import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import JobList from './pages/JobList';
import Suggestions from './pages/Suggestions';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/resume-analyzer" element={<ResumeAnalyzer />} />
        <Route path="/jobs" element={<JobList />} />
        <Route path="/jobs/new" element={<JobList />} />
        <Route path="/suggestions" element={<Suggestions />} />
        {/* Fallback route */}
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
