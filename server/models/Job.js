const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  salary: {
    type: String
  },
  jobType: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
    default: 'Full-time'
  },
  status: {
    type: String,
    enum: ['Applied', 'Interview', 'Offer', 'Rejected', 'Withdrawn'],
    default: 'Applied'
  },
  applicationDate: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String
  },
  contactPerson: {
    name: String,
    email: String,
    phone: String
  },
  skills: [{
    type: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Job', jobSchema);
