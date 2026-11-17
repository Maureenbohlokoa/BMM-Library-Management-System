const express = require('express');
const router = express.Router();

const {
    registerMember,
    getMembers,
    getMemberById,
    updateMember,
    deleteMember
} = require('../controllers/membersController');

const {
    authenticateToken,
    authorizeAdmin
} = require('../middleware/authMiddleware');

router.post('/register', registerMember);
router.get('/', authenticateToken, authorizeAdmin, getMembers);
router.get('/:id', authenticateToken, authorizeAdmin, getMemberById);
router.put('/:id', authenticateToken, authorizeAdmin, updateMember);
router.delete('/:id', authenticateToken, authorizeAdmin, deleteMember);

module.exports = router;
