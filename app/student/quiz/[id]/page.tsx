"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { StudentLayout } from "@/components/layouts/student-layout"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Clock } from "lucide-react"
import { use } from 'react'

interface Question {
  id: string
  type: 'multiple-choice' | 'true-false' | 'numerical' | 'short-answer'
  text: string
  options: string[]
}

interface QuizData {
  id: string
  title: string
  timeLimit: number
  questions: Question[]
}

export default function TakeQuiz({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const { toast } = useToast()
  const [quizData, setQuizData] = useState<QuizData | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await fetch(`/api/quizzes/${resolvedParams.id}`);
        if (!response.ok) {
          throw new Error('Failed to load quiz');
        }
        const data = await response.json();
        setQuizData(data);
        setTimeLeft(data.timeLimit * 60); // Convert minutes to seconds
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load quiz. Please try again.",
          variant: "destructive",
        });
        router.push('/student/join');
      }
    };

    fetchQuiz();
  }, [resolvedParams.id, router, toast]);

  // Timer effect
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = async () => {
    if (!quizData) return;
    
    setIsSubmitting(true);
    try {
      // Calculate score for demo quiz
      let score = 0;
      let totalQuestions = quizData.questions.length;
      
      if (quizData.id === "DEMO123") {
        // Calculate score based on correct answers
        quizData.questions.forEach((question) => {
          const userAnswer = answers[question.id];
          let correctAnswer = "";
          
          // Handle different question types
          switch (question.type) {
            case 'multiple-choice':
            case 'true-false':
              correctAnswer = question.options?.[0] || "";
              break;
            case 'numerical':
              correctAnswer = "8"; // For atomic number of Oxygen
              break;
            case 'short-answer':
              correctAnswer = "photosynthesis"; // For the plant food process
              break;
          }
          
          if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
            score += 1;
          }
        });
        
        // Convert to percentage
        score = (score / totalQuestions) * 100;
        
        const timestamp = Date.now();
        const titles = [
          "History Quiz: Ancient Civilizations",
          "Mathematics: Algebra Basics",
          "English Literature: Shakespeare's Works",
          "Geography: World Capitals",
          "Biology: Human Anatomy"
        ];
        const title = titles[timestamp % titles.length];
        
        const demoResults = {
          id: `DEMO_${timestamp}`,
          score: score,
          timeSpent: quizData.timeLimit * 60 - (timeLeft || 0),
          submittedAt: new Date().toISOString(),
          quiz: {
            title: title,
            questions: quizData.questions.map(q => ({
              id: q.id,
              text: q.text,
              correctAnswer: q.type === 'multiple-choice' || q.type === 'true-false' 
                ? q.options?.[0] || "" 
                : q.type === 'numerical' 
                  ? "8" 
                  : "photosynthesis",
              type: q.type
            }))
          },
          answers: answers
        };
        
        // Get existing demo results
        const existingResults = localStorage.getItem('demoQuizResults');
        let allResults = [];
        
        if (existingResults) {
          try {
            allResults = JSON.parse(existingResults);
            if (!Array.isArray(allResults)) {
              allResults = [allResults]; // Convert single result to array
            }
          } catch (e) {
            console.error('Error parsing existing results:', e);
            allResults = [];
          }
        }
        
        // Add new result
        allResults.push(demoResults);
        
        // Store all results back
        localStorage.setItem('demoQuizResults', JSON.stringify(allResults));
        
        router.push(`/student/results/${demoResults.id}`);
        return;
      }

      // For non-demo quizzes, submit to API
      const response = await fetch('/api/quizzes/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quizId: quizData.id,
          answers,
          timeSpent: quizData.timeLimit * 60 - (timeLeft || 0)
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit quiz');
      }

      const result = await response.json();
      router.push(`/student/results/${result.attemptId}`);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast({
        title: "Error",
        description: "Failed to submit quiz. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!quizData) {
    return (
      <StudentLayout>
        <div className="container py-10">
          <Card>
            <CardContent className="py-10">
              <p className="text-center">Loading quiz...</p>
            </CardContent>
          </Card>
        </div>
      </StudentLayout>
    );
  }

  const currentQ = quizData.questions[currentQuestion];

  return (
    <StudentLayout>
      <div className="container max-w-3xl py-10">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{quizData.title}</CardTitle>
                <CardDescription>
                  Question {currentQuestion + 1} of {quizData.questions.length}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>
                  {Math.floor((timeLeft || 0) / 60)}:
                  {String((timeLeft || 0) % 60).padStart(2, '0')}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-lg font-medium">{currentQ.text}</div>

            {currentQ.type === 'multiple-choice' || currentQ.type === 'true-false' ? (
              <RadioGroup
                value={answers[currentQ.id] || ""}
                onValueChange={(value) => handleAnswer(currentQ.id, value)}
              >
                {currentQ.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`}>{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            ) : currentQ.type === 'numerical' ? (
              <Input
                type="number"
                value={answers[currentQ.id] || ""}
                onChange={(e) => handleAnswer(currentQ.id, e.target.value)}
                placeholder="Enter your answer"
              />
            ) : (
              <Input
                type="text"
                value={answers[currentQ.id] || ""}
                onChange={(e) => handleAnswer(currentQ.id, e.target.value)}
                placeholder="Enter your answer"
              />
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentQuestion(prev => prev - 1)}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>
            {currentQuestion < quizData.questions.length - 1 ? (
              <Button
                onClick={() => setCurrentQuestion(prev => prev + 1)}
                disabled={!answers[currentQ.id]}
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !answers[currentQ.id]}
              >
                {isSubmitting ? "Submitting..." : "Submit Quiz"}
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </StudentLayout>
  );
} 