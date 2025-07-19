import { Document, model, Schema, Types } from "mongoose";

export interface IBorrow extends Document{
    book: Types.ObjectId;
    quantity: number;
    dueDate: Date;
}

const borrowSchema = new Schema<IBorrow>({
    book:{
        type:Schema.Types.ObjectId,
        ref:'Book',
        required: [true, 'Book reference is required']
    },
    quantity:{
        type: Number,
        required: [true, 'Quantity is required'],
        min: [1, 'Quantity must be possitive'],
        validate: {
            validator: Number.isInteger,
            message: 'Quantity must be an integer',
          },
    },
    dueDate: {
        type: Date,
        required: [true, 'Due date is required'],
      },

},{
    versionKey: false, // Disable __v field
    timestamps: true
})

const Borrow = model<IBorrow>('Borrow', borrowSchema);
export default Borrow;