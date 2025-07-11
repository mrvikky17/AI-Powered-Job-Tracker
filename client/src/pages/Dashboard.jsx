import React, { useState, useEffect } from 'react';
import { Pie, Bar, Line } from 'react-chartjs-2';
import { Link, useNavigate } from 'react-router-dom';
import 'chart.js/auto';
import jobService from '../services/jobService';
import '../index.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || 'Guest';
  const [stats, setStats] = useState(null);
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Try to fetch real data, fallback to sample data
      try {
        const [statsData, jobsData] = await Promise.all([
          jobService.getDashboardStats(),
          jobService.getJobs()
        ]);
        setStats(statsData);
        setRecentJobs(jobsData.slice(0, 5)); // Get latest 5 jobs
      } catch (apiError) {
        console.log('Using sample data for demo...');
        // Use sample data for demo
        const sampleJobs = jobService.getSampleJobs();
        setRecentJobs(sampleJobs.slice(0, 5));
        
        // Generate sample stats
        const sampleStats = {
          totalJobs: sampleJobs.length,
          interviewCount: sampleJobs.filter(j => j.status === 'Interview').length,
          offerCount: sampleJobs.filter(j => j.status === 'Offer').length,
          rejectedCount: sampleJobs.filter(j => j.status === 'Rejected').length,
          successRate: ((sampleJobs.filter(j => j.status === 'Offer').length / sampleJobs.length) * 100).toFixed(1),
          statusDistribution: [
            { _id: 'Applied', count: 2 },
            { _id: 'Interview', count: 1 },
            { _id: 'Offer', count: 1 },
            { _id: 'Rejected', count: 1 }
          ],
          recentApplications: [
            { _id: '2024-01-25', count: 2 },
            { _id: '2024-01-26', count: 1 },
            { _id: '2024-01-27', count: 3 },
            { _id: '2024-01-28', count: 1 },
            { _id: '2024-01-29', count: 2 }
          ]
        };
        setStats(sampleStats);
      }
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleAddNewJob = () => {
    navigate('/jobs/new');
  };

  const handleAnalyzeResume = () => {
    navigate('/resume-analyzer');
  };

  const handleViewAllJobs = () => {
    navigate('/jobs');
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loader}></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <h2>⚠️ Error</h2>
        <p>{error}</p>
        <button onClick={fetchDashboardData} style={styles.retryButton}>
          Try Again
        </button>
      </div>
    );
  }

  // Prepare chart data
  const pieData = {
    labels: stats?.statusDistribution?.map(item => item._id) || ['Applied', 'Interview', 'Offer', 'Rejected'],
    datasets: [
      {
        label: 'Applications',
        data: stats?.statusDistribution?.map(item => item.count) || [2, 1, 1, 1],
        backgroundColor: ['#3b82f6', '#f59e0b', '#10b981', '#ef4444'],
        borderWidth: 2,
        borderColor: '#ffffff'
      },
    ],
  };

  const barData = {
    labels: stats?.recentApplications?.map(item => 
      new Date(item._id).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    ) || ['Jan 25', 'Jan 26', 'Jan 27', 'Jan 28', 'Jan 29'],
    datasets: [
      {
        label: 'Applications Submitted',
        data: stats?.recentApplications?.map(item => item.count) || [2, 1, 3, 1, 2],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: '#3b82f6',
        borderWidth: 2,
        borderRadius: 6
      },
    ],
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Applied': return '#3b82f6';
      case 'Interview': return '#f59e0b';
      case 'Offer': return '#10b981';
      case 'Rejected': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.welcomeTitle}>Welcome back, {userName} 👋</h1>
          <p style={styles.subtitle}>Here's your job application overview</p>
        </div>
        <div style={styles.headerActions}>
          <Link to="/resume-analyzer" style={styles.headerButton}>
            📄 Analyze Resume
          </Link>
          <button onClick={handleLogout} style={styles.logoutButton}>
            Logout
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={styles.statsGrid}>
        <div style={{...styles.statCard, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
          <h2 style={styles.statNumber}>{stats?.totalJobs || 0}</h2>
          <p style={styles.statLabel}>Total Applications</p>
          <div style={styles.statIcon}>📝</div>
        </div>
        <div style={{...styles.statCard, background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'}}>
          <h2 style={styles.statNumber}>{stats?.interviewCount || 0}</h2>
          <p style={styles.statLabel}>Interviews</p>
          <div style={styles.statIcon}>🎯</div>
        </div>
        <div style={{...styles.statCard, background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'}}>
          <h2 style={styles.statNumber}>{stats?.offerCount || 0}</h2>
          <p style={styles.statLabel}>Offers</p>
          <div style={styles.statIcon}>🎉</div>
        </div>
        <div style={{...styles.statCard, background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'}}>
          <h2 style={styles.statNumber}>{stats?.successRate || 0}%</h2>
          <p style={styles.statLabel}>Success Rate</p>
          <div style={styles.statIcon}>📈</div>
        </div>
      </div>

      {/* Charts Section */}
      <div style={styles.chartsGrid}>
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Application Status Distribution</h3>
          <div style={styles.chartContainer}>
            <Pie 
              data={pieData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: {
                      padding: 20,
                      usePointStyle: true
                    }
                  }
                }
              }}
            />
          </div>
        </div>
        
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Recent Activity</h3>
          <div style={styles.chartContainer}>
            <Bar 
              data={barData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      stepSize: 1
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Recent Applications */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>📋 Recent Applications</h2>
          <button onClick={handleViewAllJobs} style={styles.viewAllButton}>
            View All
          </button>
        </div>
        
        {recentJobs.length > 0 ? (
          <div style={styles.jobsList}>
            {recentJobs.map((job) => (
              <div key={job._id} style={styles.jobCard}>
                <div style={styles.jobInfo}>
                  <h4 style={styles.jobTitle}>{job.title}</h4>
                  <p style={styles.jobCompany}>{job.company}</p>
                  <p style={styles.jobLocation}>📍 {job.location}</p>
                </div>
                <div style={styles.jobMeta}>
                  <span 
                    style={{
                      ...styles.statusBadge,
                      backgroundColor: getStatusColor(job.status) + '20',
                      color: getStatusColor(job.status)
                    }}
                  >
                    {job.status}
                  </span>
                  <p style={styles.jobDate}>
                    {new Date(job.applicationDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={styles.emptyState}>
            <p>No applications yet. Start by adding your first job application!</p>
            <button onClick={handleAddNewJob} style={styles.addFirstJobButton}>
              ➕ Add Your First Application
            </button>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>⚡ Quick Actions</h2>
        <div style={styles.quickActions}>
          <button onClick={handleAddNewJob} style={styles.actionButton}>
            <span style={styles.actionIcon}>➕</span>
            Add New Application
          </button>
          <button onClick={handleAnalyzeResume} style={styles.actionButton}>
            <span style={styles.actionIcon}>📄</span>
            Analyze Resume
          </button>
          <button onClick={handleViewAllJobs} style={styles.actionButton}>
            <span style={styles.actionIcon}>🔍</span>
            View All Jobs
          </button>
          <button onClick={() => window.print()} style={styles.actionButton}>
            <span style={styles.actionIcon}>📁</span>
            Export Data
          </button>
        </div>
      </div>
    </div>
  );
};

// Inline styles for modern design
const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    backgroundColor: '#f8fafc',
    minHeight: '100vh'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
  },
  welcomeTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1f2937',
    margin: '0 0 8px 0'
  },
  subtitle: {
    color: '#6b7280',
    margin: 0,
    fontSize: '16px'
  },
  headerActions: {
    display: 'flex',
    gap: '12px'
  },
  headerButton: {
    padding: '10px 20px',
    backgroundColor: '#3b82f6',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '8px',
    fontWeight: '500',
    fontSize: '14px',
    transition: 'all 0.2s'
  },
  logoutButton: {
    padding: '10px 20px',
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '500',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '30px'
  },
  statCard: {
    padding: '24px',
    borderRadius: '16px',
    color: 'white',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
  },
  statNumber: {
    fontSize: '36px',
    fontWeight: '700',
    margin: '0 0 8px 0'
  },
  statLabel: {
    fontSize: '16px',
    margin: 0,
    opacity: 0.9
  },
  statIcon: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    fontSize: '24px',
    opacity: 0.8
  },
  chartsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '24px',
    marginBottom: '30px'
  },
  chartCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
  },
  chartTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '20px'
  },
  chartContainer: {
    height: '300px',
    position: 'relative'
  },
  section: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '24px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1f2937',
    margin: 0
  },
  viewAllButton: {
    padding: '8px 16px',
    backgroundColor: '#f3f4f6',
    color: '#374151',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    cursor: 'pointer',
    fontWeight: '500'
  },
  jobsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  jobCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    transition: 'all 0.2s'
  },
  jobInfo: {
    flex: 1
  },
  jobTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1f2937',
    margin: '0 0 4px 0'
  },
  jobCompany: {
    fontSize: '14px',
    color: '#6b7280',
    margin: '0 0 4px 0'
  },
  jobLocation: {
    fontSize: '14px',
    color: '#9ca3af',
    margin: 0
  },
  jobMeta: {
    textAlign: 'right'
  },
  statusBadge: {
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '500',
    display: 'inline-block',
    marginBottom: '8px'
  },
  jobDate: {
    fontSize: '12px',
    color: '#9ca3af',
    margin: 0
  },
  quickActions: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px'
  },
  actionButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    backgroundColor: '#f8fafc',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    transition: 'all 0.2s'
  },
  actionIcon: {
    fontSize: '18px'
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px',
    color: '#6b7280'
  },
  addFirstJobButton: {
    marginTop: '16px',
    padding: '12px 24px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '50vh',
    color: '#6b7280'
  },
  loader: {
    width: '40px',
    height: '40px',
    border: '4px solid #f3f4f6',
    borderTop: '4px solid #3b82f6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '16px'
  },
  errorContainer: {
    textAlign: 'center',
    padding: '40px',
    backgroundColor: 'white',
    borderRadius: '12px',
    margin: '20px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
  },
  retryButton: {
    marginTop: '16px',
    padding: '12px 24px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer'
  }
};

// Add keyframe animation for loader
const styleSheet = document.createElement('style');
styleSheet.type = 'text/css';
styleSheet.innerText = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

export default Dashboard;
