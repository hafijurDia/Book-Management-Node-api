import express, { Request, Response } from 'express';
import z, { success } from "zod";
import Book from '../models/Book';


const CreateBookSchema = z.object({
    title: z.string(),
    author: z.string(),
    genre: z.enum(['FICTION', 'NON_FICTION', 'SCIENCE', 'HISTORY', 'BIOGRAPHY', 'FANTASY']),
    isbn: z.string(),
    description: z.string().optional(),
    copies: z.number().int().nonnegative(),
    available: z.boolean().optional(),
});

export const bookRoutes = express.Router();

bookRoutes.post('/create-book', async(req:Request, res:Response) =>{
    try {
        //valid request body
        const validatedBody = await CreateBookSchema.parseAsync(req.body);
        //create book document
        const newBook = await Book.create(validatedBody);
        res.status(201).json({
            success: true,
            message:'Book Created Successfully',
            data: newBook,
        })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                success: false,
                message: 'validation Failed',
                errors: error.issues,
            })
        }

        console.error('Error creating book:', error);
        res.status(500).json({
            success:false,
            message:'Server error',
            error,
        })
    }
})

// get all books with filtering, sorting, and limit
bookRoutes.get('/', async (req: Request, res: Response) => {
    try {
        const { filter, sortBy, sort, limit } = req.query;

       const filterObj: any = {};
       if (filter && typeof filter === 'string') {
            filterObj.genre = filter;
        }

        //determine sort order
        const sortOrder = (sort === 'asce') ? 1 : -1;
        const sortField = (sortBy && typeof sortBy === 'string') ? sortBy : 'createdAt';

        //determine limit
        const limitNumber = limit ? parseInt(limit as string) : 10;

       
        // Fetch books with filtering and sorting
        const books = await Book.find(filter ? {genre: filter} : {})
            .sort({ [sortField]: sortOrder })
            .limit(limitNumber);
            
        res.status(200).json({
            success: true,
            message: 'Books fetched successfully',
            data: books,
        });
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error,
        });
    }
});

// Get a single book by ID
bookRoutes.get('/:id', async (req: Request, res: Response) => { 
    const bookId = req.params.id;
    const book = await Book.findById(bookId);
    res.status(200).json({
        success: true,
        message: 'Book fetched successfully',
        data: book, 
    });

});

// update a book by ID

const UpdateBookBodySchema = z.object({
    copies: z.number().int().nonnegative(),
    // add other fields if you want to allow updating them
  });
  
  bookRoutes.patch('/:bookId', async (req: Request, res: Response) => {
    try {
      const { bookId } = req.params;
  
      // Validate request body
      const validatedBody = await UpdateBookBodySchema.parseAsync(req.body);
  
      const book = await Book.findByIdAndUpdate(bookId, validatedBody, { new: true });
  
      if (!book) {
        return res.status(404).json({
          success: false,
          message: 'Book not found',
        });
      }
  
      res.status(200).json({
        success: true,
        message: 'Book updated successfully',
        data: book,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation Failed',
          errors: error.issues,
        });
      }
      console.error('Error updating book:', error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error,
      });
    }
  });


  // delete a book by ID
bookRoutes.delete('/:id', async (req: Request, res: Response) => {
    const BookId = req.params.id;
    const book = await Book.findByIdAndDelete(BookId);
    res.status(200).json({
        success: true,
        message: 'User deleted successfully',
        book,
    });
});