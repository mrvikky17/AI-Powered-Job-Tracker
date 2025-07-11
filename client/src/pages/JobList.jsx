import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import jobService from '../services/jobService';

const JobList = () => {
  const location = useLocation();
  const isNewJobMode = location.pathname.includes('/new');
  
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(isNewJobMode);
  const [editingJob, setEditingJob] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    jobType: ''
  });
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    description: '',
    salary: '',
    jobType: 'Full-time',
    status: 'Applied',
    notes: '',
    contactPerson: {
      name: '',
      email: '',
      phone: ''
    },
    skills: []
  });
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      // Try to fetch real data, fallback to sample data
      try {
        const jobsData = await jobService.getJobs();
        setJobs(jobsData);
      } catch (error) {
        console.log('Using sample data for demo...');
        const sampleJobs = jobService.getSampleJobs();
        setJobs(sampleJobs);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('contactPerson.')) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        contactPerson: {
          ...formData.contactPerson,
          [field]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(skill => skill !== skillToRemove)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingJob) {
        // Update existing job
        await jobService.updateJob(editingJob._id, formData);
      } else {
        // Create new job
        await jobService.createJob(formData);
      }
      
      // Reset form and refresh list
      resetForm();
      fetchJobs();
      alert(editingJob ? 'Job updated successfully!' : 'Job added successfully!');
    } catch (error) {
      console.error('Error saving job:', error);
      // For demo purposes, add to local state
      if (editingJob) {
        setJobs(jobs.map(job => 
          job._id === editingJob._id 
            ? { ...formData, _id: editingJob._id, applicationDate: editingJob.applicationDate }
            : job
        ));
      } else {
        const newJob = {
          ...formData,
          _id: Date.now().toString(),
          applicationDate: new Date()
        };
        setJobs([newJob, ...jobs]);
      }
      resetForm();
      alert(editingJob ? 'Job updated (demo mode)!' : 'Job added (demo mode)!');
    }
  };

  const handleEdit = (job) => {
    setEditingJob(job);
    setFormData({
      ...job,
      contactPerson: job.contactPerson || { name: '', email: '', phone: '' },
      skills: job.skills || []
    });
    setShowForm(true);
  };

  const handleDelete = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job application?')) {
      try {
        await jobService.deleteJob(jobId);
        fetchJobs();
        alert('Job deleted successfully!');
      } catch (error) {
        console.error('Error deleting job:', error);
        // For demo purposes, remove from local state
        setJobs(jobs.filter(job => job._id !== jobId));
        alert('Job deleted (demo mode)!');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      company: '',
      location: '',
      description: '',
      salary: '',
      jobType: 'Full-time',
      status: 'Applied',
      notes: '',
      contactPerson: {
        name: '',
        email: '',
        phone: ''
      },
      skills: []
    });
    setEditingJob(null);
    setShowForm(false);
    setNewSkill('');
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = !filters.search || 
      job.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      job.company.toLowerCase().includes(filters.search.toLowerCase()) ||
      job.location.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesStatus = !filters.status || job.status === filters.status;
    const matchesJobType = !filters.jobType || job.jobType === filters.jobType;
    
    return matchesSearch && matchesStatus && matchesJobType;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Applied': return '#3b82f6';
      case 'Interview': return '#f59e0b';
      case 'Offer': return '#10b981';
      case 'Rejected': return '#ef4444';
      case 'Withdrawn': return '#6b7280';
      default: return '#6b7280';
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loader}></div>
        <p>Loading your job applications...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>💼 Job Applications</h1>
          <p style={styles.subtitle}>Manage and track your job applications</p>
        </div>
        <div style={styles.headerActions}>
          <Link to="/dashboard" style={styles.backButton}>
            ← Dashboard
          </Link>
          <button 
            onClick={() => setShowForm(!showForm)}
            style={styles.addButton}
          >
            {showForm ? 'Cancel' : '+ Add Job'}
          </button>
        </div>
      </div>

      {/* Job Form */}
      {showForm && (
        <div style={styles.formSection}>
          <h2 style={styles.formTitle}>
            {editingJob ? 'Edit Job Application' : 'Add New Job Application'}
          </h2>
          
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGrid}>
              {/* Basic Information */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Job Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleFormChange}
                  required
                  style={styles.input}
                  placeholder="e.g. Frontend Developer"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Company *</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleFormChange}
                  required
                  style={styles.input}
                  placeholder="e.g. TechCorp Inc."
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Location *</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleFormChange}
                  required
                  style={styles.input}
                  placeholder="e.g. San Francisco, CA"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Salary</label>
                <input
                  type="text"
                  name="salary"
                  value={formData.salary}
                  onChange={handleFormChange}
                  style={styles.input}
                  placeholder="e.g. $80,000 - $120,000"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Job Type</label>
                <select
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleFormChange}
                  style={styles.select}
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleFormChange}
                  style={styles.select}
                >
                  <option value="Applied">Applied</option>
                  <option value="Interview">Interview</option>
                  <option value="Offer">Offer</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Withdrawn">Withdrawn</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Job Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                style={styles.textarea}
                rows={4}
                placeholder="Brief description of the role and requirements..."
              />
            </div>

            {/* Skills */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Required Skills</label>
              <div style={styles.skillsInput}>
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                  style={styles.input}
                  placeholder="Add a skill and press Enter"
                />
                <button 
                  type="button" 
                  onClick={handleAddSkill}
                  style={styles.addSkillButton}
                >
                  Add
                </button>
              </div>
              <div style={styles.skillsList}>
                {formData.skills.map((skill, index) => (
                  <span key={index} style={styles.skillTag}>
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      style={styles.removeSkillButton}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Contact Person */}
            <div style={styles.sectionTitle}>Contact Information</div>
            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Contact Name</label>
                <input
                  type="text"
                  name="contactPerson.name"
                  value={formData.contactPerson.name}
                  onChange={handleFormChange}
                  style={styles.input}
                  placeholder="e.g. John Smith"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Contact Email</label>
                <input
                  type="email"
                  name="contactPerson.email"
                  value={formData.contactPerson.email}
                  onChange={handleFormChange}
                  style={styles.input}
                  placeholder="e.g. john@company.com"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Contact Phone</label>
                <input
                  type="tel"
                  name="contactPerson.phone"
                  value={formData.contactPerson.phone}
                  onChange={handleFormChange}
                  style={styles.input}
                  placeholder="e.g. (555) 123-4567"
                />
              </div>
            </div>

            {/* Notes */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleFormChange}
                style={styles.textarea}
                rows={3}
                placeholder="Additional notes about this application..."
              />
            </div>

            {/* Form Actions */}
            <div style={styles.formActions}>
              <button type="submit" style={styles.submitButton}>
                {editingJob ? 'Update Job' : 'Add Job'}
              </button>
              <button type="button" onClick={resetForm} style={styles.cancelButton}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div style={styles.filtersSection}>
        <div style={styles.filters}>
          <input
            type="text"
            name="search"
            placeholder="Search jobs..."
            value={filters.search}
            onChange={handleFilterChange}
            style={styles.searchInput}
          />
          
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            style={styles.filterSelect}
          >
            <option value="">All Status</option>
            <option value="Applied">Applied</option>
            <option value="Interview">Interview</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
            <option value="Withdrawn">Withdrawn</option>
          </select>
          
          <select
            name="jobType"
            value={filters.jobType}
            onChange={handleFilterChange}
            style={styles.filterSelect}
          >
            <option value="">All Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
          </select>
        </div>
        
        <div style={styles.resultsCount}>
          {filteredJobs.length} of {jobs.length} applications
        </div>
      </div>

      {/* Jobs List */}
      <div style={styles.jobsSection}>
        {filteredJobs.length === 0 ? (
          <div style={styles.emptyState}>
            <h3>No job applications found</h3>
            <p>Start tracking your job applications by adding your first one!</p>
            <button 
              onClick={() => setShowForm(true)}
              style={styles.addFirstJobButton}
            >
              + Add Your First Job
            </button>
          </div>
        ) : (
          <div style={styles.jobsList}>
            {filteredJobs.map((job) => (
              <div key={job._id} style={styles.jobCard}>
                <div style={styles.jobHeader}>
                  <div style={styles.jobInfo}>
                    <h3 style={styles.jobTitle}>{job.title}</h3>
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
                    <span style={styles.jobType}>{job.jobType}</span>
                    <span style={styles.jobDate}>
                      Applied: {new Date(job.applicationDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {job.description && (
                  <p style={styles.jobDescription}>
                    {job.description.length > 150 
                      ? job.description.substring(0, 150) + '...' 
                      : job.description
                    }
                  </p>
                )}

                {job.skills && job.skills.length > 0 && (
                  <div style={styles.jobSkills}>
                    <strong>Skills: </strong>
                    {job.skills.slice(0, 5).map((skill, index) => (
                      <span key={index} style={styles.skillChip}>
                        {skill}
                      </span>
                    ))}
                    {job.skills.length > 5 && (
                      <span style={styles.moreSkills}>+{job.skills.length - 5} more</span>
                    )}
                  </div>
                )}

                {job.salary && (
                  <p style={styles.jobSalary}>
                    💰 {job.salary}
                  </p>
                )}

                <div style={styles.jobActions}>
                  <button 
                    onClick={() => handleEdit(job)}
                    style={styles.editButton}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(job._id)}
                    style={styles.deleteButton}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Comprehensive styles
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
    padding: '24px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
  },
  title: {
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
  backButton: {
    padding: '10px 20px',
    backgroundColor: '#f3f4f6',
    color: '#374151',
    textDecoration: 'none',
    borderRadius: '8px',
    fontWeight: '500',
    fontSize: '14px'
  },
  addButton: {
    padding: '10px 20px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '500',
    fontSize: '14px',
    cursor: 'pointer'
  },
  formSection: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '24px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
  },
  formTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '20px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '16px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151'
  },
  input: {
    padding: '10px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    color: '#1f2937'
  },
  select: {
    padding: '10px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    color: '#1f2937',
    backgroundColor: 'white'
  },
  textarea: {
    padding: '10px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    color: '#1f2937',
    resize: 'vertical',
    fontFamily: 'inherit'
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1f2937',
    borderBottom: '1px solid #e5e7eb',
    paddingBottom: '8px',
    marginTop: '8px'
  },
  skillsInput: {
    display: 'flex',
    gap: '8px'
  },
  addSkillButton: {
    padding: '10px 16px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer'
  },
  skillsList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: '8px'
  },
  skillTag: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 8px',
    backgroundColor: '#e0e7ff',
    color: '#3730a3',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500'
  },
  removeSkillButton: {
    background: 'none',
    border: 'none',
    color: '#3730a3',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold'
  },
  formActions: {
    display: 'flex',
    gap: '12px',
    paddingTop: '20px',
    borderTop: '1px solid #e5e7eb'
  },
  submitButton: {
    padding: '12px 24px',
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  cancelButton: {
    padding: '12px 24px',
    backgroundColor: '#f3f4f6',
    color: '#374151',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer'
  },
  filtersSection: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '24px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
  },
  filters: {
    display: 'flex',
    gap: '12px',
    marginBottom: '12px',
    flexWrap: 'wrap'
  },
  searchInput: {
    flex: '1',
    minWidth: '200px',
    padding: '10px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px'
  },
  filterSelect: {
    padding: '10px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    backgroundColor: 'white',
    minWidth: '120px'
  },
  resultsCount: {
    fontSize: '14px',
    color: '#6b7280',
    textAlign: 'right'
  },
  jobsSection: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
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
  jobsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  jobCard: {
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '20px',
    transition: 'all 0.2s',
    backgroundColor: '#fafafa'
  },
  jobHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px'
  },
  jobInfo: {
    flex: '1'
  },
  jobTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1f2937',
    margin: '0 0 4px 0'
  },
  jobCompany: {
    fontSize: '16px',
    color: '#3b82f6',
    fontWeight: '500',
    margin: '0 0 4px 0'
  },
  jobLocation: {
    fontSize: '14px',
    color: '#6b7280',
    margin: 0
  },
  jobMeta: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '4px'
  },
  statusBadge: {
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500'
  },
  jobType: {
    fontSize: '12px',
    color: '#6b7280',
    backgroundColor: '#f3f4f6',
    padding: '2px 8px',
    borderRadius: '8px'
  },
  jobDate: {
    fontSize: '12px',
    color: '#9ca3af'
  },
  jobDescription: {
    fontSize: '14px',
    color: '#4b5563',
    lineHeight: '1.5',
    margin: '12px 0'
  },
  jobSkills: {
    fontSize: '14px',
    margin: '12px 0'
  },
  skillChip: {
    display: 'inline-block',
    padding: '2px 8px',
    backgroundColor: '#dbeafe',
    color: '#1e40af',
    borderRadius: '12px',
    fontSize: '12px',
    margin: '0 4px 4px 0'
  },
  moreSkills: {
    fontSize: '12px',
    color: '#6b7280',
    fontStyle: 'italic'
  },
  jobSalary: {
    fontSize: '14px',
    color: '#059669',
    fontWeight: '500',
    margin: '8px 0'
  },
  jobActions: {
    display: 'flex',
    gap: '8px',
    marginTop: '16px',
    paddingTop: '16px',
    borderTop: '1px solid #e5e7eb'
  },
  editButton: {
    padding: '6px 12px',
    backgroundColor: '#f59e0b',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '500',
    cursor: 'pointer'
  },
  deleteButton: {
    padding: '6px 12px',
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '12px',
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
  }
};

// Add spinner animation
if (!document.querySelector('#job-list-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'job-list-styles';
  styleSheet.type = 'text/css';
  styleSheet.innerText = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(styleSheet);
}

export default JobList;
