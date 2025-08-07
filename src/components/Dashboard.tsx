import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import  PomodoroTimer  from "./PomodoroTimer";
import { TaskBoard } from "./TaskBoard";
import { Calendar, BarChart3, Settings, LogOut, User, Clock, Target, TrendingUp } from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react";
import TrackRecord from "./TrackRecord"



export function Dashboard() {
  const [activeTab, setActiveTab] = useState<'timer' | 'tasks' | 'analytics' | 'calendar'| 'trackrecord'>('timer');

  const stats = {
    todayPomodoros: 5,
    weeklyPomodoros: 23,
    completedTasks: 12,
    focusStreak: 7
  };

  const {user, logout } = useAuth0();

  const navItems = [
    { id: 'timer' as const, label: 'Timer', icon: Clock },
    { id: 'tasks' as const, label: 'Tasks', icon: Target },
    { id: 'analytics' as const, label: 'Analytics', icon: BarChart3 },
    { id: 'trackrecord' as const, icon: TrendingUp, label: "Track Record",},
    { id: 'calendar' as const, label: 'Calendar', icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-card/30 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-lg animate-pulse-glow">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">FocusFlow</h1>
                <p className="text-sm text-muted-foreground">
                  Welcome back, {user?.name || "User"}!
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" className="btn-ghost">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => logout()}
                className="btn-ghost text-destructive hover:text-destructive-foreground"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-fade-in">
          <Card className="glass-card">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 mx-auto mb-2 rounded-lg bg-primary/20 flex items-center justify-center">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <div className="text-2xl font-bold text-foreground">{stats.todayPomodoros}</div>
              <div className="text-sm text-muted-foreground">Today's Sessions</div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 mx-auto mb-2 rounded-lg bg-accent/20 flex items-center justify-center">
                <Target className="w-6 h-6 text-accent" />
              </div>
              <div className="text-2xl font-bold text-foreground">{stats.completedTasks}</div>
              <div className="text-sm text-muted-foreground">Tasks Done</div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 mx-auto mb-2 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-500" />
              </div>
              <div className="text-2xl font-bold text-foreground">{stats.weeklyPomodoros}</div>
              <div className="text-sm text-muted-foreground">This Week</div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 mx-auto mb-2 rounded-lg bg-warning/20 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-warning" />
              </div>
              <div className="text-2xl font-bold text-foreground">{stats.focusStreak}</div>
              <div className="text-sm text-muted-foreground">Day Streak</div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8 p-1 bg-card/50 rounded-xl backdrop-blur-sm border border-border/50 animate-slide-up">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "default" : "ghost"}
              onClick={() => setActiveTab(item.id)}
              className={`flex-1 transition-all duration-300 ${
                activeTab === item.id 
                  ? 'bg-primary text-primary-foreground shadow-lg' 
                  : 'hover:bg-card/70'
              }`}
            >
              {React.createElement(item.icon, { className: "w-4 h-4 mr-2" })}
              {item.label}
            </Button>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Primary Content */}
          <div className="lg:col-span-2">
            {activeTab === 'timer' && (
              <div className="animate-scale-in">
                <PomodoroTimer />
              </div>
            )}
            
            {activeTab === 'tasks' && (
              <div className="animate-scale-in">
                <TaskBoard />
              </div>
            )}
            
            {activeTab === 'trackrecord' && (
              <div className="animate-scale-in">
                <TrackRecord />
              </div>  )}

            {activeTab === 'analytics' && (
              <Card className="glass-card animate-scale-in">
                <CardHeader>
                  <CardTitle className="text-xl text-foreground">Weekly Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <BarChart3 className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">Analytics Coming Soon</h3>
                    <p className="text-muted-foreground">
                      Track your productivity trends, get improvement suggestions, and visualize your focus patterns.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {activeTab === 'calendar' && (
              <Card className="glass-card animate-scale-in">
                <CardHeader>
                  <CardTitle className="text-xl text-foreground">Productivity Calendar</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">Calendar Integration</h3>
                    <p className="text-muted-foreground">
                      View your daily and weekly productivity logs, track session consistency, and plan your focus time.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="glass-card animate-fade-in">
              <CardHeader>
                <CardTitle className="text-lg text-foreground">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full btn-focus" onClick={() => setActiveTab('timer')}>
                  <Clock className="w-4 h-4 mr-2" />
                  Start Focus Session
                </Button>
                <Button className="w-full btn-break" onClick={() => setActiveTab('tasks')}>
                  <Target className="w-4 h-4 mr-2" />
                  Manage Tasks
                </Button>
                <Button className="w-full btn-ghost" onClick={() => setActiveTab('analytics')}>
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Progress
                </Button>
              </CardContent>
            </Card>

            {/* Today's Progress */}
            <Card className="glass-card animate-fade-in">
              <CardHeader>
                <CardTitle className="text-lg text-foreground">Today's Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Focus Sessions</span>
                      <span className="text-foreground">{stats.todayPomodoros}/8</span>
                    </div>
                    <div className="w-full bg-border/30 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(stats.todayPomodoros / 8) * 100}%` }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Daily Goal</span>
                      <span className="text-foreground">62%</span>
                    </div>
                    <div className="w-full bg-border/30 rounded-full h-2">
                      <div className="bg-accent h-2 rounded-full transition-all duration-500 w-[62%]" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Achievement */}
            <Card className="glass-card animate-fade-in">
              <CardContent className="p-4 text-center">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-r from-primary to-primary-glow flex items-center justify-center animate-pulse-glow">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">Great Focus!</h3>
                <p className="text-sm text-muted-foreground">You're on a 7-day streak 🔥</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}