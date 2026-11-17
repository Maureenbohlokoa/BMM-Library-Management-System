
const stockIn = async (req, res) => {
    const { book_id, quantity, notes } = req.body;

    if (!book_id || !quantity || !Number.isInteger(Number(quantity)) || Number(quantity) <= 0) {
        return res.status(400).json({
            status: 'error',
            message: 'A valid book ID and positive quantity are required.'
        });
    }

    const db = req.app.locals.db;
    let connection;

    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        const [books] = await connection.query(
            'SELECT book_id, quantity FROM books WHERE book_id = ? AND is_active = TRUE FOR UPDATE',
            [book_id]
        );

        if (books.length === 0) {
            await connection.rollback();

            return res.status(404).json({
                status: 'error',
                message: 'Book not found.'
            });
        }

        await connection.query(
            'UPDATE books SET quantity = quantity + ? WHERE book_id = ?',
            [Number(quantity), book_id]
        );

        await connection.query(
            'INSERT INTO transactions (book_id, transaction_type, quantity, notes) VALUES (?, ?, ?, ?)',
            [book_id, 'STOCK_IN', Number(quantity), notes || null]
        );

        const [updatedBooks] = await connection.query(
            'SELECT book_id, title, quantity FROM books WHERE book_id = ?',
            [book_id]
        );

        await connection.commit();

        res.status(201).json({
            status: 'success',
            message: 'Stock added successfully.',
            data: updatedBooks[0]
        });
    } catch (error) {
        if (connection) {
            await connection.rollback();
        }

        console.error('Stock in error:', error.message);

        res.status(500).json({
            status: 'error',
            message: 'Unable to add book stock.'
        });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};


const borrowBook = async (req, res) => {
    const { book_id, quantity, notes, user_id: selectedUserId } = req.body;
const user_id = req.user.role === 'admin' ? selectedUserId : req.user.user_id;
    
    if (!book_id || !user_id || !quantity || !Number.isInteger(Number(quantity)) || Number(quantity) <= 0) {
        return res.status(400).json({
            status: 'error',
            message: 'A valid book ID, user ID and positive quantity are required.'
        });
    }

    const db = req.app.locals.db;
    let connection;

    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        const [books] = await connection.query(
            'SELECT book_id, title, quantity FROM books WHERE book_id = ? AND is_active = TRUE FOR UPDATE',
            [book_id]
        );

        if (books.length === 0) {
            await connection.rollback();

            return res.status(404).json({
                status: 'error',
                message: 'Book not found.'
            });
        }

        const [members] = await connection.query(
            'SELECT user_id FROM members WHERE user_id = ?',
            [user_id]
        );

        if (members.length === 0) {
            await connection.rollback();

            return res.status(404).json({
                status: 'error',
                message: 'Member not found.'
            });
        }

        if (books[0].quantity < Number(quantity)) {
            await connection.rollback();

            return res.status(400).json({
                status: 'error',
                message: 'Not enough copies are available.'
            });
        }

        await connection.query(
            'UPDATE books SET quantity = quantity - ? WHERE book_id = ?',
            [Number(quantity), book_id]
        );

        await connection.query(
            'INSERT INTO transactions (book_id, user_id, transaction_type, quantity, notes) VALUES (?, ?, ?, ?, ?)',
            [book_id, user_id, 'BORROW', Number(quantity), notes || null]
        );

        const [updatedBooks] = await connection.query(
            'SELECT book_id, title, quantity FROM books WHERE book_id = ?',
            [book_id]
        );

        await connection.commit();

        res.status(201).json({
            status: 'success',
            message: 'Book borrowed successfully.',
            data: updatedBooks[0]
        });
    } catch (error) {
        if (connection) {
            await connection.rollback();
        }

        console.error('Borrow book error:', error.message);

        res.status(500).json({
            status: 'error',
            message: 'Unable to borrow book.'
        });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};


const returnBook = async (req, res) => {
    const { book_id, quantity, notes, user_id: selectedUserId } = req.body;
const user_id = req.user.role === 'admin' ? selectedUserId : req.user.user_id;

    if (!book_id || !user_id || !quantity || !Number.isInteger(Number(quantity)) || Number(quantity) <= 0) {
        return res.status(400).json({
            status: 'error',
            message: 'A valid book ID, user ID and positive quantity are required.'
        });
    }

    const db = req.app.locals.db;
    let connection;

    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        const [books] = await connection.query(
            'SELECT book_id, title, quantity FROM books WHERE book_id = ? AND is_active = TRUE FOR UPDATE',
            [book_id]
        );

        if (books.length === 0) {
            await connection.rollback();

            return res.status(404).json({
                status: 'error',
                message: 'Book not found.'
            });
        }

        const [members] = await connection.query(
            'SELECT user_id FROM members WHERE user_id = ?',
            [user_id]
        );

        if (members.length === 0) {
            await connection.rollback();

            return res.status(404).json({
                status: 'error',
                message: 'Member not found.'
            });
        }

        const [borrowed] = await connection.query(
            `SELECT COALESCE(SUM(
                CASE
                    WHEN transaction_type = 'BORROW' THEN quantity
                    WHEN transaction_type = 'RETURN' THEN -quantity
                    ELSE 0
                END
            ), 0) AS borrowed_quantity
            FROM transactions
            WHERE book_id = ? AND user_id = ?`,
            [book_id, user_id]
        );

        if (Number(borrowed[0].borrowed_quantity) < Number(quantity)) {
            await connection.rollback();

            return res.status(400).json({
                status: 'error',
                message: 'Return quantity exceeds the member’s outstanding borrowed quantity.'
            });
        }

        await connection.query(
            'UPDATE books SET quantity = quantity + ? WHERE book_id = ?',
            [Number(quantity), book_id]
        );

        await connection.query(
            'INSERT INTO transactions (book_id, user_id, transaction_type, quantity, notes) VALUES (?, ?, ?, ?, ?)',
            [book_id, user_id, 'RETURN', Number(quantity), notes || null]
        );

        const [updatedBooks] = await connection.query(
            'SELECT book_id, title, quantity FROM books WHERE book_id = ?',
            [book_id]
        );

        await connection.commit();

        res.status(201).json({
            status: 'success',
            message: 'Book returned successfully.',
            data: updatedBooks[0]
        });
    } catch (error) {
        if (connection) {
            await connection.rollback();
        }

        console.error('Return book error:', error.message);

        res.status(500).json({
            status: 'error',
            message: 'Unable to return book.'
        });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};


const getTransactions = async (req, res) => {
    try {
        const db = req.app.locals.db;

        const [transactions] = await db.query(
            `SELECT
                transactions.transaction_id,
                transactions.book_id,
                books.title AS book_title,
                transactions.user_id,
                users.full_name AS member_name,
                members.membership_id,
                transactions.transaction_type,
                transactions.quantity,
                transactions.notes,
                transactions.created_at
            FROM transactions
            INNER JOIN books ON transactions.book_id = books.book_id
            LEFT JOIN users ON transactions.user_id = users.user_id
            LEFT JOIN members ON transactions.user_id = members.user_id
            ORDER BY transactions.created_at DESC`
        );

        res.json({
            status: 'success',
            count: transactions.length,
            data: transactions
        });
    } catch (error) {
        console.error('Get transactions error:', error.message);

        res.status(500).json({
            status: 'error',
            message: 'Unable to retrieve transaction history.'
        });
    }
};


module.exports = {
    stockIn,
    borrowBook,
    returnBook,
    getTransactions
};