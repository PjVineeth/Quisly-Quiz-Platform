import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import QuizSubmission from '@/lib/models/QuizSubmission';
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

    if (user.role !== 'student') {
      return NextResponse.json(
        { message: 'Only students can access this endpoint' },
        { status: 403 }
      );
    }

    await connectDB();

    // Get all submissions for this student
    const submissions = await QuizSubmission.find({ 
      studentId: user._id.toString() 
    }).sort({ submittedAt: -1 });

    // Get quiz details for each submission
    const submissionsWithQuizDetails = await Promise.all(
      submissions.map(async (submission) => {
        const quiz = await Quiz.findById(submission.quizId).select('title code timeLimit questions');
        return {
          id: submission._id,
          quiz: {
            id: quiz?._id,
            title: quiz?.title || 'Quiz Not Found',
            code: quiz?.code || 'N/A',
            timeLimit: quiz?.timeLimit || 0,
            totalQuestions: quiz?.questions?.length || 0
          },
          score: submission.score,
          timeSpent: submission.timeSpent,
          submittedAt: submission.submittedAt,
          answers: Object.fromEntries(submission.answers)
        };
      })
    );

    console.log(`Fetched ${submissionsWithQuizDetails.length} submissions for student ${user.name} (${user.email})`);

    return NextResponse.json({
      student: {
        id: user._id,
        name: user.name,
        email: user.email
      },
      submissions: submissionsWithQuizDetails
    });

  } catch (error) {
    console.error('Error fetching student submissions:', error);
    return NextResponse.json(
      { message: 'Failed to fetch submissions' },
      { status: 500 }
    );
  }
}
