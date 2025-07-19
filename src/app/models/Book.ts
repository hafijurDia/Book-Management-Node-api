import { Document, Model, model, Schema } from "mongoose";

export enum Genre{
    FICTION ="FICTION",
    NON_FICTION = "NON_FICTION",
    SCIENCE = "SCIENCE",
    HISTORY = "HISTORY",
    BIOGRAPHY = "BIOGRAPHY",
    FANTASY = "FANTASY",
}

export interface IBook extends Document {
    title: string;
    author: string;
    genre: Genre;
    isbn: string;
    description?: string;
    copies: number;
    available:boolean;
}

interface BookModel extends Model<IBook> {
    borrowBook(bookId: string, quantity: number): Promise<IBook>;
  }
const bookSchema = new Schema<IBook>({
    title:{
        type: String,
        required: [true, 'Title is required'],
        trim: true
    }, 
    author: {
        type: String,
        required: [true, 'Author is required'],     
        trim: true
    },
    genre: {
        type: String,
        enum: Object.values(Genre),
        required: [true, 'Genre is required'],
    },
    isbn: {
        type: String,
        required: [true, 'ISBN is required'],
        unique: true,
        trim: true,
      },
      description: {
        type: String,
        trim: true,
      },
      copies: {
        type: Number,
        required: [true, 'Copies are required'],
        min: [0, 'Copies cannot be negative'],
      },
      available: {
        type: Boolean,
        default: true,
      },

},{
    versionKey: false, // Disable __v field
    timestamps: true
})

//static method
// bookSchema.statics.findByGenre = function(genre: string){
//     return this.find({genre})
// }

bookSchema.statics.borrowBook = async function(
    bookId: string,
    quantity: number
){
    const book = await this.findById(bookId);
    if (!book) {
        throw new Error('Book not found');
    }
    if (book.copies < quantity) {
        throw new Error('Not enough copies available');
        
    }

    book.copies -= quantity;

    if (book.copies === 0) {
        book.available = false;
        
    }

    await book.save();
    return book;
}

const Book = model<IBook, BookModel>('Book', bookSchema);
export default Book;