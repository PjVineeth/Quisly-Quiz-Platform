const express = require("express")
const router = express.Router()
const Quiz = require("../models/Quiz")
const User = require("../models/User")
const QuizSubmission = require("../models/QuizSubmission")

// Mock quizzes data
const quizzes = [
  {
    id: 1,
    title: "Science Quiz: Chapter 5",
    description: "Test your knowledge of basic science concepts",
    code: "SCI123",
    timeLimit: 10,
    createdBy: 1, // Teacher ID
    status: "active",
    startTime: "2023-06-10T14:00:00",
    endTime: "2023-06-10T15:00:00",
    questions: [
      {
        id: 1,
        type: "multiple-choice",
        text: "What is the chemical symbol for water?",
        options: ["H2O", "CO2", "NaCl", "O2"],
        correctAnswer: "H2O",
      },
      {
        id: 2,
        type: "true-false",
        text: "The Earth revolves around the Sun.",
        options: ["True", "False"],
        correctAnswer: "True",
      },
      {
        id: 3,
        type: "multiple-choice",
        text: "Which of the following is NOT a primary color?",
        options: ["Red", "Blue", "Green", "Yellow"],
        correctAnswer: "Green",
      },
      {
        id: 4,
        type: "numerical",
        text: "What is the atomic number of Oxygen?",
        correctAnswer: "8",
      },
      {
        id: 5,
        type: "short-answer",
        text: "Name the process by which plants make their own food using sunlight.",
        correctAnswer: "photosynthesis",
      },
    ],
    participants: [
      { id: 1, name: "Alex Johnson", progress: 100, score: 85, completedAt: "2023-06-10T14:15:30" },
      { id: 2, name: "Maria Garcia", progress: 80, score: null, completedAt: null },
    ],
    settings: {
      shuffleQuestions: true,
      shuffleOptions: true,
    },
  },
  {
    id: 2,
    title: "Math Quiz: Algebra",
    description: "Test your algebra skills",
    code: "MATH456",
    timeLimit: 15,
    createdBy: 1, // Teacher ID
    status: "scheduled",
    startTime: "2023-06-15T10:00:00",
    endTime: "2023-06-15T11:00:00",
    questions: [
      // Quiz questions would go here
    ],
    participants: [],
    settings: {
      shuffleQuestions: false,
      shuffleOptions: true,
    },
  },
]

// Get all quizzes (with optional filters)
router.get("/", async (req, res) => {
  try {
    const { teacherId, isActive } = req.query
    const query = {}
    
    if (teacherId) query.createdBy = teacherId
    if (isActive !== undefined) query.isActive = isActive === "true"

    const quizzes = await Quiz.find(query)
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 })
    
    res.json(quizzes)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get a specific quiz
router.get("/:id", async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .populate("createdBy", "name email")
    
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" })
    }
    
    res.json(quiz)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Create a new quiz
router.post("/", async (req, res) => {
  try {
    const { title, description, questions, createdBy, duration } = req.body
    
    // Validate teacher exists
    const teacher = await User.findOne({ _id: createdBy, role: "teacher" })
    if (!teacher) {
      return res.status(400).json({ message: "Invalid teacher ID" })
    }

    const quiz = new Quiz({
      title,
      description,
      questions,
      createdBy,
      duration
    })

    const savedQuiz = await quiz.save()
    res.status(201).json(savedQuiz)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Update a quiz
router.put("/:id", async (req, res) => {
  try {
    const { title, description, questions, isActive, duration } = req.body
    
    const quiz = await Quiz.findById(req.params.id)
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" })
    }

    quiz.title = title || quiz.title
    quiz.description = description || quiz.description
    quiz.questions = questions || quiz.questions
    quiz.isActive = isActive !== undefined ? isActive : quiz.isActive
    quiz.duration = duration || quiz.duration

    const updatedQuiz = await quiz.save()
    res.json(updatedQuiz)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Delete a quiz
router.delete("/:id", async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" })
    }

    await quiz.remove()
    res.json({ message: "Quiz deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get quiz results
router.get("/:id/results", async (req, res) => {
  try {
    const submissions = await QuizSubmission.find({ quiz: req.params.id })
      .populate("student", "name email")
      .sort({ score: -1 })

    res.json(submissions)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router

