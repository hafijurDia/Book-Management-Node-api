import express, { Request, Response } from 'express';
import z from 'zod';
import Borrow from '../models/Borrow';
import id from 'zod/v4/locales/id.cjs';

const borrowSchema = z.object({
    book: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId"),
    quantity: z.number().int().positive(),
    dueDate: z.string().nonempty(),
});

export const borrowRoutes = express.Router();

borrowRoutes.post('/', async (req: Request, res: Response) => {
    try {
        const validatedBody = await borrowSchema.parseAsync(req.body);
        const { book: bookId, quantity, dueDate } = validatedBody;

        // Create borrow record
        const borrowRecord = await Borrow.create({
            book: bookId,
            quantity,
            dueDate: new Date(dueDate),
        });
        
        res.status(201).json({
            success: true,
            message: 'Book borrowed successfully',
            data: borrowRecord,
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                success: false,
                message: 'Validation Failed',
                errors: error.issues,
            });
        }
        console.error('Error borrowing book:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error,
        });
    }
});

borrowRoutes.get('/', async (req: Request, res: Response) => {
    try {
        const aggregationResult = await Borrow.aggregate([
            {
                $group: {
                    _id: "$book",
                    totalQuantity: { $sum: "$quantity" },
                }
            },
            {
                $lookup: {
                    from: "books",
                    localField: "_id",
                    foreignField: "_id",
                    as: "bookDetails"
                }
            },
            {
                $unwind: "$bookDetails"
            },
            {
                $project: {
                    _id: 0,
                    book: {
                        title: "$bookDetails.title",
                        isbn: "$bookDetails.isbn",
                        id: "$bookDetails._id",
                    },
                    totalQuantity: 1
                }
            }
        ]);
        res.json({
            success: true,
            message: "Borrowed books summary retrieved successfully",
            data: aggregationResult,
        });
    } catch (error) {
        console.error('Error fetching borrow summary:', error);
        res.status(500).json({
            success: false,
            message: "Error retrieving borrowed books summary",
            error,
        });
    }
});
