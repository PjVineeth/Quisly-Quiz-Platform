"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { TeacherLayout } from "@/components/layouts/teacher-layout"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Clock, Users, Copy, Eye } from "lucide-react"
import Link from "next/link"

interface Quiz {
  _id: string
  title: string
  description: string
  code: string
  timeLimit: number
  questions: Array<{
    _id: string
    type: string
    text: string
  }>
  status: string
  createdAt: string
}

export default function TeacherQuizzes() {
  const router = useRouter()
  const { toast } = useToast()
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await fetch('/api/quizzes/teacher');
        if (!response.ok) {
          throw new Error('Failed to fetch quizzes');
        }
        const data = await response.json();
        setQuizzes(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load quizzes. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuizzes();
  }, [toast]);

  const copyQuizCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied!",
      description: "Quiz code copied to clipboard",
    });
  };

  if (isLoading) {
    return (
      <TeacherLayout>
        <div className="container py-10">
          <Card>
            <CardContent className="py-10">
              <p className="text-center">Loading quizzes...</p>
            </CardContent>
          </Card>
        </div>
      </TeacherLayout>
    );
  }

  return (
    <TeacherLayout>
      <div className="container py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Quizzes</h1>
          <Button onClick={() => router.push('/teacher/quizzes/create')}>
            Create New Quiz
          </Button>
        </div>

        {quizzes.length === 0 ? (
          <Card>
            <CardContent className="py-10">
              <p className="text-center text-muted-foreground">
                No quizzes found. Create your first quiz!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {quizzes.map((quiz) => (
              <Card key={quiz._id}>
                <CardHeader>
                  <CardTitle>{quiz.title}</CardTitle>
                  <CardDescription>{quiz.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{quiz.timeLimit} minutes</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{quiz.questions.length} questions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Quiz Code:</span>
                    <div className="flex items-center gap-2">
                      <code className="px-2 py-1 bg-muted rounded-md">
                        {quiz.code}
                      </code>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyQuizCode(quiz.code)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/teacher/quizzes/${quiz._id}/results`)}
                  >
                    View Results
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/teacher/quizzes/${quiz._id}`)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </TeacherLayout>
  );
} 