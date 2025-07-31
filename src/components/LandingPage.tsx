import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Target, TrendingUp, Calendar, CheckCircle } from "lucide-react";

interface LandingPageProps {
  onLogin: () => void;
}

export function LandingPage({ onLogin }: LandingPageProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleAuth = async (type: 'login' | 'signup') => {
    setIsLoading(true);
    // Simulate authentication
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    onLogin();
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      {/* Animated background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-card animate-pulse-glow opacity-50" />
      
      {/* Hero Section */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen">
          
          {/* Left side - Hero content */}
          <div className="animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-lg animate-pulse-glow">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">FocusFlow</h1>
            </div>
            
            <h2 className="text-5xl font-bold text-foreground mb-6 leading-tight">
              Your Ultimate 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-glow">
                {" "}Focus Companion
              </span>
            </h2>
            
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Welcome to your minimalistic, dark-themed Pomodoro platform built for deep work and self-growth. 
              Start with a sleek authentication flow and discover powerful productivity tools.
            </p>

            {/* Features grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-card/50 border border-border/50">
                <Target className="w-5 h-5 text-primary" />
                <span className="text-sm text-foreground">Smart Pomodoro Timer</span>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg bg-card/50 border border-border/50">
                <CheckCircle className="w-5 h-5 text-accent" />
                <span className="text-sm text-foreground">Task Management</span>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg bg-card/50 border border-border/50">
                <Calendar className="w-5 h-5 text-break" />
                <span className="text-sm text-foreground">Progress Tracking</span>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg bg-card/50 border border-border/50">
                <TrendingUp className="w-5 h-5 text-warning" />
                <span className="text-sm text-foreground">Analytics & Insights</span>
              </div>
            </div>

            <p className="text-muted-foreground italic">
              "More than a timer, it's your productivity studio."
            </p>
          </div>

          {/* Right side - Authentication */}
          <div className="animate-slide-up">
            <Card className="glass-card max-w-md mx-auto shadow-2xl">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl text-foreground">Get Started</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Join thousands of focused professionals
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="login" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <Input 
                        id="login-email" 
                        type="email" 
                        placeholder="Enter your email"
                        className="bg-input/50 border-border/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password">Password</Label>
                      <Input 
                        id="login-password" 
                        type="password" 
                        placeholder="Enter your password"
                        className="bg-input/50 border-border/50"
                      />
                    </div>
                    <Button 
                      onClick={() => handleAuth('login')} 
                      className="w-full btn-focus" 
                      disabled={isLoading}
                    >
                      {isLoading ? "Signing in..." : "Sign In"}
                    </Button>
                  </TabsContent>
                  
                  <TabsContent value="signup" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name">Full Name</Label>
                      <Input 
                        id="signup-name" 
                        placeholder="Enter your full name"
                        className="bg-input/50 border-border/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input 
                        id="signup-email" 
                        type="email" 
                        placeholder="Enter your email"
                        className="bg-input/50 border-border/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <Input 
                        id="signup-password" 
                        type="password" 
                        placeholder="Create a password"
                        className="bg-input/50 border-border/50"
                      />
                    </div>
                    <Button 
                      onClick={() => handleAuth('signup')} 
                      className="w-full btn-focus" 
                      disabled={isLoading}
                    >
                      {isLoading ? "Creating account..." : "Create Account"}
                    </Button>
                  </TabsContent>
                </Tabs>
                
                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-border/50" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full mt-4 btn-ghost"
                    onClick={() => handleAuth('login')}
                    disabled={isLoading}
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}