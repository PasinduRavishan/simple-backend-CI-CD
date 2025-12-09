import mongoose from 'mongoose';

const BookSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        author: { type: String, required: true, trim: true },
        year: { type: Number },
        summary: { type: String, default: null }
    },
    { timestamps: true }
);



const Book = mongoose.model('Book', BookSchema);
export default Book;
