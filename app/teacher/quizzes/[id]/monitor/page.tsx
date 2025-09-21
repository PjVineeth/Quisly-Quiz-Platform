"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TeacherLayout } from "@/components/layouts/teacher-layout"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock, Users, BarChart3, Copy, Square, RefreshCw } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { use } from 'react'

interface Participant {
  id: string;
  name: string;
  progress: number;
  score: number | null;
  completedAt: string | null;
  timeSpent?: number;
  currentQuestion?: number;
  totalQuestions?: number;
  status: 'active' | 'completed';
}

interface QuizData {
  id: string;
  title: string;
  code: string;
  status: string;
  timeLimit: number;
  participants: Participant[];
}

export default function MonitorQuiz({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const { toast } = useToast()
  const [quiz, setQuiz] = useState<QuizData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isQuizEnded, setIsQuizEnded] = useState(false)

  // Fetch quiz data and participants
  const fetchQuizData = async () => {
    try {
      const response = await fetch(`/api/quizzes/${resolvedParams.id}/participants`);
      if (response.ok) {
        const data = await response.json();
        setQuiz(data);
        setIsQuizEnded(data.quiz.status === 'completed');
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch quiz data",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching quiz data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch quiz data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizData();
    
    // Poll for updates every 5 seconds
    const interval = setInterval(fetchQuizData, 5000);
    
    // Clean up old sessions every 30 seconds
    const cleanupInterval = setInterval(async () => {
      try {
        await fetch('/api/quiz-sessions/cleanup', { method: 'POST' });
      } catch (error) {
        console.error('Error cleaning up sessions:', error);
      }
    }, 30000);
    
    return () => {
      clearInterval(interval);
      clearInterval(cleanupInterval);
    };
  }, [resolvedParams.id]);

  const handleEndQuiz = async () => {
    try {
      const response = await fetch(`/api/quizzes/${resolvedParams.id}/end`, {
        method: 'PATCH',
      });
      
      if (response.ok) {
        toast({
          title: "Quiz Ended",
          description: "The quiz has been ended successfully.",
        });
        setIsQuizEnded(true);
        fetchQuizData(); // Refresh data
      } else {
        const data = await response.json();
        toast({
          title: "Error",
          description: data.message || "Failed to end quiz",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error ending quiz:', error);
      toast({
        title: "Error",
        description: "Failed to end quiz",
        variant: "destructive",
      });
    }
  };

  const copyQuizCode = () => {
    if (quiz?.code) {
      navigator.clipboard.writeText(quiz.code);
      toast({
        title: "Code Copied",
        description: `Quiz code ${quiz.code} copied to clipboard`,
      });
    }
  };

  if (loading) {
    return (
      <TeacherLayout>
        <div className="container py-10">
          <Card>
            <CardContent className="py-10">
              <p className="text-center">Loading quiz data...</p>
            </CardContent>
          </Card>
        </div>
      </TeacherLayout>
    );
  }

  if (!quiz) {
    return (
      <TeacherLayout>
        <div className="container py-10">
          <Card>
            <CardContent className="py-10">
              <p className="text-center">Quiz not found</p>
            </CardContent>
          </Card>
        </div>
      </TeacherLayout>
    );
  }

  const completedCount = quiz.participants.filter(p => p.score !== null).length;
  const averageScore = completedCount > 0 
    ? Math.round(quiz.participants.filter(p => p.score !== null).reduce((sum, p) => sum + (p.score || 0), 0) / completedCount)
    : 0;

  return (
    <TeacherLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Link href="/teacher/dashboard" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Monitor Quiz</h1>
        </div>

        {/* Quiz Info */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{quiz.title}</CardTitle>
                <CardDescription>Code: {quiz.code}</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={quiz.status === "active" ? "default" : "secondary"}>
                  {quiz.status === "active" ? "Active" : "Completed"}
                </Badge>
                <Button variant="outline" size="sm" onClick={copyQuizCode}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Code
                </Button>
                {quiz.status === "active" && (
                  <Button variant="destructive" size="sm" onClick={handleEndQuiz}>
                    <Square className="mr-2 h-4 w-4" />
                    End Quiz
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Time Limit: {quiz.timeLimit} minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{quiz.participants.length} participants</span>
              </div>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Avg Score: {averageScore}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Participants */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Participants ({quiz.participants.length})</CardTitle>
              <Button variant="outline" size="sm" onClick={fetchQuizData}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {quiz.participants.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No participants yet. Share the quiz code with students to get started.
              </p>
            ) : (
              <div className="space-y-4">
                {quiz.participants.map((participant) => (
                  <div key={participant.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="font-medium">{participant.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {participant.status === 'completed' 
                            ? `Completed in ${Math.round((participant.timeSpent || 0) / 60)} minutes`
                            : participant.currentQuestion !== undefined && participant.totalQuestions !== undefined
                              ? `Question ${participant.currentQuestion + 1} of ${participant.totalQuestions}`
                              : `${participant.progress}% complete`
                          }
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-32">
                        <Progress value={participant.progress} className="h-2" />
                      </div>
                      {participant.status === 'completed' ? (
                        <Badge variant="default">{participant.score}%</Badge>
                      ) : (
                        <Badge variant="outline">Active</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{quiz.participants.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageScore}%</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TeacherLayout>
  )
}