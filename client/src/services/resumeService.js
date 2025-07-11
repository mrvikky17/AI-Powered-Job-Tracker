import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const resumeService = {
  // Analyze resume (enhanced version)
  analyzeResume: async (file) => {
    try {
      const formData = new FormData();
      formData.append('resume', file);
      
      const response = await axios.post(`${API_URL}/resume/analyze`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to analyze resume' };
    }
  },

  // Simple resume analysis (backward compatibility)
  analyzeResumeSimple: async (file) => {
    try {
      const formData = new FormData();
      formData.append('resume', file);
      
      const response = await axios.post(`${API_URL}/resume/analyze-simple`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to analyze resume' };
    }
  },

  // Get job match score
  getJobMatchScore: async (jobDescription, userSkills) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/resume/job-match`,
        { jobDescription, userSkills },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: token ? `Bearer ${token}` : '',
          },
        }
      );
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to calculate job match score' };
    }
  },

  // Mock data for development/demo
  getMockAnalysisResult: () => {
    return {
      success: true,
      data: {
        skills: {
          'Programming Languages': ['JavaScript', 'Python', 'TypeScript'],
          'Web Technologies': ['React', 'Node.js', 'HTML', 'CSS'],
          'Databases': ['MongoDB', 'MySQL'],
          'Cloud & DevOps': ['AWS', 'Docker'],
          'Tools & Frameworks': ['Git', 'Figma']
        },
        totalSkills: 10,
        extractedInfo: {
          email: ['john.doe@email.com'],
          phone: ['555-123-4567'],
          experience: ['3 years of experience'],
          education: ['bachelor', 'computer science'],
          skillCoverage: 75
        },
        recommendations: [
          {
            type: 'skill_enhancement',
            message: 'Consider learning Next.js to complement your React skills',
            priority: 'medium'
          },
          {
            type: 'career_path',
            message: 'With Python skills, consider exploring Data Science or Machine Learning',
            priority: 'high'
          }
        ],
        analysis: {
          fileName: 'sample-resume.pdf',
          fileSize: 245760,
          processedAt: new Date().toISOString(),
          textLength: 1250
        }
      }
    };
  },

  // Format skills for display
  formatSkillsForDisplay: (skills) => {
    if (Array.isArray(skills)) {
      // Handle simple array format
      return { 'Skills': skills };
    }
    
    // Handle categorized format
    return skills;
  },

  // Calculate skill match percentage
  calculateSkillMatch: (userSkills, jobSkills) => {
    const userSkillsFlat = Array.isArray(userSkills) 
      ? userSkills 
      : Object.values(userSkills).flat();
    
    const jobSkillsFlat = Array.isArray(jobSkills) 
      ? jobSkills 
      : Object.values(jobSkills).flat();
    
    const matchedSkills = userSkillsFlat.filter(skill => 
      jobSkillsFlat.some(jobSkill => 
        jobSkill.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(jobSkill.toLowerCase())
      )
    );
    
    return jobSkillsFlat.length > 0 
      ? Math.round((matchedSkills.length / jobSkillsFlat.length) * 100)
      : 0;
  },

  // Extract skills from text
  extractSkillsFromText: (text) => {
    const commonSkills = [
      'JavaScript', 'Python', 'Java', 'React', 'Angular', 'Vue.js', 'Node.js',
      'Express.js', 'MongoDB', 'MySQL', 'PostgreSQL', 'AWS', 'Azure', 'Docker',
      'Kubernetes', 'Git', 'HTML', 'CSS', 'TypeScript', 'PHP', 'Ruby', 'C++',
      'C#', 'Swift', 'Kotlin', 'Flutter', 'React Native', 'Django', 'Flask',
      'Spring', 'Laravel', 'Redux', 'GraphQL', 'REST API', 'Microservices'
    ];
    
    const foundSkills = commonSkills.filter(skill => 
      text.toLowerCase().includes(skill.toLowerCase())
    );
    
    return foundSkills;
  }
};

export default resumeService;
