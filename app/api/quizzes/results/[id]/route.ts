import { NextResponse } from "next/server"

// Mock database for demo purposes
const demoQuizResults: Record<string, any> = {}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // For demo purposes, return mock data
    // In a real application, you would fetch this from your database
    return NextResponse.json({
      id: params.id,
      score: 85,
      timeSpent: 300,
      submittedAt: new Date().toISOString(),
      quiz: {
        title: "Sample Quiz",
        questions: [
          {
            id: "q1",
            text: "What is 2 + 2?",
            correctAnswer: "4",
            type: "numerical"
          },
          {
            id: "q2",
            text: "What is the capital of France?",
            correctAnswer: "Paris",
            type: "short-answer"
          }
        ]
      },
      answers: {
        q1: "4",
        q2: "Paris"
      }
    })
  } catch (error) {
    console.error("Error fetching quiz result:", error)
    return NextResponse.json(
      { error: "Failed to fetch quiz result" },
      { status: 500 }
    )
  }
} 