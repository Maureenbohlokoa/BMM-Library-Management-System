
import { Link } from 'react-router-dom';
import {
    BookOpen,
    BookCheck,
    Clock,
    History,
    ArrowRight,
    UserRound
} from 'lucide-react';
import '../styles/MemberDashboard.css';

function MemberDashboard() {
    const member = {
        name: 'BMM Member',
        membershipId: 'BMM-001'
    };

    const statistics = [
        {
            label: 'Books Borrowed',
            value: '0',
            icon: BookOpen
        },
        {
            label: 'Currently Borrowed',
            value: '0',
            icon: BookCheck
        },
        {
            label: 'Books Overdue',
            value: '0',
            icon: Clock
        }
    ];

    return (
        <main className="member-dashboard">
            <section className="dashboard-welcome">
                <div>
                    <p className="dashboard-label">MEMBER DASHBOARD</p>
                    <h1>
                        Welcome Back,
                        <span> {member.name}!</span>
                    </h1>
                    <p>
                        Your personal reading space. Keep track of your
                        books and continue discovering new reads.
                    </p>
                </div>

                <div className="membership-card">
                    <div className="membership-icon">
                        <UserRound size={27} />
                    </div>
                    <div>
                        <span>YOUR MEMBERSHIP ID</span>
                        <strong>{member.membershipId}</strong>
                    </div>
                </div>
            </section>

            <section className="dashboard-statistics">
                {statistics.map((statistic) => {
                    const Icon = statistic.icon;

                    return (
                        <div className="dashboard-stat-card" key={statistic.label}>
                            <div className="dashboard-stat-icon">
                                <Icon size={25} />
                            </div>
                            <strong>{statistic.value}</strong>
                            <span>{statistic.label}</span>
                        </div>
                    );
                })}
            </section>

            <section className="dashboard-main-content">
                <div className="dashboard-section-heading">
                    <div>
                        <p className="dashboard-label">YOUR READING ACTIVITY</p>
                        <h2>Recent Borrowing History</h2>
                    </div>

                    <History size={25} />
                </div>

                <div className="dashboard-empty">
                    <BookOpen size={45} />
                    <h3>No Borrowing History Yet</h3>
                    <p>
                        Once you borrow a book, your borrowing records
                        will appear here.
                    </p>
                    <Link to="/catalogue" className="dashboard-browse-button">
                        Explore Books <ArrowRight size={17} />
                    </Link>
                </div>
            </section>

            <section className="dashboard-discover">
                <div>
                    <p className="dashboard-label">READY FOR YOUR NEXT READ?</p>
                    <h2>Discover Something New Today.</h2>
                    <p>
                        Explore our collection and find a book that
                        inspires your next chapter.
                    </p>
                </div>

                <Link to="/catalogue" className="dashboard-discover-button">
                    Browse Catalogue <ArrowRight size={18} />
                </Link>
            </section>
        </main>
    );
}

export default MemberDashboard;
