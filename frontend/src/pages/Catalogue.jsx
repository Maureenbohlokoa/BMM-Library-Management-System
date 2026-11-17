
import { useEffect, useState } from 'react';
import { Search, BookOpen } from 'lucide-react';
import bookService from '../services/bookService';
import '../styles/Catalogue.css';

function Catalogue() {
    const [books, setBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const token = localStorage.getItem('bmmToken');

                if (!token) {
                    throw new Error('Please log in to view the book catalogue.');
                }

                const response = await bookService.getBooks(token);
                setBooks(response.data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, []);

    const categories = [
        'All',
        ...new Set(books.map((book) => book.genre).filter(Boolean))
    ];

    const filteredBooks = books.filter((book) => {
        const matchesSearch =
            book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.author.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory =
            selectedCategory === 'All' ||
            book.genre === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    return (
        <main className="catalogue-page">
            <section className="catalogue-heading">
                <p className="catalogue-label">DISCOVER YOUR NEXT READ</p>
                <h1>Explore Our <span>Book Collection</span></h1>
                <p>
                    Browse through our collection and discover books
                    that inspire, educate and entertain.
                </p>
            </section>

            <section className="catalogue-content">
                <div className="catalogue-toolbar">
                    <div className="catalogue-search">
                        <Search size={20} />
                        <input
                            type="text"
                            placeholder="Search by book title or author..."
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                        />
                    </div>

                    <div className="catalogue-filter">
                        <label htmlFor="category">Category</label>
                        <select
                            id="category"
                            value={selectedCategory}
                            onChange={(event) => setSelectedCategory(event.target.value)}
                        >
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="catalogue-results">
                    <h2>Our Books</h2>
                    <p>{filteredBooks.length} books displayed</p>
                </div>

                {loading ? (
                    <div className="catalogue-empty">
                        <p>Loading books...</p>
                    </div>
                ) : error ? (
                    <div className="catalogue-empty">
                        <BookOpen size={45} />
                        <h3>Unable to load books</h3>
                        <p>{error}</p>
                    </div>
                ) : filteredBooks.length > 0 ? (
                    <div className="catalogue-grid">
                        {filteredBooks.map((book) => (
                            <article className="catalogue-book-card" key={book.book_id}>
                                <div className="catalogue-book-cover">
                                    <img
                                        src={
                                            book.isbn
                                                ? `https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg`
                                                : ''
                                        }
                                        alt={book.title}
                                        onError={(event) => {
                                            event.currentTarget.style.display = 'none';
                                            event.currentTarget.nextElementSibling.style.display = 'flex';
                                        }}
                                    />
                                    <div className="catalogue-cover-fallback">
                                        <BookOpen size={42} />
                                        <span>{book.title}</span>
                                    </div>
                                </div>

                                <div className="catalogue-book-info">
                                    <span>{book.genre || 'General'}</span>
                                    <h3>{book.title}</h3>
                                    <p>By {book.author}</p>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="catalogue-empty">
                        <BookOpen size={45} />
                        <h3>No books found</h3>
                        <p>Try another search or choose a different category.</p>
                    </div>
                )}
            </section>
        </main>
    );
}

export default Catalogue;
