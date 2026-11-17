
import { ArrowRight, BookOpen } from 'lucide-react';
import '../styles/FeaturedBooks.css';

const featuredBooks = [
    {
        title: 'The Mountain Is You',
        author: 'Brianna Wiest',
        category: 'Personal Growth',
        cover: 'https://covers.openlibrary.org/b/isbn/9781949759228-L.jpg'
    },
    {
        title: 'Atomic Habits',
        author: 'James Clear',
        category: 'Self Development',
        cover: 'https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg'
    },
    {
        title: 'The Psychology of Money',
        author: 'Morgan Housel',
        category: 'Finance',
        cover: 'https://covers.openlibrary.org/b/isbn/9780857197689-L.jpg'
    },
    {
        title: 'Ikigai',
        author: 'Héctor García and Francesc Miralles',
        category: 'Lifestyle',
        cover: 'https://covers.openlibrary.org/b/isbn/9781786330895-L.jpg'
    }
];

function FeaturedBooks() {
    return (
        <section className="featured-books" id="books">
            <div className="featured-heading">
                <div>
                    <p className="section-label">EXPLORE OUR COLLECTION</p>
                    <h2>Featured <span>Books</span></h2>
                    <p className="featured-description">
                        Discover inspiring reads and find your next favourite book.
                    </p>
                </div>

                <a href="#catalogue" className="view-all-link">
                    View All Books <ArrowRight size={18} />
                </a>
            </div>

            <div className="books-grid">
                {featuredBooks.map((book) => (
                    <article className="book-card" key={book.title}>
                        <div className="book-cover">
                            <img
                                src={book.cover}
                                alt={book.title}
                                onError={(event) => {
                                    event.currentTarget.style.display = 'none';
                                    event.currentTarget.nextElementSibling.style.display = 'flex';
                                }}
                            />
                            <div className="book-cover-fallback">
                                <BookOpen size={42} />
                                <span>{book.title}</span>
                            </div>
                        </div>

                        <div className="book-information">
                            <p className="book-category">{book.category}</p>
                            <h3>{book.title}</h3>
                            <p className="book-author">By {book.author}</p>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}

export default FeaturedBooks;
