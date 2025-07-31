import { useState } from "react";
import  PomodoroLandingPage  from "@/components/LandingPage";
import { Dashboard } from "@/components/Dashboard";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (isAuthenticated) {
    return <Dashboard onLogout={handleLogout} />;
  }

 
  return <PomodoroLandingPage onLogin={handleLogin} />;
};

export default Index;
