import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import styles from "./App.module.css";
import { Login, Register, NotFound, PageTemplate } from "./components";
import UserContext from "./context/UserContext";
import Axios from "axios";
import config from "./config/Config";

// Configure axios defaults
Axios.defaults.withCredentials = true;  // Important for sending cookies
Axios.defaults.baseURL = 'http://localhost:5001';  // Your backend URL

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  const setUserData = (data) => {
    if (data.user) {
      setIsAuthenticated(true);
      setUser(data.user);
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await Axios.get('/api/auth/user', {
          withCredentials: true
        });
        
        if (response.data.user) {
          setIsAuthenticated(true);
          setUser(response.data.user);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Create an axios interceptor to handle 401 errors
  useEffect(() => {
    const interceptor = Axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 401) {
          setIsAuthenticated(false);
          setUser(null);
        }
        return Promise.reject(error);
      }
    );

    return () => Axios.interceptors.response.eject(interceptor);
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <UserContext.Provider value={{ 
        userData: { user, isAuthenticated }, 
        setUserData 
      }}>
        <div className={styles.container}>
          <Routes>
            {isAuthenticated ? (
              <Route path="/" element={<PageTemplate />} />
            ) : (
              <>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </>
            )}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </UserContext.Provider>
    </Router>
  );
}

export default App;
