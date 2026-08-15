import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Events from './pages/Events';
import CreateEvent from './pages/CreateEvent';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check for existing authentication on app load
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        // Invalid stored data, clear it
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleRegister = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-[#030014] text-white overflow-x-hidden relative transition-colors duration-300">
          {/* Premium Global Background */}
          <div className="fixed inset-0 z-0 pointer-events-none">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
            <div className="absolute left-1/4 top-0 -z-10 h-[400px] w-[400px] rounded-full bg-purple-600 opacity-20 blur-[120px]"></div>
            <div className="absolute right-1/4 bottom-0 -z-10 h-[400px] w-[400px] rounded-full bg-blue-600 opacity-20 blur-[120px]"></div>
          </div>

          {/* Main Content */}
          <div className="relative z-10">
            <Navigation user={user} onLogout={handleLogout} />
            <main className="pt-16">
              <Routes>
                <Route path="/" element={<Home user={user} />} />
                <Route path="/events" element={<Events user={user} />} />
                <Route
                  path="/create-event"
                  element={user ? <CreateEvent user={user} /> : <Navigate to="/login" />}
                />
                <Route
                  path="/profile"
                  element={user ? <Profile user={user} /> : <Navigate to="/login" />}
                />
                <Route
                  path="/login"
                  element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/" />}
                />
                <Route
                  path="/register"
                  element={!user ? <Register onRegister={handleRegister} /> : <Navigate to="/" />}
                />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;