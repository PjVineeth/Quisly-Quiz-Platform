const express = require("express")
const router = express.Router()

// Mock student data
const students = [
  { id: 1, name: "Student 1", email: "student1@example.com" },
  { id: 2, name: "Student 2", email: "student2@example.com" },
]

// Mock quiz results
const quizResults = [
  {
    id: 1,
    studentId: 1,
    quizId: 1,
    score: 85,
    completedAt: "2023-06-10T14:15:30",
    answers: [
      { questionId: 1, answer: "H2O", isCorrect: true },
      { questionId: 2, answer: "True", isCorrect: true },
      { questionId: 3, answer: "Green", isCorrect: true },
      { questionId: 4, answer: "6", isCorrect: false },
      { questionId: 5, answer: "photosynthesis", isCorrect: true },
    ],
  },
  {
    id: 2,
    studentId: 1,
    quizId: 2,
    score: 70,
    completedAt: "2023-05-25T11:30:00",
    answers: [],
  },
]

// Get student dashboard data
router.get('/dashboard', (req, res) => {
  // In a real app, you would get the student ID from the authenticated user
  const studentId = 1;
  
  // Get upcoming quizzes (mock data)
  const upcomingQuizzes = [
    { id: 3, title: "Science Quiz: Chapter 5", date: "2023-06-15T14:00:00", subject: "Science", teacher: "Ms. Johnson" },
    { id: 4, title: "Math Final Exam", date: "2023-06-18T10:00:00", subject: "Mathematics", teacher: "Mr. Smith" }
  ];

  res.json({
    student: students.find(s => s.id === studentId),
    quizResults: quizResults.filter(r => r.studentId === studentId),
    upcomingQuizzes
  });
});

module.exports = router;

