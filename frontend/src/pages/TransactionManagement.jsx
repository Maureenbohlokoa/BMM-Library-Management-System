
import { useEffect, useState } from 'react';
import {
    ArrowDownToLine,
    ArrowUpFromLine,
    RotateCcw,
    Search,
    ClipboardList,
    BookOpen
} from 'lucide-react';
import bookService from '../services/bookService';
import memberService from '../services/memberService';
import transactionService from '../services/transactionService';
import '../styles/TransactionManagement.css';

function TransactionManagement() {
    const [activeTab, setActiveTab] = useState('borrow');
    const [searchTerm, setSearchTerm] = useState('');
    const [transactions, setTransactions] = useState([]);
    const [books, setBooks] = useState([]);
    const [members, setMembers] = useState([]);
    const [formData, setFormData] = useState({
        user_id: '',
        book_id: '',
        quantity: 1,
        notes: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const token = localStorage.getItem('bmmToken');
    const user = JSON.parse(localStorage.getItem('bmmUser') || 'null');
    const isAdmin = user?.role === 'admin';

    async function fetchData() {
        setError('');

        try {
            if (!token) {
                throw new Error('Please log in to access transactions.');
            }

            const bookResponse = await bookService.getBooks(token);
            setBooks(bookResponse.data);

            if (isAdmin) {
                const memberResponse = await memberService.getMembers(token);
                setMembers(memberResponse.data);

                const transactionResponse = await transactionService.getTransactions(token);
                setTransactions(transactionResponse.data);
            } else {
                setTransactions([]);
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    const filteredTransactions = transactions.filter((transaction) =>
        `${transaction.member_name || ''} ${transaction.book_title || ''} ${transaction.membership_id || ''}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    const borrowCount = transactions.filter(
        (item) => item.transaction_type === 'BORROW'
    ).length;

    const returnCount = transactions.filter(
        (item) => item.transaction_type === 'RETURN'
    ).length;

    const stockCount = transactions.filter(
        (item) => item.transaction_type === 'STOCK_IN'
    ).length;

    function handleChange(event) {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setError('');
        setSuccess('');

        if (!formData.book_id || Number(formData.quantity) <= 0) {
            setError('Please select a book and enter a valid quantity.');
            return;
        }

        if (activeTab !== 'stock' && isAdmin && !formData.user_id) {
            setError('Please select a member.');
            return;
        }

        setSaving(true);

        try {
            const transactionData = {
                book_id: Number(formData.book_id),
                quantity: Number(formData.quantity),
                notes: formData.notes.trim()
            };

            let response;

            if (activeTab === 'stock') {
                response = await transactionService.stockIn(transactionData, token);
            } else if (activeTab === 'borrow') {
                if (isAdmin) {
                    transactionData.user_id = Number(formData.user_id);
                }

                response = await transactionService.borrowBook(transactionData, token);
            } else {
                if (isAdmin) {
                    transactionData.user_id = Number(formData.user_id);
                }

                response = await transactionService.returnBook(transactionData, token);
            }

            setSuccess(response.message || 'Transaction recorded successfully.');

            setFormData({
                user_id: '',
                book_id: '',
                quantity: 1,
                notes: ''
            });

            await fetchData();
        } catch (error) {
            setError(error.message);
        } finally {
            setSaving(false);
        }
    }

    const transactionTypes = [
        {
            id: 'borrow',
            label: 'Borrow Book',
            icon: ArrowDownToLine
        },
        {
            id: 'return',
            label: 'Return Book',
            icon: RotateCcw
        },
        ...(isAdmin
            ? [{
                id: 'stock',
                label: 'Stock In',
                icon: ArrowUpFromLine
            }]
            : [])
    ];

    return (
        <main className="transaction-page">
            <section className="transaction-header">
                <div>
                    <p className="transaction-eyebrow">LIBRARY OPERATIONS</p>
                    <h1>Transaction <span>Management</span></h1>
                    <p>Manage book borrowing, returns and library stock records.</p>
                </div>

                <div className="transaction-header-icon">
                    <ClipboardList size={38} />
                </div>
            </section>

            {error && <p role="alert">{error}</p>}
            {success && <p role="status">{success}</p>}

            {isAdmin && (
                <section className="transaction-summary">
                    <div className="transaction-summary-card">
                        <div className="transaction-summary-icon borrow-icon">
                            <ArrowDownToLine size={23} />
                        </div>
                        <div>
                            <strong>{borrowCount}</strong>
                            <span>Borrow Records</span>
                        </div>
                    </div>

                    <div className="transaction-summary-card">
                        <div className="transaction-summary-icon return-icon">
                            <RotateCcw size={23} />
                        </div>
                        <div>
                            <strong>{returnCount}</strong>
                            <span>Return Records</span>
                        </div>
                    </div>

                    <div className="transaction-summary-card">
                        <div className="transaction-summary-icon stock-icon">
                            <ArrowUpFromLine size={23} />
                        </div>
                        <div>
                            <strong>{stockCount}</strong>
                            <span>Stock Records</span>
                        </div>
                    </div>
                </section>
            )}

            <section className="transaction-form-section">
                <div className="transaction-section-heading">
                    <div>
                        <p className="transaction-eyebrow">RECORD ACTIVITY</p>
                        <h2>New Transaction</h2>
                    </div>
                    <BookOpen size={25} />
                </div>

                <div className="transaction-tabs">
                    {transactionTypes.map((type) => {
                        const Icon = type.icon;

                        return (
                            <button
                                type="button"
                                key={type.id}
                                className={activeTab === type.id ? 'active' : ''}
                                onClick={() => {
                                    setActiveTab(type.id);
                                    setError('');
                                    setSuccess('');
                                }}
                            >
                                <Icon size={18} />
                                {type.label}
                            </button>
                        );
                    })}
                </div>

                <form className="transaction-form" onSubmit={handleSubmit}>
                    <div className="transaction-form-grid">
                        {activeTab !== 'stock' && isAdmin && (
                            <div className="transaction-field">
                                <label>Member</label>
                                <select
                                    name="user_id"
                                    value={formData.user_id}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select a member</option>
                                    {members.map((member) => (
                                        <option
                                            key={member.user_id}
                                            value={member.user_id}
                                        >
                                            {member.full_name} ({member.membership_id})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div className="transaction-field">
                            <label>Book Title</label>
                            <select
                                name="book_id"
                                value={formData.book_id}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select a book</option>
                                {books.map((book) => (
                                    <option
                                        key={book.book_id}
                                        value={book.book_id}
                                    >
                                        {book.title} ({book.quantity} available)
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="transaction-field">
                            <label>Quantity</label>
                            <input
                                type="number"
                                name="quantity"
                                min="1"
                                step="1"
                                value={formData.quantity}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="transaction-field">
                            <label>Notes (Optional)</label>
                            <input
                                type="text"
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                placeholder="Add any additional information"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="transaction-submit"
                        disabled={saving || loading}
                    >
                        <ClipboardList size={18} />
                        {saving
                            ? 'Processing...'
                            : `Record ${activeTab === 'borrow'
                                ? 'Borrowing'
                                : activeTab === 'return'
                                    ? 'Return'
                                    : 'Stock In'}`}
                    </button>
                </form>
            </section>

            {isAdmin && (
                <section className="transaction-history">
                    <div className="transaction-section-heading">
                        <div>
                            <p className="transaction-eyebrow">LIBRARY RECORDS</p>
                            <h2>Transaction History</h2>
                        </div>
                        <span className="transaction-count">
                            {transactions.length} Records
                        </span>
                    </div>

                    <div className="transaction-search">
                        <Search size={19} />
                        <input
                            type="text"
                            placeholder="Search by member or book title..."
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                        />
                    </div>

                    <div className="transaction-table-wrapper">
                        <table className="transaction-table">
                            <thead>
                                <tr>
                                    <th>Transaction</th>
                                    <th>Member / Admin</th>
                                    <th>Book Title</th>
                                    <th>Quantity</th>
                                    <th>Date</th>
                                    <th>Notes</th>
                                </tr>
                            </thead>

                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" className="transaction-empty">
                                            Loading transactions...
                                        </td>
                                    </tr>
                                ) : filteredTransactions.length > 0 ? (
                                    filteredTransactions.map((transaction) => (
                                        <tr key={transaction.transaction_id}>
                                            <td>
                                                <span
                                                    className={`transaction-type ${
                                                        transaction.transaction_type === 'BORROW'
                                                            ? 'borrow'
                                                            : transaction.transaction_type === 'RETURN'
                                                                ? 'return'
                                                                : 'stock'
                                                    }`}
                                                >
                                                    {transaction.transaction_type === 'BORROW'
                                                        ? 'Borrow'
                                                        : transaction.transaction_type === 'RETURN'
                                                            ? 'Return'
                                                            : 'Stock In'}
                                                </span>
                                            </td>
                                            <td>
                                                {transaction.member_name || 'Administrator'}
                                                {transaction.membership_id && (
                                                    <span> ({transaction.membership_id})</span>
                                                )}
                                            </td>
                                            <td>{transaction.book_title}</td>
                                            <td>{transaction.quantity}</td>
                                            <td>
                                                {new Date(
                                                    transaction.created_at
                                                ).toLocaleDateString()}
                                            </td>
                                            <td>{transaction.notes || '—'}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="transaction-empty">
                                            {loading
                                                ? 'Loading transactions...'
                                                : 'No transaction records found.'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            )}
        </main>
    );
}

export default TransactionManagement;
