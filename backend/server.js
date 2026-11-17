
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mysql = require('mysql2/promise');
const booksRoutes = require('./routes/books');
const membersRoutes = require('./routes/members');
const transactionsRoutes = require('./routes/transactions');
const authRoutes = require('./routes/auth');


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://localhost:5174'
    ]
}));

app.use(express.json());

const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'bmm_library',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

app.locals.db = db;

app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to BMM Library Management System API!'
    });
});

app.get('/api/health', (req, res) => {
    res.json({
        status: 'success',
        message: 'BMM Library backend is running!'
    });
});

app.get('/api/db-test', async (req, res) => {
    try {
        await db.query('SELECT 1');

        res.json({
            status: 'success',
            message: 'MySQL database connected successfully!'
        });
    } catch (error) {
        console.error('Database connection error:', error.message);

        res.status(500).json({
            status: 'error',
            message: 'Database connection failed. Check your database settings.'
        });
    }
});

app.use('/api/books', booksRoutes);
app.use('/api/members', membersRoutes);
app.use('/api/transactions', transactionsRoutes);
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`BMM Library server running at http://localhost:${PORT}`);
});
