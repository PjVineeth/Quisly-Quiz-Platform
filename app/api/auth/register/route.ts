import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import { createToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json();
    const normalizedEmail = (email || '').trim().toLowerCase();

    // Validate required fields
    if (!name || !normalizedEmail || !password || !role) {
      console.error('Missing required fields:', { name, email, password, role });
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate name length
    if (name.length < 2) {
      return NextResponse.json(
        { error: 'Name must be at least 2 characters long' },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Validate role
    if (!['teacher', 'student'].includes(role)) {
      return NextResponse.json(
        { error: 'Role must be either teacher or student' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Create new user (password will be hashed by pre-save hook)
    const user = await User.create({
      name,
      email: normalizedEmail,
      password,
      role,
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user.toObject();

    // Create auth token and set cookie like login
    const token = await createToken(user);

    const response = NextResponse.json(
      { user: userWithoutPassword, message: `Welcome, ${user.name}!` },
      { status: 201 }
    );

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle Mongoose validation errors
    if (error instanceof Error && error.name === 'ValidationError') {
      const validationErrors = Object.values((error as any).errors).map((err: any) => err.message);
      return NextResponse.json(
        { error: 'Validation failed', details: validationErrors },
        { status: 400 }
      );
    }

    // Handle duplicate key error
    if (error instanceof Error && (error as any).code === 11000) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 