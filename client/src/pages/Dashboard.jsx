import React from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import '../index.css';

const Dashboard = () => {
  const stats = {
    total: 25,
    interview: 5,
    offers: 3,
    successRate: ((3 / 25) * 100).toFixed(1),
  };

  const pieData = {
    labels: ['Applied', 'Interview', 'Offer', 'Rejected'],
    datasets: [
      {
        label: 'Status Distribution',
        data: [12, 5, 3, 5],
        backgroundColor: ['#2563eb', '#facc15', '#22c55e', '#ef4444']
      }
    ]
  };

  const barData = {
    labels: ['Jun 22', 'Jun 23', 'Jun 24', 'Jun 25', 'Jun 26', 'Jun 27', 'Jun 28'],
    datasets: [
      {
        label: 'Applications Submitted',
        data: [1, 2, 4, 3, 5, 6, 4],
        backgroundColor: '#60a5fa'
      }
    ]
  };

  return (
    <div className="container">
      <h1>📊 Dashboard Overview</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <h2>{stats.total}</h2>
          <p>Total Applications</p>
        </div>
        <div className="stat-card">
          <h2>{stats.interview}</h2>
          <p>Interviews Scheduled</p>
        </div>
        <div className="stat-card">
          <h2>{stats.offers}</h2>
          <p>Offers Received</p>
        </div>
        <div className="stat-card">
          <h2>{stats.successRate}%</h2>
          <p>Success Rate</p>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-box">
          <h3>Application Status</h3>
          <Pie data={pieData} />
        </div>
        <div className="chart-box">
          <h3>Activity Over Last 7 Days</h3>
          <Bar data={barData} />
        </div>
      </div>

      <h2>📋 Recent Activity</h2>
      <table className="activity-table">
        <thead>
          <tr>
            <th>Position</th>
            <th>Company</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>SDE Intern</td>
            <td>Google</td>
            <td>Interview</td>
            <td>Jun 28</td>
          </tr>
          <tr>
            <td>Frontend Dev</td>
            <td>Zoho</td>
            <td>Rejected</td>
            <td>Jun 25</td>
          </tr>
        </tbody>
      </table>

      <h2>💡 Quick Actions</h2>
      <div className="quick-actions">
        <button className="button">➕ Add New Application</button>
        <button className="button">📄 Analyze Resume Again</button>
        <button className="button">🔍 Search Jobs</button>
        <button className="button">📁 Export All Data</button>
      </div>
    </div>
  );
};

export default Dashboard;
