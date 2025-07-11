const multer = require('multer');
const pdfParse = require('pdf-parse');
const User = require('../models/User');

// Enhanced skill keywords with categories
const SKILL_CATEGORIES = {
  'Programming Languages': [
    'JavaScript', 'Python', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Go', 'Rust', 'Swift',
    'Kotlin', 'TypeScript', 'Scala', 'Perl', 'R', 'MATLAB', 'Dart', 'Objective-C'
  ],
  'Web Technologies': [
    'HTML', 'CSS', 'React', 'Angular', 'Vue.js', 'Node.js', 'Express.js', 'jQuery',
    'Bootstrap', 'Sass', 'Less', 'Webpack', 'Next.js', 'Nuxt.js', 'Svelte', 'Ember.js'
  ],
  'Databases': [
    'MongoDB', 'MySQL', 'PostgreSQL', 'SQLite', 'Redis', 'Cassandra', 'Oracle',
    'SQL Server', 'DynamoDB', 'Firebase', 'CouchDB', 'Neo4j', 'InfluxDB'
  ],
  'Cloud & DevOps': [
    'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Jenkins', 'GitLab CI',
    'GitHub Actions', 'Terraform', 'Ansible', 'Chef', 'Puppet', 'Vagrant'
  ],
  'Mobile Development': [
    'React Native', 'Flutter', 'Xamarin', 'Ionic', 'Cordova', 'Android', 'iOS',
    'Swift', 'Kotlin', 'Objective-C'
  ],
  'Data Science & AI': [
    'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'Scikit-learn',
    'Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'Jupyter', 'Apache Spark', 'Hadoop'
  ],
  'Tools & Frameworks': [
    'Git', 'SVN', 'Jira', 'Confluence', 'Slack', 'Trello', 'Figma', 'Adobe XD',
    'Photoshop', 'Illustrator', 'Sketch', 'InVision'
  ]
};

// Flatten all skills for easy searching
const ALL_SKILLS = Object.values(SKILL_CATEGORIES).flat();

// Setup multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

// Analyze resume function
const analyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Parse PDF
    const data = await pdfParse(req.file.buffer);
    const text = data.text.toLowerCase();

    // Extract skills by category
    const extractedSkills = {};
    let totalSkillsFound = 0;

    Object.entries(SKILL_CATEGORIES).forEach(([category, skills]) => {
      const foundSkills = skills.filter(skill => 
        text.includes(skill.toLowerCase())
      );
      
      if (foundSkills.length > 0) {
        extractedSkills[category] = foundSkills;
        totalSkillsFound += foundSkills.length;
      }
    });

    // Extract additional information
    const extractedInfo = {
      // Extract email
      email: text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g),
      
      // Extract phone numbers
      phone: text.match(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g),
      
      // Extract years of experience (basic pattern)
      experience: text.match(/\b(\d+)\+?\s*(years?|yrs?)\s*(of\s*)?(experience|exp)/gi),
      
      // Extract education keywords
      education: [
        'bachelor', 'master', 'phd', 'doctorate', 'degree', 'university', 'college',
        'computer science', 'engineering', 'mathematics', 'physics'
      ].filter(keyword => text.includes(keyword.toLowerCase())),
      
      // Calculate skill coverage score (out of 100)
      skillCoverage: Math.min(100, Math.round((totalSkillsFound / 20) * 100))
    };

    // Generate recommendations
    const recommendations = generateRecommendations(extractedSkills, extractedInfo);

    // Response
    res.json({
      success: true,
      data: {
        skills: extractedSkills,
        totalSkills: totalSkillsFound,
        extractedInfo,
        recommendations,
        analysis: {
          fileName: req.file.originalname,
          fileSize: req.file.size,
          processedAt: new Date().toISOString(),
          textLength: data.text.length
        }
      }
    });

  } catch (error) {
    console.error('Resume analysis error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to analyze resume',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Generate recommendations based on skills
const generateRecommendations = (skills, info) => {
  const recommendations = [];
  
  // Check for popular tech stacks
  if (skills['Web Technologies']?.includes('React') && skills['Programming Languages']?.includes('JavaScript')) {
    recommendations.push({
      type: 'skill_enhancement',
      message: 'Consider learning Next.js to complement your React skills',
      priority: 'medium'
    });
  }
  
  if (skills['Programming Languages']?.includes('Python') && !skills['Data Science & AI']?.length) {
    recommendations.push({
      type: 'career_path',
      message: 'With Python skills, consider exploring Data Science or Machine Learning',
      priority: 'high'
    });
  }
  
  if (skills['Web Technologies'] && !skills['Cloud & DevOps']?.length) {
    recommendations.push({
      type: 'skill_gap',
      message: 'Consider learning cloud platforms (AWS, Azure) for modern web development',
      priority: 'medium'
    });
  }
  
  // Experience-based recommendations
  if (info.skillCoverage < 30) {
    recommendations.push({
      type: 'improvement',
      message: 'Consider adding more technical skills to increase your profile strength',
      priority: 'high'
    });
  }
  
  return recommendations;
};

// Get job match score
const getJobMatchScore = async (req, res) => {
  try {
    const { jobDescription, userSkills } = req.body;
    
    if (!jobDescription || !userSkills) {
      return res.status(400).json({ message: 'Job description and user skills are required' });
    }
    
    const jobText = jobDescription.toLowerCase();
    const matchedSkills = [];
    const missingSkills = [];
    
    // Check each skill category
    Object.entries(SKILL_CATEGORIES).forEach(([category, skills]) => {
      skills.forEach(skill => {
        if (jobText.includes(skill.toLowerCase())) {
          if (userSkills[category]?.includes(skill)) {
            matchedSkills.push({ skill, category, status: 'matched' });
          } else {
            missingSkills.push({ skill, category, status: 'missing' });
          }
        }
      });
    });
    
    const totalRequiredSkills = matchedSkills.length + missingSkills.length;
    const matchScore = totalRequiredSkills > 0 
      ? Math.round((matchedSkills.length / totalRequiredSkills) * 100)
      : 0;
    
    res.json({
      success: true,
      data: {
        matchScore,
        matchedSkills,
        missingSkills,
        totalRequiredSkills,
        recommendation: getMatchRecommendation(matchScore)
      }
    });
    
  } catch (error) {
    console.error('Job match error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to calculate job match score' 
    });
  }
};

const getMatchRecommendation = (score) => {
  if (score >= 80) return 'Excellent match! You should definitely apply.';
  if (score >= 60) return 'Good match. Consider applying and highlighting your relevant skills.';
  if (score >= 40) return 'Moderate match. Focus on the skills you have and consider learning the missing ones.';
  return 'Lower match. Consider gaining more relevant skills before applying.';
};

module.exports = {
  upload,
  analyzeResume,
  getJobMatchScore
};
