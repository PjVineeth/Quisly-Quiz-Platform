import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import QuizSession from '@/lib/models/QuizSession';

export async function PATCH(req: NextRequest) {
  try {
    await connectDB();
    const { sessionId, currentQuestion, answers, status, score, timeSpent } = await req.json();

    const session = await QuizSession.findById(sessionId);
    if (!session) {
      return NextResponse.json(
        { message: 'Session not found' },
        { status: 404 }
      );
    }

    // Update session data
    if (typeof currentQuestion === 'number') {
      session.currentQuestion = currentQuestion;
    }
    const totalQuestions = session.totalQuestions || 0;
    session.progress = totalQuestions > 0
      ? Math.round((session.currentQuestion / totalQuestions) * 100)
      : 0;
    session.lastActivity = new Date();

    if (answers) {
      session.answers = new Map(Object.entries(answers));
    }

    if (status) {
      session.status = status;
      if (status === 'completed') {
        session.completedAt = new Date();
        session.score = typeof score === 'number' ? score : null;
        session.timeSpent = typeof timeSpent === 'number' ? timeSpent : null;
      }
    }

    await session.save();

    return NextResponse.json({
      success: true,
      session: {
        id: session._id,
        studentName: session.studentName,
        currentQuestion: session.currentQuestion,
        progress: session.progress,
        status: session.status,
        score: session.score,
        timeSpent: session.timeSpent
      }
    });

  } catch (error) {
    console.error('Error updating quiz session:', error);
    return NextResponse.json(
      { message: 'Failed to update quiz session' },
      { status: 500 }
    );
  }
}
