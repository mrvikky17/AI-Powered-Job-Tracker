const express = require('express');
const router = express.Router();
const {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  getDashboardStats,
  searchJobs
} = require('../controllers/jobController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply auth middleware to all routes
router.use(authMiddleware);

// Dashboard stats
router.get('/stats', getDashboardStats);

// Search and filter jobs
router.get('/search', searchJobs);

// CRUD operations
router.get('/', getJobs);
router.get('/:id', getJob);
router.post('/', createJob);
router.put('/:id', updateJob);
router.delete('/:id', deleteJob);

module.exports = router;
