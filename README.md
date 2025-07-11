# 🚀 AI-Powered Job Tracker (JobSnap)

A modern, full-stack job application tracking system with AI-powered resume analysis and intelligent job recommendations.

## ✨ Features

### 📊 Dashboard Analytics
- Real-time statistics and visualizations
- Application status tracking
- Success rate calculations
- Recent activity charts

### 🤖 AI Resume Analyzer
- PDF resume parsing
- Skill extraction by categories
- Career recommendations
- Job match scoring
- Drag & drop file upload

### 💼 Job Management
- Complete CRUD operations for job applications
- Advanced filtering and search
- Status tracking (Applied, Interview, Offer, Rejected)
- Contact person management
- Skills tracking per job

### 🎯 Smart Features
- Job recommendations based on skills
- Application success tracking
- Modern, responsive UI
- Real-time data updates

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express.js** - Server framework
- **MongoDB** + **Mongoose** - Database
- **JWT** - Authentication
- **Multer** - File upload handling
- **PDF-Parse** - Resume parsing
- **bcrypt** - Password hashing

### Frontend
- **React 19** - UI framework
- **React Router** - Navigation
- **Chart.js** - Data visualization
- **Axios** - HTTP client
- **Modern CSS** - Styling

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd AI-Powered-Job-Tracker
```

### 2. Backend Setup
```bash
cd server
npm install
```

Create a `.env` file in the server directory:
```env
MONGO_URI=mongodb://127.0.0.1:27017/jobsnap?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2
JWT_SECRET=your_super_secret_jwt_key_here
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

### 3. Frontend Setup
```bash
cd ../client
npm install
```

Create a `.env` file in the client directory (optional):
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 4. Database Setup

**Option A: Local MongoDB**
1. Install MongoDB locally
2. Start MongoDB service
3. The app will create the database automatically

**Option B: MongoDB Atlas**
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get the connection string
4. Update the `MONGO_URI` in server/.env

### 5. Start the Application

**Backend (Terminal 1):**
```bash
cd server
npm run dev
```

**Frontend (Terminal 2):**
```bash
cd client
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🎮 Usage

### Demo Mode
The application includes demo functionality that works without a backend:

**Demo Login Credentials:**
- Email: `demo@jobsnap.com`
- Password: `demo123`

**OR**
- Email: `test@test.com`
- Password: `test123`

### Resume Analyzer Demo
- Click "Try Demo Analysis" to see sample resume analysis results
- Or upload a real PDF resume for analysis

### Features Walkthrough

1. **Sign Up/Login**
   - Create a new account or use demo credentials
   - Secure JWT-based authentication

2. **Dashboard**
   - View application statistics
   - Interactive charts and graphs
   - Quick action buttons

3. **Resume Analyzer**
   - Upload PDF resumes
   - Get AI-powered skill extraction
   - Receive career recommendations
   - Skills categorized by technology

4. **Job Management**
   - Add new job applications
   - Edit existing applications
   - Filter and search jobs
   - Track application status

## 🗂️ Project Structure

```
AI-Powered-Job-Tracker/
├── server/                 # Backend
│   ├── config/            # Database configuration
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Custom middleware
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── .env              # Environment variables
│   ├── app.js            # Main server file
│   └── package.json      # Dependencies
├── client/                # Frontend
│   ├── public/           # Static files
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   ├── App.js        # Main app component
│   │   └── index.js      # Entry point
│   └── package.json      # Dependencies
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

### Jobs
- `GET /api/jobs` - Get all jobs for user
- `POST /api/jobs` - Create new job
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job
- `GET /api/jobs/stats` - Get dashboard statistics
- `GET /api/jobs/search` - Search/filter jobs

### Resume
- `POST /api/resume/analyze` - Analyze resume (enhanced)
- `POST /api/resume/analyze-simple` - Simple analysis
- `POST /api/resume/job-match` - Get job match score

### Health
- `GET /api/health` - Health check

## 🔧 Configuration

### Environment Variables

**Server (.env):**
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

**Client (.env):**
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🚀 Deployment

### Backend Deployment (Heroku)
1. Install Heroku CLI
2. Create Heroku app: `heroku create your-app-name`
3. Set environment variables: `heroku config:set MONGO_URI=your_mongodb_uri`
4. Deploy: `git push heroku main`

### Frontend Deployment (Netlify)
1. Build the app: `npm run build`
2. Deploy the `build` folder to Netlify
3. Set environment variables in Netlify dashboard

### Docker Deployment
```dockerfile
# Example Dockerfile for backend
FROM node:16
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Troubleshooting

### Common Issues

**MongoDB Connection Error:**
- Ensure MongoDB is running
- Check connection string in .env
- Verify network connectivity

**CORS Errors:**
- Check CLIENT_URL in server .env
- Ensure frontend URL matches CORS configuration

**File Upload Issues:**
- Check file size limits (5MB max)
- Ensure PDF format
- Verify multer configuration

**JWT Token Errors:**
- Check JWT_SECRET in .env
- Clear localStorage and login again
- Verify token expiration

### Debug Mode
Set `NODE_ENV=development` for detailed error messages.

## 🌟 Features Roadmap

- [ ] Email notifications for application updates
- [ ] Calendar integration for interview scheduling
- [ ] Job board integration (LinkedIn, Indeed)
- [ ] Advanced analytics and reporting
- [ ] Mobile app
- [ ] Team collaboration features
- [ ] Resume builder
- [ ] Interview preparation tools

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Check the troubleshooting section
- Review the API documentation

---

**Made with ❤️ for job seekers everywhere**
