import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Quiz from '@/models/Quiz';
import crypto from 'crypto';

// Function to generate a unique quiz code
function generateQuizCode(length: number = 6): string {
  return crypto.randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length)
    .toUpperCase();
}

// Function to find a unique code that doesn't exist in the database
async function findUniqueCode(): Promise<string> {
  let code: string;
  let isUnique = false;
  
  while (!isUnique) {
    code = generateQuizCode();
    const existingQuiz = await Quiz.findOne({ code });
    if (!existingQuiz) {
      isUnique = true;
      return code;
    }
  }
  return generateQuizCode(); // Fallback
}

export async function POST(req: NextRequest) {
  try {
    // Connect to MongoDB
    await connectDB();

    // Get the quiz data from the request
    const body = await req.json();
    const { title, description, timeLimit, shuffleQuestions, shuffleOptions, questions } = body;

    // Validate required fields
    if (!title || !questions || questions.length === 0) {
      return NextResponse.json(
        { message: 'Missing required fields (title, questions)' },
        { status: 400 }
      );
    }

    // Generate a unique code for the quiz
    const uniqueCode = await findUniqueCode();

    // Create the quiz document
    const newQuiz = new Quiz({
      title,
      description,
      code: uniqueCode,
      timeLimit: parseInt(timeLimit, 10) || 10,
      shuffleQuestions: !!shuffleQuestions,
      shuffleOptions: !!shuffleOptions,
      questions: questions.map(q => ({
        id: q.id,
        type: q.type,
        text: q.text,
        options: q.options,
        correctAnswer: q.correctAnswer
      })),
      status: 'draft',
      createdBy: 'teacher123' // Hardcoded for now, replace with actual user ID when auth is added
    });

    // Save to database
    await newQuiz.save();

    // Return the created quiz
    return NextResponse.json(newQuiz, { status: 201 });

  } catch (error) {
    console.error('Error creating quiz:', error);
    return NextResponse.json(
      { message: 'Failed to create quiz', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 