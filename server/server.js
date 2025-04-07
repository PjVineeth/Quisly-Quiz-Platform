const express = require("express")
const http = require("http")
const path = require("path")
const socketIo = require("socket.io")
const cors = require("cors")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
require('dotenv').config()

// Import routes
const authRoutes = require("./routes/auth")
const quizRoutes = require("./routes/quizzes")
const studentRoutes = require("./routes/students")
const teacherRoutes = require("./routes/teachers")

// Create Express app
const app = express()
const server = http.createServer(app)
const io = socketIo(server)

// MongoDB connection
const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log('Connection string:', process.env.MONGODB_URI);
    
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('MongoDB connected successfully');
    
    // Log all collections in the database
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
    
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit process with failure
  }
};

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Add detailed request logging middleware
app.use((req, res, next) => {
  console.log('\n=== New Request ===');
  console.log('Time:', new Date().toISOString());
  console.log('Method:', req.method);
  console.log('Path:', req.path);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  console.log('==================\n');
  next();
});

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "../public")))

// API routes
app.use("/api/auth", authRoutes)
app.use("/api/quizzes", quizRoutes)
app.use("/api/students", studentRoutes)
app.use("/api/teachers", teacherRoutes)

// Socket.io connection
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id)

  // Join a quiz room
  socket.on("join-quiz", (quizId, studentName) => {
    socket.join(`quiz:${quizId}`)

    // Notify teacher that a student joined
    io.to(`quiz:${quizId}:teacher`).emit("student-joined", {
      id: socket.id,
      name: studentName,
    })

    console.log(`${studentName} joined quiz ${quizId}`)
  })

  // Teacher monitoring a quiz
  socket.on("monitor-quiz", (quizId) => {
    socket.join(`quiz:${quizId}:teacher`)
    console.log(`Teacher monitoring quiz ${quizId}`)
  })

  // Student submitting an answer
  socket.on("submit-answer", (data) => {
    // Notify teacher about the answer
    io.to(`quiz:${data.quizId}:teacher`).emit("student-answer", {
      studentId: socket.id,
      studentName: data.studentName,
      questionId: data.questionId,
      answer: data.answer,
    })
  })

  // Student completing a quiz
  socket.on("complete-quiz", async (data) => {
    try {
      // Create quiz submission in MongoDB
      const QuizSubmission = require('../lib/models/QuizSubmission').default;
      await QuizSubmission.create({
        quiz: data.quizId,
        student: data.studentId,
        score: data.score,
        totalQuestions: data.totalQuestions,
        timeTaken: data.timeSpent,
        answers: data.answers
      });

      // Notify teacher about completion
      io.to(`quiz:${data.quizId}:teacher`).emit("student-completed", {
        studentId: socket.id,
        studentName: data.studentName,
        score: data.score,
        timeSpent: data.timeSpent,
      })

      // Update leaderboard for all students
      io.to(`quiz:${data.quizId}`).emit("leaderboard-update", {
        studentName: data.studentName,
        score: data.score,
      })
    } catch (error) {
      console.error('Error saving quiz submission:', error);
    }
  })

  // Teacher ending a quiz
  socket.on("end-quiz", (quizId) => {
    // Notify all students that the quiz has ended
    io.to(`quiz:${quizId}`).emit("quiz-ended")
    console.log(`Quiz ${quizId} ended by teacher`)
  })

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id)
  })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

// Catch-all route to serve the index.html file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"))
})

// Start server
const PORT = process.env.PORT || 3001
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

