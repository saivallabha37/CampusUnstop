import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import SpotlightCard from '../components/reactbits/SpotlightCard';
// import BorderGlow from '../components/reactbits/BorderGlow';
import SplashCursor from '../components/reactbits/SplashCursor';
import MagneticButton from '../components/MagneticButton';
import FloatingElements from '../components/FloatingElements';
import HoverEffect from '../components/HoverEffect';

const Home = ({ user }) => {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedEvents();
  }, []);

  const fetchFeaturedEvents = async () => {
    try {
      const data = await api.getEvents();
      // Get upcoming events as featured
      const upcoming = data.filter(event => new Date(event.date) > new Date()).slice(0, 3);
      setFeaturedEvents(upcoming);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-20 px-4 relative">
      <SplashCursor />
      <FloatingElements />

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 pt-16">
        <div className="text-center max-w-5xl mx-auto space-y-8">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-4 text-sm font-medium text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            <span>Welcome to the community! 🌟</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight">
            <span className="block text-white mb-2">Welcome to</span>
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              CampusUnstop
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Discover, compete, learn, and grow—this is where your journey gets exciting. Join the best college events marketplace.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center pt-8">
            <Link
              to="/events"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-full shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:shadow-[0_0_40px_rgba(139,92,246,0.5)] transform hover:-translate-y-1 transition-all duration-300"
            >
              Explore Events
            </Link>
            {user ? (
              <Link
                to="/create-event"
                className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-full border border-white/10 backdrop-blur-md transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
              >
                Create Event
              </Link>
            ) : (
              <Link
                to="/login"
                className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-full border border-white/10 backdrop-blur-md transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
              >
                Get Started
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="relative z-10 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-pink-400 to-yellow-500 bg-clip-text text-transparent dark:from-pink-400 dark:to-yellow-500 light:from-purple-600 light:to-blue-600">
            Featured Events
          </h2>
          {loading ? (
            <div className="text-center text-gray-400 dark:text-gray-400 light:text-gray-600">Loading events...</div>
          ) : featuredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredEvents.map((event) => (
                <HoverEffect key={event._id} effect="scale" className="h-full">
                  <SpotlightCard
                    className="p-6 glass-dark rounded-xl hover:border-blue-400/50 transition-all duration-300 h-full cursor-pointer transform hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(59,130,246,0.3)]"
                    spotlightColor="rgba(59, 130, 246, 0.3)"
                  >
                    <div className="space-y-4 h-full flex flex-col">
                      <h3 className="text-2xl font-bold text-white mb-2">{event.title}</h3>
                      <p className="text-gray-300 line-clamp-3 flex-grow">{event.description}</p>
                      <div className="flex justify-between items-center text-sm text-gray-400 bg-slate-800/50 p-3 rounded-lg border border-slate-700/50 mt-4">
                        <span>📅 {new Date(event.date).toLocaleDateString()}</span>
                        <span>🏷️ {event.category}</span>
                      </div>
                      <div className="flex justify-between items-center mt-4">
                        <span className="text-blue-400 font-semibold bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">👥 {event.attendees}/{event.capacity} attendees</span>
                        <MagneticButton className="mt-auto">
                          <Link
                            to="/events"
                            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg transition-all duration-300 font-semibold dark:from-blue-500 dark:to-purple-600 dark:hover:from-blue-600 dark:hover:to-purple-700 light:from-purple-500 light:to-blue-500 light:hover:from-purple-600 light:hover:to-blue-600"
                          >
                            View Details
                          </Link>
                        </MagneticButton>
                      </div>
                    </div>
                  </SpotlightCard>
                </HoverEffect>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400 dark:text-gray-400 light:text-gray-600">
              <p className="mb-4">No upcoming events yet.</p>
              {user && (
                <HoverEffect effect="glow">
                  <MagneticButton>
                    <Link
                      to="/create-event"
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg transition-all duration-300 font-semibold dark:from-purple-500 dark:to-pink-500 dark:hover:from-purple-600 dark:hover:to-pink-600 light:from-blue-500 light:to-purple-500 light:hover:from-blue-600 light:hover:to-purple-600"
                    >
                      Create the first event!
                    </Link>
                  </MagneticButton>
                </HoverEffect>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;