import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Quiz from '@/lib/models/Quiz';
import QuizSubmission from '@/lib/models/QuizSubmission';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Only students can fetch their own attempt result
    if (user.role !== 'student') {
      return NextResponse.json(
        { error: 'Only students can access quiz results' },
        { status: 403 }
      );
    }

    await connectDB();
    const { id: attemptId } = await params;

    // Find submission by id
    const submission = await QuizSubmission.findById(attemptId);
    if (!submission) {
      return NextResponse.json(
        { error: 'Quiz attempt not found' },
        { status: 404 }
      );
    }

    // Ensure the submission belongs to the requesting student
    if (submission.studentId !== user._id.toString()) {
      return NextResponse.json(
        { error: 'You can only view your own quiz results' },
        { status: 403 }
      );
    }

    // Load quiz to supply question text/answers/types
    const quiz = await Quiz.findById(submission.quizId);
    if (!quiz) {
      return NextResponse.json(
        { error: 'Associated quiz not found' },
        { status: 404 }
      );
    }

    const questions = quiz.questions.map((q: any) => ({
      id: q.id,
      text: q.text,
      correctAnswer: q.correctAnswer,
      type: q.type,
    }));

    return NextResponse.json({
      id: submission._id,
      score: submission.score,
      timeSpent: submission.timeSpent,
      submittedAt: submission.submittedAt,
      quiz: {
        title: quiz.title,
        questions,
      },
      answers: Object.fromEntries(submission.answers),
    });
  } catch (error) {
    console.error('Error fetching quiz attempt:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quiz attempt' },
      { status: 500 }
    );
  }
}


