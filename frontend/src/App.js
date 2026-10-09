import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { ThemeProvider } from './contexts/ThemeContext';
import { DialogProvider } from './contexts/DialogContext';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Home from './pages/Home';
import Events from './pages/Events';
import CreateEvent from './pages/CreateEvent';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import { api } from './services/api';
import CompleteProfileModal from './components/CompleteProfileModal';

function App() {
  const [user, setUser] = useState(null);
  const [needsProfile, setNeedsProfile] = useState(false);
  const [pendingFirebaseUser, setPendingFirebaseUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        if (firebaseUser.emailVerified) {
          try {
            // Attempt to sync and fetch CampusUnstop profile
            const profileDataStr = sessionStorage.getItem('pendingProfileData');
            const profileData = profileDataStr ? JSON.parse(profileDataStr) : {};

            const campusUser = await api.syncUser(profileData);
            setUser(campusUser);

            // Clear pending data upon successful sync
            sessionStorage.removeItem('pendingProfileData');
          } catch (error) {
            console.error('Failed to sync user profile:', error);
            if (error.needsProfile) {
              setPendingFirebaseUser(firebaseUser);
              setNeedsProfile(true);
            } else {
              setUser(null);
              auth.signOut();
            }
          }
        } else {
          // User exists but is unverified
          setUser(null);
        }
      } else {
        setUser(null);
        setNeedsProfile(false);
        setPendingFirebaseUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setUser(null);
      setNeedsProfile(false);
      setPendingFirebaseUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleProfileComplete = (campusUser) => {
    setUser(campusUser);
    setNeedsProfile(false);
    setPendingFirebaseUser(null);
  };

  const handleProfileCancel = () => {
    auth.signOut();
    setNeedsProfile(false);
    setPendingFirebaseUser(null);
  };

  return (
    <ThemeProvider>
      <DialogProvider>
        <Router>
          <div className="min-h-screen bg-[#030014] text-white overflow-x-hidden relative transition-colors duration-300 flex flex-col">
            {/* Premium Global Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
              <div className="absolute left-1/4 top-0 -z-10 h-[400px] w-[400px] rounded-full bg-purple-600 opacity-20 blur-[120px]"></div>
              <div className="absolute right-1/4 bottom-0 -z-10 h-[400px] w-[400px] rounded-full bg-blue-600 opacity-20 blur-[120px]"></div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex flex-col flex-grow">
              <Navigation user={user} onLogout={handleLogout} />
              <main className="pt-16 flex-grow">
                {needsProfile && pendingFirebaseUser && (
                  <CompleteProfileModal
                    firebaseUser={pendingFirebaseUser}
                    onComplete={handleProfileComplete}
                    onCancel={handleProfileCancel}
                  />
                )}

                <Routes>
                  <Route path="/" element={<Home user={user} />} />
                  <Route path="/events" element={<Events user={user} />} />
                  <Route path="/calendar" element={<Events user={user} />} />
                  <Route
                    path="/create-event"
                    element={user ? <CreateEvent user={user} /> : <Navigate to="/login" />}
                  />
                  <Route
                    path="/profile"
                    element={user ? <Profile user={user} onUserUpdated={setUser} /> : <Navigate to="/login" />}
                  />
                  <Route
                    path="/login"
                    element={!user ? <Login /> : <Navigate to="/" />}
                  />
                  <Route
                    path="/register"
                    element={!user ? <Register /> : <Navigate to="/" />}
                  />
                </Routes>
              </main>
              <Footer />
            </div>
          </div>
        </Router>
      </DialogProvider>
    </ThemeProvider>
  );
}

export default App;