import '../styles/Home.css';
function Home() {
    return (
        <main className="home-page">
            <section className="hero-section">
                <div className="hero-content">
                    <p className="hero-label">WELCOME TO BMM LIBRARY</p>

                    <h1>
                        Discover Your Next
                        <span> Great Read.</span>
                    </h1>

                    <p className="hero-description">
                        Explore a world of knowledge, inspiration and
                        imagination. Your next favourite book is waiting
                        for you at BMM Library.
                    </p>

                    <div className="hero-buttons">
                        <button className="primary-button">
                            Explore Books
                        </button>

                        <button className="secondary-button">
                            Become a Member
                        </button>
                    </div>
                </div>

                <div className="hero-image">
                    <div className="image-decoration">
                        <span>READ</span>
                        <span>LEARN</span>
                        <span>GROW</span>
                    </div>
                </div>
            </section>

            <section className="welcome-section">
                <p>YOUR JOURNEY STARTS HERE</p>
                <h2>A Library Designed for Curious Minds</h2>
                <p>
                    Whether you are studying, discovering something new,
                    or enjoying a good story, BMM Library is here to
                    support your reading journey.
                </p>
            </section>
        </main>
    );
}

export default Home;
