import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"

// Mock data for upcoming quizzes
const upcomingQuizzes = [
  {
    id: "1",
    title: "History Quiz",
    subject: "History",
    date: "2024-03-20T10:00:00",
    teacher: "Mr. Smith",
  },
  {
    id: "2",
    title: "English Quiz",
    subject: "English",
    date: "2024-03-22T14:30:00",
    teacher: "Ms. Johnson",
  },
]

export function UpcomingQuizzes() {
  return (
    <div className="space-y-4">
      {upcomingQuizzes.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">No upcoming quizzes at the moment.</p>
          </CardContent>
        </Card>
      ) : (
        upcomingQuizzes.map((quiz) => (
          <Card key={quiz.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{quiz.title}</CardTitle>
                  <CardDescription>By {quiz.teacher}</CardDescription>
                </div>
                <Badge>{quiz.subject}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="mr-1 h-4 w-4" />
                <time dateTime={quiz.date}>
                  {new Date(quiz.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </time>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Set Reminder
              </Button>
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  )
} 