"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
<<<<<<< HEAD
import {
  loginWithAuth0,
  signupWithAuth0,
  setAuthData,
  type LoginCredentials,
  type SignupCredentials,
} from "@/services/auth0"
=======
import { useAuth0 } from "@auth0/auth0-react"
>>>>>>> 66ade86a8c5bc3c7ba36f001ba3d4339bc6b5f02
import {
  Timer,
  BarChart3,
  Calendar,
  CheckCircle,
  Play,
  ArrowRight,
  Star,
  Users,
  Zap,
  Target,
  TrendingUp,
  Shield,
  Globe,
  Brain,
  Award,
  ChevronDown,
  Menu,
  X,
} from "lucide-react"
import e from "cors"

interface PomodoroLandingPageProps {
  onLogin?: () => void;
}

export default function PomodoroLandingPage({ onLogin }: PomodoroLandingPageProps) {
  const { toast } = useToast()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
<<<<<<< HEAD
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showSignupModal, setShowSignupModal] = useState(false)
  const [loginForm, setLoginForm] = useState<LoginCredentials>({ email: "", password: "" })
  const [signupForm, setSignupForm] = useState<SignupCredentials>({ 
    name: "", 
    email: "", 
    password: "", 
    confirmPassword: "" 
  })
  const [isLoading, setIsLoading] = useState(false)

  // Authentication handlers
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const response = await loginWithAuth0(loginForm)
      
      if (response.success && response.user && response.token) {
        // Store auth data
        setAuthData(response.token, response.user)
        
        // Show success message
        toast({
          title: "Success!",
          description: "Welcome back! You've been successfully signed in.",
        })
        
        // Call the onLogin callback
        onLogin?.()
        setShowLoginModal(false)
        setLoginForm({ email: "", password: "" })
      } else {
        toast({
          title: "Login Failed",
          description: response.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Login failed:", error)
      toast({
        title: "Login Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const response = await signupWithAuth0(signupForm)
      
      if (response.success && response.user && response.token) {
        // Store auth data
        setAuthData(response.token, response.user)
        
        // Show success message
        toast({
          title: "Welcome!",
          description: "Your account has been created successfully!",
        })
        
        // Call the onLogin callback
        onLogin?.()
        setShowSignupModal(false)
        setSignupForm({ name: "", email: "", password: "", confirmPassword: "" })
      } else {
        toast({
          title: "Registration Failed",
          description: response.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Signup failed:", error)
      toast({
        title: "Registration Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }
=======
  const { user, loginWithRedirect, logout } = useAuth0()
>>>>>>> 66ade86a8c5bc3c7ba36f001ba3d4339bc6b5f02

  const features = [
    {
      icon: Timer,
      title: "Smart Pomodoro Timer",
      description: "Customizable focus sessions with beautiful animations and intelligent break reminders",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: CheckCircle,
      title: "Task Management",
      description: "Organize your work with an intuitive task board and real-time progress tracking",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Calendar,
      title: "Session Tracking",
      description: "Visual calendar integration showing your productivity patterns and daily streaks",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: BarChart3,
      title: "Analytics & Insights",
      description: "Detailed performance analysis with personalized improvement suggestions",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: Brain,
      title: "Focus Enhancement",
      description: "Science-backed techniques to improve concentration and reduce distractions",
      color: "from-indigo-500 to-purple-500",
    },
    {
      icon: Zap,
      title: "Productivity Boost",
      description: "Increase your output by up to 40% with structured work sessions",
      color: "from-yellow-500 to-orange-500",
    },
  ]

  const benefits = [
    {
      icon: Target,
      title: "Laser Focus",
      description: "Eliminate distractions and maintain deep concentration for extended periods",
    },
    {
      icon: TrendingUp,
      title: "Measurable Progress",
      description: "Track your productivity gains with detailed analytics and performance metrics",
    },
    {
      icon: Shield,
      title: "Burnout Prevention",
      description: "Built-in break reminders and workload management to maintain healthy work habits",
    },
    {
      icon: Award,
      title: "Goal Achievement",
      description: "Reach your objectives faster with structured time management and task prioritization",
    },
  ]

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Software Developer",
      company: "TechCorp",
      content: "FocusFlow transformed my productivity. I'm completing 40% more tasks and feeling less stressed.",
      rating: 5,
      avatar: "/placeholder.svg?height=60&width=60&text=SC",
    },
    {
      name: "Marcus Johnson",
      role: "Designer",
      company: "Creative Studio",
      content: "The analytics feature helped me identify my peak productivity hours. Game-changer!",
      rating: 5,
      avatar: "/placeholder.svg?height=60&width=60&text=MJ",
    },
    {
      name: "Emily Rodriguez",
      role: "Student",
      company: "University",
      content: "Perfect for studying! The break reminders keep me fresh and focused throughout long sessions.",
      rating: 5,
      avatar: "/placeholder.svg?height=60&width=60&text=ER",
    },
  ]

  const stats = [
    { number: "50K+", label: "Active Users" },
    { number: "2M+", label: "Focus Sessions" },
    { number: "40%", label: "Productivity Increase" },
    { number: "4.9", label: "App Store Rating" },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [testimonials.length])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-hidden">
      {/* Header */}
      <header className="relative z-50 px-6 py-4">
        <nav className="flex items-center justify-between max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Timer className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold">FocusFlow</span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-300 hover:text-white transition-colors">
              Features
            </a>
            <a href="#benefits" className="text-gray-300 hover:text-white transition-colors">
              Benefits
            </a>
            <a href="#testimonials" className="text-gray-300 hover:text-white transition-colors">
              Reviews
            </a>
            <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">
              Pricing
            </a>
          </div>


          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
          <Button
          onClick={(e) => loginWithRedirect()}
          className="hidden md:inline-flex items-center bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            login with Auth0
          </Button>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 bg-gray-800/95 backdrop-blur-sm rounded-lg border border-gray-700"
            >
              <div className="p-4 space-y-4">
                <a href="#features" className="block text-gray-300 hover:text-white transition-colors">
                  Features
                </a>
                <a href="#benefits" className="block text-gray-300 hover:text-white transition-colors">
                  Benefits
                </a>
                <a href="#testimonials" className="block text-gray-300 hover:text-white transition-colors">
                  Reviews
                </a>
                <a href="#pricing" className="block text-gray-300 hover:text-white transition-colors">
                  Pricing
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Badge className="mb-6 bg-purple-500/20 text-purple-300 border-purple-500/30">
                <Zap className="w-4 h-4 mr-2" />
                #1 Productivity App
              </Badge>

              <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                  Master Your
                </span>
                <br />
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Focus Journey
                </span>
              </h1>

              <p className="text-xl lg:text-2xl text-gray-300 mb-8 leading-relaxed">
                Transform your productivity with the ultimate Pomodoro companion. Built for deep work, designed for
                success, powered by intelligent insights.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 px-8 py-4 text-lg bg-transparent"
                >
                  <Play className="mr-2 w-5 h-5" />
                  Watch Demo
                </Button>
              </div>

              <div className="flex items-center space-x-6 text-sm text-gray-400">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                  Free 14-day trial
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                  No credit card required
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                  Cancel anytime
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="relative"
            >
              {/* App Preview Mockup */}
              <div className="relative mx-auto w-full max-w-md">
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 border border-gray-700 shadow-2xl">
                  <div className="text-center mb-6">
                    <div className="w-32 h-32 mx-auto mb-4 relative">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          stroke="currentColor"
                          strokeWidth="2"
                          fill="none"
                          className="text-gray-700"
                        />
                        <motion.circle
                          cx="50"
                          cy="50"
                          r="45"
                          stroke="currentColor"
                          strokeWidth="2"
                          fill="none"
                          strokeLinecap="round"
                          className="text-purple-500"
                          strokeDasharray={`${2 * Math.PI * 45}`}
                          strokeDashoffset={`${2 * Math.PI * 45 * 0.3}`}
                          animate={{
                            strokeDashoffset: [2 * Math.PI * 45 * 0.3, 2 * Math.PI * 45 * 0.7, 2 * Math.PI * 45 * 0.3],
                          }}
                          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="text-2xl font-mono font-bold">24:15</div>
                        <div className="text-xs text-gray-400">Focus Time</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-gray-700/50 rounded-lg">
                      <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Complete project proposal</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-700/30 rounded-lg">
                      <div className="w-4 h-4 border-2 border-gray-500 rounded-full"></div>
                      <span className="text-sm text-gray-400">Review design mockups</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-700/30 rounded-lg">
                      <div className="w-4 h-4 border-2 border-gray-500 rounded-full"></div>
                      <span className="text-sm text-gray-400">Prepare presentation</span>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <motion.div
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                  className="absolute -top-4 -right-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full p-3"
                >
                  <CheckCircle className="w-6 h-6" />
                </motion.div>

                <motion.div
                  animate={{ y: [10, -10, 10] }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 1 }}
                  className="absolute -bottom-4 -left-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full p-3"
                >
                  <BarChart3 className="w-6 h-6" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <Badge className="mb-4 bg-blue-500/20 text-blue-300 border-blue-500/30">
              <Star className="w-4 h-4 mr-2" />
              Powerful Features
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Everything You Need to
              <br />
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Maximize Productivity
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Discover the comprehensive suite of tools designed to transform your work habits and boost your focus.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300 h-full">
                  <CardContent className="p-6">
                    <div
                      className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-gradient-to-r from-gray-900/50 to-gray-800/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}>
              <Badge className="mb-4 bg-green-500/20 text-green-300 border-green-500/30">
                <TrendingUp className="w-4 h-4 mr-2" />
                Proven Results
              </Badge>
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                Why Choose
                <br />
                <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                  FocusFlow?
                </span>
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Join thousands of professionals who have transformed their productivity and achieved their goals with
                our scientifically-backed approach.
              </p>

              <div className="space-y-6">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-4"
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                      <p className="text-gray-400">{benefit.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} className="relative">
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700">
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div className="text-center p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                    <div className="text-2xl font-bold text-purple-400 mb-1">25min</div>
                    <div className="text-sm text-gray-400">Focus Sessions</div>
                  </div>
                  <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                    <div className="text-2xl font-bold text-green-400 mb-1">5min</div>
                    <div className="text-sm text-gray-400">Break Time</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                    <span className="text-sm">Today's Progress</span>
                    <Badge className="bg-green-500/20 text-green-300">8/10 sessions</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                    <span className="text-sm">Weekly Goal</span>
                    <Badge className="bg-blue-500/20 text-blue-300">42/50 sessions</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                    <span className="text-sm">Productivity Score</span>
                    <Badge className="bg-purple-500/20 text-purple-300">94%</Badge>
                  </div>
                </div>
              </div>

              {/* Floating Achievement */}
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                className="absolute -top-6 -right-6 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full p-4"
              >
                <Award className="w-8 h-8" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <Badge className="mb-4 bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
              <Users className="w-4 h-4 mr-2" />
              Loved by Users
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              What Our Users
              <br />
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Are Saying
              </span>
            </h2>
          </motion.div>

          <div className="relative max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-8 text-center">
                    <div className="flex justify-center mb-4">
                      {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <blockquote className="text-xl lg:text-2xl text-gray-300 mb-6 leading-relaxed">
                      "{testimonials[currentTestimonial].content}"
                    </blockquote>
                    <div className="flex items-center justify-center space-x-4">
                      <img
                        src={testimonials[currentTestimonial].avatar || "/placeholder.svg"}
                        alt={testimonials[currentTestimonial].name}
                        className="w-12 h-12 rounded-full"
                      />
                      <div className="text-left">
                        <div className="font-semibold">{testimonials[currentTestimonial].name}</div>
                        <div className="text-sm text-gray-400">
                          {testimonials[currentTestimonial].role} at {testimonials[currentTestimonial].company}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentTestimonial ? "bg-purple-500" : "bg-gray-600"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="pricing" className="py-20 bg-gradient-to-r from-purple-900/20 to-pink-900/20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Ready to Transform
              <br />
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Your Productivity?
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join over 50,000 professionals who have already revolutionized their work habits with FocusFlow.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg"
              >
                Start Your Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 px-8 py-4 text-lg bg-transparent"
              >
                Schedule Demo
                <Calendar className="ml-2 w-5 h-5" />
              </Button>
            </div>

            <div className="flex items-center justify-center space-x-8 text-sm text-gray-400">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                14-day free trial
              </div>
              <div className="flex items-center">
                <Shield className="w-4 h-4 mr-2 text-green-400" />
                No credit card required
              </div>
              <div className="flex items-center">
                <Globe className="w-4 h-4 mr-2 text-green-400" />
                Available worldwide
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Timer className="w-5 h-5" />
                </div>
                <span className="text-xl font-bold">FocusFlow</span>
              </div>
              <p className="text-gray-400 text-sm">
                The ultimate productivity companion for professionals who demand excellence.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Integrations
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    API
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Community
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Status
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2024 FocusFlow. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* All authentication modals and handlers removed */}

      {/* Scroll to Top Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed bottom-8 right-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 z-50"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <ChevronDown className="w-5 h-5 rotate-180" />
      </motion.button>
    </div>
  )
}
