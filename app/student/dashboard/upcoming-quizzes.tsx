import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Users } from "lucide-react"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface ActiveQuiz {
  _id: string;
  title: string;
  description?: string;
  code: string;
  timeLimit: number;
  status: 'active';
  updatedAt: string;
}

export function UpcomingQuizzes() {
  const [activeQuizzes, setActiveQuizzes] = useState<ActiveQuiz[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchActiveQuizzes();
  }, []);

  const fetchActiveQuizzes = async () => {
    try {
      const response = await fetch('/api/quizzes/active');
      if (response.ok) {
        const data = await response.json();
        setActiveQuizzes(data);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch active quizzes",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching active quizzes:', error);
      toast({
        title: "Error",
        description: "Failed to fetch active quizzes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {loading ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">Loading active quizzes...</p>
          </CardContent>
        </Card>
      ) : activeQuizzes.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">No active quizzes at the moment.</p>
            <p className="text-sm text-muted-foreground mt-2">
              Ask your teacher for a quiz code to join an active quiz.
            </p>
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
                <Badge variant="default">Active Now</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {quiz.description && (
                  <p className="text-sm text-muted-foreground">{quiz.description}</p>
                )}
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="mr-1 h-4 w-4" />
                  <span>Time Limit: {quiz.timeLimit} minutes</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="mr-1 h-4 w-4" />
                  <span>Started: {new Date(quiz.updatedAt).toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href={`/student/quiz/${quiz.code}`}>
                  Join Quiz
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  )
} 