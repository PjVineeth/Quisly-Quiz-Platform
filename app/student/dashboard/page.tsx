"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StudentLayout } from "@/components/layouts/student-layout"
import { Badge } from "@/components/ui/badge"
import { Clock, Trophy, Calendar } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { CompletedQuizzes } from "./completed-quizzes"
import { UpcomingQuizzes } from "./upcoming-quizzes"

// Mock data for student dashboard
const upcomingQuizzes = [
  { id: 1, title: "Science Quiz: Chapter 5", date: "2023-06-15T14:00:00", subject: "Science", teacher: "Ms. Johnson" },
  { id: 2, title: "Math Final Exam", date: "2023-06-18T10:00:00", subject: "Mathematics", teacher: "Mr. Smith" },
]

const completedQuizzes = [
  {
    id: 101,
    title: "History Quiz: Ancient Rome",
    date: "2023-06-01T13:00:00",
    subject: "History",
    score: 85,
    total: 100,
  },
  { id: 102, title: "English Literature Quiz", date: "2023-05-25T11:30:00", subject: "English", score: 92, total: 100 },
  {
    id: 103,
    title: "Geography Test: Continents",
    date: "2023-05-20T09:00:00",
    subject: "Geography",
    score: 78,
    total: 100,
  },
]

export default function StudentDashboard() {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState("upcoming")

  // Set initial tab based on URL parameter
  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab === "completed" || tab === "upcoming") {
      setActiveTab(tab)
    }
  }, [searchParams])

  return (
    <StudentLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, Student! Here's what's happening with your quizzes.</p>
          </div>
          <Button asChild>
            <Link href="/student/join">Join a Quiz</Link>
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-[400px] grid-cols-2">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          <TabsContent value="upcoming">
            <UpcomingQuizzes />
          </TabsContent>
          <TabsContent value="completed">
            <CompletedQuizzes />
          </TabsContent>
        </Tabs>
      </div>
    </StudentLayout>
  )
}

