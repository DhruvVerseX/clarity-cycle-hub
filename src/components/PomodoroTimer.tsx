import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Pause, RotateCcw, Coffee, Timer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type TimerMode = 'focus' | 'short-break' | 'long-break';

interface TimerState {
  mode: TimerMode;
  timeLeft: number;
  isRunning: boolean;
  sessionCount: number;
}

const TIMER_DURATIONS = {
  focus: 25 * 60, // 25 minutes
  'short-break': 5 * 60, // 5 minutes
  'long-break': 15 * 60, // 15 minutes
};

export function PomodoroTimer() {
  const [timer, setTimer] = useState<TimerState>({
    mode: 'focus',
    timeLeft: TIMER_DURATIONS.focus,
    isRunning: false,
    sessionCount: 0,
  });

  const { toast } = useToast();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (timer.isRunning && timer.timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimer(prev => ({
          ...prev,
          timeLeft: prev.timeLeft - 1,
        }));
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timer.isRunning, timer.timeLeft]);

  useEffect(() => {
    if (timer.timeLeft === 0 && timer.isRunning) {
      handleTimerComplete();
    }
  }, [timer.timeLeft, timer.isRunning]);

  const handleTimerComplete = () => {
    setTimer(prev => ({ ...prev, isRunning: false }));
    
    // Play notification sound (placeholder)
    try {
      audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+LwvmwhBzOV2O/CeSEFKnnK8N+XTAkOUaTntoqPXWyJ0/DOeSQFJoHA4N2XPBAMFTzT+wCZcwCZcwCZcwCZcwCZcwCZcwCZcwC=');
      audioRef.current.play();
    } catch (error) {
      console.log('Audio notification not available');
    }

    // Show toast notification
    const messages = {
      focus: "Great focus session! Time for a break 🎉",
      'short-break': "Break's over! Ready to focus? 💪",
      'long-break': "Long break complete! Let's get back to work! 🚀"
    };

    toast({
      title: "Session Complete!",
      description: messages[timer.mode],
      duration: 5000,
    });

    // Auto-transition to next mode
    handleModeSwitch();
  };

  const handleModeSwitch = () => {
    let nextMode: TimerMode;
    let newSessionCount = timer.sessionCount;

    if (timer.mode === 'focus') {
      newSessionCount += 1;
      nextMode = newSessionCount % 4 === 0 ? 'long-break' : 'short-break';
    } else {
      nextMode = 'focus';
    }

    setTimer({
      mode: nextMode,
      timeLeft: TIMER_DURATIONS[nextMode],
      isRunning: false,
      sessionCount: newSessionCount,
    });
  };

  const toggleTimer = () => {
    setTimer(prev => ({ ...prev, isRunning: !prev.isRunning }));
  };

  const resetTimer = () => {
    setTimer(prev => ({
      ...prev,
      timeLeft: TIMER_DURATIONS[prev.mode],
      isRunning: false,
    }));
  };

  const switchMode = (mode: TimerMode) => {
    setTimer({
      mode,
      timeLeft: TIMER_DURATIONS[mode],
      isRunning: false,
      sessionCount: timer.sessionCount,
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((TIMER_DURATIONS[timer.mode] - timer.timeLeft) / TIMER_DURATIONS[timer.mode]) * 100;

  const modeConfig = {
    focus: {
      color: 'from-primary to-primary-glow',
      icon: Timer,
      label: 'Focus Time',
      description: 'Deep work session'
    },
    'short-break': {
      color: 'from-blue-500 to-blue-400',
      icon: Coffee,
      label: 'Short Break',
      description: 'Take a quick rest'
    },
    'long-break': {
      color: 'from-accent to-green-400',
      icon: Coffee,
      label: 'Long Break',
      description: 'Extended rest time'
    }
  };

  const currentConfig = modeConfig[timer.mode];

  return (
    <Card className="glass-card animate-scale-in">
      <CardContent className="p-8">
        {/* Mode Selector */}
        <div className="flex justify-center gap-2 mb-8">
          {(Object.keys(modeConfig) as TimerMode[]).map((mode) => (
            <Button
              key={mode}
              variant={timer.mode === mode ? "default" : "outline"}
              size="sm"
              onClick={() => switchMode(mode)}
              className={`px-3 py-2 text-xs transition-all duration-300 ${
                timer.mode === mode 
                  ? `bg-gradient-to-r ${modeConfig[mode].color} text-white shadow-lg` 
                  : 'btn-ghost'
              }`}
            >
              {React.createElement(modeConfig[mode].icon, { className: "w-3 h-3 mr-1" })}
              {modeConfig[mode].label}
            </Button>
          ))}
        </div>

        {/* Timer Display */}
        <div className="text-center mb-8">
          <div className="relative w-64 h-64 mx-auto mb-6">
            {/* Background Circle */}
            <div className="absolute inset-0 rounded-full border-8 border-border/30"></div>
            
            {/* Progress Circle */}
            <div 
              className="absolute inset-0 rounded-full border-8 border-transparent animate-pulse-glow transition-all duration-300"
              style={{
                background: `conic-gradient(from 0deg, hsl(var(--primary)) ${progress}%, transparent ${progress}%)`,
                borderRadius: '50%',
                padding: '4px',
              }}
            >
              <div className="w-full h-full rounded-full bg-background"></div>
            </div>

            {/* Timer Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {React.createElement(currentConfig.icon, {
                className: `w-8 h-8 mb-2 ${timer.mode === 'focus' ? 'text-primary' : timer.mode === 'short-break' ? 'text-blue-500' : 'text-accent'}`
              })}
              <div className={`text-4xl font-bold mb-1 ${timer.isRunning ? 'animate-timer-tick' : ''}`}>
                {formatTime(timer.timeLeft)}
              </div>
              <div className="text-sm text-muted-foreground">{currentConfig.description}</div>
            </div>
          </div>

          {/* Session Counter */}
          <div className="text-center mb-6">
            <div className="text-sm text-muted-foreground mb-2">Sessions Completed</div>
            <div className="flex justify-center gap-1">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    i < timer.sessionCount % 4 
                      ? 'bg-primary shadow-lg' 
                      : 'bg-border/30'
                  }`}
                />
              ))}
            </div>
            <div className="text-lg font-semibold text-foreground mt-2">
              {timer.sessionCount} total
            </div>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex justify-center gap-4">
          <Button
            onClick={toggleTimer}
            className={`btn-focus px-8 py-3 text-lg ${timer.isRunning ? 'bg-destructive hover:bg-destructive/90' : ''}`}
          >
            {timer.isRunning ? (
              <>
                <Pause className="w-5 h-5 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-5 h-5 mr-2" />
                Start
              </>
            )}
          </Button>
          
          <Button
            onClick={resetTimer}
            variant="outline"
            className="btn-ghost px-6 py-3"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}