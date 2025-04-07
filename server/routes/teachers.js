const express = require("express");
const router = express.Router();

// Mock teacher data
const teachers = [
  { id: 1, name: "Ms. Johnson", email: "johnson@example.com", subject: "Science" },
  { id: 2, name: "Mr. Smith", email: "smith@example.com", subject: "Mathematics" },
];

// Get teacher profile
router.get('/profile/:id', (req, res) => {
  const teacher = teachers.find(t => t.id === parseInt(req.params.id));
  if (!teacher) {
    return res.status(404).json({ message: "Teacher not found" });
  }
  res.json(teacher);
});

// Get teacher's quizzes
router.get('/:id/quizzes', (req, res) => {
  // Mock quiz data
  const quizzes = [
    {
      id: 1,
      title: "Science Quiz: Chapter 5",
      subject: "Science",
      date: "2023-06-15T14:00:00",
      status: "scheduled"
    },
    {
      id: 2,
      title: "Math Final Exam",
      subject: "Mathematics",
      date: "2023-06-18T10:00:00",
      status: "scheduled"
    }
  ];
  
  res.json(quizzes);
});

module.exports = router; 