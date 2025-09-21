"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, role: value }))
  }

  const generateUniqueEmail = () => {
    const timestamp = Date.now()
    const randomNum = Math.floor(Math.random() * 1000)
    setFormData((prev) => ({ ...prev, email: `user${timestamp}${randomNum}@example.com` }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Client-side validation with detailed feedback
    if (!formData.name || formData.name.length < 2) {
      toast({
        title: "Invalid Name",
        description: "Name must be at least 2 characters long. Please enter your full name.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      toast({
        title: "Invalid Email Format",
        description: "Please enter a valid email address (e.g., john@example.com)",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    if (!formData.password || formData.password.length < 6) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 6 characters long for security.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    if (!formData.role || !['teacher', 'student'].includes(formData.role)) {
      toast({
        title: "Role Required",
        description: "Please select whether you are a teacher or student.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    try {
      console.log('Submitting registration with data:', formData)
      
      toast({
        title: "Creating Account",
        description: `Creating ${formData.role} account for ${formData.name}...`,
      })
      
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        role: formData.role,
      }

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      })

      let data: any = {}
      try {
        data = await response.json()
      } catch (e) {
        // Non-JSON response (e.g., HTML error)
      }
      console.log('Registration response:', { status: response.status, data })

      if (!response.ok) {
        const errorMessage = data.details ? data.details.join(', ') : data.message || data.error || 'Registration failed'
        console.error('Registration failed:', errorMessage)
        
        toast({
          title: "Registration Failed",
          description: errorMessage,
          variant: "destructive",
        })
        return
      }

      // Success - show detailed success message
      toast({
        title: "Account Created Successfully!",
        description: `Welcome ${data.user.name}! Your ${data.user.role} account is ready. Redirecting to dashboard...`,
      })

      console.log('Registration successful for:', data.user.name, 'Role:', data.user.role)

      // Small delay to show success message before redirect
      setTimeout(() => {
        if (data?.user?.role === "teacher") {
          router.push("/teacher/dashboard")
        } else {
          router.push("/student/dashboard")
        }
      }, 2000)

    } catch (error) {
      console.error('Registration error:', error)
      toast({
        title: "Connection Error",
        description: "Network error or unexpected error occurred. Please check your connection and try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/40">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>Register to start creating or participating in quizzes</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                required
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="flex gap-2">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
                {/* <Button
                  type="button"
                  variant="outline"
                  onClick={generateUniqueEmail}
                  className="whitespace-nowrap"
                >
                  Generate
                </Button> */}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label>I am a:</Label>
              <RadioGroup value={formData.role} onValueChange={handleRoleChange} className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="student" id="student" />
                  <Label htmlFor="student">Student</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="teacher" id="teacher" />
                  <Label htmlFor="teacher">Teacher</Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Register"}
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary underline underline-offset-4">
                Login
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

