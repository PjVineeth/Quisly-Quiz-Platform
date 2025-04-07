"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StudentLayout } from "@/components/layouts/student-layout"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function JoinQuiz() {
  const router = useRouter()
  const { toast } = useToast()
  const [quizCode, setQuizCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Check if it's the demo quiz code
      if (quizCode === "DEMO123") {
        router.push(`/student/quiz/${quizCode}`);
        return;
      }

      // First verify if the quiz exists and is active
      const response = await fetch(`/api/quizzes/verify/${quizCode}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to verify quiz code');
      }

      if (data.status === 'active') {
        // If quiz is active, redirect to the quiz page
        router.push(`/student/quiz/${quizCode}`);
      } else {
        toast({
          title: "Quiz Not Available",
          description: "This quiz is not currently active. Please check with your teacher.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error joining quiz:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Invalid quiz code",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <StudentLayout>
      <div className="container max-w-md py-10">
        <Card>
          <CardHeader>
            <CardTitle>Join Quiz</CardTitle>
            <CardDescription>Enter the quiz code provided by your teacher</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Enter quiz code"
                  value={quizCode}
                  onChange={(e) => setQuizCode(e.target.value.toUpperCase())}
                  maxLength={7}
                  required
                  className="text-center text-2xl tracking-widest uppercase"
                />
                <p className="text-sm text-muted-foreground text-center">
                  Try using code <span className="font-mono">DEMO123</span> for a demo quiz
                </p>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Checking..." : "Join Quiz"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </StudentLayout>
  )
}

