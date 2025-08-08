import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Progress } from "./ui/progress"
import { Calendar, Clock, Target, TrendingUp, TrendingDown, Award, Flame, CheckCircle, Timer, BarChart3, ChevronLeft, ChevronRight, Activity } from 'lucide-react'
import { useTasks, usePomodoroSessions } from "@/hooks/use-api"

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

/**
 * Returns a new Date set to 00:00:00.000 for the given date (local time).
 */
const startOfDay = (date: Date): Date => {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

/**
 * Returns a new Date set to 23:59:59.999 for the given date (local time).
 */
const endOfDay = (date: Date): Date => {
  const d = new Date(date)
  d.setHours(23, 59, 59, 999)
  return d
}

/**
 * Get start and end of the week for a given offset.
 * Week starts on Sunday to match existing UI (0 = Sunday, 6 = Saturday).
 */
const getWeekWindow = (weekOffset: number): { start: Date; end: Date } => {
  const base = new Date()
  // Shift by full weeks based on offset
  base.setDate(base.getDate() + weekOffset * 7)
  const start = new Date(base)
  start.setDate(base.getDate() - base.getDay())
  start.setHours(0, 0, 0, 0)
  const end = new Date(start)
  end.setDate(start.getDate() + 6)
  end.setHours(23, 59, 59, 999)
  return { start, end }
}

/**
 * Get an array of seven dates representing each day in the given week window.
 */
const getWeekDays = (start: Date): Date[] => {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    d.setHours(0, 0, 0, 0)
    return d
  })
}

export default function TrackRecord() {
  // Load tasks and sessions (sessions optional). Errors are handled gracefully.
  const { tasks, isLoading: isLoadingTasks, error: tasksError } = useTasks()
  const { sessions, isLoading: isLoadingSessions } = usePomodoroSessions()

  const [weeklyData, setWeeklyData] = useState<DayRecord[]>([])
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats>({
    totalSessions: 0,
    totalFocusTime: 0,
    totalTasks: 0,
    completedTasks: 0,
    averageProductivity: 0,
    currentStreak: 0,
    bestDay: "-",
    improvement: 0,
  })
  const [currentWeek, setCurrentWeek] = useState(0) // 0 = current week, -1 = last week, etc.
  const [loading, setLoading] = useState(false)

  /**
   * Compute week window and days when week changes.
   */
  const { weekStart, weekEnd, weekDays } = useMemo(() => {
    const { start, end } = getWeekWindow(currentWeek)
    return { weekStart: start, weekEnd: end, weekDays: getWeekDays(start) }
  }, [currentWeek])

  // Format time in hours and minutes
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  // Get week date range (formatted)
  const getWeekRange = () => {
    return {
      start: weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      end: weekEnd.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    }
  }

  /**
   * Build dynamic weekly data from tasks and pomodoro sessions.
   * If sessions are unavailable, focus metrics fall back to zeros.
   */
  const buildWeeklyData = async () => {
    setLoading(true)
    try {
      // Defensive guards for arrays
      const allTasks = Array.isArray(tasks) ? tasks : []
      const allSessions = Array.isArray(sessions) ? sessions : []

      // Filter sessions within the selected week
      const weekSessions = allSessions.filter((s) => {
        const start = new Date(s.startTime)
        return start >= weekStart && start <= weekEnd
      })

      // Helper to get friendly day name
      const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const

      // Build per-day records
      const dayRecords: DayRecord[] = weekDays.map((dayDate) => {
        const dayStart = startOfDay(dayDate)
        const dayEnd = endOfDay(dayDate)

        // Total tasks created that day (in week scope)
        const tasksCreatedThatDay = allTasks.filter((t) => {
          const created = new Date(t.createdAt)
          return created >= dayStart && created <= dayEnd
        })

        // Tasks completed that day
        const tasksCompletedThatDay = allTasks.filter((t) => {
          if (t.status !== "completed") return false
          const updated = new Date(t.updatedAt)
          return updated >= dayStart && updated <= dayEnd
        })

        // Sessions associated that day
        const sessionsThatDay = weekSessions.filter((s) => {
          const start = new Date(s.startTime)
          return start >= dayStart && start <= dayEnd
        })

        // Aggregate focus time (minutes) and count sessions
        const totalFocusTimeMinutes = sessionsThatDay.reduce((sum, s) => sum + (typeof s.duration === "number" ? s.duration : 0), 0)
        const focusSessionsCount = sessionsThatDay.length

        // Productivity: completed / total tasks that day (0-100)
        const totalTasksThatDay = tasksCreatedThatDay.length
        const completedTasksThatDay = tasksCompletedThatDay.length
        const productivityPercent = totalTasksThatDay > 0 ? Math.round((completedTasksThatDay / totalTasksThatDay) * 100) : 0

        return {
          date: dayDate.toISOString(),
          dayName: dayNames[dayDate.getDay()],
          focusSessions: focusSessionsCount,
          totalFocusTime: totalFocusTimeMinutes,
          tasksCompleted: completedTasksThatDay,
          totalTasks: totalTasksThatDay,
          breaksTaken: 0, // No break data available yet
          productivity: productivityPercent,
          streak: completedTasksThatDay > 0,
        }
      })

      // Compute weekly aggregates
      const totalSessions = dayRecords.reduce((sum, d) => sum + d.focusSessions, 0)
      const totalFocusTime = dayRecords.reduce((sum, d) => sum + d.totalFocusTime, 0)
      const totalTasks = dayRecords.reduce((sum, d) => sum + d.totalTasks, 0)
      const completedTasks = dayRecords.reduce((sum, d) => sum + d.tasksCompleted, 0)
      const averageProductivity = dayRecords.length > 0 ? Math.round(dayRecords.reduce((sum, d) => sum + d.productivity, 0) / dayRecords.length) : 0

      // Determine best day (by productivity, tie-breaker: completed tasks)
      const best = [...dayRecords].sort((a, b) => {
        if (b.productivity !== a.productivity) return b.productivity - a.productivity
        return b.tasksCompleted - a.tasksCompleted
      })[0]

      // Compute improvement vs last week (based on completed tasks)
      const { start: prevStart, end: prevEnd } = getWeekWindow(currentWeek - 1)
      const prevCompleted = allTasks.filter((t) => {
        if (t.status !== "completed") return false
        const updated = new Date(t.updatedAt)
        return updated >= prevStart && updated <= prevEnd
      }).length
      const improvement = prevCompleted > 0 ? Math.round(((completedTasks - prevCompleted) / prevCompleted) * 100) : (completedTasks > 0 ? 100 : 0)

      // Current streak within displayed week (consecutive days with completions ending at latest day <= today)
      let currentStreak = 0
      for (let i = dayRecords.length - 1; i >= 0; i--) {
        const isFutureDay = new Date(dayRecords[i].date) > new Date()
        if (isFutureDay && currentWeek === 0) continue
        if (dayRecords[i].tasksCompleted > 0) {
          currentStreak += 1
        } else {
          if (currentWeek === 0) break
          // For past weeks, count streak within that window
          break
        }
      }

      setWeeklyData(dayRecords)
      setWeeklyStats({
        totalSessions,
        totalFocusTime,
        totalTasks,
        completedTasks,
        averageProductivity,
        currentStreak,
        bestDay: best ? new Date(best.date).toLocaleDateString("en-US", { weekday: "long" }) : "-",
        improvement,
      })
    } finally {
      setLoading(false)
    }
  }

  // Handle week navigation
  const navigateWeek = (direction: 'prev' | 'next') => {
    const newWeek = direction === 'prev' ? currentWeek - 1 : currentWeek + 1
    if (newWeek <= 0) { // Don't allow future weeks
      setCurrentWeek(newWeek)
    }
  }

  useEffect(() => {
    // Rebuild data whenever week, tasks, or sessions change
    void buildWeeklyData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentWeek, tasks, sessions])

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

      {(loading || isLoadingTasks || isLoadingSessions) ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        </div>
      ) : (
        <>
          {tasksError && (
            <div className="text-red-400 text-sm">Failed to load tasks. Please try again.</div>
          )}
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
                      Your most productive day was <strong>{weeklyStats.bestDay}</strong> with {weeklyData.find(d => new Date(d.date).toLocaleDateString("en-US", { weekday: "long" }) === weeklyStats.bestDay)?.productivity ?? 0}% productivity!
                    </p>
                  </div>

                  <div className="p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
                    <h4 className="font-semibold text-blue-400 mb-2 flex items-center">
                      <Target className="w-4 h-4 mr-2" />
                      Consistency
                    </h4>
                    <p className="text-sm text-gray-300">
                      You maintained focus for an average of {formatTime(Math.round(weeklyStats.totalFocusTime / Math.max(weeklyStats.totalSessions, 1)))} per session.
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
