"use client"

import { useState, useEffect, useRef } from "react"
import { Play, Pause, RotateCcw, Coffee, Briefcase } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

type TimerMode = 'work' | 'shortBreak' | 'longBreak'

const TIMER_SETTINGS = {
  work: 25 * 60, // 25 minutes
  shortBreak: 5 * 60, // 5 minutes
  longBreak: 15 * 60, // 15 minutes
}

export default function PomodoroTimer() {
  const [mode, setMode] = useState<TimerMode>('work')
  const [timeLeft, setTimeLeft] = useState(TIMER_SETTINGS.work)
  const [isRunning, setIsRunning] = useState(false)
  const [sessions, setSessions] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimerComplete()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, timeLeft])

  const handleTimerComplete = () => {
    setIsRunning(false)
    
    if (mode === 'work') {
      const newSessions = sessions + 1
      setSessions(newSessions)
      
      // Every 4 work sessions, take a long break
      if (newSessions % 4 === 0) {
        setMode('longBreak')
        setTimeLeft(TIMER_SETTINGS.longBreak)
      } else {
        setMode('shortBreak')
        setTimeLeft(TIMER_SETTINGS.shortBreak)
      }
    } else {
      setMode('work')
      setTimeLeft(TIMER_SETTINGS.work)
    }
  }

  const toggleTimer = () => {
    setIsRunning(!isRunning)
  }

  const resetTimer = () => {
    setIsRunning(false)
    setTimeLeft(TIMER_SETTINGS[mode])
  }

  const switchMode = (newMode: TimerMode) => {
    setMode(newMode)
    setTimeLeft(TIMER_SETTINGS[newMode])
    setIsRunning(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const progress = ((TIMER_SETTINGS[mode] - timeLeft) / TIMER_SETTINGS[mode]) * 100
  const circumference = 2 * Math.PI * 120
  const strokeDashoffset = circumference - (progress / 100) * circumference

  const getModeConfig = () => {
    switch (mode) {
      case 'work':
        return {
          title: 'Focus Time',
          color: 'text-red-500',
          bgColor: 'from-red-500/20 to-orange-500/20',
          strokeColor: '#ef4444',
          icon: Briefcase
        }
      case 'shortBreak':
        return {
          title: 'Short Break',
          color: 'text-green-500',
          bgColor: 'from-green-500/20 to-emerald-500/20',
          strokeColor: '#22c55e',
          icon: Coffee
        }
      case 'longBreak':
        return {
          title: 'Long Break',
          color: 'text-blue-500',
          bgColor: 'from-blue-500/20 to-cyan-500/20',
          strokeColor: '#3b82f6',
          icon: Coffee
        }
    }
  }

  const config = getModeConfig()
  const Icon = config.icon

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {/* Header */}
      <div className={`flex items-center justify-center gap-2 ${config.color}`}>
        <Icon className="w-6 h-6" />
        <h1 className="text-2xl font-bold">{config.title}</h1>
      </div>
      <p className="text-white/60">Session {sessions + 1}</p>

      {/* Circular Progress */}
      <div className="relative w-64 h-64 mx-auto">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 256 256">
          {/* Background circle */}
          <circle
            cx="128"
            cy="128"
            r="120"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-white/10"
          />
          {/* Progress circle */}
          <circle
            cx="128"
            cy="128"
            r="120"
            stroke={config.strokeColor}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out drop-shadow-lg"
            style={{ filter: `drop-shadow(0 0 8px ${config.strokeColor}40)` }}
          />
        </svg>
        {/* Timer display */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-5xl font-mono font-bold text-white mb-2">
              {formatTime(timeLeft)}
            </div>
            <div className="text-white/60 text-sm">
              {Math.floor(timeLeft / 60)}m {timeLeft % 60}s remaining
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <Button
          onClick={toggleTimer}
          size="lg"
          className={`w-16 h-16 rounded-full ${isRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white shadow-lg transition-all duration-200 hover:scale-105`}
        >
          {isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
        </Button>
        <Button
          onClick={resetTimer}
          size="lg"
          variant="outline"
          className="w-16 h-16 rounded-full border-white/20 bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all duration-200 hover:scale-105"
        >
          <RotateCcw className="w-6 h-6" />
        </Button>
      </div>

      {/* Mode Switcher */}
      <div className="flex gap-2 justify-center mt-4">
        <Button
          onClick={() => switchMode('work')}
          variant={mode === 'work' ? 'default' : 'outline'}
          size="sm"
          className={`${mode === 'work' ? 'bg-red-500 hover:bg-red-600 text-white' : 'border-white/20 bg-white/10 hover:bg-white/20 text-white'} transition-all duration-200`}
        >
          Work
        </Button>
        <Button
          onClick={() => switchMode('shortBreak')}
          variant={mode === 'shortBreak' ? 'default' : 'outline'}
          size="sm"
          className={`${mode === 'shortBreak' ? 'bg-green-500 hover:bg-green-600 text-white' : 'border-white/20 bg-white/10 hover:bg-white/20 text-white'} transition-all duration-200`}
        >
          Short Break
        </Button>
        <Button
          onClick={() => switchMode('longBreak')}
          variant={mode === 'longBreak' ? 'default' : 'outline'}
          size="sm"
          className={`${mode === 'longBreak' ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'border-white/20 bg-white/10 hover:bg-white/20 text-white'} transition-all duration-200`}
        >
          Long Break
        </Button>
      </div>

      {/* Stats */}
      <div className="text-center text-white/60 text-sm mt-4">
        <p>Completed Sessions: {sessions}</p>
        <p>Next: {sessions % 4 === 3 ? 'Long Break' : sessions % 2 === 0 ? 'Short Break' : 'Work Session'}</p>
      </div>
    </div>
  )
}
