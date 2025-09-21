import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Quiz from '@/lib/models/Quiz';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    await connectDB();
    const { code: rawCode } = await params;
    const code = rawCode.toUpperCase();

    const quiz = await Quiz.findOne({ code });

    if (!quiz) {
      return NextResponse.json(
        { message: 'Quiz not found' },
        { status: 404 }
      );
    }

    // Check if quiz is active
    if (quiz.status !== 'active') {
      return NextResponse.json(
        { message: 'Quiz is not currently active' },
        { status: 400 }
      );
    }

    // Return quiz data for taking the quiz
    return NextResponse.json({
      id: quiz._id,
      title: quiz.title,
      description: quiz.description,
      timeLimit: quiz.timeLimit,
      questions: quiz.questions.map(q => ({
        id: q.id,
        type: q.type,
        text: q.text,
        options: q.options
        // Don't include correctAnswer for security
      }))
    });

  } catch (error) {
    console.error('Error fetching quiz:', error);
    return NextResponse.json(
      { message: 'Failed to fetch quiz' },
      { status: 500 }
    );
  }
}
