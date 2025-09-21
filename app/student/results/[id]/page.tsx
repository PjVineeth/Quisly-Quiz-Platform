"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StudentLayout } from "@/components/layouts/student-layout"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { use } from 'react'

interface QuizResult {
  id: string
  score: number
  timeSpent: number
  submittedAt: string
  quiz: {
    title: string
    questions: Array<{
      id: string
      text: string
      correctAnswer: string
      type: string
    }>
  }
  answers: Record<string, string>
}

export default function QuizResults({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const { toast } = useToast()
  const { user, loading: authLoading } = useAuth()
  const [result, setResult] = useState<QuizResult | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Guard: only students can view their results
    if (authLoading) return
    if (!user) {
      toast({ title: "Authentication Required", description: "Please log in to view results.", variant: "destructive" })
      router.replace('/login')
      return
    }
    if (user.role !== 'student') {
      toast({ title: "Access Denied", description: "Only students can view this page.", variant: "destructive" })
      router.replace('/teacher/dashboard')
      return
    }

    const fetchResult = async () => {
      try {
        setIsLoading(true)
        console.log('Fetching results for ID:', resolvedParams.id)

        // Handle demo quiz results
        if (resolvedParams.id.startsWith("DEMO_")) {
          const demoResults = localStorage.getItem('demoQuizResults')
          
          if (!demoResults) {
            throw new Error('Demo quiz results not found. Please take the quiz again.')
          }
          
          try {
            const parsedResults = JSON.parse(demoResults)
            const result = Array.isArray(parsedResults) 
              ? parsedResults.find(r => r.id === resolvedParams.id)
              : parsedResults.id === resolvedParams.id 
                ? parsedResults 
                : null;
            
            if (!result) {
              throw new Error('Quiz result not found. Please take the quiz again.')
            }
            
            if (!result.quiz || !result.quiz.questions) {
              throw new Error('Invalid quiz result format')
            }
            
            setResult(result)
            return
          } catch (e) {
            console.error('Error parsing demo results:', e)
            throw new Error('Failed to parse quiz results. Please try again.')
          }
        }

        // Handle regular quiz results
        const response = await fetch(`/api/quizzes/results/${resolvedParams.id}`)
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || 'Failed to fetch quiz attempt')
        }
        const data = await response.json()
        
        if (!data || !data.quiz || !data.quiz.questions) {
          throw new Error('Invalid quiz results format')
        }
        setResult(data)
      } catch (error) {
        console.error('Error in fetchResult:', error)
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to load quiz result. Please try again.",
          variant: "destructive",
        })
        router.push('/student/dashboard')
      } finally {
        setIsLoading(false)
      }
    }

    fetchResult()
  }, [resolvedParams.id, router, toast, user, authLoading])

  if (isLoading) {
    return (
      <StudentLayout>
        <div className="container py-10">
          <Card>
            <CardContent className="py-10">
              <p className="text-center">Loading results...</p>
            </CardContent>
          </Card>
        </div>
      </StudentLayout>
    )
  }

  if (!result || !result.quiz || !result.quiz.questions) {
    return (
      <StudentLayout>
        <div className="container py-10">
          <Card>
            <CardContent className="py-10">
              <p className="text-center">No results found. Please try taking the quiz again.</p>
              <div className="mt-6 flex justify-center">
                <Button onClick={() => router.push('/student/dashboard')}>
                  Back to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </StudentLayout>
    )
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  return (
    <StudentLayout>
      <div className="container max-w-3xl py-10">
        <Card>
          <CardHeader>
            <CardTitle>Quiz Results</CardTitle>
            <CardDescription>{result.quiz.title}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 text-center md:grid-cols-3">
              <div className="rounded-lg bg-muted p-4">
                <p className="text-sm font-medium">Score</p>
                <p className="mt-2 text-2xl font-bold">
                  {typeof result.score === 'number' ? result.score.toFixed(1) : 'N/A'}%
                </p>
              </div>
              <div className="rounded-lg bg-muted p-4">
                <p className="text-sm font-medium">Time Spent</p>
                <p className="mt-2 text-2xl font-bold">
                  {typeof result.timeSpent === 'number' ? formatTime(result.timeSpent) : 'N/A'}
                </p>
              </div>
              <div className="rounded-lg bg-muted p-4">
                <p className="text-sm font-medium">Submitted</p>
                <p className="mt-2 text-sm">
                  {result.submittedAt ? new Date(result.submittedAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-medium">Question Review</h3>
              <div className="mt-4 space-y-6">
                {result.quiz.questions.map((question, index) => (
                  <div key={question.id} className="rounded-lg border p-4">
                    <p className="font-medium">Question {index + 1}</p>
                    <p className="mt-2">{question.text}</p>
                    <div className="mt-4 grid gap-2">
                      <div>
                        <p className="text-sm text-muted-foreground">Your Answer:</p>
                        <p className="font-medium">{result.answers[question.id] || "Not answered"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Correct Answer:</p>
                        <p className="font-medium">{question.correctAnswer}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 flex justify-center">
          <Button onClick={() => router.push('/student/dashboard?tab=completed')}>
            Back to Completed Quizzes
          </Button>
        </div>
      </div>
    </StudentLayout>
  )
}

