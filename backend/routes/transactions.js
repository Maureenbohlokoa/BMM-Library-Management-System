const express = require('express');
const router = express.Router();

const {
    stockIn,
    borrowBook,
    returnBook,
    getTransactions
} = require('../controllers/transactionsController');

const {
    authenticateToken,
    authorizeAdmin
} = require('../middleware/authMiddleware');

router.post('/stock-in', authenticateToken, authorizeAdmin, stockIn);
router.post('/borrow', authenticateToken, borrowBook);
router.post('/return', authenticateToken, returnBook);
router.get('/', authenticateToken, authorizeAdmin, getTransactions);

module.exports = router;