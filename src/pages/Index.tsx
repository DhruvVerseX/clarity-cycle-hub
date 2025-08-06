import { useState, useEffect } from "react";
import PomodoroLandingPage from "@/components/LandingPage";
import { Dashboard } from "@/components/Dashboard";
import { isAuthenticated, getCurrentUser, logoutFromAuth0 } from "@/services/auth0";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuth = () => {
      // Corrected the isAuthenticated call to directly access the boolean value
      const authenticated = isAuthenticated;
      const currentUser = getCurrentUser();
      
      setIsAuthenticated(authenticated);
      setUser(currentUser);
    };

    checkAuth();
  }, []);
  /**
   * Handles the login process by checking the authentication status and setting the user state.
   */
  const handleLogin = () => {
    // Corrected the isAuthenticated call to directly access the boolean value
    const authenticated = isAuthenticated;
    const currentUser = getCurrentUser();
    
    setIsAuthenticated(authenticated);
    setUser(currentUser);
  };

  const handleLogout = async () => {
    await logoutFromAuth0();
    setIsAuthenticated(false);
    setUser(null);
  };

  if (isAuthenticated && user) {
    return <Dashboard onLogout={handleLogout} user={user} />;
  }

  return <PomodoroLandingPage onLogin={handleLogin} />;
};

export default Index;
