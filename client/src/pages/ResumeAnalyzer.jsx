import React, { useState } from 'react';
import axios from 'axios';

const ResumeAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert('Please select a resume file.');

    const formData = new FormData();
    formData.append('resume', file);

    try {
      setLoading(true);
      const res = await axios.post('http://localhost:5000/api/resume/analyze', formData);
      setSkills(res.data.skills);
    } catch (err) {
      alert('Failed to analyze resume');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📄 Resume Analyzer</h2>
      <input
        type="file"
        accept=".pdf"
        onChange={(e) => setFile(e.target.files[0])}
        style={styles.fileInput}
      />
      <button onClick={handleUpload} style={styles.button}>
        {loading ? 'Analyzing...' : 'Analyze Resume'}
      </button>

      {skills.length > 0 && (
        <div style={styles.result}>
          <h3>✅ Extracted Skills:</h3>
          <ul>
            {skills.map((skill, idx) => (
              <li key={idx} style={styles.skillItem}>🔹 {skill}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// Inner CSS
const styles = {
  container: {
    maxWidth: '500px',
    margin: '50px auto',
    padding: '30px',
    background: '#f0f4ff',
    borderRadius: '12px',
    boxShadow: '0 0 20px rgba(0,0,0,0.1)',
    textAlign: 'center',
    fontFamily: 'Segoe UI, sans-serif',
  },
  title: {
    fontSize: '24px',
    marginBottom: '20px',
    color: '#1e3a8a',
  },
  fileInput: {
    padding: '10px',
    borderRadius: '6px',
    marginBottom: '15px',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  result: {
    marginTop: '25px',
    textAlign: 'left',
  },
  skillItem: {
    background: '#e0e7ff',
    padding: '6px 12px',
    borderRadius: '8px',
    margin: '5px 0',
  },
};

export default ResumeAnalyzer;
