import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Trophy } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

interface QuizResult {
  id: string
  score: number
  timeSpent: number
  submittedAt: string
  quiz: {
    id: string
    title: string
    code: string
    timeLimit: number
    totalQuestions: number
  }
  answers: Record<string, string>
}

export function CompletedQuizzes() {
  const [completedQuizzes, setCompletedQuizzes] = useState<QuizResult[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true)
        
        // First, get demo quiz results from localStorage
        const demoResults = localStorage.getItem('demoQuizResults')
        let demoSubmissions: QuizResult[] = []
        
        if (demoResults) {
          try {
            const parsedDemoResults = JSON.parse(demoResults)
            if (parsedDemoResults) {
              const resultsArray = Array.isArray(parsedDemoResults) 
                ? parsedDemoResults 
                : [parsedDemoResults];
              
              demoSubmissions = resultsArray.map(result => ({
                id: result.id,
                score: result.score,
                timeSpent: result.timeSpent,
                submittedAt: result.submittedAt,
                quiz: {
                  id: 'demo',
                  title: result.quiz.title,
                  code: 'DEMO123',
                  timeLimit: 10,
                  totalQuestions: result.quiz.questions?.length || 0
                },
                answers: result.answers
              }))
            }
          } catch (e) {
            console.error('Error parsing demo results:', e)
          }
        }

        // Then fetch real quiz submissions from API (authenticated)
        const response = await fetch('/api/student/submissions', { credentials: 'include' })
        if (response.ok) {
          const data = await response.json()
          const realSubmissions = data.submissions.map((submission: any) => ({
            id: submission.id,
            score: submission.score,
            timeSpent: submission.timeSpent,
            submittedAt: submission.submittedAt,
            quiz: submission.quiz,
            answers: submission.answers
          }))

          // Only show real submissions for the authenticated student
          realSubmissions.sort((a: QuizResult, b: QuizResult) =>
            new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
          )

          setCompletedQuizzes(realSubmissions)
        } else {
          if (response.status === 401) {
            toast({
              title: "Authentication Required",
              description: "Please log in to view your completed quizzes.",
              variant: "destructive",
            })
          } else if (response.status === 403) {
            toast({
              title: "Access Denied",
              description: "Only students can view completed quizzes.",
              variant: "destructive",
            })
          } else {
            toast({
              title: "Error",
              description: "Failed to load your submissions.",
              variant: "destructive",
            })
          }
          // Fall back to showing nothing (do not mix demo data here)
          setCompletedQuizzes([])
        }
      } catch (error) {
        console.error('Error fetching submissions:', error)
        toast({
          title: "Error",
          description: "Failed to load quiz submissions. Showing demo results only.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchSubmissions()
  }, [toast])

  if (loading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">Loading your quiz submissions...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {completedQuizzes.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">You haven't completed any quizzes yet.</p>
          </CardContent>
        </Card>
      ) : (
        completedQuizzes.map((result) => (
          <Card key={result.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{result.quiz.title}</CardTitle>
                  <CardDescription>
                    Code: {result.quiz.code} • Completed on {new Date(result.submittedAt).toLocaleDateString()}
                  </CardDescription>
                </div>
                <Badge variant="outline">{result.quiz.code === 'DEMO123' ? 'Demo' : 'Quiz'}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="mr-1 h-4 w-4" />
                  <time dateTime={result.submittedAt}>
                    {new Date(result.submittedAt).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </time>
                  <span className="mx-2">•</span>
                  <span>{result.timeSpent}s</span>
                </div>
                <div className="flex items-center gap-1">
                  <Trophy className="h-4 w-4 text-yellow-500" />
                  <span className="font-medium">
                    {result.score.toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                {result.quiz.totalQuestions} questions • {result.quiz.timeLimit} min time limit
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link href={`/student/results/${result.id}`}>View Results</Link>
              </Button>
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  )
} 