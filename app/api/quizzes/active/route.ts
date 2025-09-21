import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Quiz from '@/lib/models/Quiz';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Get all active quizzes
    const activeQuizzes = await Quiz.find({ status: 'active' })
      .sort({ updatedAt: -1 })
      .select('title description code timeLimit status updatedAt');

    return NextResponse.json(activeQuizzes);

  } catch (error) {
    console.error('Error fetching active quizzes:', error);
    return NextResponse.json(
      { message: 'Failed to fetch active quizzes' },
      { status: 500 }
    );
  }
}
