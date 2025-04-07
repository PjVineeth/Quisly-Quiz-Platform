"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TeacherLayout } from "@/components/layouts/teacher-layout"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock, Users, BarChart3, Copy } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

// Mock data for quiz monitoring
const mockQuiz = {
  id: 1,
  title: "Science Quiz: Chapter 5",
  code: "SCI123",
  status: "active",
  startTime: "2023-06-10T14:00:00",
  endTime: "2023-06-10T15:00:00",
  totalQuestions: 5,
  participants: [
    { id: 1, name: "Alex Johnson", progress: 100, score: 85, completedAt: "2023-06-10T14:15:30" },
    { id: 2, name: "Maria Garcia", progress: 80, score: null, completedAt: null },
    { id: 3, name: "David Kim", progress: 60, score: null, completedAt: null },
    { id: 4, name: "Sarah Williams", progress: 40, score: null, completedAt: null },
    { id: 5, name: "James Brown", progress: 20, score: null, completedAt: null },
  ],
  questionStats: [
    { 
      id: 1, 
      correctAnswers: 3, 
      totalAnswers: 5,
      text: "What is the chemical symbol for water?",
      options: [
        { text: "H2O", isCorrect: true, selectedCount: 3 },
        { text: "CO2", isCorrect: false, selectedCount: 1 },
        { text: "NaCl", isCorrect: false, selectedCount: 1 },
        { text: "O2", isCorrect: false, selectedCount: 0 }
      ]
    },
    { 
      id: 2, 
      correctAnswers: 4, 
      totalAnswers: 5,
      text: "The Earth revolves around the Sun. (True/False)",
      options: [
        { text: "True", isCorrect: true, selectedCount: 4 },
        { text: "False", isCorrect: false, selectedCount: 1 }
      ]
    },
    { 
      id: 3, 
      correctAnswers: 2, 
      totalAnswers: 4,
      text: "Which of the following is NOT a primary color?",
      options: [
        { text: "Red", isCorrect: false, selectedCount: 0 },
        { text: "Blue", isCorrect: false, selectedCount: 0 },
        { text: "Green", isCorrect: true, selectedCount: 2 },
        { text: "Yellow", isCorrect: false, selectedCount: 2 }
      ]
    },
    { 
      id: 4, 
      correctAnswers: 1, 
      totalAnswers: 3,
      text: "What is the atomic number of Oxygen?",
      options: [
        { text: "6", isCorrect: false, selectedCount: 1 },
        { text: "8", isCorrect: true, selectedCount: 1 },
        { text: "16", isCorrect: false, selectedCount: 1 }
      ]
    },
    { 
      id: 5, 
      correctAnswers: 0, 
      totalAnswers: 2,
      text: "Name the process by which plants make their own food using sunlight.",
      options: [
        { text: "Photosynthesis", isCorrect: true, selectedCount: 0 },
        { text: "Respiration", isCorrect: false, selectedCount: 2 }
      ]
    },
  ],
}

export default function MonitorQuiz({ params }: { params: { id: string } }) {
  const { toast } = useToast()
  const [quiz, setQuiz] = useState(mockQuiz)
  const [timeLeft, setTimeLeft] = useState("")
  const [isQuizEnded, setIsQuizEnded] = useState(false)
  const [socket, setSocket] = useState<any>(null)

  // Calculate time remaining
  useEffect(() => {
    const calculateTimeLeft = () => {
      const endTime = new Date(quiz.endTime).getTime()
      const now = new Date().getTime()
      const difference = endTime - now

      if (difference > 0) {
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)

        return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      }

      return "Ended"
    }

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    setTimeLeft(calculateTimeLeft())

    return () => clearInterval(timer)
  }, [quiz.endTime])

  // Simulate socket connection
  useEffect(() => {
    // In a real app, you would connect to your actual socket server
    // const newSocket = io("http://localhost:3001");

    // For demo purposes, we'll simulate socket events
    function simulateSocketEvents() {
      // Simulate a new participant joining
      setTimeout(() => {
        if (!isQuizEnded) {
          setQuiz((prevQuiz) => ({
            ...prevQuiz,
            participants: [
              ...prevQuiz.participants,
              {
                id: 6,
                name: "Emma Wilson",
                progress: 0,
                score: null,
                completedAt: null,
              },
            ],
          }))

          toast({
            title: "New participant joined",
            description: "Emma Wilson has joined the quiz",
          })
        }
      }, 5000)

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        if (!isQuizEnded) {
          setQuiz((prevQuiz) => ({
            ...prevQuiz,
            participants: prevQuiz.participants.map((participant) => {
              if (participant.score === null && participant.progress < 100) {
                const newProgress = Math.min(participant.progress + 20, 100)

                // If progress reaches 100, set a score
                if (newProgress === 100) {
                  const randomScore = Math.floor(Math.random() * 30) + 70 // Random score between 70-100
                  return {
                    ...participant,
                    progress: newProgress,
                    score: randomScore,
                    completedAt: new Date().toISOString(),
                  }
                }

                return {
                  ...participant,
                  progress: newProgress,
                }
              }
              return participant
            }),
            questionStats: prevQuiz.questionStats.map((stat, index) => {
              // Update question stats as participants progress
              const newAnswers = Math.min(stat.totalAnswers + 1, quiz.participants.length)
              const newCorrect = stat.correctAnswers + (Math.random() > 0.3 ? 1 : 0)

              return {
                ...stat,
                totalAnswers: newAnswers,
                correctAnswers: Math.min(newCorrect, newAnswers),
              }
            }),
          }))
        }
      }, 8000)

      return () => clearInterval(progressInterval)
    }

    const cleanup = simulateSocketEvents()

    return () => {
      cleanup()
      // In a real app: socket.disconnect()
    }
  }, [toast, isQuizEnded])

  const copyQuizCode = () => {
    navigator.clipboard.writeText(quiz.code)
    toast({
      title: "Quiz code copied",
      description: "The quiz code has been copied to your clipboard",
    })
  }

  const endQuiz = () => {
    // In a real app, you would send a socket event to end the quiz
    setIsQuizEnded(true)
    toast({
      title: "Quiz ended",
      description: "The quiz has been ended for all participants",
    })

    // Redirect to results page
    // router.push(`/teacher/quizzes/${params.id}/results`);
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
              <h1 className="text-3xl font-bold tracking-tight">{quiz.title}</h1>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span>Code: {quiz.code}</span>
              <Button variant="ghost" size="sm" onClick={copyQuizCode}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="font-mono">{timeLeft}</span>
            </div>
            <Button variant="destructive" onClick={endQuiz}>
              End Quiz
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Participants ({quiz.participants.length})</CardTitle>
              <CardDescription>Real-time progress of quiz participants</CardDescription>
            </CardHeader>
            <CardContent className="max-h-[400px] overflow-y-auto">
              <div className="space-y-4">
                {quiz.participants.map((participant) => (
                  <div key={participant.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{participant.name}</span>
                      {participant.score !== null ? (
                        <Badge>{participant.score}%</Badge>
                      ) : (
                        <span className="text-sm text-muted-foreground">{participant.progress}% complete</span>
                      )}
                    </div>
                    <Progress value={participant.progress} className="h-2" />
                    {participant.completedAt && (
                      <p className="text-xs text-muted-foreground">
                        Completed at {new Date(participant.completedAt).toLocaleTimeString()}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Question Statistics</CardTitle>
              <CardDescription>Performance data for each question</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {quiz.questionStats.map((stat, index) => {
                  const correctPercentage =
                    stat.totalAnswers > 0 ? Math.round((stat.correctAnswers / stat.totalAnswers) * 100) : 0

                  return (
                    <div key={stat.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Question {index + 1}</span>
                        <span className="text-sm">
                          {stat.correctAnswers}/{stat.totalAnswers} correct ({correctPercentage}%)
                        </span>
                      </div>
                      <div className="flex h-2 items-center space-x-1">
                        <div
                          className="h-full bg-green-500 rounded-l-full"
                          style={{ width: `${correctPercentage}%` }}
                        />
                        <div
                          className="h-full bg-red-500 rounded-r-full"
                          style={{ width: `${100 - correctPercentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(
                  (quiz.participants.filter((p) => p.score !== null).length / quiz.participants.length) * 100,
                )}
                %
              </div>
              <p className="text-xs text-muted-foreground">
                {quiz.participants.filter((p) => p.score !== null).length} of {quiz.participants.length} completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {quiz.participants.some((p) => p.score !== null)
                  ? Math.round(
                      quiz.participants.filter((p) => p.score !== null).reduce((sum, p) => sum + (p.score || 0), 0) /
                        quiz.participants.filter((p) => p.score !== null).length,
                    )
                  : 0}
                %
              </div>
              <p className="text-xs text-muted-foreground">
                Based on {quiz.participants.filter((p) => p.score !== null).length} completed quizzes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8:45</div>
              <p className="text-xs text-muted-foreground">Average completion time</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quiz Questions</CardTitle>
            <CardDescription>Questions included in this quiz</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {quiz.questionStats.map((stat, index) => (
                <div key={stat.id} className="rounded-lg border p-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Question {index + 1}</h3>
                    <Badge variant="outline">
                      {stat.correctAnswers}/{stat.totalAnswers} correct
                    </Badge>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground">{stat.text}</p>
                    <div className="mt-3 space-y-2">
                      {stat.options?.map((option, optIndex) => (
                        <div key={optIndex} className="flex items-center justify-between p-2 rounded-md border">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${option.isCorrect ? 'bg-green-500' : 'bg-red-500'}`} />
                            <span className={`text-sm ${option.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                              {option.text}
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {option.selectedCount} selected
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4">
                    <Progress 
                      value={(stat.correctAnswers / stat.totalAnswers) * 100} 
                      className="h-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {Math.round((stat.correctAnswers / stat.totalAnswers) * 100)}% correct
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </TeacherLayout>
  )
}

