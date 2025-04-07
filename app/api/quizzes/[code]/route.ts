import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Quiz from "@/models/Quiz";

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
  { params }: { params: { code: string } }
) {
  try {
    const code = params.code.toUpperCase();

    // Return demo quiz data if the code is DEMO123
    if (code === "DEMO123") {
      return NextResponse.json({
        id: demoQuiz.id,
        title: demoQuiz.title,
        timeLimit: demoQuiz.timeLimit,
        questions: demoQuiz.questions.map(q => ({
          id: q.id,
          type: q.type,
          text: q.text,
          options: q.options,
          correctAnswer: q.correctAnswer
        })),
      });
    }

    // Only try to connect to DB if it's not a demo quiz
    try {
      await connectDB();
    } catch (error) {
      console.error("DB connection error:", error);
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 500 }
      );
    }

    const quiz = await Quiz.findOne({ code, status: "active" });

    if (!quiz) {
      return NextResponse.json(
        { error: "Quiz not found or not active" },
        { status: 404 }
      );
    }

    // Return only necessary data for taking the quiz
    return NextResponse.json({
      id: quiz._id,
      title: quiz.title,
      timeLimit: quiz.timeLimit,
      questions: quiz.questions.map((q: any) => ({
        id: q._id,
        type: q.type,
        text: q.text,
        options: q.options,
      })),
    });
  } catch (error) {
    console.error("Error fetching quiz:", error);
    return NextResponse.json(
      { error: "Failed to fetch quiz" },
      { status: 500 }
    );
  }
} 