import React from 'react';
import { Link } from 'react-router-dom';
import '../index.css';

const Home = () => {
  return (
    <div className="home-container">
      <nav className="navbar">
        <div className="logo">JobSnap</div>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/signup">Signup</Link></li>
          <li><Link to="/dashboard">Dashboard</Link></li>
        </ul>
      </nav>

      <header className="hero">
        <h1>Welcome to JobSnap</h1>
        <p>Your personal job application tracker powered by AI</p>
        <Link to="/signup"><button className="cta-btn">Get Started</button></Link>
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
