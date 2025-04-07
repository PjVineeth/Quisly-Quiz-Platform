import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { LucideBook, LucideGraduationCap, LucideUsers } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Quisly</h1>
          <div className="flex gap-4">
            <Button variant="outline" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Register</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Unlock Knowledge, One Question at a Time!</h2>
          <p className="text-xl text-muted-foreground">
            An interactive Quisly that brings learning and competition together. Challenge yourself, track your progress, and become a master in your favorite topics!
          </p>
          <Button size="lg" className="mt-6" asChild>
            <Link href="/register">Start Now</Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LucideGraduationCap className="h-6 w-6" />
                For Students
              </CardTitle>
              <CardDescription>Join and participate in quizzes</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Join quizzes via unique link or code</li>
                <li>Participate in a distraction-free interface</li>
                <li>View real-time leaderboard and feedback</li>
                <li>Access your quiz history and results</li>
              </ul>
            </CardContent>
            {/* <CardFooter>
              <Button className="w-full" asChild>
                <Link href="/student/join">Join as Student</Link>
              </Button>
            </CardFooter> */}
          </Card>

          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LucideBook className="h-6 w-6" />
                For Educators
              </CardTitle>
              <CardDescription>Create and manage quizzes</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Create and edit quizzes with various question types</li>
                <li>Monitor quiz progress in real-time</li>
                <li>View detailed analytics and results</li>
                <li>Export grade sheets and reports</li>
              </ul>
            </CardContent>
            {/* <CardFooter>
              <Button className="w-full" asChild>
                <Link href="/teacher/dashboard">Create as Educator</Link>
              </Button>
            </CardFooter> */}
          </Card>

          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LucideUsers className="h-6 w-6" />
                For Organizations
              </CardTitle>
              <CardDescription>Team-building through quizzes</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Seamless intranet integration</li>
                <li>Customizable team challenges</li>
                <li>Track organizational learning progress</li>
                <li>Secure and private environment</li>
              </ul>
            </CardContent>
            {/* <CardFooter>
              <Button className="w-full" asChild>
                <Link href="/organization/signup">Join as Organization</Link>
              </Button>
            </CardFooter> */}
          </Card>
        </div>

        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Why Choose Our Platform?</h2>
          <div className="grid md:grid-cols-2 gap-8 mt-8">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Real-Time Leaderboards</h3>
              <p className="text-muted-foreground">Track scores, compare performance, and compete with friends or colleagues in real time.</p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Customizable Quizzes</h3>
              <p className="text-muted-foreground">Create and share personalized quizzes tailored to any topic or skill level.</p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Interactive Learning</h3>
              <p className="text-muted-foreground">Immerse yourself in thoughtfully designed quizzes that make learning enjoyable and effective.</p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Detailed Analytics</h3>
              <p className="text-muted-foreground">Get comprehensive insights into your performance and areas for improvement.</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground">© {new Date().getFullYear()} Quisly. All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="/privacy" className="text-muted-foreground hover:text-foreground">Privacy</Link>
              <Link href="/terms" className="text-muted-foreground hover:text-foreground">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

