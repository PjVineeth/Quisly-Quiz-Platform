# 🎯 Quisly - Modern Quiz Platform

Quisly is a comprehensive, real-time quiz platform built with modern web technologies. It provides a seamless experience for educators to create and monitor quizzes while enabling students to participate in interactive, live quiz sessions.

## Features

- **User Authentication**: Secure login and registration using Clerk
- **Quiz Management**: Create, edit, and delete quizzes
- **Real-time Quiz Taking**: Interactive quiz-taking experience
- **Responsive Design**: Works seamlessly across all devices
- **Modern UI**: Built with Tailwind CSS and Radix UI components
- **Secure API**: Protected endpoints with JWT authentication
- **MongoDB Integration**: Efficient data storage and retrieval

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- MongoDB (running locally)
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone [your-repository-url]
cd Quisly-Quiz-Platform
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Configuration
Create a `.env` file in the root directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/quisly

# Authentication
JWT_SECRET=your-super-secret-jwt-key-here
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your-clerk-key
CLERK_SECRET_KEY=sk_test_your-clerk-secret

# Server Configuration
PORT=3001
NODE_ENV=development
```

### 4. Database Setup
```bash
# Start MongoDB (if running locally)
# macOS
brew services start mongodb-community

# Windows
net start MongoDB

# Linux
sudo service mongod start

# Verify MongoDB connection
mongosh
```

### 5. Start the Application
```bash
# Start both frontend and backend
npm run dev:all

# Or start separately
npm run dev      # Frontend only (port 3000)
npm run server   # Backend only (port 3001)
```

## ⚙️ Configuration

### Environment Variables
| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `MONGODB_URI` | MongoDB connection string | ✅ | `mongodb://localhost:27017/quisly` |
| `JWT_SECRET` | Secret key for JWT tokens | ✅ | - |
| `CLERK_SECRET_KEY` | Clerk authentication secret | ✅ | - |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public key | ✅ | - |
| `PORT` | Backend server port | ❌ | `3001` |

### Next.js Configuration
The `next.config.mjs` includes:
- **Image Optimization**: Disabled for static export compatibility
- **TypeScript**: Build errors ignored for development
- **ESLint**: Build-time linting disabled
- **Experimental Features**: Webpack build worker, parallel builds

### Tailwind CSS Configuration
- **Dark Mode**: Class-based theme switching
- **Custom Colors**: HSL-based design system
- **Responsive Design**: Mobile-first approach
- **Animation**: Custom keyframes for UI interactions

## 📊 Database Schema

### User Model
```javascript
{
  name: String (2-50 chars, required)
  email: String (unique, required, validated)
  password: String (6+ chars, hashed)
  role: Enum ['student', 'teacher'] (default: 'student')
  createdAt: Date (auto-generated)
}
```

### Quiz Model
```javascript
{
  title: String (required)
  description: String (optional)
  code: String (unique, auto-generated, uppercase)
  timeLimit: Number (minutes, min: 1, default: 10)
  shuffleQuestions: Boolean (default: false)
  shuffleOptions: Boolean (default: false)
  questions: [{
    id: String (required)
    type: Enum ['multiple-choice', 'true-false', 'numerical', 'short-answer']
    text: String (question text)
    options: [String] (answer choices)
    correctAnswer: String (correct answer)
  }]
  status: Enum ['draft', 'scheduled', 'active', 'completed']
  createdBy: ObjectId (ref: User)
  createdAt: Date (auto-generated)
  updatedAt: Date (auto-updated)
}
```

### QuizSubmission Model
```javascript
{
  quiz: ObjectId (ref: Quiz, required)
  student: ObjectId (ref: User, required)
  answers: [{
    questionIndex: Number (required)
    selectedOption: Number (required)
    isCorrect: Boolean (required)
  }]
  score: Number (required)
  totalQuestions: Number (required)
  timeTaken: Number (seconds, required)
  submittedAt: Date (auto-generated)
}
```

## 🌐 API Documentation

### Authentication Endpoints
```http
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Quiz Management Endpoints
```http
GET    /api/quizzes              # Get all quizzes
POST   /api/quizzes              # Create new quiz
GET    /api/quizzes/:id          # Get specific quiz
PUT    /api/quizzes/:id          # Update quiz
DELETE /api/quizzes/:id          # Delete quiz
GET    /api/quizzes/:id/results  # Get quiz results
```

### Next.js API Routes
```http
POST /api/quizzes/submit         # Submit quiz answers
GET  /api/quizzes/verify/:code   # Verify quiz code
POST /api/quizzes/teacher        # Teacher operations
```

## 🔌 Real-time Features

### Socket.IO Events

#### Client to Server
```javascript
// Student Events
socket.emit('join-quiz', quizId, studentName)
socket.emit('submit-answer', { quizId, questionId, answer, studentName })
socket.emit('complete-quiz', { quizId, studentName, score, timeSpent })

// Teacher Events
socket.emit('monitor-quiz', quizId)
socket.emit('end-quiz', quizId)
```

#### Server to Client
```javascript
// Teacher Updates
socket.on('student-joined', { id, name })
socket.on('student-answer', { studentId, studentName, questionId, answer })
socket.on('student-completed', { studentId, studentName, score, timeSpent })

// Student Updates
socket.on('leaderboard-update', { studentName, score })
socket.on('quiz-ended')
```

## 🎨 UI Components

### Design System
- **Base**: shadcn/ui components built on Radix UI
- **Typography**: Inter font family
- **Color Scheme**: HSL-based with CSS variables
- **Spacing**: Tailwind's consistent spacing scale
- **Border Radius**: Customizable radius system

### Key Components
- **Layout Components**: Student/Teacher layouts with navigation
- **Form Components**: Form fields with validation
- **Quiz Components**: Question display, timer, progress indicators
- **Dashboard Components**: Cards, tables, statistics
- **Theme Components**: Dark/light mode toggle

## 📱 Responsive Design

- **Mobile First**: Tailwind CSS mobile-first approach
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px), 2xl (1400px)
- **Components**: Fully responsive UI components
- **Navigation**: Collapsible mobile navigation
- **Tables**: Responsive table layouts for results

## 🚀 Deployment

### Build Process
```bash
# Build for production
npm run build

# Start production server
npm start
```

### Deployment Platforms
- **Vercel**: Recommended for Next.js frontend
- **Railway/Render**: For Express.js backend
- **MongoDB Atlas**: For database hosting
- **Environment Variables**: Configure on hosting platform

### Production Considerations
- Set up proper CORS policies
- Configure environment variables
- Set up MongoDB indexes
- Enable compression and caching
- Set up monitoring and logging

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
