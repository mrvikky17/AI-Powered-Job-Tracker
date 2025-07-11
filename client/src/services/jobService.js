import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('userName');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const jobService = {
  // Get all jobs
  getJobs: async () => {
    try {
      const response = await api.get('/jobs');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch jobs' };
    }
  },

  // Get single job
  getJob: async (id) => {
    try {
      const response = await api.get(`/jobs/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch job' };
    }
  },

  // Create new job
  createJob: async (jobData) => {
    try {
      const response = await api.post('/jobs', jobData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create job' };
    }
  },

  // Update job
  updateJob: async (id, jobData) => {
    try {
      const response = await api.put(`/jobs/${id}`, jobData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update job' };
    }
  },

  // Delete job
  deleteJob: async (id) => {
    try {
      const response = await api.delete(`/jobs/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete job' };
    }
  },

  // Get dashboard statistics
  getDashboardStats: async () => {
    try {
      const response = await api.get('/jobs/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch dashboard stats' };
    }
  },

  // Search jobs
  searchJobs: async (filters) => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      
      const response = await api.get(`/jobs/search?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to search jobs' };
    }
  },

  // Sample job data for demo/development
  getSampleJobs: () => {
    return [
      {
        _id: '1',
        title: 'Frontend Developer',
        company: 'TechCorp',
        location: 'San Francisco, CA',
        status: 'Applied',
        applicationDate: new Date('2024-01-15'),
        salary: '$80,000 - $120,000',
        jobType: 'Full-time',
        description: 'Build amazing user interfaces with React and TypeScript.',
        skills: ['React', 'TypeScript', 'CSS', 'JavaScript']
      },
      {
        _id: '2',
        title: 'Backend Developer',
        company: 'DataSystems Inc',
        location: 'New York, NY',
        status: 'Interview',
        applicationDate: new Date('2024-01-20'),
        salary: '$90,000 - $130,000',
        jobType: 'Full-time',
        description: 'Design and implement scalable API services.',
        skills: ['Node.js', 'MongoDB', 'Express.js', 'JavaScript']
      },
      {
        _id: '3',
        title: 'Full Stack Developer',
        company: 'InnovateLab',
        location: 'Austin, TX',
        status: 'Offer',
        applicationDate: new Date('2024-01-25'),
        salary: '$95,000 - $140,000',
        jobType: 'Full-time',
        description: 'Work on both frontend and backend of our web applications.',
        skills: ['React', 'Node.js', 'MongoDB', 'TypeScript']
      },
      {
        _id: '4',
        title: 'Software Engineer Intern',
        company: 'StartupXYZ',
        location: 'Seattle, WA',
        status: 'Rejected',
        applicationDate: new Date('2024-01-10'),
        salary: '$25/hour',
        jobType: 'Internship',
        description: 'Summer internship program for aspiring developers.',
        skills: ['Python', 'Django', 'JavaScript', 'HTML']
      },
      {
        _id: '5',
        title: 'DevOps Engineer',
        company: 'CloudTech',
        location: 'Remote',
        status: 'Applied',
        applicationDate: new Date('2024-02-01'),
        salary: '$100,000 - $150,000',
        jobType: 'Full-time',
        description: 'Manage CI/CD pipelines and cloud infrastructure.',
        skills: ['AWS', 'Docker', 'Kubernetes', 'Jenkins']
      }
    ];
  }
};

export default jobService;
