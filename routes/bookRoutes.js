import express from 'express';
import {
  createBook,
  getBooks,
  getBookById,
  replaceBook,
  updateBook,
  deleteBook
} from '../controllers/bookController.js';

const router = express.Router();

router.post('/', createBook);
router.get('/', getBooks);
router.get('/:id', getBookById);
router.put('/:id', replaceBook);
router.patch('/:id', updateBook);
router.delete('/:id', deleteBook);

export default router;
