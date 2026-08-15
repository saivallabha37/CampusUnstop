import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import SpotlightCard from '../components/reactbits/SpotlightCard';

const Profile = ({ user }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [stats, setStats] = useState({
    eventsParticipated: 0,
    eventsCreated: 0
  });
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({
    name: user.name,
    phone: user.phone,
    college: user.college,
    year: user.year,
    branch: user.branch
  });
  const [myEvents, setMyEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [editingEvent, setEditingEvent] = useState(null);

  useEffect(() => {
    fetchUserStats();
    if (activeTab === 'events') {
      fetchMyEvents();
    }
  }, [activeTab]);

  const fetchUserStats = async () => {
    try {
      // Get events created by user
      const createdEvents = await api.getEventsByOrganizer(user.id);

      // Get events participated in
      const bookings = await api.getUserBookings(user.id);
      const eventsParticipated = bookings.length;

      setStats({
        eventsParticipated,
        eventsCreated: createdEvents.length
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyEvents = async () => {
    setEventsLoading(true);
    try {
      const events = await api.getEventsByOrganizer(user.id);
      setMyEvents(events);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setEventsLoading(false);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      // In a real app, you'd call an API to update user profile
      // For now, just update local state
      alert('Profile update functionality would be implemented here');
      setEditMode(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  const handleCancelEdit = () => {
    setEditData({
      name: user.name,
      phone: user.phone,
      college: user.college,
      year: user.year,
      branch: user.branch
    });
    setEditMode(false);
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return;
    }

    try {
      await api.deleteEvent(eventId);
      fetchMyEvents(); // Refresh the list
      fetchUserStats(); // Update stats
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event');
    }
  };

  const handleUpdateEvent = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        ...editingEvent,
        capacity: parseInt(editingEvent.capacity),
        date: new Date(editingEvent.date),
        registrationDeadline: new Date(editingEvent.registrationDeadline)
      };
      await api.updateEvent(editingEvent._id, updatedData);
      setEditingEvent(null);
      fetchMyEvents();
      alert('Event updated successfully!');
    } catch (error) {
      console.error('Error updating event:', error);
      alert('Failed to update event');
    }
  };

  const filteredEvents = myEvents.filter(event => {
    const now = new Date();
    const eventDate = new Date(event.date);

    if (filter === 'upcoming') {
      return eventDate > now;
    } else if (filter === 'past') {
      return eventDate <= now;
    }
    return true;
  });

  const getStatusBadge = (event) => {
    const now = new Date();
    const eventDate = new Date(event.date);

    if (eventDate > now) {
      return <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs">Upcoming</span>;
    } else if (eventDate.toDateString() === now.toDateString()) {
      return <span className="bg-yellow-600 text-white px-2 py-1 rounded-full text-xs">Today</span>;
    } else {
      return <span className="bg-gray-600 text-white px-2 py-1 rounded-full text-xs">Past</span>;
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 relative pt-24">

      <div className="max-w-7xl mx-auto relative z-10 animate-fade-in">
        <h1 className="text-4xl font-bold text-center mb-8">My Profile</h1>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="bg-neutral-900 p-1 rounded-lg inline-block">
            {[
              { id: 'profile', label: 'Profile' },
              { id: 'events', label: 'My Events' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-2 rounded-md transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'profile' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-2">
            <SpotlightCard
              className="p-6 glass-dark border border-slate-700/50 rounded-2xl shadow-[0_0_30px_rgba(34,197,94,0.15)]"
              spotlightColor="rgba(34, 197, 94, 0.3)"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Profile Information</h2>
                {!editMode ? (
                  <button
                    onClick={() => setEditMode(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-300"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <div className="space-x-2">
                    <button
                      onClick={handleSaveProfile}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg transition-colors duration-300"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg transition-colors duration-300"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                    {editMode ? (
                      <input
                        type="text"
                        name="name"
                        value={editData.name}
                        onChange={handleEditChange}
                        className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-white">{user.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                    <p className="text-white">{user.email}</p>
                    <p className="text-xs text-gray-500">Email cannot be changed</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Phone</label>
                    {editMode ? (
                      <input
                        type="tel"
                        name="phone"
                        value={editData.phone}
                        onChange={handleEditChange}
                        className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-white">{user.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">College</label>
                    {editMode ? (
                      <input
                        type="text"
                        name="college"
                        value={editData.college}
                        onChange={handleEditChange}
                        className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-white">{user.college}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Year</label>
                    {editMode ? (
                      <select
                        name="year"
                        value={editData.year}
                        onChange={handleEditChange}
                        className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="1st Year">1st Year</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="4th Year">4th Year</option>
                      </select>
                    ) : (
                      <p className="text-white">{user.year}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Branch</label>
                    {editMode ? (
                      <input
                        type="text"
                        name="branch"
                        value={editData.branch}
                        onChange={handleEditChange}
                        className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-white">{user.branch}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Role</label>
                  <p className="text-white capitalize">{user.role}</p>
                </div>
              </div>
            </SpotlightCard>
          </div>

          {/* Dashboard Stats */}
          <div>
            <SpotlightCard
              className="p-6 glass-dark border border-slate-700/50 rounded-2xl mb-6 shadow-[0_0_30px_rgba(168,85,247,0.15)]"
              spotlightColor="rgba(168, 85, 247, 0.3)"
            >
              <h2 className="text-2xl font-semibold mb-6">Dashboard</h2>

              {loading ? (
                <div className="text-center text-gray-400">Loading stats...</div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-white">{stats.eventsParticipated}</div>
                    <div className="text-blue-200">Events Participated</div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-white">{stats.eventsCreated}</div>
                    <div className="text-purple-200">Events Created</div>
                  </div>

                  <div className="bg-gradient-to-r from-green-600 to-green-700 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-white">
                      {stats.eventsParticipated + stats.eventsCreated}
                    </div>
                    <div className="text-green-200">Total Activity</div>
                  </div>
                </div>
              )}
            </SpotlightCard>


          </div>
        </div>
        ) : (
          /* My Events Tab */
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">My Events</h2>
              <Link
                to="/create-event"
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors duration-300"
              >
                Create New Event
              </Link>
            </div>

            {/* Stats Summary */}
            {myEvents.length > 0 && (
              <div className="mb-8">
                <SpotlightCard
                  className="p-6 glass-dark border border-slate-700/50 rounded-2xl shadow-[0_0_30px_rgba(147,51,234,0.15)]"
                  spotlightColor="rgba(147, 51, 234, 0.3)"
                >
                  <h2 className="text-2xl font-semibold mb-4">Event Summary</h2>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-400">{myEvents.length}</div>
                      <div className="text-gray-400">Total Events</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-400">
                        {myEvents.filter(e => new Date(e.date) > new Date()).length}
                      </div>
                      <div className="text-gray-400">Upcoming</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-yellow-400">
                        {myEvents.filter(e => new Date(e.date).toDateString() === new Date().toDateString()).length}
                      </div>
                      <div className="text-gray-400">Today</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-400">
                        {myEvents.reduce((sum, e) => sum + e.attendees, 0)}
                      </div>
                      <div className="text-gray-400">Total Attendees</div>
                    </div>
                  </div>
                </SpotlightCard>
              </div>
            )}

            {/* Filter Tabs */}
            <div className="mb-8">
              <div className="bg-neutral-900 p-1 rounded-lg inline-block">
                {[
                  { id: 'all', label: 'All Events' },
                  { id: 'upcoming', label: 'Upcoming' },
                  { id: 'past', label: 'Past' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setFilter(tab.id)}
                    className={`px-6 py-2 rounded-md transition-all duration-300 ${
                      filter === tab.id
                        ? 'bg-purple-600 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-neutral-800'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Events List */}
            {eventsLoading ? (
              <div className="text-center text-gray-400">Loading your events...</div>
            ) : filteredEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredEvents.map((event) => (
                  <SpotlightCard
                    key={event._id}
                    className="p-6 glass-dark border border-slate-700/50 rounded-2xl hover:border-blue-400/50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(147,51,234,0.2)]"
                    spotlightColor="rgba(147, 51, 234, 0.3)"
                  >
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <h3 className="text-xl font-semibold text-white">{event.title}</h3>
                        {getStatusBadge(event)}
                      </div>

                      <p className="text-gray-300 line-clamp-2">{event.description}</p>

                      <div className="space-y-2 text-sm text-gray-400">
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
                          <span>Category:</span>
                          <span>{event.category}</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-4 space-x-2">
                        <button
                          onClick={() => setEditingEvent({
                            ...event,
                            date: new Date(event.date).toISOString().split('T')[0],
                            registrationDeadline: event.registrationDeadline ? new Date(event.registrationDeadline).toISOString().split('T')[0] : ''
                          })}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors duration-300 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event._id)}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg transition-colors duration-300 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </SpotlightCard>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-400">
                <p className="mb-4">
                  {filter === 'all'
                    ? "You haven't created any events yet."
                    : `No ${filter} events found.`
                  }
                </p>
                <Link
                  to="/create-event"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors duration-300"
                >
                  Create Your First Event
                </Link>
              </div>
            )}

          </div>
        )}
      </div>

      {/* Edit Event Modal */}
      {editingEvent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-xl p-6 w-full max-w-md border border-slate-700 max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-white mb-6">Edit Event</h3>
            <form onSubmit={handleUpdateEvent} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={editingEvent.title}
                  onChange={(e) => setEditingEvent({...editingEvent, title: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                <textarea
                  required
                  value={editingEvent.description}
                  onChange={(e) => setEditingEvent({...editingEvent, description: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-400 focus:outline-none h-24 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                <select
                  required
                  value={editingEvent.category}
                  onChange={(e) => setEditingEvent({...editingEvent, category: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-400 focus:outline-none"
                >
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
                  value={editingEvent.date}
                  onChange={(e) => setEditingEvent({...editingEvent, date: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Capacity</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={editingEvent.capacity}
                  onChange={(e) => setEditingEvent({...editingEvent, capacity: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Registration Deadline</label>
                <input
                  type="date"
                  required
                  value={editingEvent.registrationDeadline}
                  onChange={(e) => setEditingEvent({...editingEvent, registrationDeadline: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-400 focus:outline-none"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditingEvent(null)}
                  className="flex-1 border border-slate-600 text-gray-300 hover:bg-slate-700 font-semibold py-2 px-4 rounded-lg transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;