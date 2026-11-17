
import { BookOpen, Mail, MapPin, Phone } from 'lucide-react';
import '../styles/Footer.css';

function Footer() {
    return (
        <footer className="footer" id="contact">
            <div className="footer-content">
                <div className="footer-brand">
                    <div className="footer-logo">
                        <BookOpen size={28} />
                        <span>BMM LIBRARY</span>
                    </div>

                    <p>
                        Discover knowledge, explore new ideas and find
                        inspiration with every page. Your reading journey
                        begins here.
                    </p>
                </div>

                <div className="footer-links">
                    <h3>Quick Links</h3>
                    <a href="#home">Home</a>
                    <a href="#books">Browse Books</a>
                    <a href="#about">About Us</a>
                    <a href="#login">Member Login</a>
                </div>

                <div className="footer-contact">
                    <h3>Contact Us</h3>
                    <p>
                        <MapPin size={17} />
                        <span>Lesotho</span>
                    </p>
                    <p>
                        <Mail size={17} />
                        <span>info@bmmlibrary.com</span>
                    </p>
                    <p>
                        <Phone size={17} />
                        <span>Contact details coming soon</span>
                    </p>
                </div>
            </div>

            <div className="footer-bottom">
                <p>© {new Date().getFullYear()} BMM Library. All rights reserved.</p>
                <p>Read. Learn. Grow.</p>
            </div>
        </footer>
    );
}

export default Footer;
