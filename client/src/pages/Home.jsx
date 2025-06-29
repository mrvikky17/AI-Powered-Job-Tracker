import React from 'react';
import '../index.css';

const Home = () => {
  return (
    <div className="home-container">
      <nav className="navbar">
        <div className="logo">JobSnap</div>
        <ul className="nav-links">
          <li>Home</li>
          <li>Jobs</li>
          <li>Resume Analyzer</li>
          <li>Dashboard</li>
        </ul>
      </nav>

      <header className="hero">
        <h1>Welcome to JobSnap</h1>
        <p>Your personal job application tracker powered by AI</p>
        <button className="cta-btn">Get Started</button>
      </header>

      <section className="features">
        <div className="feature-card">
          <h3>Track Applications</h3>
          <p>Stay organized with all your job applications in one place.</p>
        </div>
        <div className="feature-card">
          <h3>Resume Analyzer</h3>
          <p>Upload your resume and get skill matches using AI.</p>
        </div>
        <div className="feature-card">
          <h3>Smart Suggestions</h3>
          <p>Receive job recommendations based on your resume.</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
