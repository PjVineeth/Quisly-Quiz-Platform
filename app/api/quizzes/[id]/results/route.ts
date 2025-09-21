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
    // Get authenticated user
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    if (user.role !== 'teacher') {
      return NextResponse.json(
        { message: 'Only teachers can view quiz results' },
        { status: 403 }
      );
    }

    await connectDB();
    const { id: quizId } = await params;

    // Find the quiz
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return NextResponse.json(
        { message: 'Quiz not found' },
        { status: 404 }
      );
    }

    // Check if the quiz belongs to this teacher
    if (quiz.createdBy !== user._id.toString()) {
      return NextResponse.json(
        { message: 'You can only view results of your own quizzes' },
        { status: 403 }
      );
    }

    // Get all submissions for this quiz
    const submissions = await QuizSubmission.find({ quizId })
      .sort({ submittedAt: -1 });

    // Calculate statistics
    const totalSubmissions = submissions.length;
    const averageScore = totalSubmissions > 0 
      ? Math.round(submissions.reduce((sum, sub) => sum + sub.score, 0) / totalSubmissions)
      : 0;
    const highestScore = totalSubmissions > 0 
      ? Math.max(...submissions.map(sub => sub.score))
      : 0;
    const lowestScore = totalSubmissions > 0 
      ? Math.min(...submissions.map(sub => sub.score))
      : 0;

    // Calculate average time spent
    const averageTimeSpent = totalSubmissions > 0
      ? Math.round(submissions.reduce((sum, sub) => sum + sub.timeSpent, 0) / totalSubmissions)
      : 0;

    // Format results data
    const results = submissions.map((submission) => ({
      id: submission._id,
      studentName: submission.studentName,
      studentEmail: submission.studentEmail,
      score: submission.score,
      timeSpent: submission.timeSpent,
      submittedAt: submission.submittedAt,
      answers: Object.fromEntries(submission.answers)
    }));

    return NextResponse.json({
      quiz: {
        id: quiz._id,
        title: quiz.title,
        code: quiz.code,
        totalQuestions: quiz.questions.length,
        timeLimit: quiz.timeLimit,
        status: quiz.status
      },
      statistics: {
        totalSubmissions,
        averageScore,
        highestScore,
        lowestScore,
        averageTimeSpent
      },
      results
    });

  } catch (error) {
    console.error('Error fetching quiz results:', error);
    return NextResponse.json(
      { message: 'Failed to fetch quiz results' },
      { status: 500 }
    );
  }
}
