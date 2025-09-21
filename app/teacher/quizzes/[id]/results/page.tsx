"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TeacherLayout } from "@/components/layouts/teacher-layout"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, BarChart3, Users, Clock } from "lucide-react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { use } from 'react'
import { useToast } from "@/hooks/use-toast"

interface QuizResult {
  id: string;
  studentName: string;
  score: number;
  timeSpent: number;
  submittedAt: string;
  answers: Record<string, string>;
}

interface QuizData {
  id: string;
  title: string;
  code: string;
  totalQuestions: number;
  timeLimit: number;
  status: string;
}

interface Statistics {
  totalSubmissions: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  averageTimeSpent: number;
}

interface QuizResultsData {
  quiz: QuizData;
  statistics: Statistics;
  results: QuizResult[];
}

export default function QuizResults({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const { toast } = useToast()
  const [quizResults, setQuizResults] = useState<QuizResultsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchQuizResults = async () => {
      try {
        const response = await fetch(`/api/quizzes/${resolvedParams.id}/results`)
        if (response.ok) {
          const data = await response.json()
          setQuizResults(data)
        } else {
          toast({
            title: "Error",
            description: "Failed to load quiz results",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error('Error fetching quiz results:', error)
        toast({
          title: "Error",
          description: "Failed to load quiz results",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchQuizResults()
  }, [resolvedParams.id, toast])

  const downloadResults = () => {
    if (!quizResults) return
    
    // Create CSV content
    const csvContent = [
      ['Student Name', 'Score (%)', 'Time Spent (seconds)', 'Submitted At'],
      ...quizResults.results.map(result => [
        result.studentName,
        result.score.toString(),
        result.timeSpent.toString(),
        new Date(result.submittedAt).toLocaleString()
      ])
    ].map(row => row.join(',')).join('\n')

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${quizResults.quiz.title}_results.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)

    toast({
      title: "Download Started",
      description: "Quiz results are being downloaded",
    })
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <TeacherLayout>
        <div className="container py-10">
          <Card>
            <CardContent className="py-10">
              <p className="text-center">Loading quiz results...</p>
            </CardContent>
          </Card>
        </div>
      </TeacherLayout>
    )
  }

  if (!quizResults) {
    return (
      <TeacherLayout>
        <div className="container py-10">
          <Card>
            <CardContent className="py-10">
              <p className="text-center">Quiz results not found</p>
            </CardContent>
          </Card>
        </div>
      </TeacherLayout>
    )
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
              <h1 className="text-3xl font-bold tracking-tight">{quizResults.quiz.title}</h1>
            </div>
            <p className="text-muted-foreground">
              Quiz Code: {quizResults.quiz.code} • {quizResults.quiz.totalQuestions} questions • {quizResults.quiz.timeLimit} minutes
            </p>
          </div>
          <Button onClick={downloadResults} disabled={quizResults.results.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            Download Results
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Participants</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{quizResults.statistics.totalSubmissions}</div>
              <p className="text-xs text-muted-foreground">Total submissions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{quizResults.statistics.averageScore}%</div>
              <p className="text-xs text-muted-foreground">
                {quizResults.statistics.averageScore >= 70 ? "Good performance" : "Needs improvement"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Highest Score</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{quizResults.statistics.highestScore}%</div>
              <p className="text-xs text-muted-foreground">Best performance</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatTime(quizResults.statistics.averageTimeSpent)}</div>
              <p className="text-xs text-muted-foreground">Average completion time</p>
            </CardContent>
          </Card>
        </div>

        {quizResults.results.length === 0 ? (
          <Card>
            <CardContent className="py-10">
              <p className="text-center text-muted-foreground">
                No submissions yet. Students need to complete the quiz to see results here.
              </p>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="participants" className="space-y-4">
            <TabsList>
              <TabsTrigger value="participants">Participants ({quizResults.results.length})</TabsTrigger>
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
                        <TableHead>Rank</TableHead>
                        <TableHead>Student Name</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Time Spent</TableHead>
                        <TableHead>Completed At</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {quizResults.results
                        .sort((a, b) => b.score - a.score)
                        .map((participant, index) => (
                          <TableRow key={participant.id}>
                            <TableCell className="font-medium">
                              {index === 0 && "🥇 "}
                              {index === 1 && "🥈 "}
                              {index === 2 && "🥉 "}
                              #{index + 1}
                            </TableCell>
                            <TableCell className="font-medium">{participant.studentName}</TableCell>
                            <TableCell>
                              <Badge variant={participant.score >= 70 ? "default" : "outline"}>
                                {participant.score}%
                              </Badge>
                            </TableCell>
                            <TableCell>{formatTime(participant.timeSpent)}</TableCell>
                            <TableCell>
                              {new Date(participant.submittedAt).toLocaleString()}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </TeacherLayout>
  )
}