import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Quiz from '@/lib/models/Quiz';

export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    await connectDB();
    const code = params.code.toUpperCase();

    const quiz = await Quiz.findOne({ code });

    if (!quiz) {
      return NextResponse.json(
        { message: 'Quiz not found' },
        { status: 404 }
      );
    }

    // Return quiz status and basic info
    return NextResponse.json({
      id: quiz._id,
      title: quiz.title,
      status: quiz.status,
      timeLimit: quiz.timeLimit
    });

  } catch (error) {
    console.error('Error verifying quiz:', error);
    return NextResponse.json(
      { message: 'Failed to verify quiz' },
      { status: 500 }
    );
  }
} 