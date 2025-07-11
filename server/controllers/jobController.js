const Job = require('../models/Job');
const User = require('../models/User');
const mongoose = require('mongoose');

// Get all jobs for a user
exports.getJobs = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const jobs = await Job.find({ userId }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single job
exports.getJob = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const job = await Job.findOne({ _id: req.params.id, userId });
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new job application
exports.createJob = async (req, res) => {
  try {
    const jobData = {
      ...req.body,
      userId: new mongoose.Types.ObjectId(req.user.id)
    };
    
    const job = new Job(jobData);
    const savedJob = await job.save();
    res.status(201).json(savedJob);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a job application
exports.updateJob = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, userId },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    res.json(job);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a job application
exports.deleteJob = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const job = await Job.findOneAndDelete({ _id: req.params.id, userId });
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    res.json({ message: 'Job application deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    
    const totalJobs = await Job.countDocuments({ userId });
    const interviewCount = await Job.countDocuments({ userId, status: 'Interview' });
    const offerCount = await Job.countDocuments({ userId, status: 'Offer' });
    const rejectedCount = await Job.countDocuments({ userId, status: 'Rejected' });
    
    const statusDistribution = await Job.aggregate([
      { $match: { userId: userId } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    // Get recent applications (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentApplications = await Job.aggregate([
      { 
        $match: { 
          userId: userId,
          applicationDate: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$applicationDate" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    const successRate = totalJobs > 0 ? ((offerCount / totalJobs) * 100).toFixed(1) : 0;
    
    res.json({
      totalJobs,
      interviewCount,
      offerCount,
      rejectedCount,
      successRate,
      statusDistribution,
      recentApplications
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search and filter jobs
exports.searchJobs = async (req, res) => {
  try {
    const { search, status, jobType, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    let query = { userId: new mongoose.Types.ObjectId(req.user.id) };
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (status) {
      query.status = status;
    }
    
    if (jobType) {
      query.jobType = jobType;
    }
    
    const jobs = await Job.find(query)
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .limit(parseInt(req.query.limit) || 50);
    
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
