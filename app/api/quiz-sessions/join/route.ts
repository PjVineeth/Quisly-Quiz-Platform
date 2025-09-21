    import { NextRequest, NextResponse } from 'next/server';
    import connectDB from '@/lib/mongodb';
    import Quiz from '@/lib/models/Quiz';
    import QuizSession from '@/lib/models/QuizSession';
    import { getUserFromRequest } from '@/lib/auth';

    export async function POST(req: NextRequest) {
    try {
        await connectDB();
        
        // Get authenticated user
        const user = await getUserFromRequest(req);
        if (!user) {
        return NextResponse.json(
            { message: 'Authentication required' },
            { status: 401 }
        );
        }

        if (user.role !== 'student') {
        return NextResponse.json(
            { message: 'Only students can join quizzes' },
            { status: 403 }
        );
        }

        const { quizCode } = await req.json();

        const quiz = await Quiz.findOne({ code: quizCode.toUpperCase() });

        if (!quiz) {
        return NextResponse.json(
            { message: 'Quiz not found' },
            { status: 404 }
        );
        }

        if (quiz.status !== 'active') {
        return NextResponse.json(
            { message: 'Quiz is not currently active' },
            { status: 400 }
        );
        }

        // Check if student already has an active session for this quiz
        const existingSession = await QuizSession.findOne({
        quizId: quiz._id.toString(),
        studentId: user._id.toString(),
        status: 'active'
        });

        if (existingSession) {
        return NextResponse.json(
            { 
            message: 'You already have an active session for this quiz', 
            sessionId: existingSession._id,
            quiz: {
                id: quiz._id,
                title: quiz.title,
                description: quiz.description,
                timeLimit: quiz.timeLimit,
                questions: quiz.questions.map(q => ({
                id: q.id,
                type: q.type,
                text: q.text,
                options: q.options,
                })),
                shuffleQuestions: quiz.shuffleQuestions,
                shuffleOptions: quiz.shuffleOptions,
            }
            },
            { status: 200 }
        );
        }

        // Create a new quiz session
        const newSession = new QuizSession({
        quizId: quiz._id.toString(),
        quizCode: quiz.code,
        studentId: user._id.toString(),
        studentName: user.name,
        studentEmail: user.email,
        currentQuestion: 0,
        totalQuestions: quiz.questions.length,
        progress: 0,
        status: 'active',
        lastActivity: new Date(),
        });

        await newSession.save();

        return NextResponse.json(
        { 
            message: 'Joined quiz session successfully', 
            sessionId: newSession._id,
            quiz: {
            id: quiz._id,
            title: quiz.title,
            description: quiz.description,
            timeLimit: quiz.timeLimit,
            questions: quiz.questions.map(q => ({
                id: q.id,
                type: q.type,
                text: q.text,
                options: q.options,
            })),
            shuffleQuestions: quiz.shuffleQuestions,
            shuffleOptions: quiz.shuffleOptions,
            }
        },
        { status: 200 }
        );

    } catch (error) {
        console.error('Error joining quiz session:', error);
        return NextResponse.json(
        { message: 'Failed to join quiz session' },
        { status: 500 }
        );
    }
    }