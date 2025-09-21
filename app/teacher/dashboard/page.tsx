"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TeacherLayout } from "@/components/layouts/teacher-layout"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, Users, Clock, BarChart3, Copy, Play, Square } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"

interface Quiz {
  _id: string;
  title: string;
  description?: string;
  code: string;
  timeLimit: number;
  status: 'draft' | 'scheduled' | 'active' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export default function TeacherDashboard() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to access the teacher dashboard.",
        variant: "destructive",
      });
      router.replace('/login');
      return;
    }

    if (user.role !== 'teacher') {
      toast({
        title: "Access Denied",
        description: "Only teachers can access this dashboard.",
        variant: "destructive",
      });
      router.replace('/student/dashboard');
      return;
    }

    fetchQuizzes();
  }, [authLoading, user]);

  // Check authentication
  if (authLoading) {
    return (
      <TeacherLayout>
        <div className="container py-10 text-center">
          <p>Checking authentication...</p>
        </div>
      </TeacherLayout>
    );
  }

  if (!user || user.role !== 'teacher') {
    return (
      <TeacherLayout>
        <div className="container py-10 text-center">
          <p>Redirecting...</p>
        </div>
      </TeacherLayout>
    );
  }

  const fetchQuizzes = async () => {
    try {
      const response = await fetch('/api/quizzes/teacher', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setQuizzes(data);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch quizzes');
      }
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch quizzes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleActivateQuiz = async (quizId: string) => {
    try {
      const response = await fetch(`/api/quizzes/${quizId}/activate`, {
        method: 'PATCH',
        credentials: 'include'
      });
      
      if (response.ok) {
        toast({
          title: "Quiz Activated",
          description: "The quiz is now active and students can join.",
        });
        fetchQuizzes(); // Refresh the list
      } else {
        const data = await response.json();
        toast({
          title: "Error",
          description: data.message || "Failed to activate quiz",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error activating quiz:', error);
      toast({
        title: "Error",
        description: "Failed to activate quiz",
        variant: "destructive",
      });
    }
  };

  const handleEndQuiz = async (quizId: string) => {
    try {
      const response = await fetch(`/api/quizzes/${quizId}/end`, {
        method: 'PATCH',
        credentials: 'include'
      });
      
      if (response.ok) {
        toast({
          title: "Quiz Ended",
          description: "The quiz has been ended and is no longer accepting submissions.",
        });
        fetchQuizzes(); // Refresh the list
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

  const copyQuizCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Code Copied",
      description: `Quiz code ${code} copied to clipboard`,
    });
  };

  const activeQuizzes = quizzes.filter(quiz => quiz.status === 'active');
  const draftQuizzes = quizzes.filter(quiz => quiz.status === 'draft');
  const completedQuizzes = quizzes.filter(quiz => quiz.status === 'completed');

  return (
    <TeacherLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, Teacher! Manage your quizzes and view analytics.</p>
          </div>
          <Button asChild>
            <Link href="/teacher/quizzes/create">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Quiz
            </Link>
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">+2 from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45</div>
              <p className="text-xs text-muted-foreground">+5 from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Completion Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12:45</div>
              <p className="text-xs text-muted-foreground">-2:30 from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Score</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">78%</div>
              <p className="text-xs text-muted-foreground">+2% from last month</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="active" className="space-y-4">
          <TabsList>
            <TabsTrigger value="active">Active Quizzes ({activeQuizzes.length})</TabsTrigger>
            <TabsTrigger value="draft">Draft Quizzes ({draftQuizzes.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed Quizzes ({completedQuizzes.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {loading ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">Loading quizzes...</p>
                </CardContent>
              </Card>
            ) : activeQuizzes.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">No active quizzes at the moment.</p>
                </CardContent>
              </Card>
            ) : (
              activeQuizzes.map((quiz) => (
                <Card key={quiz._id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{quiz.title}</CardTitle>
                        <CardDescription>Code: {quiz.code}</CardDescription>
                      </div>
                      <Badge variant="default">Active</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="mr-1 h-4 w-4" />
                        <span>Time Limit: {quiz.timeLimit} minutes</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <span>Started: {new Date(quiz.updatedAt).toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => copyQuizCode(quiz.code)}
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Code
                    </Button>
                    <div className="flex gap-2">
                      <Button asChild>
                        <Link href={`/teacher/quizzes/${quiz._id}/monitor`}>
                          Monitor
                        </Link>
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleEndQuiz(quiz._id)}
                      >
                        <Square className="mr-2 h-4 w-4" />
                        End Quiz
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="draft" className="space-y-4">
            {loading ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">Loading quizzes...</p>
                </CardContent>
              </Card>
            ) : draftQuizzes.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">No draft quizzes.</p>
                </CardContent>
              </Card>
            ) : (
              draftQuizzes.map((quiz) => (
                <Card key={quiz._id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{quiz.title}</CardTitle>
                        <CardDescription>Code: {quiz.code}</CardDescription>
                      </div>
                      <Badge variant="outline">Draft</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="mr-1 h-4 w-4" />
                        <span>Time Limit: {quiz.timeLimit} minutes</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <span>Created: {new Date(quiz.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => copyQuizCode(quiz.code)}
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Code
                    </Button>
                    <Button 
                      onClick={() => handleActivateQuiz(quiz._id)}
                    >
                      <Play className="mr-2 h-4 w-4" />
                      Activate Quiz
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {loading ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">Loading quizzes...</p>
                </CardContent>
              </Card>
            ) : completedQuizzes.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">No completed quizzes.</p>
                </CardContent>
              </Card>
            ) : (
              completedQuizzes.map((quiz) => (
                <Card key={quiz._id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle>{quiz.title}</CardTitle>
                      <Badge variant="secondary">Completed</Badge>
                    </div>
                    <CardDescription>
                      Code: {quiz.code}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="mr-1 h-4 w-4" />
                        <span>Time Limit: {quiz.timeLimit} minutes</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <span>Completed: {new Date(quiz.updatedAt).toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" variant="outline" asChild>
                      <Link href={`/teacher/quizzes/${quiz._id}/results`}>View Results</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </TeacherLayout>
  )
}

