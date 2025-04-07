"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TeacherLayout } from "@/components/layouts/teacher-layout"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, Users, Clock, BarChart3, Copy } from "lucide-react"
import Link from "next/link"

// Mock data for teacher dashboard
const activeQuizzes = [
  {
    id: 1,
    title: "Science Quiz: Chapter 5",
    code: "SCI123",
    participants: 24,
    status: "active",
    startTime: "2023-06-10T14:00:00",
    endTime: "2023-06-10T15:00:00",
  },
  {
    id: 2,
    title: "Math Quiz: Algebra",
    code: "MATH456",
    participants: 18,
    status: "scheduled",
    startTime: "2023-06-15T10:00:00",
    endTime: "2023-06-15T11:00:00",
  },
]

const recentQuizzes = [
  {
    id: 101,
    title: "History Quiz: Ancient Rome",
    date: "2023-06-01",
    participants: 22,
    avgScore: 78,
  },
  {
    id: 102,
    title: "English Literature Quiz",
    date: "2023-05-25",
    participants: 20,
    avgScore: 85,
  },
  {
    id: 103,
    title: "Geography Test: Continents",
    date: "2023-05-20",
    participants: 19,
    avgScore: 72,
  },
]

export default function TeacherDashboard() {
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
            <TabsTrigger value="active">Active Quizzes</TabsTrigger>
            <TabsTrigger value="recent">Recent Quizzes</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {activeQuizzes.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">No active quizzes at the moment.</p>
                </CardContent>
              </Card>
            ) : (
              activeQuizzes.map((quiz) => (
                <Card key={quiz.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{quiz.title}</CardTitle>
                        <CardDescription>Code: {quiz.code}</CardDescription>
                      </div>
                      <Badge variant={quiz.status === "active" ? "default" : "outline"}>
                        {quiz.status === "active" ? "Active" : "Scheduled"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="mr-1 h-4 w-4" />
                        <span>{quiz.participants} participants</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="mr-1 h-4 w-4" />
                        <span>
                          {new Date(quiz.startTime).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                          {" - "}
                          {new Date(quiz.endTime).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm">
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Code
                    </Button>
                    <Button asChild>
                      <Link href={`/teacher/quizzes/${quiz.id}/monitor`}>
                        {quiz.status === "active" ? "Monitor" : "View"}
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="recent" className="space-y-4">
            {recentQuizzes.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">No recent quizzes.</p>
                </CardContent>
              </Card>
            ) : (
              recentQuizzes.map((quiz) => (
                <Card key={quiz.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle>{quiz.title}</CardTitle>
                      <Badge variant="outline">Completed</Badge>
                    </div>
                    <CardDescription>
                      {new Date(quiz.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="mr-1 h-4 w-4" />
                        <span>{quiz.participants} participants</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <span className="font-medium">Avg. Score: {quiz.avgScore}%</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" variant="outline" asChild>
                      <Link href={`/teacher/quizzes/${quiz.id}/results`}>View Results</Link>
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

