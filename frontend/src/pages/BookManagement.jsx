
import { useEffect, useState } from 'react';
import { BookOpen, Search, Plus, Pencil, Trash2 } from 'lucide-react';
import bookService from '../services/bookService';
import '../styles/BookManagement.css';

function BookManagement() {
    const [books, setBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        genre: '',
        isbn: '',
        quantity: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const token = localStorage.getItem('bmmToken');

    const fetchBooks = async () => {
        setError('');

        try {
            if (!token) {
                throw new Error('Please log in as an administrator.');
            }

            const response = await bookService.getBooks(token);
            setBooks(response.data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    const filteredBooks = books.filter((book) =>
        `${book.title} ${book.author} ${book.genre || ''} ${book.isbn || ''}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    function handleChange(event) {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    }

    function resetForm() {
        setFormData({
            title: '',
            author: '',
            genre: '',
            isbn: '',
            quantity: ''
        });
        setEditingId(null);
        setShowForm(false);
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setError('');
        setSuccess('');

        if (
            !formData.title.trim() ||
            !formData.author.trim() ||
            formData.quantity === '' ||
            Number(formData.quantity) < 0 ||
            !Number.isInteger(Number(formData.quantity))
        ) {
            setError('Enter a valid title, author and whole-number quantity.');
            return;
        }

        setSaving(true);

        try {
            const bookData = {
                title: formData.title.trim(),
                author: formData.author.trim(),
                genre: formData.genre.trim(),
                isbn: formData.isbn.trim(),
                quantity: Number(formData.quantity)
            };

            if (editingId !== null) {
                const response = await bookService.updateBook(editingId, bookData, token);
                setSuccess(response.message || 'Book updated successfully.');
            } else {
                const response = await bookService.addBook(bookData, token);
                setSuccess(response.message || 'Book added successfully.');
            }

            resetForm();
            await fetchBooks();
        } catch (error) {
            setError(error.message);
        } finally {
            setSaving(false);
        }
    }

    function handleEdit(book) {
        setFormData({
            title: book.title,
            author: book.author,
            genre: book.genre || '',
            isbn: book.isbn || '',
            quantity: String(book.quantity)
        });
        setEditingId(book.book_id);
        setShowForm(true);
        setError('');
        setSuccess('');
    }

    async function handleDelete(id) {
        const confirmed = window.confirm('Are you sure you want to remove this book?');

        if (!confirmed) {
            return;
        }

        setError('');
        setSuccess('');

        try {
            const response = await bookService.deleteBook(id, token);
            setSuccess(response.message || 'Book removed successfully.');
            await fetchBooks();
        } catch (error) {
            setError(error.message);
        }
    }

    return (
        <main className="book-management">
            <section className="book-management-heading">
                <div>
                    <p className="book-management-label">ADMINISTRATOR PORTAL</p>
                    <h1>Book <span>Management</span></h1>
                    <p>Manage the BMM Library collection and keep book records up to date.</p>
                </div>

                <button
                    className="add-book-button"
                    onClick={() => {
                        resetForm();
                        setShowForm(true);
                    }}
                >
                    <Plus size={18} />
                    Add New Book
                </button>
            </section>

            {error && <p role="alert">{error}</p>}
            {success && <p role="status">{success}</p>}

            {showForm && (
                <section className="book-form-section">
                    <div className="book-form-heading">
                        <h2>{editingId !== null ? 'Edit Book Details' : 'Add a New Book'}</h2>
                        <button type="button" onClick={resetForm}>Close</button>
                    </div>

                    <form onSubmit={handleSubmit} className="book-form">
                        <div className="book-form-grid">
                            <label>
                                Book Title
                                <input
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="Enter book title"
                                    required
                                />
                            </label>

                            <label>
                                Author
                                <input
                                    name="author"
                                    value={formData.author}
                                    onChange={handleChange}
                                    placeholder="Enter author name"
                                    required
                                />
                            </label>

                            <label>
                                Genre
                                <input
                                    name="genre"
                                    value={formData.genre}
                                    onChange={handleChange}
                                    placeholder="Enter book genre"
                                />
                            </label>

                            <label>
                                ISBN
                                <input
                                    name="isbn"
                                    value={formData.isbn}
                                    onChange={handleChange}
                                    placeholder="Enter ISBN"
                                />
                            </label>

                            <label>
                                Quantity
                                <input
                                    name="quantity"
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={formData.quantity}
                                    onChange={handleChange}
                                    placeholder="Enter quantity"
                                    required
                                />
                            </label>
                        </div>

                        <div className="book-form-actions">
                            <button type="button" className="cancel-book-button" onClick={resetForm}>
                                Cancel
                            </button>
                            <button type="submit" className="save-book-button" disabled={saving}>
                                {saving
                                    ? 'Saving...'
                                    : editingId !== null
                                        ? 'Update Book'
                                        : 'Save Book'}
                            </button>
                        </div>
                    </form>
                </section>
            )}

            <section className="book-list-section">
                <div className="book-list-heading">
                    <div>
                        <h2>Library Collection</h2>
                        <p>{books.length} books recorded</p>
                    </div>

                    <div className="book-search">
                        <Search size={18} />
                        <input
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                            placeholder="Search books..."
                        />
                    </div>
                </div>

                <div className="book-table-wrapper">
                    <table className="book-table">
                        <thead>
                            <tr>
                                <th>Book Title</th>
                                <th>Author</th>
                                <th>Genre</th>
                                <th>ISBN</th>
                                <th>Quantity</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="empty-books">
                                        Loading books...
                                    </td>
                                </tr>
                            ) : filteredBooks.length > 0 ? (
                                filteredBooks.map((book) => (
                                    <tr key={book.book_id}>
                                        <td>{book.title}</td>
                                        <td>{book.author}</td>
                                        <td>{book.genre || '—'}</td>
                                        <td>{book.isbn || '—'}</td>
                                        <td>{book.quantity}</td>
                                        <td>
                                            <div className="book-actions">
                                                <button
                                                    type="button"
                                                    className="edit-book-button"
                                                    onClick={() => handleEdit(book)}
                                                    aria-label="Edit book"
                                                >
                                                    <Pencil size={16} />
                                                </button>

                                                <button
                                                    type="button"
                                                    className="delete-book-button"
                                                    onClick={() => handleDelete(book.book_id)}
                                                    aria-label="Delete book"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="empty-books">
                                        <BookOpen size={35} />
                                        <strong>No books found</strong>
                                        <span>Add a book to start building your collection.</span>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </main>
    );
}

export default BookManagement;
