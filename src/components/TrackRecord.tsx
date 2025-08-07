import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Progress } from "./ui/progress"
import { Calendar, Clock, Target, TrendingUp, TrendingDown, Award, Flame, CheckCircle, Timer, BarChart3, ChevronLeft, ChevronRight, Activity } from 'lucide-react'

// Types for track record data
interface DayRecord {
  date: string
  dayName: string
  focusSessions: number
  totalFocusTime: number // in minutes
  tasksCompleted: number
  totalTasks: number
  breaksTaken: number
  productivity: number // percentage
  streak: boolean
}

interface WeeklyStats {
  totalSessions: number
  totalFocusTime: number
  totalTasks: number
  completedTasks: number
  averageProductivity: number
  currentStreak: number
  bestDay: string
  improvement: number // percentage change from last week
}

// Mock data - this will be replaced with API calls
const mockWeeklyData: DayRecord[] = [
  {
    date: "2024-01-15",
    dayName: "Mon",
    focusSessions: 8,
    totalFocusTime: 200,
    tasksCompleted: 6,
    totalTasks: 8,
    breaksTaken: 8,
    productivity: 85,
    streak: true,
  },
  {
    date: "2024-01-16",
    dayName: "Tue",
    focusSessions: 6,
    totalFocusTime: 150,
    tasksCompleted: 4,
    totalTasks: 6,
    breaksTaken: 6,
    productivity: 78,
    streak: true,
  },
  {
    date: "2024-01-17",
    dayName: "Wed",
    focusSessions: 10,
    totalFocusTime: 250,
    tasksCompleted: 8,
    totalTasks: 9,
    breaksTaken: 10,
    productivity: 92,
    streak: true,
  },
  {
    date: "2024-01-18",
    dayName: "Thu",
    focusSessions: 4,
    totalFocusTime: 100,
    tasksCompleted: 3,
    totalTasks: 5,
    breaksTaken: 4,
    productivity: 65,
    streak: false,
  },
  {
    date: "2024-01-19",
    dayName: "Fri",
    focusSessions: 7,
    totalFocusTime: 175,
    tasksCompleted: 5,
    totalTasks: 7,
    breaksTaken: 7,
    productivity: 82,
    streak: true,
  },
  {
    date: "2024-01-20",
    dayName: "Sat",
    focusSessions: 5,
    totalFocusTime: 125,
    tasksCompleted: 3,
    totalTasks: 4,
    breaksTaken: 5,
    productivity: 88,
    streak: true,
  },
  {
    date: "2024-01-21",
    dayName: "Sun",
    focusSessions: 3,
    totalFocusTime: 75,
    tasksCompleted: 2,
    totalTasks: 3,
    breaksTaken: 3,
    productivity: 75,
    streak: true,
  },
]

const mockWeeklyStats: WeeklyStats = {
  totalSessions: 43,
  totalFocusTime: 1075, // 17.9 hours
  totalTasks: 42,
  completedTasks: 31,
  averageProductivity: 81,
  currentStreak: 6,
  bestDay: "Wednesday",
  improvement: 15, // 15% improvement from last week
}

export default function TrackRecord() {
  const [weeklyData, setWeeklyData] = useState<DayRecord[]>(mockWeeklyData)
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats>(mockWeeklyStats)
  const [currentWeek, setCurrentWeek] = useState(0) // 0 = current week, -1 = last week, etc.
  const [loading, setLoading] = useState(false)

  // Format time in hours and minutes
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  // Get week date range
  const getWeekRange = () => {
    const today = new Date()
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + (currentWeek * 7)))
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6)
    
    return {
      start: startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      end: endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
  }

  // Simulate API fetch
  const fetchWeeklyData = async (weekOffset: number) => {
    setLoading(true)
    // TODO: Replace with actual API call
    // const response = await fetch(`/api/track-record?week=${weekOffset}`)
    // const data = await response.json()
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // For now, return mock data
    setWeeklyData(mockWeeklyData)
    setWeeklyStats(mockWeeklyStats)
    setLoading(false)
  }

  // Handle week navigation
  const navigateWeek = (direction: 'prev' | 'next') => {
    const newWeek = direction === 'prev' ? currentWeek - 1 : currentWeek + 1
    if (newWeek <= 0) { // Don't allow future weeks
      setCurrentWeek(newWeek)
      fetchWeeklyData(newWeek)
    }
  }

  useEffect(() => {
    fetchWeeklyData(currentWeek)
  }, [currentWeek])

  const weekRange = getWeekRange()

  return (
    <div className="space-y-6">
      {/* Header with Week Navigation */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Track Record</h2>
          <p className="text-gray-400">Your productivity journey over time</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateWeek('prev')}
            className="border-gray-600 hover:bg-gray-800"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          <div className="text-center">
            <div className="font-semibold">
              {weekRange.start} - {weekRange.end}
            </div>
            <div className="text-sm text-gray-400">
              {currentWeek === 0 ? 'This Week' : `${Math.abs(currentWeek)} week${Math.abs(currentWeek) > 1 ? 's' : ''} ago`}
            </div>
          </div>
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateWeek('next')}
            disabled={currentWeek >= 0}
            className="border-gray-600 hover:bg-gray-800 disabled:opacity-50"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        </div>
      ) : (
        <>
          {/* Weekly Overview Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-purple-400">{weeklyStats.totalSessions}</div>
                    <div className="text-sm text-gray-400">Focus Sessions</div>
                  </div>
                  <Timer className="w-8 h-8 text-purple-400" />
                </div>
                <div className="mt-2 flex items-center text-xs">
                  {weeklyStats.improvement > 0 ? (
                    <TrendingUp className="w-3 h-3 text-green-400 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-400 mr-1" />
                  )}
                  <span className={weeklyStats.improvement > 0 ? "text-green-400" : "text-red-400"}>
                    {Math.abs(weeklyStats.improvement)}% vs last week
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-blue-400">{formatTime(weeklyStats.totalFocusTime)}</div>
                    <div className="text-sm text-gray-400">Focus Time</div>
                  </div>
                  <Clock className="w-8 h-8 text-blue-400" />
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  Avg: {formatTime(Math.round(weeklyStats.totalFocusTime / 7))} per day
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-green-400">{weeklyStats.completedTasks}</div>
                    <div className="text-sm text-gray-400">Tasks Done</div>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  {weeklyStats.completedTasks}/{weeklyStats.totalTasks} total tasks
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-orange-400">{weeklyStats.currentStreak}</div>
                    <div className="text-sm text-gray-400">Day Streak</div>
                  </div>
                  <Flame className="w-8 h-8 text-orange-400" />
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  Keep it going! 🔥
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Daily Breakdown */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Daily Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weeklyData.map((day, index) => (
                  <motion.div
                    key={day.date}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="text-center min-w-[60px]">
                        <div className="font-semibold">{day.dayName}</div>
                        <div className="text-xs text-gray-400">
                          {new Date(day.date).getDate()}
                        </div>
                      </div>
                      
                      {day.streak && (
                        <div className="flex items-center">
                          <Flame className="w-4 h-4 text-orange-400" />
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-6 flex-1 justify-center">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-purple-400">{day.focusSessions}</div>
                        <div className="text-xs text-gray-400">Sessions</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-lg font-semibold text-blue-400">{formatTime(day.totalFocusTime)}</div>
                        <div className="text-xs text-gray-400">Focus Time</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-lg font-semibold text-green-400">{day.tasksCompleted}/{day.totalTasks}</div>
                        <div className="text-xs text-gray-400">Tasks</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-center min-w-[80px]">
                        <div className="flex items-center space-x-2">
                          <Progress 
                            value={day.productivity} 
                            className="w-16 h-2"
                          />
                          <span className="text-sm font-medium">{day.productivity}%</span>
                        </div>
                        <div className="text-xs text-gray-400 mt-1">Productivity</div>
                      </div>
                      
                      <Badge 
                        variant={day.productivity >= 80 ? "default" : day.productivity >= 60 ? "secondary" : "destructive"}
                        className="min-w-[60px] justify-center"
                      >
                        {day.productivity >= 80 ? "Great" : day.productivity >= 60 ? "Good" : "Low"}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Weekly Insights */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Weekly Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-green-900/20 border border-green-700 rounded-lg">
                    <h4 className="font-semibold text-green-400 mb-2 flex items-center">
                      <Award className="w-4 h-4 mr-2" />
                      Best Performance
                    </h4>
                    <p className="text-sm text-gray-300">
                      Your most productive day was <strong>{weeklyStats.bestDay}</strong> with {weeklyData.find(d => d.dayName === 'Wed')?.productivity}% productivity!
                    </p>
                  </div>

                  <div className="p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
                    <h4 className="font-semibold text-blue-400 mb-2 flex items-center">
                      <Target className="w-4 h-4 mr-2" />
                      Consistency
                    </h4>
                    <p className="text-sm text-gray-300">
                      You maintained focus for an average of {formatTime(Math.round(weeklyStats.totalFocusTime / weeklyStats.totalSessions))} per session.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-purple-900/20 border border-purple-700 rounded-lg">
                    <h4 className="font-semibold text-purple-400 mb-2 flex items-center">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Progress
                    </h4>
                    <p className="text-sm text-gray-300">
                      {weeklyStats.improvement > 0 ? 
                        `Great job! You improved by ${weeklyStats.improvement}% compared to last week.` :
                        `You had ${Math.abs(weeklyStats.improvement)}% fewer sessions than last week. Let's get back on track!`
                      }
                    </p>
                  </div>

                  <div className="p-4 bg-orange-900/20 border border-orange-700 rounded-lg">
                    <h4 className="font-semibold text-orange-400 mb-2 flex items-center">
                      <Flame className="w-4 h-4 mr-2" />
                      Streak Status
                    </h4>
                    <p className="text-sm text-gray-300">
                      {weeklyStats.currentStreak > 0 ? 
                        `Amazing! You're on a ${weeklyStats.currentStreak}-day streak. Keep the momentum going!` :
                        "Start a new streak today! Consistency is key to building lasting habits."
                      }
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
