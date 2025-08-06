import { useState, useEffect } from "react";
import PomodoroLandingPage from "@/components/LandingPage";
import { Dashboard } from "@/components/Dashboard";
import { isAuthenticated, getCurrentUser, logoutFromAuth0 } from "@/services/auth0";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
<<<<<<< HEAD

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      const currentUser = getCurrentUser();
      
      setIsAuthenticated(authenticated);
      setUser(currentUser);
    };

    checkAuth();
  }, []);
=======
>>>>>>> 66ade86a8c5bc3c7ba36f001ba3d4339bc6b5f02

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
<<<<<<< HEAD
    const authenticated = isAuthenticated();
=======
    // Corrected the isAuthenticated call to directly access the boolean value
    const authenticated = isAuthenticated;
>>>>>>> 66ade86a8c5bc3c7ba36f001ba3d4339bc6b5f02
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
