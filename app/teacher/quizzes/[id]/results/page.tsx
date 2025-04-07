"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TeacherLayout } from "@/components/layouts/teacher-layout"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, BarChart3, Users, Clock } from "lucide-react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Mock data for quiz results
const getMockQuizResults = (quizId: string) => ({
  id: 1,
  title: quizId === "101" ? "History Quiz: Ancient Rome" : 
         quizId === "102" ? "English Literature Quiz" : 
         quizId === "103" ? "Geography Test: Continents" : 
         "Science Quiz: Chapter 5",
  date: "2023-06-10",
  totalQuestions: 5,
  participants: [
    { id: 1, name: "Alex Johnson", score: 85, timeSpent: "8:45", completedAt: "2023-06-10T14:15:30" },
    { id: 2, name: "Maria Garcia", score: 90, timeSpent: "9:20", completedAt: "2023-06-10T14:20:45" },
    { id: 3, name: "David Kim", score: 75, timeSpent: "12:10", completedAt: "2023-06-10T14:25:15" },
    { id: 4, name: "Sarah Williams", score: 70, timeSpent: "10:30", completedAt: "2023-06-10T14:22:30" },
    { id: 5, name: "James Brown", score: 80, timeSpent: "11:15", completedAt: "2023-06-10T14:30:00" },
  ],
  questionStats: [
    {
      id: 1,
      text: "What is the chemical symbol for water?",
      correctAnswers: 4,
      totalAnswers: 5,
      options: [
        { text: "H2O", count: 4, isCorrect: true },
        { text: "CO2", count: 1, isCorrect: false },
        { text: "NaCl", count: 0, isCorrect: false },
        { text: "O2", count: 0, isCorrect: false },
      ],
    },
    {
      id: 2,
      text: "The Earth revolves around the Sun.",
      correctAnswers: 5,
      totalAnswers: 5,
      options: [
        { text: "True", count: 5, isCorrect: true },
        { text: "False", count: 0, isCorrect: false },
      ],
    },
    {
      id: 3,
      text: "Which of the following is NOT a primary color?",
      correctAnswers: 3,
      totalAnswers: 5,
      options: [
        { text: "Red", count: 0, isCorrect: false },
        { text: "Blue", count: 0, isCorrect: false },
        { text: "Green", count: 3, isCorrect: true },
        { text: "Yellow", count: 2, isCorrect: false },
      ],
    },
    {
      id: 4,
      text: "What is the atomic number of Oxygen?",
      correctAnswers: 2,
      totalAnswers: 5,
      answers: ["8", "8", "6", "7", "16"],
    },
    {
      id: 5,
      text: "Name the process by which plants make their own food using sunlight.",
      correctAnswers: 4,
      totalAnswers: 5,
      answers: ["photosynthesis", "photosynthesis", "photosynthesis", "photosynthesis", "respiration"],
    },
  ],
})

export default function QuizResults({ params }: { params: { id: string } }) {
  const mockQuizResults = getMockQuizResults(params.id)
  const averageScore = Math.round(
    mockQuizResults.participants.reduce((sum, p) => sum + p.score, 0) / mockQuizResults.participants.length,
  )

  const downloadResults = () => {
    // In a real app, this would generate and download a CSV or Excel file
    alert("Downloading results...")
  }

  return (
    <TeacherLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Link href="/teacher/dashboard" className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <h1 className="text-3xl font-bold tracking-tight">{mockQuizResults.title}</h1>
            </div>
            <p className="text-muted-foreground">
              Results from{" "}
              {new Date(mockQuizResults.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <Button onClick={downloadResults}>
            <Download className="mr-2 h-4 w-4" />
            Download Results
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Participants</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockQuizResults.participants.length}</div>
              <p className="text-xs text-muted-foreground">All participants completed the quiz</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageScore}%</div>
              <p className="text-xs text-muted-foreground">
                {averageScore >= 70 ? "Good performance" : "Needs improvement"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">10:24</div>
              <p className="text-xs text-muted-foreground">Average completion time</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="participants" className="space-y-4">
          <TabsList>
            <TabsTrigger value="participants">Participants</TabsTrigger>
            <TabsTrigger value="questions">Questions</TabsTrigger>
          </TabsList>

          <TabsContent value="participants">
            <Card>
              <CardHeader>
                <CardTitle>Participant Results</CardTitle>
                <CardDescription>Detailed performance of each participant</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Time Spent</TableHead>
                      <TableHead>Completed At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockQuizResults.participants
                      .sort((a, b) => b.score - a.score)
                      .map((participant, index) => (
                        <TableRow key={participant.id}>
                          <TableCell className="font-medium">
                            {index === 0 && "🥇 "}
                            {index === 1 && "🥈 "}
                            {index === 2 && "🥉 "}
                            {participant.name}
                          </TableCell>
                          <TableCell>
                            <Badge variant={participant.score >= 70 ? "default" : "outline"}>
                              {participant.score}%
                            </Badge>
                          </TableCell>
                          <TableCell>{participant.timeSpent}</TableCell>
                          <TableCell>
                            {new Date(participant.completedAt).toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="questions">
            <div className="space-y-6">
              {mockQuizResults.questionStats.map((question, index) => {
                const correctPercentage = Math.round((question.correctAnswers / question.totalAnswers) * 100)

                return (
                  <Card key={question.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Question {index + 1}: {question.text}
                      </CardTitle>
                      <CardDescription>
                        {question.correctAnswers} out of {question.totalAnswers} answered correctly ({correctPercentage}
                        %)
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {"options" in question && question.options ? (
                        <div className="space-y-3">
                          {question.options.map((option, optIndex) => {
                            const percentage = Math.round((option.count / question.totalAnswers) * 100)

                            return (
                              <div key={optIndex} className="space-y-1">
                                <div className="flex justify-between items-center">
                                  <span
                                    className={option.isCorrect ? "font-medium text-green-600 dark:text-green-400" : ""}
                                  >
                                    {option.text} {option.isCorrect && "(Correct)"}
                                  </span>
                                  <span className="text-sm">
                                    {option.count}/{question.totalAnswers} ({percentage}%)
                                  </span>
                                </div>
                                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                                  <div
                                    className={`h-full ${option.isCorrect ? "bg-green-500" : "bg-red-500"}`}
                                    style={{ width: `${percentage}%` }}
                                  />
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <p className="font-medium">Answers:</p>
                          <div className="flex flex-wrap gap-2">
                            {question.answers.map((answer, ansIndex) => (
                              <Badge
                                key={ansIndex}
                                variant={answer.toLowerCase() === question.answers[0].toLowerCase() ? "default" : "outline"}
                              >
                                {answer}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </TeacherLayout>
  )
}

