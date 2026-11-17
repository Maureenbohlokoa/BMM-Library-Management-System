
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import '../styles/Register.css';

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setSuccess('');

        if (formData.password !== formData.confirmPassword) {
            setError('Your passwords do not match.');
            return;
        }

        if (formData.password.length < 6) {
            setError('Your password must contain at least 6 characters.');
            return;
        }

        setLoading(true);

        try {
            const response = await authService.register({
                full_name: formData.full_name,
                email: formData.email,
                password: formData.password
            });

            setSuccess(
                `Account created successfully! Your membership ID is ${response.membership_id}.`
            );

            setFormData({
                full_name: '',
                email: '',
                password: '',
                confirmPassword: ''
            });

            setTimeout(() => navigate('/login'), 3000);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="register-page">
            <div className="register-container">
                <div className="register-intro">
                    <p className="register-label">BECOME A MEMBER</p>

                    <h1>
                        Your Reading Journey
                        <span> Starts Here.</span>
                    </h1>

                    <p>
                        Join BMM Library and discover a world of books,
                        knowledge and inspiration. Create your account
                        to get started.
                    </p>

                    <div className="register-benefits">
                        <div>
                            <span>01</span>
                            <p>Explore our library collection</p>
                        </div>

                        <div>
                            <span>02</span>
                            <p>Receive your personal membership ID</p>
                        </div>

                        <div>
                            <span>03</span>
                            <p>Manage your borrowing activities</p>
                        </div>
                    </div>
                </div>

                <div className="register-form-card">
                    <div className="register-form-heading">
                        <h2>Create Your Account</h2>
                        <p>Enter your details to become a BMM member.</p>
                    </div>

                    <form className="register-form" onSubmit={handleSubmit}>
                        <div className="register-field">
                            <label htmlFor="full_name">Full Name</label>
                            <input
                                type="text"
                                id="full_name"
                                name="full_name"
                                placeholder="Enter your full name"
                                value={formData.full_name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="register-field">
                            <label htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Enter your email address"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="register-field">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="Create a password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="register-field">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                placeholder="Enter your password again"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {error && <p role="alert">{error}</p>}

                        {success && <p role="status">{success}</p>}

                        <button
                            type="submit"
                            className="register-submit"
                            disabled={loading}
                        >
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>

                    <p className="register-login">
                        Already have an account? <Link to="/login">Log In</Link>
                    </p>
                </div>
            </div>
        </main>
    );
}

export default Register;
