import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Quiz from '@/lib/models/Quiz';
import QuizSubmission from '@/lib/models/QuizSubmission';
import QuizSession from '@/lib/models/QuizSession';
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
        { message: 'Only teachers can view quiz participants' },
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
        { message: 'You can only view participants of your own quizzes' },
        { status: 403 }
      );
    }

    // Get only recent active sessions (last 10 minutes) for this quiz
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    const activeSessions = await QuizSession.find({ 
      quizId, 
      status: 'active',
      startTime: { $gte: tenMinutesAgo }
    }).sort({ startTime: -1 });

    // Get only recent completed submissions (last 10 minutes) for this quiz
    const submissions = await QuizSubmission.find({ 
      quizId,
      submittedAt: { $gte: tenMinutesAgo }
    }).sort({ submittedAt: -1 });

    // Format active participants data
    const activeParticipants = activeSessions.map((session) => ({
      id: session._id,
      name: session.studentName,
      email: session.studentEmail,
      progress: session.progress,
      score: null,
      completedAt: null,
      timeSpent: null,
      currentQuestion: session.currentQuestion,
      totalQuestions: session.totalQuestions,
      status: 'active'
    }));

    // Format completed participants data
    const completedParticipants = submissions.map((submission) => ({
      id: submission._id,
      name: submission.studentName,
      email: submission.studentEmail,
      progress: 100,
      score: submission.score,
      completedAt: submission.submittedAt,
      timeSpent: submission.timeSpent,
      currentQuestion: null,
      totalQuestions: null,
      status: 'completed'
    }));

    // Combine active and completed participants
    const participants = [...activeParticipants, ...completedParticipants];

    return NextResponse.json({
      quiz: {
        id: quiz._id,
        title: quiz.title,
        code: quiz.code,
        status: quiz.status,
        timeLimit: quiz.timeLimit
      },
      participants
    });

  } catch (error) {
    console.error('Error fetching quiz participants:', error);
    return NextResponse.json(
      { message: 'Failed to fetch participants' },
      { status: 500 }
    );
  }
}
