"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import {
  Menu,
  Plus,
  Home,
  Trophy,
  BookOpen,
  Target,
  Clock,
  Share2,
  ArrowRight,
  CheckCircle,
  XCircle,
  GraduationCap,
  Monitor,
  Heart,
  User,
} from "lucide-react"

// Types
interface AppUser {
  id: string
  name: string
  email: string
  solvedQuizzes: number
  createdQuizzes: number
  correctPercentage: number
}

interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  category: string
  difficulty: string
  createdBy: string
}

interface Quiz {
  id: string
  questions: Question[]
  category: string
  difficulty: string
}

type Screen =
  | "auth"
  | "home"
  | "create-quiz"
  | "category-selection"
  | "difficulty-selection"
  | "quiz-playing"
  | "quiz-result"

type AuthMode = "login" | "signup"

// Sample data
const sampleQuestions: Question[] = [
  {
    id: "1",
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: 2,
    category: "education",
    difficulty: "easy",
    createdBy: "system",
  },
  {
    id: "2",
    question: "Which team won the FIFA World Cup 2022?",
    options: ["Brazil", "Argentina", "France", "Germany"],
    correctAnswer: 1,
    category: "sports",
    difficulty: "medium",
    createdBy: "system",
  },
  {
    id: "3",
    question: "What does HTML stand for?",
    options: [
      "Hyper Text Markup Language",
      "High Tech Modern Language",
      "Home Tool Markup Language",
      "Hyperlink and Text Markup Language",
    ],
    correctAnswer: 0,
    category: "tech",
    difficulty: "easy",
    createdBy: "system",
  },
  {
    id: "4",
    question: "What is the most popular programming language in 2024?",
    options: ["Python", "JavaScript", "Java", "C++"],
    correctAnswer: 1,
    category: "tech",
    difficulty: "medium",
    createdBy: "system",
  },
]

export default function QuizApp() {
  // State management
  const [currentScreen, setCurrentScreen] = useState<Screen>("auth")
  const [authMode, setAuthMode] = useState<AuthMode>("login")
  const [user, setUser] = useState<AppUser | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // Quiz creation state
  const [newQuestion, setNewQuestion] = useState("")
  const [newOptions, setNewOptions] = useState(["", "", "", ""])
  const [correctAnswer, setCorrectAnswer] = useState<number | null>(null)
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedDifficulty, setSelectedDifficulty] = useState("")

  // Quiz playing state
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [timeLeft, setTimeLeft] = useState(20)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  // Auth form state
  const [authForm, setAuthForm] = useState({
    name: "",
    email: "",
    password: "",
  })

  // Timer effect
  useEffect(() => {
    if (currentScreen === "quiz-playing" && timeLeft > 0 && !showResult) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && currentScreen === "quiz-playing" && !showResult) {
      handleTimeUp()
    }
  }, [timeLeft, currentScreen, showResult])

  // Categories
  const categories = [
    { id: "fun", name: "Fun", icon: Heart, color: "bg-pink-500" },
    { id: "sports", name: "Sports", icon: Trophy, color: "bg-green-500" },
    { id: "education", name: "Education", icon: GraduationCap, color: "bg-blue-500" },
    { id: "tech", name: "Tech", icon: Monitor, color: "bg-purple-500" },
  ]

  // Auth functions
  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate authentication
    const newUser: AppUser = {
      id: "1",
      name: authForm.name || "John Doe",
      email: authForm.email,
      solvedQuizzes: 15,
      createdQuizzes: 3,
      correctPercentage: 78,
    }
    setUser(newUser)
    setCurrentScreen("home")
  }

  // Quiz creation functions
  const handleCreateQuiz = () => {
    if (
      !newQuestion ||
      newOptions.some((opt) => !opt) ||
      correctAnswer === null ||
      !selectedCategory ||
      !selectedDifficulty
    ) {
      alert("Please fill all fields")
      return
    }

    const question: Question = {
      id: Date.now().toString(),
      question: newQuestion,
      options: newOptions,
      correctAnswer,
      category: selectedCategory,
      difficulty: selectedDifficulty,
      createdBy: user?.id || "",
    }

    // Add to sample questions (in real app, this would be API call)
    sampleQuestions.push(question)

    // Reset form
    setNewQuestion("")
    setNewOptions(["", "", "", ""])
    setCorrectAnswer(null)
    setSelectedCategory("")
    setSelectedDifficulty("")

    alert("Quiz question created successfully!")
    setIsDrawerOpen(false)
    setCurrentScreen("home")
  }

  // Quiz playing functions
  const startQuiz = (category: string, difficulty: string) => {
    const filteredQuestions = sampleQuestions.filter((q) => q.category === category && q.difficulty === difficulty)

    if (filteredQuestions.length === 0) {
      alert("No questions available for this category and difficulty")
      return
    }

    const quiz: Quiz = {
      id: Date.now().toString(),
      questions: filteredQuestions,
      category,
      difficulty,
    }

    setCurrentQuiz(quiz)
    setCurrentQuestionIndex(0)
    setScore(0)
    setTimeLeft(20)
    setSelectedAnswer(null)
    setShowResult(false)
    setCurrentScreen("quiz-playing")
  }

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
  }

  const handleTimeUp = () => {
    setIsCorrect(false)
    setShowResult(true)
    setTimeout(() => {
      nextQuestion()
    }, 2000)
  }

  const submitAnswer = () => {
    if (selectedAnswer === null) return

    const correct = selectedAnswer === currentQuiz!.questions[currentQuestionIndex].correctAnswer
    setIsCorrect(correct)
    if (correct) setScore(score + 1)
    setShowResult(true)

    setTimeout(() => {
      nextQuestion()
    }, 2000)
  }

  const nextQuestion = () => {
    if (currentQuestionIndex < currentQuiz!.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer(null)
      setTimeLeft(20)
      setShowResult(false)
    } else {
      setCurrentScreen("quiz-result")
    }
  }

  const shareQuiz = () => {
    if (navigator.share) {
      navigator.share({
        title: "Quiz Challenge",
        text: `I just completed a ${currentQuiz?.category} quiz! Try it yourself.`,
        url: window.location.href,
      })
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href)
      alert("Quiz link copied to clipboard!")
    }
  }

  // Auth Screen
  if (currentScreen === "auth") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{authMode === "login" ? "Welcome Back" : "Create Account"}</CardTitle>
            <CardDescription>
              {authMode === "login" ? "Sign in to continue" : "Join our quiz community"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAuth} className="space-y-4">
              {authMode === "signup" && (
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={authForm.name}
                    onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                    required
                  />
                </div>
              )}
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={authForm.email}
                  onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={authForm.password}
                  onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                {authMode === "login" ? "Sign In" : "Sign Up"}
              </Button>
            </form>
            <div className="mt-4 text-center">
              <Button variant="link" onClick={() => setAuthMode(authMode === "login" ? "signup" : "login")}>
                {authMode === "login" ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Home Screen
  if (currentScreen === "home") {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-3">
                <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Menu className="w-5 h-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left">
                    <SheetHeader>
                      <SheetTitle>Menu</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6 space-y-4">
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => {
                          setCurrentScreen("home")
                          setIsDrawerOpen(false)
                        }}
                      >
                        <Home className="w-4 h-4 mr-2" />
                        Home
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => {
                          setCurrentScreen("create-quiz")
                          setIsDrawerOpen(false)
                        }}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Create Quiz
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>
                <h1 className="text-xl font-semibold">Quiz App</h1>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-gray-600" />
                <span className="font-medium">{user?.name}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, {user?.name}!</h2>
            <p className="text-gray-600">Ready for your next quiz challenge?</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Success Rate</p>
                    <p className="text-3xl font-bold text-green-600">{user?.correctPercentage}%</p>
                  </div>
                  <Target className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Solved Quizzes</p>
                    <p className="text-3xl font-bold text-blue-600">{user?.solvedQuizzes}</p>
                  </div>
                  <BookOpen className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Created Quizzes</p>
                    <p className="text-3xl font-bold text-purple-600">{user?.createdQuizzes}</p>
                  </div>
                  <Plus className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-xl font-semibold mb-6">Choose a Category</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category) => {
                const Icon = category.icon
                return (
                  <Card
                    key={category.id}
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => {
                      setSelectedCategory(category.id)
                      setCurrentScreen("difficulty-selection")
                    }}
                  >
                    <CardContent className="p-6 text-center">
                      <div
                        className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center mx-auto mb-4`}
                      >
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h4 className="text-lg font-semibold mb-2">{category.name}</h4>
                      <p className="text-gray-600 text-sm">Test your knowledge</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Create Quiz Screen
  if (currentScreen === "create-quiz") {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Button variant="ghost" onClick={() => setCurrentScreen("home")}>
                ← Back to Home
              </Button>
              <h1 className="text-xl font-semibold">Create Quiz</h1>
              <div></div>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardHeader>
              <CardTitle>Add New Question</CardTitle>
              <CardDescription>Create a new quiz question for the community</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="question">Question</Label>
                <Textarea
                  id="question"
                  placeholder="Enter your question here..."
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                />
              </div>

              <div>
                <Label>Options</Label>
                <div className="space-y-3 mt-2">
                  {newOptions.map((option, index) => (
                    <Input
                      key={index}
                      placeholder={`Option ${index + 1}`}
                      value={option}
                      onChange={(e) => {
                        const updatedOptions = [...newOptions]
                        updatedOptions[index] = e.target.value
                        setNewOptions(updatedOptions)
                      }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <Label>Correct Answer</Label>
                <RadioGroup
                  value={correctAnswer?.toString()}
                  onValueChange={(value) => setCorrectAnswer(Number.parseInt(value))}
                >
                  {newOptions.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={index.toString()} id={`correct-${index}`} />
                      <Label htmlFor={`correct-${index}`}>
                        Option {index + 1}: {option || `Option ${index + 1}`}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Category</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Difficulty</Label>
                  <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="tough">Tough</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={handleCreateQuiz} className="w-full" size="lg">
                Submit Question
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Difficulty Selection Screen
  if (currentScreen === "difficulty-selection") {
    const category = categories.find((c) => c.id === selectedCategory)

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className={`w-16 h-16 ${category?.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
              {category && <category.icon className="w-8 h-8 text-white" />}
            </div>
            <CardTitle className="text-2xl">{category?.name} Quiz</CardTitle>
            <CardDescription>Choose your difficulty level</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => startQuiz(selectedCategory, "easy")}
              variant="outline"
              className="w-full h-16 text-left"
            >
              <div>
                <div className="font-semibold text-green-600">Easy</div>
                <div className="text-sm text-gray-600">Perfect for beginners</div>
              </div>
            </Button>
            <Button
              onClick={() => startQuiz(selectedCategory, "medium")}
              variant="outline"
              className="w-full h-16 text-left"
            >
              <div>
                <div className="font-semibold text-yellow-600">Medium</div>
                <div className="text-sm text-gray-600">Good challenge level</div>
              </div>
            </Button>
            <Button
              onClick={() => startQuiz(selectedCategory, "tough")}
              variant="outline"
              className="w-full h-16 text-left"
            >
              <div>
                <div className="font-semibold text-red-600">Tough</div>
                <div className="text-sm text-gray-600">For experts only</div>
              </div>
            </Button>
            <Button variant="ghost" onClick={() => setCurrentScreen("home")} className="w-full">
              Back to Categories
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Quiz Playing Screen
  if (currentScreen === "quiz-playing" && currentQuiz) {
    const question = currentQuiz.questions[currentQuestionIndex]
    const progress = ((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <Badge variant="outline" className="capitalize">
                {currentQuiz.category} - {currentQuiz.difficulty}
              </Badge>
              <div className="flex items-center gap-2 text-sm font-medium">
                <Clock className="w-4 h-4" />
                <span className={timeLeft <= 5 ? "text-red-600" : "text-gray-600"}>{timeLeft}s</span>
              </div>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">
                Question {currentQuestionIndex + 1} of {currentQuiz.questions.length}
              </span>
              <span className="text-sm font-medium">Score: {score}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Question Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl leading-relaxed">{question.question}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!showResult ? (
                <>
                  <RadioGroup
                    value={selectedAnswer?.toString()}
                    onValueChange={(value) => handleAnswerSelect(Number.parseInt(value))}
                  >
                    {question.options.map((option, index) => (
                      <div
                        key={index}
                        className={`flex items-center space-x-3 rounded-lg border p-4 transition-colors cursor-pointer hover:bg-gray-50 ${
                          selectedAnswer === index ? "bg-blue-100 border-blue-500" : ""
                        }`}
                      >
                        <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                        <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                  <Button onClick={submitAnswer} disabled={selectedAnswer === null} className="w-full" size="lg">
                    Submit Answer
                  </Button>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="mb-4">
                    {isCorrect ? (
                      <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                    ) : (
                      <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
                    )}
                  </div>
                  <div className="text-2xl font-bold mb-2">{isCorrect ? "Correct!" : "Wrong Answer"}</div>
                  <div className="text-gray-600 mb-6">
                    {!isCorrect && `Correct answer: ${question.options[question.correctAnswer]}`}
                  </div>
                  <div className="space-y-3">
                    <Button onClick={nextQuestion} className="w-full">
                      <ArrowRight className="w-4 h-4 mr-2" />
                      {currentQuestionIndex < currentQuiz.questions.length - 1 ? "Next Question" : "View Results"}
                    </Button>
                    <Button onClick={shareQuiz} variant="outline" className="w-full">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share with Friend
                    </Button>
                    <Button onClick={() => setCurrentScreen("home")} variant="ghost" className="w-full">
                      <Home className="w-4 h-4 mr-2" />
                      Back to Home
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Quiz Result Screen
  if (currentScreen === "quiz-result" && currentQuiz) {
    const percentage = Math.round((score / currentQuiz.questions.length) * 100)

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-2xl">Quiz Complete!</CardTitle>
            <CardDescription>
              {percentage >= 80 ? "Excellent work! 🎉" : percentage >= 60 ? "Good job! 👍" : "Keep practicing! 💪"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div
                className={`text-4xl font-bold mb-2 ${
                  percentage >= 80 ? "text-green-600" : percentage >= 60 ? "text-yellow-600" : "text-red-600"
                }`}
              >
                {score}/{currentQuiz.questions.length}
              </div>
              <div className="text-lg text-gray-600">{percentage}% Correct</div>
            </div>

            <div className="space-y-3">
              <Button onClick={() => setCurrentScreen("home")} className="w-full" size="lg">
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
              <Button onClick={shareQuiz} variant="outline" className="w-full">
                <Share2 className="w-4 h-4 mr-2" />
                Share Results
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return null
}
