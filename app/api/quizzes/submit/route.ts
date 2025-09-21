import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Quiz from "@/lib/models/Quiz";
import QuizSubmission from "@/lib/models/QuizSubmission";
import { getUserFromRequest } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { quizCode, answers, timeSpent } = body;

    await connectDB();

    // Get authenticated user
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    if (user.role !== 'student') {
      return NextResponse.json(
        { message: 'Only students can submit quizzes' },
        { status: 403 }
      );
    }

    // Handle demo quiz submission
    if (quizCode === "DEMO123") {
      // Calculate score for demo quiz
      const demoQuiz = {
        id: "DEMO123",
        title: "Demo Science Quiz",
        questions: [
          {
            id: "q1",
            text: "What is the chemical symbol for Oxygen?",
            correctAnswer: "O",
            type: "multiple-choice"
          },
          {
            id: "q2",
            text: "The Earth revolves around the Sun.",
            correctAnswer: "True",
            type: "true-false"
          },
          {
            id: "q3",
            text: "What is the capital of France?",
            correctAnswer: "Paris",
            type: "short-answer"
          }
        ]
      };

      let correctAnswers = 0;
      demoQuiz.questions.forEach((question) => {
        const userAnswer = answers[question.id];
        if (userAnswer && userAnswer.toLowerCase() === question.correctAnswer.toLowerCase()) {
          correctAnswers++;
        }
      });

      const score = Math.round((correctAnswers / demoQuiz.questions.length) * 100);

      return NextResponse.json({
        success: true,
        attemptId: "demo-attempt-" + Date.now(),
        score,
        totalQuestions: demoQuiz.questions.length,
        correctAnswers,
        message: "Demo quiz submitted successfully"
      });
    }

    // Handle real quiz submission
    const quiz = await Quiz.findOne({ code: quizCode.toUpperCase() });
    if (!quiz) {
      return NextResponse.json(
        { message: "Quiz not found" },
        { status: 404 }
      );
    }

    if (quiz.status !== 'active') {
      return NextResponse.json(
        { message: "Quiz is not currently active" },
        { status: 400 }
      );
    }

    // Calculate score
    let correctAnswers = 0;
    quiz.questions.forEach((question) => {
      const userAnswer = answers[question.id];
      if (userAnswer && userAnswer === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const score = (correctAnswers / quiz.questions.length) * 100;

    // Create quiz submission
    const submission = new QuizSubmission({
      quizId: quiz._id.toString(),
      quizCode: quiz.code,
      studentId: user._id.toString(),
      studentName: user.name,
      studentEmail: user.email,
      answers: new Map(Object.entries(answers)),
      score,
      timeSpent,
      submittedAt: new Date()
    });

    await submission.save();

    return NextResponse.json({
      success: true,
      attemptId: submission._id,
    });
  } catch (error) {
    console.error("Error submitting quiz:", error);
    return NextResponse.json(
      { error: "Failed to submit quiz", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}