"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { TeacherLayout } from "@/components/layouts/teacher-layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, Trash2, Save, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

type QuestionType = "multiple-choice" | "true-false" | "numerical" | "short-answer"

interface Question {
  id: string
  type: QuestionType
  text: string
  options: string[]
  correctAnswer: string
}

export default function CreateQuiz() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [quizData, setQuizData] = useState({
    title: "",
    description: "",
    timeLimit: 10,
    shuffleQuestions: false,
    shuffleOptions: false,
  })

  const [questions, setQuestions] = useState<Question[]>([
    {
      id: "q1",
      type: "multiple-choice",
      text: "",
      options: ["", "", "", ""],
      correctAnswer: "",
    },
  ])

  const handleQuizDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setQuizData({ ...quizData, [name]: value })
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setQuizData({ ...quizData, [name]: checked })
  }

  const handleQuestionChange = (id: string, field: string, value: any) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, [field]: value } : q)))
  }

  const handleOptionChange = (questionId: string, index: number, value: string) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          const newOptions = [...q.options]
          newOptions[index] = value
          return { ...q, options: newOptions }
        }
        return q
      }),
    )
  }

  const handleCorrectAnswerChange = (questionId: string, value: string) => {
    setQuestions(questions.map((q) => (q.id === questionId ? { ...q, correctAnswer: value } : q)))
  }

  const addQuestion = () => {
    const newQuestion: Question = {
      id: `q${questions.length + 1}`,
      type: "multiple-choice",
      text: "",
      options: ["", "", "", ""],
      correctAnswer: "",
    }
    setQuestions([...questions, newQuestion])
  }

  const removeQuestion = (id: string) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((q) => q.id !== id))
    }
  }

  const handleTypeChange = (questionId: string, type: QuestionType) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          let options = q.options
          let correctAnswer = q.correctAnswer

          // Reset options based on question type
          if (type === "multiple-choice") {
            options = ["", "", "", ""]
            correctAnswer = ""
          } else if (type === "true-false") {
            options = ["True", "False"]
            correctAnswer = ""
          } else {
            options = []
            correctAnswer = ""
          }

          return { ...q, type, options, correctAnswer }
        }
        return q
      }),
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/quizzes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...quizData, questions }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create quiz');
      }

      const createdQuiz = await response.json();

      toast({
        title: "Quiz Created",
        description: `Quiz "${createdQuiz.title}" created successfully with code ${createdQuiz.code}.`,
      })

      router.push("/teacher/dashboard")

    } catch (error) {
        console.error("Error creating quiz:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        toast({
            title: "Error Creating Quiz",
            description: errorMessage,
            variant: "destructive",
        })
    } finally {
        setIsSubmitting(false)
    }
  }

  const renderQuestionOptions = (question: Question) => {
    switch (question.type) {
      case "multiple-choice":
      case "true-false":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Options</Label>
              {question.options.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={option}
                    onChange={(e) => handleOptionChange(question.id, index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCorrectAnswerChange(question.id, option)}
                    className={`min-w-[80px] ${
                      question.correctAnswer === option ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""
                    }`}
                  >
                    {question.correctAnswer === option ? "Correct" : "Set Correct"}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )

      case "numerical":
        return (
          <div className="space-y-2">
            <Label htmlFor={`${question.id}-correct-answer`}>Correct Answer (Number)</Label>
            <Input
              id={`${question.id}-correct-answer`}
              type="number"
              value={question.correctAnswer}
              onChange={(e) => handleCorrectAnswerChange(question.id, e.target.value)}
              placeholder="Enter the correct numerical answer"
            />
          </div>
        )

      case "short-answer":
        return (
          <div className="space-y-2">
            <Label htmlFor={`${question.id}-correct-answer`}>Correct Answer</Label>
            <Input
              id={`${question.id}-correct-answer`}
              value={question.correctAnswer}
              onChange={(e) => handleCorrectAnswerChange(question.id, e.target.value)}
              placeholder="Enter the correct answer"
            />
            <p className="text-xs text-muted-foreground">
              Student answers will be marked correct if they match this exactly (case insensitive).
            </p>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <TeacherLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Link href="/teacher/dashboard" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Create Quiz</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="details" className="space-y-6">
            <TabsList>
              <TabsTrigger value="details">Quiz Details</TabsTrigger>
              <TabsTrigger value="questions">Questions</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="details">
              <Card>
                <CardHeader>
                  <CardTitle>Quiz Information</CardTitle>
                  <CardDescription>Enter the basic information about your quiz</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Quiz Title</Label>
                    <Input
                      id="title"
                      name="title"
                      value={quizData.title}
                      onChange={handleQuizDataChange}
                      placeholder="e.g., Science Quiz: Chapter 5"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={quizData.description}
                      onChange={handleQuizDataChange}
                      placeholder="Provide a brief description of the quiz"
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timeLimit">Time Limit (minutes)</Label>
                    <Input
                      id="timeLimit"
                      name="timeLimit"
                      type="number"
                      min="1"
                      max="180"
                      value={quizData.timeLimit}
                      onChange={handleQuizDataChange}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="questions" className="space-y-6">
              {questions.map((question, index) => (
                <Card key={question.id} className="relative">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Question {index + 1}</CardTitle>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeQuestion(question.id)}
                        disabled={questions.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove question</span>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor={`${question.id}-type`}>Question Type</Label>
                      <Select
                        value={question.type}
                        onValueChange={(value) => handleTypeChange(question.id, value as QuestionType)}
                      >
                        <SelectTrigger id={`${question.id}-type`}>
                          <SelectValue placeholder="Select question type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                          <SelectItem value="true-false">True/False</SelectItem>
                          <SelectItem value="numerical">Numerical</SelectItem>
                          <SelectItem value="short-answer">Short Answer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`${question.id}-text`}>Question Text</Label>
                      <Textarea
                        id={`${question.id}-text`}
                        value={question.text}
                        onChange={(e) => handleQuestionChange(question.id, "text", e.target.value)}
                        placeholder="Enter your question here"
                        required
                      />
                    </div>

                    {renderQuestionOptions(question)}
                  </CardContent>
                </Card>
              ))}

              <Button type="button" variant="outline" onClick={addQuestion} className="w-full">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Question
              </Button>
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Quiz Settings</CardTitle>
                  <CardDescription>Configure additional settings for your quiz</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="shuffleQuestions">Shuffle Questions</Label>
                      <p className="text-sm text-muted-foreground">Randomize the order of questions for each student</p>
                    </div>
                    <Switch
                      id="shuffleQuestions"
                      checked={quizData.shuffleQuestions}
                      onCheckedChange={(checked) => handleSwitchChange("shuffleQuestions", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="shuffleOptions">Shuffle Answer Options</Label>
                      <p className="text-sm text-muted-foreground">
                        Randomize the order of answer options for multiple choice questions
                      </p>
                    </div>
                    <Switch
                      id="shuffleOptions"
                      checked={quizData.shuffleOptions}
                      onCheckedChange={(checked) => handleSwitchChange("shuffleOptions", checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" asChild>
                <Link href="/teacher/dashboard">Cancel</Link>
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                <Save className="mr-2 h-4 w-4" />
                {isSubmitting ? "Saving..." : "Save Quiz"}
              </Button>
            </div>
          </Tabs>
        </form>
      </div>
    </TeacherLayout>
  )
}

