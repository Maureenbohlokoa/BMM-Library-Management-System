
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import '../styles/Navbar.css';

function Navbar() {
    return (
        <header className="navbar">
            <Link to="/" className="navbar-logo">
                <div className="logo-icon">
                    <BookOpen size={25} />
                </div>

                <div className="logo-text">
                    <span>BMM</span>
                    <small>LIBRARY</small>
                </div>
            </Link>

            <nav className="nav-links">
                <Link to="/">Home</Link>
                <Link to="/catalogue">Browse Books</Link>
                <Link to="/#about">About Us</Link>
                <Link to="/#contact">Contact</Link>
            </nav>

            <div className="nav-actions">
                <Link to="/login" className="login-link">Login</Link>
                <Link to="/register" className="join-button">Join BMM</Link>
            </div>
        </header>
    );
}

export default Navbar;
