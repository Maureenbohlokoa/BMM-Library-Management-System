
import { BookOpen, GraduationCap, Heart, Sparkles } from 'lucide-react';
import '../styles/About.css';

function About() {
    return (
        <section className="about-section" id="about">
            <div className="about-container">
                <div className="about-visual">
                    <div className="about-image-card">
                        <BookOpen size={75} />
                        <span>Knowledge Begins Here</span>
                        <div className="about-decoration">
                            <Sparkles size={25} />
                        </div>
                    </div>

                    <div className="about-experience">
                        <GraduationCap size={30} />
                        <div>
                            <strong>A Place to Grow</strong>
                            <span>Learn something new every day</span>
                        </div>
                    </div>
                </div>

                <div className="about-content">
                    <p className="section-label">GET TO KNOW US</p>

                    <h2>
                        More Than Books.
                        <span> A World of Possibilities.</span>
                    </h2>

                    <p className="about-description">
                        BMM Library is a welcoming space created for readers,
                        learners and curious minds. We believe that every book
                        has the power to inspire ideas, build knowledge and
                        open doors to new opportunities.
                    </p>

                    <p className="about-description">
                        Whether you are pursuing your studies, developing
                        new skills or simply enjoying a great story, we are
                        here to support your journey through reading.
                    </p>

                    <div className="about-values">
                        <div className="about-value">
                            <BookOpen size={23} />
                            <div>
                                <strong>Knowledge</strong>
                                <span>Discover and learn</span>
                            </div>
                        </div>

                        <div className="about-value">
                            <Heart size={23} />
                            <div>
                                <strong>Community</strong>
                                <span>Grow together</span>
                            </div>
                        </div>
                    </div>

                    <a href="#books" className="about-button">
                        Explore Our Books
                    </a>
                </div>
            </div>
        </section>
    );
}

export default About;
