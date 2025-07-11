const express = require('express');
const router = express.Router();
const { upload, analyzeResume, getJobMatchScore } = require('../controllers/resumeController');
const authMiddleware = require('../middleware/authMiddleware');

// Resume analysis endpoint (no auth required for demo)
router.post('/analyze', upload.single('resume'), analyzeResume);

// Job match score endpoint (requires auth)
router.post('/job-match', authMiddleware, getJobMatchScore);

// Legacy endpoint for backward compatibility
router.post('/analyze-simple', upload.single('resume'), async (req, res) => {
  try {
    const { analyzeResume } = require('../controllers/resumeController');
    
    // Call the new analyze function but return simplified response
    const mockReq = { ...req };
    const mockRes = {
      json: (data) => {
        if (data.success && data.data.skills) {
          // Convert categorized skills to flat array for backward compatibility
          const flatSkills = Object.values(data.data.skills).flat();
          res.json({ skills: flatSkills });
        } else {
          res.status(500).json({ message: 'Failed to process resume' });
        }
      },
      status: (code) => ({ json: (data) => res.status(code).json(data) })
    };
    
    await analyzeResume(mockReq, mockRes);
  } catch (err) {
    console.error('Resume analysis error:', err);
    res.status(500).json({ message: 'Failed to process resume' });
  }
});

module.exports = router;
