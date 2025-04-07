import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import mongoose from "mongoose";

// Mock database for demo purposes
const demoQuizResults: Record<string, any> = {};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { quizId, answers, timeSpent } = body;

    // Handle demo quiz submission
    if (quizId === "DEMO123") {
      // Calculate score
      const demoQuiz = {
        id: "DEMO123",
        title: "Demo Quiz",
        questions: [
          {
            id: "1",
            text: "What is the capital of France?",
            correctAnswer: "Paris",
            type: "short-answer"
          },
          {
            id: "2",
            text: "What is 2 + 2?",
            correctAnswer: "4",
            type: "numerical"
          },
          {
            id: "3",
            text: "Is the Earth round?",
            correctAnswer: "True",
            type: "true-false"
          }
        ]
      };

      let correctAnswers = 0;
      demoQuiz.questions.forEach(question => {
        const userAnswer = answers[question.id] || "";
        if (question.type === "short-answer") {
          if (userAnswer.toLowerCase() === question.correctAnswer.toLowerCase()) {
            correctAnswers++;
          }
        } else {
          if (userAnswer === question.correctAnswer) {
            correctAnswers++;
          }
        }
      });

      const score = (correctAnswers / demoQuiz.questions.length) * 100;

      // Create result object
      const result = {
        id: `DEMO_${Date.now()}`,
        score,
        timeSpent,
        submittedAt: new Date().toISOString(),
        quiz: demoQuiz,
        answers
      };

      // Store in mock database
      demoQuizResults[result.id] = result;

      return NextResponse.json({
        success: true,
        result: result
      });
    }

    // Handle regular quiz submission
    await connectDB();

    // Create quiz attempt
    const QuizAttempt = mongoose.models.QuizAttempt || mongoose.model('QuizAttempt', {
      quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
      answers: { type: Map, of: String, required: true },
      timeSpent: { type: Number, required: true },
      score: { type: Number, required: true },
      submittedAt: { type: Date, default: Date.now },
    });

    const attempt = new QuizAttempt({
      quizId,
      answers: new Map(Object.entries(answers)),
      timeSpent,
      score: 0, // Calculate actual score based on correct answers
    });

    await attempt.save();

    return NextResponse.json({
      success: true,
      attemptId: attempt._id,
    });
  } catch (error) {
    console.error("Error submitting quiz:", error);
    return NextResponse.json(
      { error: "Failed to submit quiz" },
      { status: 500 }
    );
  }
} 