
import { BookOpen, Users, BookCheck, BookCopy } from 'lucide-react';
import '../styles/LibraryStats.css';

const statistics = [
    {
        label: 'Books in Collection',
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

function LibraryStats() {
    return (
        <section className="library-stats">
            <div className="stats-heading">
                <p className="section-label">BMM LIBRARY AT A GLANCE</p>
                <h2>Our Library <span>In Numbers</span></h2>
                <p>
                    A growing community built around knowledge and reading.
                </p>
            </div>

            <div className="stats-grid">
                {statistics.map((statistic) => {
                    const Icon = statistic.icon;

                    return (
                        <div className="stat-card" key={statistic.label}>
                            <div className="stat-icon">
                                <Icon size={27} />
                            </div>

                            <strong>{statistic.value}</strong>
                            <span>{statistic.label}</span>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

export default LibraryStats;
