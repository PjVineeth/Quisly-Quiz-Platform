import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Validate required fields
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/;
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();


    // Find user
    if (!user) {
      return NextResponse.json(
        { error: 'No account found with this email address. Please check your email or register for a new account.' },
        { status: 401 }
      );
    }

    console.log('User found:', user.name, 'Role:', user.role);

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      console.log('Invalid password for user:', user.email);
      return NextResponse.json(
        { error: 'Incorrect password. Please check your password and try again.' },
        { status: 401 }
      );
    }

    console.log('Password verified for user:', user.name);

    // Create JWT token

    console.log('JWT token created for user:', user.name);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user.toObject();

    // Set cookie with token
    const response = NextResponse.json(
      { 
        user: userWithoutPassword,
        message: `Welcome back, ${user.name}!`
      },
      { status: 200 }
    );

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    console.log('Login successful for:', user.name, 'Role:', user.role);
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { 
        error: 'Login failed due to server error', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
} 