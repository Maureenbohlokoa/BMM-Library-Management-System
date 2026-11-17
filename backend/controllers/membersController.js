
const registerMember = async (req, res) => {
    const { full_name, email, password } = req.body;

    if (!full_name || !email || !password) {
        return res.status(400).json({
            status: 'error',
            message: 'Full name, email and password are required.'
        });
    }

    if (password.length < 6) {
        return res.status(400).json({
            status: 'error',
            message: 'Password must contain at least 6 characters.'
        });
    }

    const db = req.app.locals.db;
    let connection;

    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        const [existingUsers] = await connection.query(
            'SELECT user_id FROM users WHERE email = ?',
            [email]
        );

        if (existingUsers.length > 0) {
            await connection.rollback();

            return res.status(409).json({
                status: 'error',
                message: 'An account with this email already exists.'
            });
        }

        const bcrypt = require('bcryptjs');
        const passwordHash = await bcrypt.hash(password, 10);

        const [userResult] = await connection.query(
            'INSERT INTO users (full_name, email, password_hash, role) VALUES (?, ?, ?, ?)',
            [full_name, email, passwordHash, 'member']
        );

        const userId = userResult.insertId;

        const [memberResult] = await connection.query(
            'INSERT INTO members (user_id, membership_id) VALUES (?, NULL)',
            [userId]
        );

        const memberNumber = memberResult.insertId;
        const membershipId = `BMM-${String(memberNumber).padStart(3, '0')}`;

        await connection.query(
            'UPDATE members SET membership_id = ? WHERE member_number = ?',
            [membershipId, memberNumber]
        );

        await connection.commit();

        res.status(201).json({
            status: 'success',
            message: 'Member registered successfully.',
            data: {
                user_id: userId,
                full_name,
                email,
                membership_id: membershipId,
                role: 'member'
            }
        });
    } catch (error) {
        if (connection) {
            await connection.rollback();
        }

        console.error('Member registration error:', error.message);

        res.status(500).json({
            status: 'error',
            message: 'Member registration failed.'
        });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

const getMembers = async (req, res) => {
    try {
        const db = req.app.locals.db;

        const [members] = await db.query(
            `SELECT 
                users.user_id,
                users.full_name,
                users.email,
                users.role,
                members.membership_id,
                users.created_at
            FROM users
            INNER JOIN members ON users.user_id = members.user_id
            ORDER BY members.member_number DESC`
        );

        res.json({
            status: 'success',
            count: members.length,
            data: members
        });
    } catch (error) {
        console.error('Get members error:', error.message);

        res.status(500).json({
            status: 'error',
            message: 'Unable to retrieve members.'
        });
    }
};


const getMemberById = async (req, res) => {
    try {
        const db = req.app.locals.db;
        const { id } = req.params;

        const [members] = await db.query(
            `SELECT 
                users.user_id,
                users.full_name,
                users.email,
                users.role,
                members.membership_id,
                users.created_at
            FROM users
            INNER JOIN members ON users.user_id = members.user_id
            WHERE users.user_id = ?`,
            [id]
        );

        if (members.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Member not found.'
            });
        }

        res.json({
            status: 'success',
            data: members[0]
        });
    } catch (error) {
        console.error('Get member error:', error.message);

        res.status(500).json({
            status: 'error',
            message: 'Unable to retrieve member.'
        });
    }
};


const updateMember = async (req, res) => {
    try {
        const db = req.app.locals.db;
        const { id } = req.params;
        const { full_name, email } = req.body;

        if (!full_name || !email) {
            return res.status(400).json({
                status: 'error',
                message: 'Full name and email are required.'
            });
        }

        const [existingMembers] = await db.query(
            'SELECT user_id FROM members WHERE user_id = ?',
            [id]
        );

        if (existingMembers.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Member not found.'
            });
        }

        const [existingEmail] = await db.query(
            'SELECT user_id FROM users WHERE email = ? AND user_id != ?',
            [email, id]
        );

        if (existingEmail.length > 0) {
            return res.status(409).json({
                status: 'error',
                message: 'This email is already being used by another account.'
            });
        }

        await db.query(
            'UPDATE users SET full_name = ?, email = ? WHERE user_id = ?',
            [full_name, email, id]
        );

        const [updatedMember] = await db.query(
            `SELECT 
                users.user_id,
                users.full_name,
                users.email,
                users.role,
                members.membership_id
            FROM users
            INNER JOIN members ON users.user_id = members.user_id
            WHERE users.user_id = ?`,
            [id]
        );

        res.json({
            status: 'success',
            message: 'Member updated successfully.',
            data: updatedMember[0]
        });
    } catch (error) {
        console.error('Update member error:', error.message);

        res.status(500).json({
            status: 'error',
            message: 'Unable to update member.'
        });
    }
};


const deleteMember = async (req, res) => {
    try {
        const db = req.app.locals.db;
        const { id } = req.params;

        const [existingMembers] = await db.query(
            'SELECT user_id FROM members WHERE user_id = ?',
            [id]
        );

        if (existingMembers.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Member not found.'
            });
        }

        await db.query(
            'DELETE FROM users WHERE user_id = ?',
            [id]
        );

        res.json({
            status: 'success',
            message: 'Member deleted successfully.'
        });
    } catch (error) {
        console.error('Delete member error:', error.message);

        res.status(500).json({
            status: 'error',
            message: 'Unable to delete member.'
        });
    }
};


module.exports = {
    registerMember,
    getMembers,
    getMemberById,
    updateMember,
    deleteMember
};