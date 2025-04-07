import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Trophy } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

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

export function CompletedQuizzes() {
  const [completedQuizzes, setCompletedQuizzes] = useState<QuizResult[]>([])

  useEffect(() => {
    // Get demo quiz results from localStorage
    const demoResults = localStorage.getItem('demoQuizResults')
    if (demoResults) {
      try {
        const parsedDemoResults = JSON.parse(demoResults)
        if (parsedDemoResults) {
          // Handle both array and single result formats
          const resultsArray = Array.isArray(parsedDemoResults) 
            ? parsedDemoResults 
            : [parsedDemoResults];
          
          // Sort by submission date, most recent first
          resultsArray.sort((a, b) => 
            new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
          );
          
          // Update quiz titles based on ID
          const updatedResults = resultsArray.map(result => {
            let title = result.quiz.title;
            if (result.id.startsWith("DEMO_")) {
              // Assign different titles based on the timestamp in the ID
              const timestamp = parseInt(result.id.split("_")[1]);
              const titles = [
                "History Quiz: Ancient Civilizations",
                "Mathematics: Algebra Basics",
                "English Literature: Shakespeare's Works",
                "Geography: World Capitals",
                "Biology: Human Anatomy"
              ];
              title = titles[timestamp % titles.length];
            }
            return {
              ...result,
              quiz: {
                ...result.quiz,
                title
              }
            };
          });
          
          setCompletedQuizzes(updatedResults);
        }
      } catch (e) {
        console.error('Error parsing demo results:', e)
      }
    }

    // TODO: Fetch regular quiz results from API when implemented
  }, [])

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
                    Completed on {new Date(result.submittedAt).toLocaleDateString()}
                  </CardDescription>
                </div>
                <Badge variant="outline">Quiz</Badge>
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
                </div>
                <div className="flex items-center gap-1">
                  <Trophy className="h-4 w-4 text-yellow-500" />
                  <span className="font-medium">
                    {result.score.toFixed(1)}%
                  </span>
                </div>
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