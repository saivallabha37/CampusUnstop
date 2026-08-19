import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import SpotlightCard from '../components/reactbits/SpotlightCard';
import { useDialog } from '../contexts/DialogContext';

const Landing = ({ user, onLogout, onLoginClick }) => {
  const { showDialog, showConfirmation } = useDialog();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    capacity: '',
    category: '',
    registrationDeadline: ''
  });
  const [registrationData, setRegistrationData] = useState({
    name: '',
    email: '',
    phone: '',
    college: '',
    year: '',
    branch: ''
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const data = await api.getEvents();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = (event) => {
    setSelectedEvent(event);
    setShowRegisterForm(true);
  };

  const handleSubmitRegistration = async (e) => {
    e.preventDefault();

    const confirmed = await showConfirmation({
      title: 'Confirm Registration',
      message: `Are you sure you want to register for "${selectedEvent.title}"?`,
      confirmText: 'Register',
      cancelText: 'Cancel'
    });
    if (!confirmed) return;

    try {
      const result = await api.registerForEvent(user.id, selectedEvent._id);

      if (result.message === 'Registration successful') {
        await showDialog({
          type: 'success',
          title: 'Registration Successful',
          message: 'Registration successful! You will receive a confirmation email shortly.'
        });
        setShowRegisterForm(false);
        setRegistrationData({
          name: '',
          email: '',
          phone: '',
          college: '',
          year: '',
          branch: ''
        });
        fetchEvents(); // Refresh events to show updated attendee count
      } else {
        const message = result.message || 'Unable to process registration.';
        const lowerMessage = message.toLowerCase();
        const isDuplicate = lowerMessage.includes('already') || lowerMessage.includes('duplicate');
        const isError = lowerMessage.includes('fail') || lowerMessage.includes('error');

        await showDialog({
          type: isDuplicate ? 'warning' : (isError ? 'error' : 'information'),
          title: isDuplicate ? 'Already Registered' : 'Registration Update',
          message
        });
      }
    } catch (error) {
      console.error('Error registering:', error);
      await showDialog({
        type: 'error',
        title: 'Registration Failed',
        message: 'Registration failed. Please try again.'
      });
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      const eventData = {
        ...newEvent,
        capacity: parseInt(newEvent.capacity),
        date: new Date(newEvent.date),
        registrationDeadline: new Date(newEvent.registrationDeadline)
      };

      await api.createEvent(eventData);
      setShowCreateForm(false);
      setNewEvent({
        title: '',
        description: '',
        date: '',
        capacity: '',
        category: '',
        registrationDeadline: ''
      });
      fetchEvents(); // Refresh events list
      await showDialog({
        type: 'success',
        title: 'Event Created',
        message: 'Event created successfully!'
      });
    } catch (error) {
      console.error('Error creating event:', error);
      await showDialog({
        type: 'error',
        title: 'Event Creation Failed',
        message: 'Failed to create event. Please try again.'
      });
    }
  };

  const scrollToEvents = () => {
    const eventsSection = document.getElementById('events-section');
    eventsSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-sm border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                VCE Events
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-300">Welcome, {user.name}</span>
                  <button
                    onClick={onLogout}
                    className="px-4 py-2 border border-slate-600 text-gray-300 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={onLoginClick}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-300"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="min-h-screen relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden pt-16">
      
      {/* Clean Premium Background */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay z-0 pointer-events-none"></div>

      {/* Hero Section */}
      <section className="relative flex items-center justify-center min-h-screen px-4 z-10">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent animate-pulse">
            Compete. Learn. Grow.
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
            Join <span className="text-blue-400 font-semibold">VCE Events</span> - Your ultimate college event marketplace.
            Discover, register, and participate in exciting events that shape your future.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={scrollToEvents}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              Explore Events
            </button>
            {user ? (
              <button
                onClick={() => setShowCreateForm(true)}
                className="px-8 py-4 border-2 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-slate-900 font-semibold rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                Create Event
              </button>
            ) : (
              <button
                onClick={onLoginClick}
                className="px-8 py-4 border-2 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-slate-900 font-semibold rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                Login to Register
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section id="events-section" className="relative py-20 px-4 z-10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Upcoming Events
          </h2>

          {loading ? (
            <div className="text-center text-gray-400">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
              Loading events...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event, index) => (
                <SpotlightCard
                  key={event._id}
                  className="group relative glass-dark rounded-2xl p-6 transform transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/20"
                  spotlightColor="rgba(139, 92, 246, 0.25)"
                >
                  <div className="relative z-10 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                      <span className="px-4 py-1.5 bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider rounded-full border border-blue-400/30 backdrop-blur-md">
                        {event.category}
                      </span>
                      <div className="text-right">
                        <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Attendees</div>
                        <div className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                          {event.attendees}/{event.capacity}
                        </div>
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-blue-300 transition-colors duration-300">
                      {event.title}
                    </h3>

                    <p className="text-gray-300 mb-6 leading-relaxed flex-grow line-clamp-3">
                      {event.description}
                    </p>

                    <div className="flex items-center text-gray-400 mb-6 bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                      <svg className="w-5 h-5 mr-3 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-medium">
                        {new Date(event.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full bg-slate-800/80 rounded-full h-2.5 mb-6 overflow-hidden border border-slate-700/50">
                      <div
                        className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-full rounded-full transition-all duration-1000 ease-out relative"
                        style={{ width: `${(event.attendees / event.capacity) * 100}%` }}
                      >
                        <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]"></div>
                      </div>
                    </div>

                    <button
                      onClick={() => user ? handleRegister(event) : onLoginClick()}
                      className="w-full relative overflow-hidden group/btn bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-300 hover:shadow-[0_0_20px_rgba(139,92,246,0.4)]"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover/btn:opacity-20 transition-opacity duration-300"></div>
                      <span className="relative flex items-center justify-center">
                        {user ? 'Register Now' : 'Login to Register'}
                        <svg className="w-5 h-5 ml-2 transform group-hover/btn:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </span>
                    </button>
                  </div>
                </SpotlightCard>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-4 border-t border-slate-800 z-10">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400">
            © 2024 VCE Events. Empowering college communities through events.
          </p>
        </div>
      </footer>
    </div>

    {/* Create Event Modal */}
    {showCreateForm && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-slate-800 rounded-xl p-6 w-full max-w-md border border-slate-700">
          <h3 className="text-2xl font-bold text-white mb-6">Create New Event</h3>
          <form onSubmit={handleCreateEvent} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
              <input
                type="text"
                required
                value={newEvent.title}
                onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
              <textarea
                required
                value={newEvent.description}
                onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-400 focus:outline-none h-24 resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
              <select
                required
                value={newEvent.category}
                onChange={(e) => setNewEvent({...newEvent, category: e.target.value})}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-400 focus:outline-none"
              >
                <option value="">Select category</option>
                <option value="Technology">Technology</option>
                <option value="Business">Business</option>
                <option value="Arts">Arts</option>
                <option value="Sports">Sports</option>
                <option value="Academic">Academic</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Date</label>
              <input
                type="date"
                required
                value={newEvent.date}
                onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Capacity</label>
              <input
                type="number"
                required
                min="1"
                value={newEvent.capacity}
                onChange={(e) => setNewEvent({...newEvent, capacity: e.target.value})}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Registration Deadline</label>
              <input
                type="date"
                required
                value={newEvent.registrationDeadline}
                onChange={(e) => setNewEvent({...newEvent, registrationDeadline: e.target.value})}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-400 focus:outline-none"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300"
              >
                Create Event
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="flex-1 border border-slate-600 text-gray-300 hover:bg-slate-700 font-semibold py-2 px-4 rounded-lg transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    )}

    {/* Register for Event Modal */}
    {showRegisterForm && selectedEvent && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-slate-800 rounded-xl p-6 w-full max-w-2xl border border-slate-700 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-white">Register for Event</h3>
            <button
              onClick={() => setShowRegisterForm(false)}
              className="text-gray-400 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>

          {/* Event Details */}
          <div className="bg-slate-700/50 rounded-lg p-4 mb-6">
            <h4 className="text-xl font-semibold text-blue-400 mb-2">{selectedEvent.title}</h4>
            <p className="text-gray-300 mb-3">{selectedEvent.description}</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Date:</span>
                <span className="text-white ml-2">
                  {new Date(selectedEvent.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Category:</span>
                <span className="text-white ml-2">{selectedEvent.category}</span>
              </div>
              <div>
                <span className="text-gray-400">Capacity:</span>
                <span className="text-white ml-2">{selectedEvent.capacity}</span>
              </div>
              <div>
                <span className="text-gray-400">Registered:</span>
                <span className="text-white ml-2">{selectedEvent.attendees}</span>
              </div>
            </div>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmitRegistration} className="space-y-4">
            <h4 className="text-lg font-semibold text-white mb-4">Your Details</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={registrationData.name}
                  onChange={(e) => setRegistrationData({...registrationData, name: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-400 focus:outline-none"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={registrationData.email}
                  onChange={(e) => setRegistrationData({...registrationData, email: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-400 focus:outline-none"
                  placeholder="your.email@college.edu"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={registrationData.phone}
                  onChange={(e) => setRegistrationData({...registrationData, phone: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-400 focus:outline-none"
                  placeholder="+91 9876543210"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">College/University *</label>
                <input
                  type="text"
                  required
                  value={registrationData.college}
                  onChange={(e) => setRegistrationData({...registrationData, college: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-400 focus:outline-none"
                  placeholder="Your college name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Year of Study *</label>
                <select
                  required
                  value={registrationData.year}
                  onChange={(e) => setRegistrationData({...registrationData, year: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-400 focus:outline-none"
                >
                  <option value="">Select year</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                  <option value="5th Year">5th Year</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Branch/Department *</label>
                <input
                  type="text"
                  required
                  value={registrationData.branch}
                  onChange={(e) => setRegistrationData({...registrationData, branch: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-400 focus:outline-none"
                  placeholder="Computer Science, Mechanical, etc."
                />
              </div>
            </div>

            <div className="flex gap-3 pt-6">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
              >
                Complete Registration
              </button>
              <button
                type="button"
                onClick={() => setShowRegisterForm(false)}
                className="flex-1 border border-slate-600 text-gray-300 hover:bg-slate-700 font-semibold py-3 px-6 rounded-lg transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
    </>
  );
};

export default Landing;