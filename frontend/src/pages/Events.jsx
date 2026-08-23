import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import SpotlightCard from '../components/reactbits/SpotlightCard';
import { useDialog } from '../contexts/DialogContext';

const Events = ({ user }) => {
  const { showDialog, showConfirmation } = useDialog();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchEvents = useCallback(async () => {
    try {
      const data = await api.getEvents();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const filterEvents = useCallback(() => {
    let filtered = events;

    // Filter by status
    const now = new Date();
    if (activeTab === 'ongoing') {
      filtered = events.filter(event => {
        const eventDate = new Date(event.date);
        const endDate = new Date(eventDate);
        endDate.setHours(23, 59, 59, 999); // Assume events end at end of day
        return eventDate <= now && endDate >= now;
      });
    } else if (activeTab === 'upcoming') {
      filtered = events.filter(event => new Date(event.date) > now);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredEvents(filtered);
  }, [events, activeTab, searchTerm]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    filterEvents();
  }, [filterEvents]);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const handleRegister = async (event) => {
    if (!user) {
      await showDialog({
        type: 'information',
        title: 'Login Required',
        message: 'Please login to register for events'
      });
      return;
    }

    const confirmed = await showConfirmation({
      title: 'Confirm Registration',
      message: `Are you sure you want to register for "${event.title}"?`,
      confirmText: 'Register',
      cancelText: 'Cancel'
    });
    if (!confirmed) return;

    try {
      const result = await api.registerForEvent(user.id, event._id);
      if (result.message === 'Registration successful') {
        await showDialog({
          type: 'success',
          title: 'Registration Successful',
          message: 'Registration successful! You will receive a confirmation email shortly.'
        });
        fetchEvents(); // Refresh to update attendee count
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

  const tabs = [
    { id: 'upcoming', label: 'Upcoming Events' },
    { id: 'ongoing', label: 'Ongoing Events' },
    { id: 'all', label: 'All Events' }
  ];

  return (
    <div className="min-h-screen py-8 px-4 relative pt-24">

      <div className="max-w-7xl mx-auto relative z-10">
        <h1 className="text-5xl md:text-6xl font-bold text-center mb-12 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-fade-in">Explore Events</h1>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search events by title, description, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-neutral-900 p-1 rounded-lg">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-2 rounded-md transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="text-center text-gray-400">Loading events...</div>
        ) : filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
              <div key={event._id} onClick={() => handleEventClick(event)} className="cursor-pointer">
                <SpotlightCard
                  className="p-6 glass-dark rounded-2xl hover:border-blue-400/50 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(59,130,246,0.3)] h-full flex flex-col"
                  spotlightColor="rgba(139, 92, 246, 0.25)"
                >
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-semibold text-white">{event.title}</h3>
                    <span className="text-sm bg-blue-600 px-2 py-1 rounded-full">
                      {event.category}
                    </span>
                  </div>
                  <p className="text-gray-300 line-clamp-3 my-4 flex-grow">{event.description}</p>
                  <div className="space-y-3 text-sm text-gray-400 bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
                    <div className="flex justify-between">
                      <span>Date:</span>
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Time:</span>
                      <span>{new Date(event.date).toLocaleTimeString()}</span>
                    </div>
                    {event.location && (
                      <div className="flex justify-between">
                        <span>Location:</span>
                        <span>{event.location}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Attendees:</span>
                      <span>{event.attendees}/{event.capacity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Deadline:</span>
                      <span>{new Date(event.registrationDeadline).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-4">
                    <span className={`text-sm px-2 py-1 rounded-full ${
                      new Date(event.date) > new Date()
                        ? 'bg-green-600 text-white'
                        : new Date(event.date).toDateString() === new Date().toDateString()
                        ? 'bg-yellow-600 text-white'
                        : 'bg-gray-600 text-white'
                    }`}>
                      {new Date(event.date) > new Date() ? 'Upcoming' :
                       new Date(event.date).toDateString() === new Date().toDateString() ? 'Today' : 'Past'}
                    </span>
                    {user && new Date(event.registrationDeadline) > new Date() && event.attendees < event.capacity && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleRegister(event); }}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-300 shadow-[0_0_15px_rgba(59,130,246,0.5)] transform hover:scale-105"
                      >
                        Register
                      </button>
                    )}
                  </div>
                </div>
              </SpotlightCard>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400">
            <p className="mb-4">No events found matching your criteria.</p>
            {user && (
              <Link
                to="/create-event"
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors duration-300"
              >
                Create an Event
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Event Details Modal */}
      {showModal && selectedEvent && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="glass-dark rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto transform scale-100 transition-transform duration-300 border border-slate-700/50 shadow-[0_0_50px_rgba(139,92,246,0.15)]">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-white">{selectedEvent.title}</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4 text-gray-300">
              <p>{selectedEvent.description}</p>
              <div className="grid grid-cols-2 gap-4">
                <div><strong>Date:</strong> {new Date(selectedEvent.date).toLocaleDateString()}</div>
                <div><strong>Time:</strong> {new Date(selectedEvent.date).toLocaleTimeString()}</div>
                <div>
                  <strong>Location:</strong>{' '}
                  {selectedEvent.location || 'TBD'}
                </div>
                
                <div>
                  <strong>Category:</strong>{' '}
                  {selectedEvent.category}
                </div>
                
                <div>
                  <strong>Eligibility:</strong>{' '}
                  {selectedEvent.eligibleYears?.length > 0
                    ? selectedEvent.eligibleYears.join(', ')
                    : 'All Years'}
                </div>
                
                <div>
                  <strong>Bookings:</strong>{' '}
                  {selectedEvent.attendees}
                </div>
                <div><strong>Free Slots:</strong> {selectedEvent.capacity - selectedEvent.attendees}</div>
                <div><strong>Reserved Slots:</strong> {selectedEvent.attendees}</div>
                <div><strong>Capacity:</strong> {selectedEvent.capacity}</div>
              </div>
              {selectedEvent.recommendations && (
                <div>
                  <strong>Recommendations:</strong>
                  <p>{selectedEvent.recommendations}</p>
                </div>
              )}
              {selectedEvent.prerequisites && (
                <div>
                  <strong>Prerequisites:</strong>
                  <p>{selectedEvent.prerequisites}</p>
                </div>
              )}
              {selectedEvent.participants && selectedEvent.participants.length > 0 && (
                <div>
                  <strong>Participants:</strong>
                  <ul className="list-disc list-inside">
                    {selectedEvent.participants.map((participant, index) => (
                      <li key={index}>{participant.name || participant}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
