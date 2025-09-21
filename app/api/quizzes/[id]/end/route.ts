import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Quiz from '@/lib/models/Quiz';
import { getUserFromRequest } from '@/lib/auth';

export async function PATCH(
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
        { message: 'Only teachers can end quizzes' },
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
        { message: 'You can only end your own quizzes' },
        { status: 403 }
      );
    }

    // Check if quiz is active
    if (quiz.status !== 'active') {
      return NextResponse.json(
        { message: 'Quiz can only be ended if it is currently active' },
        { status: 400 }
      );
    }

    // Update quiz status to completed
    quiz.status = 'completed';
    await quiz.save();

    console.log(`Quiz "${quiz.title}" ended by teacher ${user.name} (${user.email})`);

    return NextResponse.json({
      message: 'Quiz ended successfully',
      quiz: {
        id: quiz._id,
        title: quiz.title,
        code: quiz.code,
        status: quiz.status
      }
    });

  } catch (error) {
    console.error('Error ending quiz:', error);
    return NextResponse.json(
      { message: 'Failed to end quiz' },
      { status: 500 }
    );
  }
}
