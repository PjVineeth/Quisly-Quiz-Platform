import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Quiz from '@/lib/models/Quiz';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
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
        { message: 'Only teachers can access this endpoint' },
        { status: 403 }
      );
    }

    await connectDB();

    // Get only quizzes created by this teacher
    const quizzes = await Quiz.find({ createdBy: user._id.toString() })
      .sort({ createdAt: -1 })
      .select('title description code timeLimit status createdAt updatedAt questions');

    console.log(`Fetched ${quizzes.length} quizzes for teacher ${user.name} (${user.email})`);

    return NextResponse.json(quizzes);

  } catch (error) {
    console.error('Error fetching teacher quizzes:', error);
    return NextResponse.json(
      { message: 'Failed to fetch quizzes' },
      { status: 500 }
    );
  }
}