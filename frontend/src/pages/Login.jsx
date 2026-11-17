
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import '../styles/Login.css';

function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [error, setError] = useState('');
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
        setLoading(true);

        try {
            const response = await authService.login(formData);

            localStorage.setItem('bmmToken', response.data.token);
            localStorage.setItem('bmmUser', JSON.stringify(response.data.user));
            
            if (response.data.user.role === 'admin') {
                navigate('/admin-dashboard');
            } else {
                navigate('/member-dashboard');
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="login-page">
            <div className="login-container">
                <div className="login-intro">
                    <p className="login-label">WELCOME BACK</p>

                    <h1>
                        Your Library.
                        <span> Your World.</span>
                    </h1>

                    <p>
                        Sign in to your BMM Library account and continue
                        exploring knowledge, discovering books and
                        managing your reading journey.
                    </p>

                    <div className="login-benefits">
                        <div>
                            <span>01</span>
                            <p>Access your personal book catalogue</p>
                        </div>

                        <div>
                            <span>02</span>
                            <p>Keep track of your borrowed books</p>
                        </div>

                        <div>
                            <span>03</span>
                            <p>Manage your library account</p>
                        </div>
                    </div>
                </div>

                <div className="login-form-card">
                    <div className="login-form-heading">
                        <h2>Welcome Back!</h2>
                        <p>Enter your account details to continue.</p>
                    </div>

                    <form className="login-form" onSubmit={handleSubmit}>
                        <div className="login-field">
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

                        <div className="login-field">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {error && <p role="alert">{error}</p>}

                        <button
                            type="submit"
                            className="login-submit"
                            disabled={loading}
                        >
                            {loading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>

                    <p className="login-register">
                        Don't have an account?
                        <Link to="/register"> Create an Account</Link>
                    </p>
                </div>
            </div>
        </main>
    );
}

export default Login;
