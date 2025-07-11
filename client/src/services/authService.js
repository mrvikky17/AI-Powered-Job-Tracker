import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const authService = {
  // User signup
  signup: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/auth/signup`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Signup failed' };
    }
  },

  // User login
  login: async (credentials) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Login failed' };
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
  },

  // Get current user token
  getToken: () => {
    return localStorage.getItem('token');
  },

  // Get current user name
  getCurrentUser: () => {
    return {
      token: localStorage.getItem('token'),
      userName: localStorage.getItem('userName'),
      userId: localStorage.getItem('userId')
    };
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    try {
      // Check if token is expired (basic check)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp > currentTime;
    } catch (error) {
      return false;
    }
  },

  // Store user data after successful login
  setUserData: (userData) => {
    if (userData.token) {
      localStorage.setItem('token', userData.token);
    }
    if (userData.name) {
      localStorage.setItem('userName', userData.name);
    }
    if (userData.userId) {
      localStorage.setItem('userId', userData.userId);
    }
  },

  // Validate email format
  validateEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Validate password strength
  validatePassword: (password) => {
    return {
      isValid: password.length >= 6,
      message: password.length >= 6 ? '' : 'Password must be at least 6 characters long'
    };
  },

  // Demo login (for testing without backend)
  demoLogin: async (credentials) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Demo credentials
    const demoUsers = [
      { email: 'demo@jobsnap.com', password: 'demo123', name: 'Demo User' },
      { email: 'test@test.com', password: 'test123', name: 'Test User' }
    ];
    
    const user = demoUsers.find(
      u => u.email === credentials.email && u.password === credentials.password
    );
    
    if (user) {
      const demoToken = btoa(JSON.stringify({
        id: 'demo-user-id',
        email: user.email,
        name: user.name,
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
      }));
      
      return {
        token: demoToken,
        name: user.name,
        userId: 'demo-user-id'
      };
    } else {
      throw { message: 'Invalid email or password' };
    }
  },

  // Demo signup
  demoSignup: async (userData) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Basic validation
    if (!userData.name || !userData.email || !userData.password) {
      throw { message: 'All fields are required' };
    }
    
    if (!authService.validateEmail(userData.email)) {
      throw { message: 'Invalid email format' };
    }
    
    const passwordValidation = authService.validatePassword(userData.password);
    if (!passwordValidation.isValid) {
      throw { message: passwordValidation.message };
    }
    
    return { message: 'User created successfully' };
  }
};

export default authService;
