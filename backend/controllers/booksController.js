
const getBooks = async (req, res) => {
    try {
        const db = req.app.locals.db;

        const [books] = await db.query(
            'SELECT * FROM books WHERE is_active = TRUE ORDER BY created_at DESC'
        );

        res.status(200).json({
            status: 'success',
            results: books.length,
            data: books
        });
    } catch (error) {
        console.error('Get books error:', error.message);

        res.status(500).json({
            status: 'error',
            message: 'Unable to retrieve books.'
        });
    }
};

const getBookById = async (req, res) => {
    try {
        const db = req.app.locals.db;
        const { id } = req.params;

        const [books] = await db.query(
            'SELECT * FROM books WHERE book_id = ? AND is_active = TRUE',
            [id]
        );

        if (books.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Book not found.'
            });
        }

        res.status(200).json({
            status: 'success',
            data: books[0]
        });
    } catch (error) {
        console.error('Get book error:', error.message);

        res.status(500).json({
            status: 'error',
            message: 'Unable to retrieve the book.'
        });
    }
};

const createBook = async (req, res) => {
    try {
        const db = req.app.locals.db;
        const { title, author, genre, isbn, quantity } = req.body;

        if (!title || !author || quantity === undefined) {
            return res.status(400).json({
                status: 'error',
                message: 'Title, author and quantity are required.'
            });
        }

        const bookQuantity = Number(quantity);

        if (!Number.isInteger(bookQuantity) || bookQuantity < 0) {
            return res.status(400).json({
                status: 'error',
                message: 'Quantity must be a whole number of zero or more.'
            });
        }

        const [result] = await db.query(
            `INSERT INTO books (title, author, genre, isbn, quantity)
             VALUES (?, ?, ?, ?, ?)`,
            [
                title.trim(),
                author.trim(),
                genre ? genre.trim() : null,
                isbn ? isbn.trim() : null,
                bookQuantity
            ]
        );

        const [books] = await db.query(
            'SELECT * FROM books WHERE book_id = ?',
            [result.insertId]
        );

        res.status(201).json({
            status: 'success',
            message: 'Book added successfully.',
            data: books[0]
        });
    } catch (error) {
        console.error('Create book error:', error.message);

        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                status: 'error',
                message: 'A book with this ISBN already exists.'
            });
        }

        res.status(500).json({
            status: 'error',
            message: 'Unable to add the book.'
        });
    }
};

const updateBook = async (req, res) => {
    try {
        const db = req.app.locals.db;
        const { id } = req.params;
        const { title, author, genre, isbn, quantity } = req.body;

        if (!title || !author || quantity === undefined) {
            return res.status(400).json({
                status: 'error',
                message: 'Title, author and quantity are required.'
            });
        }

        const bookQuantity = Number(quantity);

        if (!Number.isInteger(bookQuantity) || bookQuantity < 0) {
            return res.status(400).json({
                status: 'error',
                message: 'Quantity must be a whole number of zero or more.'
            });
        }

        const [result] = await db.query(
            `UPDATE books
             SET title = ?, author = ?, genre = ?, isbn = ?, quantity = ?
             WHERE book_id = ? AND is_active = TRUE`,
            [
                title.trim(),
                author.trim(),
                genre ? genre.trim() : null,
                isbn ? isbn.trim() : null,
                bookQuantity,
                id
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Book not found.'
            });
        }

        const [books] = await db.query(
            'SELECT * FROM books WHERE book_id = ?',
            [id]
        );

        res.status(200).json({
            status: 'success',
            message: 'Book updated successfully.',
            data: books[0]
        });
    } catch (error) {
        console.error('Update book error:', error.message);

        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                status: 'error',
                message: 'A book with this ISBN already exists.'
            });
        }

        res.status(500).json({
            status: 'error',
            message: 'Unable to update the book.'
        });
    }
};

const deleteBook = async (req, res) => {
    try {
        const db = req.app.locals.db;
        const { id } = req.params;

        const [result] = await db.query(
            'UPDATE books SET is_active = FALSE WHERE book_id = ? AND is_active = TRUE',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Book not found.'
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Book removed successfully.'
        });
    } catch (error) {
        console.error('Delete book error:', error.message);

        res.status(500).json({
            status: 'error',
            message: 'Unable to remove the book.'
        });
    }
};

module.exports = {
    getBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook
};
