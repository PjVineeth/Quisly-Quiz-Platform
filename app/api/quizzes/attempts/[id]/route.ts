import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import mongoose from "mongoose";

// Define the QuizAttempt schema
const QuizAttemptSchema = new mongoose.Schema({
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  answers: { type: Map, of: String, required: true },
  timeSpent: { type: Number, required: true },
  score: { type: Number, required: true },
  submittedAt: { type: Date, default: Date.now },
});

// Create the model if it doesn't exist
const QuizAttempt = mongoose.models.QuizAttempt || mongoose.model('QuizAttempt', QuizAttemptSchema);

// Demo quiz data
const demoQuiz = {
  id: "DEMO123",
  title: "Science Quiz: Chapter 5",
  description: "Test your knowledge of basic science concepts",
  timeLimit: 10,
  questions: [
    {
      id: "1",
      type: "multiple-choice",
      text: "What is the chemical symbol for water?",
      options: ["H2O", "CO2", "NaCl", "O2"],
      correctAnswer: "H2O",
    },
    {
      id: "2",
      type: "true-false",
      text: "The Earth revolves around the Sun.",
      options: ["True", "False"],
      correctAnswer: "True",
    },
    {
      id: "3",
      type: "multiple-choice",
      text: "Which of the following is NOT a primary color?",
      options: ["Red", "Blue", "Green", "Yellow"],
      correctAnswer: "Green",
    },
    {
      id: "4",
      type: "numerical",
      text: "What is the atomic number of Oxygen?",
      correctAnswer: "8",
    },
    {
      id: "5",
      type: "short-answer",
      text: "Name the process by which plants make their own food using sunlight.",
      correctAnswer: "photosynthesis",
    },
  ],
};

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Handle demo quiz results
    if (params.id === "DEMO123") {
      // Get the stored results from localStorage (simulated)
      const storedResults = request.headers.get("x-demo-results");
      if (!storedResults) {
        return NextResponse.json(
          { error: "Demo quiz results not found" },
          { status: 404 }
        );
      }

      const results = JSON.parse(storedResults);
      
      return NextResponse.json({
        score: results.score,
        timeSpent: results.timeSpent,
        submittedAt: results.submittedAt,
        answers: results.answers,
        quiz: {
          title: demoQuiz.title,
          questions: demoQuiz.questions,
        },
      });
    }

    await connectDB();

    const attempt = await QuizAttempt.findById(params.id)
      .populate('quizId')
      .exec();

    if (!attempt) {
      return NextResponse.json(
        { error: "Quiz attempt not found" },
        { status: 404 }
      );
    }

    // Format the response
    return NextResponse.json({
      score: attempt.score,
      timeSpent: attempt.timeSpent,
      submittedAt: attempt.submittedAt,
      answers: Object.fromEntries(attempt.answers),
      quiz: {
        title: attempt.quizId.title,
        questions: attempt.quizId.questions,
      },
    });
  } catch (error) {
    console.error("Error fetching quiz attempt:", error);
    return NextResponse.json(
      { error: "Failed to fetch quiz attempt" },
      { status: 500 }
    );
  }
} 