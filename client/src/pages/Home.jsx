import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={styles.container}>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <div style={styles.logo}>JobSnap</div>
        <ul style={styles.navLinks}>
          <li><Link to="/" style={styles.link}>Home</Link></li>
          <li><Link to="/login" style={styles.link}>Login</Link></li>
          <li><Link to="/signup" style={styles.link}>Signup</Link></li>
          <li><Link to="/dashboard" style={styles.link}>Dashboard</Link></li>
        </ul>
      </nav>

      {/* Hero Section */}
      <header style={styles.hero}>
        <h1 style={styles.heroTitle}>Welcome to <span style={{ color: '#2563eb' }}>JobSnap</span></h1>
        <p style={styles.heroText}>Your personal job application tracker powered by AI</p>
        <Link to="/signup"><button style={styles.ctaBtn}>🚀 Get Started</button></Link>
      </header>

      {/* Features Section */}
      <section style={styles.features}>
        {features.map((feature, i) => (
          <div key={i} style={{ ...styles.featureCard, animationDelay: `${i * 0.2}s` }}>
            <h3>{feature.title}</h3>
            <p>{feature.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

// Feature Cards Content
const features = [
  {
    title: '📋 Track Applications',
    desc: 'Stay organized with all your job applications in one place.',
  },
  {
    title: '📑 Resume Analyzer',
    desc: 'Upload your resume and get skill matches using AI.',
  },
  {
    title: '💡 Smart Suggestions',
    desc: 'Receive job recommendations based on your resume.',
  },
  {
    title: '🔍 Explore Jobs',
    desc: 'Browse open positions with built-in search filters.',
  },
];

// Inline Styles
const styles = {
  container: {
    fontFamily: 'Segoe UI, sans-serif',
    background: 'linear-gradient(to bottom right, #eef2ff, #dbeafe)',
    minHeight: '100vh',
    paddingBottom: '50px',
  },
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 40px',
    backgroundColor: '#1e3a8a',
    color: 'white',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  },
  logo: {
    fontSize: '24px',
    fontWeight: 'bold',
    letterSpacing: '1px',
  },
  navLinks: {
    display: 'flex',
    listStyle: 'none',
    gap: '20px',
    margin: 0,
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontWeight: '500',
    transition: 'color 0.3s',
  },
  hero: {
    textAlign: 'center',
    marginTop: '60px',
    padding: '0 20px',
  },
  heroTitle: {
    fontSize: '40px',
    fontWeight: '700',
    marginBottom: '15px',
  },
  heroText: {
    fontSize: '18px',
    color: '#374151',
    marginBottom: '25px',
  },
  ctaBtn: {
    padding: '12px 24px',
    fontSize: '16px',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s ease',
  },
  features: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '30px',
    padding: '50px 40px',
    animation: 'fadeIn 1s ease forwards',
  },
  featureCard: {
    background: 'rgba(255, 255, 255, 0.8)',
    borderRadius: '16px',
    padding: '25px',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    backdropFilter: 'blur(6px)',
    transition: 'transform 0.3s ease',
    animation: 'popIn 0.6s ease forwards',
  },
};

// Extra Keyframes (can be added in index.css for more control)
const styleTag = document.createElement('style');
styleTag.innerHTML = `
@keyframes popIn {
  0% { opacity: 0; transform: scale(0.95); }
  100% { opacity: 1; transform: scale(1); }
}
@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}
`;
document.head.appendChild(styleTag);

export default Home;
