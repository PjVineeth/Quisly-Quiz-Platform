import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Quiz from "@/models/Quiz";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Fetch all quizzes (you might want to add filtering by teacher ID later)
    const quizzes = await Quiz.find({})
      .sort({ createdAt: -1 }) // Sort by newest first
      .select('title description code timeLimit questions status createdAt')
      .exec();

    return NextResponse.json(quizzes);
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    return NextResponse.json(
      { error: "Failed to fetch quizzes" },
      { status: 500 }
    );
  }
} 