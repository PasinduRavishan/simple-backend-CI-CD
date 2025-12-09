import Book from '../models/book.model.js';

/* Create */
export const createBook = async (req, res, next) => {
  try {
    const { title, author, year, summary } = req.body;
    if (!title || !author) {
      return res.status(400).json({ error: 'title and author are required' });
    }
    const book = await Book.create({ title, author, year, summary });
    return res.status(201).json(book);
  } catch (err) {
    next(err);
  }
};

/* Get all */
export const getBooks = async (req, res, next) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    return res.json(books);
  } catch (err) {
    next(err);
  }
};

/* Get by id */
export const getBookById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    return res.json(book);
  } catch (err) {
    if (err.name === 'CastError') return res.status(404).json({ error: 'Book not found' });
    next(err);
  }
};

/* Replace (PUT) */
export const replaceBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, author, year, summary } = req.body;
    if (!title || !author) {
      return res.status(400).json({ error: 'title and author are required' });
    }
    const book = await Book.findByIdAndUpdate(
      id,
      { title, author, year, summary },
      { new: true, runValidators: true }
    );
    if (!book) return res.status(404).json({ error: 'Book not found' });
    return res.json(book);
  } catch (err) {
    if (err.name === 'CastError') return res.status(404).json({ error: 'Book not found' });
    next(err);
  }
};

/* Patch */
export const updateBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const allowed = ['title', 'author', 'year', 'summary'];
    const keys = Object.keys(updates).filter((k) => allowed.includes(k));
    if (keys.length === 0) return res.status(400).json({ error: 'No valid fields to update' });

    const book = await Book.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!book) return res.status(404).json({ error: 'Book not found' });
    return res.json(book);
  } catch (err) {
    if (err.name === 'CastError') return res.status(404).json({ error: 'Book not found' });
    next(err);
  }
};

/* Delete */
export const deleteBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const book = await Book.findByIdAndDelete(id);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    return res.status(204).send();
  } catch (err) {
    if (err.name === 'CastError') return res.status(404).json({ error: 'Book not found' });
    next(err);
  }
};
