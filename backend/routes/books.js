
const express = require('express');
const router = express.Router();

const {
    getBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook
} = require('../controllers/booksController');

const {
    authenticateToken,
    authorizeAdmin
} = require('../middleware/authMiddleware');

router.get('/', authenticateToken, getBooks);
router.get('/:id', authenticateToken, getBookById);
router.post('/', authenticateToken, authorizeAdmin, createBook);
router.put('/:id', authenticateToken, authorizeAdmin, updateBook);
router.delete('/:id', authenticateToken, authorizeAdmin, deleteBook);

module.exports = router;
