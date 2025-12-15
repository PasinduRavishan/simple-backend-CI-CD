import BookRepository from '../repositories/BookRepository.js';

const bookRepo = new BookRepository();


export const createBook = async (req, res, next) => {
  try {
    const { title, author, year, summary } = req.body;
    
    if (!title || !author) {
      return res.status(400).json({ error: 'title and author are required' });
    }

    const book = await bookRepo.save({ title, author, year, summary });
    return res.status(201).json(book);
  } catch (err) {
    next(err);
  }
};


export const getBooks = async (req, res, next) => {
  try {
    const { author, year, title } = req.query;
    const searchParams = {};
    
    if (author) searchParams.author = author;
    if (year) searchParams.year = parseInt(year);
    if (title) searchParams.title = title;

    const books = await bookRepo.retrieveAll(searchParams);
    return res.json(books);
  } catch (err) {
    next(err);
  }
};


export const getBookById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const book = await bookRepo.retrieveById(parseInt(id));
    
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    
    return res.json(book);
  } catch (err) {
    next(err);
  }
};


export const replaceBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, author, year, summary } = req.body;
    
    if (!title || !author) {
      return res.status(400).json({ error: 'title and author are required' });
    }

    const affectedRows = await bookRepo.update({
      id: parseInt(id),
      title,
      author,
      year,
      summary
    });

    if (affectedRows === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const updatedBook = await bookRepo.retrieveById(parseInt(id));
    return res.json(updatedBook);
  } catch (err) {
    next(err);
  }
};


export const updateBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const allowed = ['title', 'author', 'year', 'summary'];
    const keys = Object.keys(updates).filter((k) => allowed.includes(k));
    
    if (keys.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    const updateData = { id: parseInt(id) };
    keys.forEach(key => {
      updateData[key] = updates[key];
    });

    const affectedRows = await bookRepo.update(updateData);

    if (affectedRows === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const updatedBook = await bookRepo.retrieveById(parseInt(id));
    return res.json(updatedBook);
  } catch (err) {
    next(err);
  }
};


export const deleteBook = async (req, res, next) => {
  try {
    const { id} = req.params;
    const affectedRows = await bookRepo.delete(parseInt(id));
    
    if (affectedRows === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }
    
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
};


export const deleteAllBooks = async (req, res, next) => {
  try {
    const affectedRows = await bookRepo.deleteAll();
    return res.json({ 
      message: `Successfully deleted ${affectedRows} book(s)`,
      deletedCount: affectedRows
    });
  } catch (err) {
    next(err);
  }
};
