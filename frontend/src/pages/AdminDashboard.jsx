
import {
    BookOpen,
    Users,
    BookCheck,
    BookCopy,
    TrendingUp,
    AlertTriangle,
    ArrowRight,
    ClipboardList
} from 'lucide-react';
import { Link } from 'react-router-dom';
import '../styles/AdminDashboard.css';

function AdminDashboard() {
    const statistics = [
        {
            label: 'Total Books',
            value: '0',
            icon: BookOpen
        },
        {
            label: 'Registered Members',
            value: '0',
            icon: Users
        },
        {
            label: 'Books Available',
            value: '0',
            icon: BookCheck
        },
        {
            label: 'Books Borrowed',
            value: '0',
            icon: BookCopy
        }
    ];

    const managementOptions = [
        {
            title: 'Book Management',
            description: 'Add, update and remove books from the library collection.',
            icon: BookOpen,
            path: '/book-management',
            linkText: 'Manage Books'
        },
        {
            title: 'Member Management',
            description: 'View and manage registered library members.',
            icon: Users,
            path: '/member-management',
            linkText: 'Manage Members'
        },
        {
            title: 'Transaction Management',
            description: 'Record borrowed books, returns and stock updates.',
            icon: ClipboardList,
            path: '/transaction-management',
            linkText: 'Manage Transactions'
        }
    ];

    return (
        <main className="admin-dashboard">
            <section className="admin-welcome">
                <div>
                    <p className="admin-label">ADMINISTRATOR PORTAL</p>
                    <h1>
                        Library <span>Overview</span>
                    </h1>
                    <p>
                        Welcome to the BMM Library administration
                        dashboard. Manage your library operations
                        from one central place.
                    </p>
                </div>

                <div className="admin-welcome-icon">
                    <TrendingUp size={38} />
                </div>
            </section>

            <section className="admin-statistics">
                {statistics.map((statistic) => {
                    const Icon = statistic.icon;

                    return (
                        <div className="admin-stat-card" key={statistic.label}>
                            <div className="admin-stat-icon">
                                <Icon size={25} />
                            </div>
                            <strong>{statistic.value}</strong>
                            <span>{statistic.label}</span>
                        </div>
                    );
                })}
            </section>

            <section className="admin-management">
                <div className="admin-section-heading">
                    <div>
                        <p className="admin-label">LIBRARY OPERATIONS</p>
                        <h2>Management Centre</h2>
                    </div>
                </div>

                <div className="admin-management-grid">
                    {managementOptions.map((option) => {
                        const Icon = option.icon;

                        return (
                            <article className="admin-management-card" key={option.title}>
                                <div className="admin-management-icon">
                                    <Icon size={27} />
                                </div>

                                <h3>{option.title}</h3>
                                <p>{option.description}</p>

                                <Link to={option.path} className="admin-management-link">
                                    {option.linkText} <ArrowRight size={16} />
                                </Link>
                            </article>
                        );
                    })}
                </div>
            </section>

            <section className="admin-alert">
                <div className="admin-alert-icon">
                    <AlertTriangle size={25} />
                </div>

                <div>
                    <h3>Low Stock Monitoring</h3>
                    <p>
                        Books with fewer than two available copies
                        will be highlighted here.
                    </p>
                </div>
            </section>
        </main>
    );
}

export default AdminDashboard;
