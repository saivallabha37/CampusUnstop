import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import EventCard from '../components/EventCard';
import EventCalendar from '../components/EventCalendar';
import EventImage from '../components/EventImage';
import EventFilters from '../components/EventFilters';
import FilterChips from '../components/FilterChips';
import SortDropdown from '../components/SortDropdown';
import { useDialog } from '../contexts/DialogContext';

const Events = ({ user }) => {
  const { showDialog, showConfirmation } = useDialog();
  const location = useLocation();
  const navigate = useNavigate();
  
  const isCalendarView = location.pathname === '/calendar';

  const [events, setEvents] = useState([]);
  const [userBookings, setUserBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [datePreset, setDatePreset] = useState('');
  const [eligibleOnly, setEligibleOnly] = useState(false);
  const [sortOrder, setSortOrder] = useState('nearest');
  const [showFilters, setShowFilters] = useState(false);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // --------------------------------------------------
  // Fetch events
  // --------------------------------------------------

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setFetchError(false);

    try {
      const data = await api.getEvents();

      setEvents(Array.isArray(data) ? data : []);
      setFetchError(!Array.isArray(data));

    } catch (error) {

      setFetchError(true);

      console.error(
        'Error fetching events:',
        error
      );

    } finally {

      setLoading(false);

    }
  }, []);


  // --------------------------------------------------
  // Fetch user's registrations
  // --------------------------------------------------

  const fetchUserBookings = useCallback(async () => {

    if (!user?.id) {
      setUserBookings([]);
      return;
    }

    try {

      const bookings =
        await api.getUserBookings(user.id);

      setUserBookings(
        Array.isArray(bookings)
          ? bookings
          : []
      );

    } catch (error) {

      console.error(
        'Error fetching user bookings:',
        error
      );

      setUserBookings([]);

    }

  }, [user]);


  // --------------------------------------------------
  // Initial loading
  // --------------------------------------------------

  useEffect(() => {

    fetchEvents();

    fetchUserBookings();

  }, [
    fetchEvents,
    fetchUserBookings
  ]);


  // --------------------------------------------------
  // Check whether user registered for event
  // --------------------------------------------------

  const isUserRegistered = useCallback(
    (eventId) => {

      return userBookings.some((booking) => {

        const bookingEventId =
          typeof booking.eventId === 'object'
            ? booking.eventId?._id
            : booking.eventId;

        return (
          String(bookingEventId) ===
          String(eventId)
        );

      });

    },
    [userBookings]
  );


  // --------------------------------------------------
  // Eligibility check
  // --------------------------------------------------

  const isUserEligible = useCallback(
    (event) => {

      if (!user) {
        return false;
      }

      const eligibleYears =
        Array.isArray(event.eligibleYears)
          ? event.eligibleYears
          : [];

      // Empty eligibility = open to everyone
      if (eligibleYears.length === 0) {
        return true;
      }

      return eligibleYears.includes(
        user.year
      );

    },
    [user]
  );


  const filteredEvents = useMemo(() => {
    const now = new Date();
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const formatDateKey = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(startOfToday);
    endOfToday.setDate(endOfToday.getDate() + 1);
    const endOfWeek = new Date(startOfToday);
    endOfWeek.setDate(endOfWeek.getDate() + (7 - endOfWeek.getDay()));
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const matchingEvents = events.filter((event) => {
      const eventDate = new Date(event.date);
      const hasValidDate = !Number.isNaN(eventDate.getTime());
      const category = typeof event.category === 'string' ? event.category : '';
      const normalizedCategory = category.toLowerCase();

      if (activeTab === 'upcoming' && (!hasValidDate || eventDate <= now)) {
        return false;
      }

      if (activeTab === 'ongoing') {
        if (!hasValidDate) {
          return false;
        }

        const endDate = new Date(eventDate);
        endDate.setHours(23, 59, 59, 999);

        if (eventDate > now || endDate < now) {
          return false;
        }
      }

      if (activeTab === 'past') {
        if (!hasValidDate) {
          return false;
        }

        const endDate = new Date(eventDate);
        endDate.setHours(23, 59, 59, 999);

        if (endDate >= now) {
          return false;
        }
      }

      if (normalizedSearch && !String(event.title || '').toLowerCase().includes(normalizedSearch)) {
        return false;
      }

      if (categoryFilter !== 'all') {
        const matchesCategory = categoryFilter === 'Other'
          ? !['technical', 'cultural', 'sports', 'workshop'].includes(normalizedCategory)
          : normalizedCategory === categoryFilter.toLowerCase();

        if (!matchesCategory) {
          return false;
        }
      }

      if (dateFilter && (!hasValidDate || formatDateKey(eventDate) !== dateFilter)) {
        return false;
      }

      if (datePreset && (!hasValidDate || (
        datePreset === 'today' && (eventDate < startOfToday || eventDate >= endOfToday)
      ) || (
        datePreset === 'tomorrow' && (eventDate < endOfToday || eventDate >= new Date(endOfToday.getTime() + 86400000))
      ) || (
        datePreset === 'week' && (eventDate < startOfToday || eventDate >= endOfWeek)
      ) || (
        datePreset === 'month' && (eventDate < startOfToday || eventDate >= endOfMonth)
      ))) {
        return false;
      }

      if (eligibleOnly && !isUserEligible(event)) {
        return false;
      }

      return true;
    });

    return [...matchingEvents].sort((firstEvent, secondEvent) => {
      if (sortOrder === 'recent') {
        const firstCreated = new Date(firstEvent.createdAt || 0).getTime();
        const secondCreated = new Date(secondEvent.createdAt || 0).getTime();
        return (Number.isNaN(secondCreated) ? 0 : secondCreated) - (Number.isNaN(firstCreated) ? 0 : firstCreated);
      }

      if (sortOrder === 'available') {
        const firstAvailable = Number(firstEvent.capacity || 0) - Number(firstEvent.attendees || 0);
        const secondAvailable = Number(secondEvent.capacity || 0) - Number(secondEvent.attendees || 0);
        return secondAvailable - firstAvailable;
      }

      const firstDate = new Date(firstEvent.date).getTime();
      const secondDate = new Date(secondEvent.date).getTime();
      const safeFirstDate = Number.isNaN(firstDate) ? Number.MAX_SAFE_INTEGER : firstDate;
      const safeSecondDate = Number.isNaN(secondDate) ? Number.MAX_SAFE_INTEGER : secondDate;
      return sortOrder === 'latest' ? safeSecondDate - safeFirstDate : safeFirstDate - safeSecondDate;
    });
  }, [events, activeTab, searchTerm, categoryFilter, dateFilter, datePreset, eligibleOnly, sortOrder, isUserEligible]);

  const clearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('all');
    setDateFilter('');
    setDatePreset('');
    setActiveTab('upcoming');
    setEligibleOnly(false);
  };


  // --------------------------------------------------
  // Event details
  // --------------------------------------------------

  const handleEventClick = (event) => {

    setSelectedEvent(event);
    setShowModal(true);

  };


  // --------------------------------------------------
  // Register
  // --------------------------------------------------

  const handleRegister = async (event) => {

    if (!user) {

      await showDialog({
        type: 'information',
        title: 'Login Required',
        message:
          'Please login to register for events.'
      });

      return;

    }


    // ----------------------------------------------
    // Eligibility check
    // ----------------------------------------------

    if (!isUserEligible(event)) {

      await showDialog({
        type: 'warning',
        title: 'Not Eligible',
        message:
          `This event is only open to ${
            event.eligibleYears.join(', ')
          }.`
      });

      return;

    }


    // ----------------------------------------------
    // Duplicate protection
    // ----------------------------------------------

    if (
      isUserRegistered(event._id)
    ) {

      await showDialog({
        type: 'warning',
        title: 'Already Registered',
        message:
          'You are already registered for this event.'
      });

      return;

    }


    // ----------------------------------------------
    // Confirm registration
    // ----------------------------------------------

    const confirmed =
      await showConfirmation({

        title:
          'Confirm Registration',

        message:
          `Are you sure you want to register for "${event.title}"?`,

        confirmText:
          'Register',

        cancelText:
          'Cancel'

      });


    if (!confirmed) {
      return;
    }


    try {

      const result =
        await api.registerForEvent(
          user.id,
          event._id
        );


      // --------------------------------------------
      // Successful registration
      // --------------------------------------------

      if (
        result?.code === 'REGISTERED' ||
        result?.message ===
          'Registration successful'
      ) {

        /*
         * IMPORTANT:
         *
         * We do NOT show a success dialog.
         *
         * Instead, we immediately add the new
         * registration to userBookings.
         *
         * This causes the button to become:
         *
         *        ✓ Registered
         *
         * and disabled.
         */

        setUserBookings(prev => [
          ...prev,

          {
            _id:
              result.booking?._id,

            userId:
              user.id,

            eventId:
              event._id
          }

        ]);


        // Update attendee count locally

        setEvents(prevEvents =>
          prevEvents.map(item =>
            item._id === event._id
              ? {
                  ...item,
                  attendees:
                    item.attendees + 1
                }
              : item
          )
        );


        return;

      }


      // --------------------------------------------
      // Already registered
      // --------------------------------------------

      if (
        result?.code ===
        'ALREADY_REGISTERED'
      ) {

        await showDialog({
          type: 'warning',

          title:
            'Already Registered',

          message:
            'You are already registered for this event.'
        });

        /*
         * Refresh bookings because the backend
         * says the user is already registered.
         */

        await fetchUserBookings();

        return;

      }


      // --------------------------------------------
      // Not eligible
      // --------------------------------------------

      if (
        result?.code ===
        'NOT_ELIGIBLE'
      ) {

        await showDialog({
          type: 'warning',

          title:
            'Not Eligible',

          message:
            result.message
        });

        return;

      }


      // --------------------------------------------
      // Other backend response
      // --------------------------------------------

      await showDialog({

        type: 'information',

        title:
          'Registration Update',

        message:
          result?.message ||
          'Unable to process registration.'

      });

    } catch (error) {

      console.error(
        'Error registering:',
        error
      );


      /*
       * api.js may throw for HTTP 409.
       *
       * If your API helper exposes the backend
       * response, handle ALREADY_REGISTERED here.
       */

      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Registration failed. Please try again.';


      if (
        message
          .toLowerCase()
          .includes('already registered')
      ) {

        await showDialog({

          type:
            'warning',

          title:
            'Already Registered',

          message:
            'You are already registered for this event.'

        });


        await fetchUserBookings();

        return;

      }


      if (
        message
          .toLowerCase()
          .includes('not eligible')
      ) {

        await showDialog({

          type:
            'warning',

          title:
            'Not Eligible',

          message

        });

        return;

      }


      await showDialog({

        type:
          'error',

        title:
          'Registration Failed',

        message:
          'Registration failed. Please try again.'

      });

    }

  };


  // --------------------------------------------------
  // Tabs
  // --------------------------------------------------

  const tabs = [

    {
      id: 'upcoming',
      label: 'Upcoming Events'
    },

    {
      id: 'ongoing',
      label: 'Ongoing Events'
    },

    {
      id: 'past',
      label: 'Past Events'
    },

    {
      id: 'all',
      label: 'All Events'
    }

  ];

  const activeChips = [
    ...(searchTerm.trim() ? [{ id: 'search', label: `Search: ${searchTerm.trim()}` }] : []),
    ...(categoryFilter !== 'all' ? [{ id: 'category', label: categoryFilter }] : []),
    ...(dateFilter ? [{ id: 'date', label: dateFilter }] : []),
    ...(datePreset ? [{ id: 'datePreset', label: datePreset }] : []),
    ...(activeTab !== 'all' ? [{ id: 'status', label: activeTab[0].toUpperCase() + activeTab.slice(1) }] : []),
    ...(eligibleOnly ? [{ id: 'eligible', label: 'Eligible for me' }] : [])
  ];

  const removeFilter = (filterId) => {
    if (filterId === 'search') setSearchTerm('');
    if (filterId === 'category') setCategoryFilter('all');
    if (filterId === 'date') setDateFilter('');
    if (filterId === 'datePreset') setDatePreset('');
    if (filterId === 'status') setActiveTab('all');
    if (filterId === 'eligible') setEligibleOnly(false);
  };

  const handleDatePresetChange = (preset) => {
    setDatePreset(preset);
    if (preset) setDateFilter('');
  };

  const handleCustomDateChange = (date) => {
    setDateFilter(date);
    if (date) setDatePreset('');
  };


  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (
    <div className={`min-h-screen px-4 relative ${isCalendarView ? 'pt-24 pb-8' : 'py-8 pt-24'}`}>
      <div className={`${isCalendarView ? 'max-w-[1500px]' : 'max-w-7xl'} mx-auto relative z-10`}>


        {/* Heading */}
        {!isCalendarView && (
          <h1 className="text-5xl md:text-6xl font-bold text-center mb-12 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-fade-in">
            Explore Events
          </h1>
        )}


        {!isCalendarView && (
          <>
            {/* Search and filters */}
            <div className="mb-4 flex flex-col gap-3 md:flex-row">
              <label className="min-w-0 flex-1">
                <span className="sr-only">Search events by title</span>
                <input
                  type="search"
                  placeholder="Search events by title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowFilters(true)}
                  className="flex-1 rounded-lg border border-blue-400/40 bg-blue-500/10 px-5 py-3 font-semibold text-blue-100 transition-colors hover:bg-blue-500/20 focus:outline-none focus:ring-2 focus:ring-blue-500 md:flex-none"
                >
                  Filters{activeChips.length > 0 ? ` (${activeChips.length})` : ''}
                </button>
                <SortDropdown value={sortOrder} onChange={setSortOrder} />
              </div>
            </div>

            <FilterChips chips={activeChips} onRemove={removeFilter} onClear={clearFilters} />

            {/* Tabs */}
            <div className="flex justify-center mb-8">
              <div className="bg-neutral-900 p-1 rounded-lg">
                {tabs.map(tab => (
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
          </>
        )}

        {!isCalendarView && (
          <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => navigate('/events')}
                className="px-4 py-1.5 rounded-md text-sm font-medium transition-colors bg-blue-600 text-white shadow-lg"
              >
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                  List View
                </div>
              </button>
              <button
                onClick={() => navigate('/calendar')}
                className="px-4 py-1.5 rounded-md text-sm font-medium transition-colors text-gray-400 hover:text-white hover:bg-slate-800"
              >
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  Calendar View
                </div>
              </button>
            </div>
            
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <span>{filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'} found</span>
              {activeChips.length > 0 && (
                <button type="button" onClick={clearFilters} className="text-blue-300 underline underline-offset-4 hover:text-white">
                  Clear all
                </button>
              )}
            </div>
          </div>
        )}


        {/* Events */}

        {loading ? (

          <div className="text-center text-gray-400">
            Loading events...
          </div>

        ) : fetchError ? (

          <div className="text-center text-red-300">
            <p>We could not load events right now. Please try again later.</p>
            <button
              type="button"
              onClick={fetchEvents}
              className="mt-4 rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Retry
            </button>
          </div>

        ) : filteredEvents.length > 0 ? (

          isCalendarView ? (
            <EventCalendar events={filteredEvents} onEventClick={handleEventClick} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

            {filteredEvents.map(event => {

              const eligible =
                isUserEligible(event);

              const registered =
                isUserRegistered(event._id);

              const hasDeadline =
                new Date(
                  event.registrationDeadline
                ) > new Date();

              const hasCapacity =
                event.attendees <
                event.capacity;


              return (
                <EventCard
                  key={event._id}
                  event={event}
                  eligible={eligible}
                  registered={registered}
                  hasDeadline={hasDeadline}
                  hasCapacity={hasCapacity}
                  onClick={() => handleEventClick(event)}
                  onRegister={handleRegister}
                  user={user}
                />
              );

            })}

          </div>
          )

        ) : events.length === 0 ? (

          <div className="text-center text-gray-400">

            <p className="mb-4">
              No events are available yet.
            </p>

            {user && (

              <Link
                to="/create-event"
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors duration-300"
              >
                Create an Event
              </Link>

            )}

          </div>

        ) : (

          <div className="text-center text-gray-400">

            <p className="mb-4">
              No events match your current filters.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-300"
            >
              Clear Filters
            </button>

          </div>

        )}

      </div>

      <EventFilters
        open={showFilters}
        category={categoryFilter}
        datePreset={datePreset}
        customDate={dateFilter}
        status={activeTab}
        eligibleOnly={eligibleOnly}
        user={user}
        onCategoryChange={setCategoryFilter}
        onDatePresetChange={handleDatePresetChange}
        onCustomDateChange={handleCustomDateChange}
        onStatusChange={setActiveTab}
        onEligibleOnlyChange={setEligibleOnly}
        onClear={clearFilters}
        onClose={() => setShowFilters(false)}
      />

      {/* Event Details Modal */}

      {showModal && selectedEvent && (
        (() => {
          const eligible = isUserEligible(selectedEvent);
          const registered = isUserRegistered(selectedEvent._id);
          const hasDeadline = new Date(selectedEvent.registrationDeadline) > new Date();
          const hasCapacity = selectedEvent.attendees < selectedEvent.capacity;

          return (
            <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
              <div className="glass-dark rounded-2xl p-0 max-w-2xl w-full max-h-[90vh] overflow-y-auto transform scale-100 transition-transform duration-300 border border-slate-700/50 shadow-[0_0_50px_rgba(139,92,246,0.15)] flex flex-col">
                
                {/* Modal Header with Image */}
                <div className="relative w-full aspect-video bg-slate-900 shrink-0">
                  <EventImage 
                    src={selectedEvent.imageUrl} 
                    alt={selectedEvent.title}
                    className="w-full h-full object-cover rounded-t-2xl"
                  />
                  
                  <div className="absolute top-4 right-4 flex gap-2">
                    <span className="text-sm font-medium bg-blue-600/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-white shadow-lg border border-blue-400/30">
                      {selectedEvent.category}
                    </span>
                    <button
                      onClick={() => setShowModal(false)}
                      className="bg-black/50 hover:bg-black/80 text-white rounded-full p-2 backdrop-blur-sm transition-colors border border-white/10"
                      aria-label="Close"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 to-transparent p-6 pt-12">
                    <h2 className="text-3xl font-bold text-white drop-shadow-lg">
                      {selectedEvent.title}
                    </h2>
                  </div>
                </div>

                <div className="p-8 space-y-6 text-gray-300">
                  <div className="prose prose-invert max-w-none">
                    <p className="text-lg leading-relaxed whitespace-pre-wrap">
                      {selectedEvent.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-800/30 p-6 rounded-xl border border-slate-700/50">
                    <div className="space-y-4">
                      <div>
                        <strong className="block text-gray-400 text-sm mb-1">Date & Time</strong>
                        <div className="text-white">
                          {new Date(selectedEvent.date).toLocaleDateString()} at {new Date(selectedEvent.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                      </div>
                      
                      {selectedEvent.location && (
                        <div>
                          <strong className="block text-gray-400 text-sm mb-1">Location</strong>
                          <div className="text-white">{selectedEvent.location}</div>
                        </div>
                      )}
                      
                      <div>
                        <strong className="block text-gray-400 text-sm mb-1">Eligibility</strong>
                        <div className="text-white">
                          {selectedEvent.eligibleYears?.length > 0
                            ? selectedEvent.eligibleYears.join(', ')
                            : 'All Years'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <strong className="block text-gray-400 text-sm mb-1">Registration Deadline</strong>
                        <div className="text-white">
                          {new Date(selectedEvent.registrationDeadline).toLocaleDateString()}
                        </div>
                      </div>

                      <div>
                        <strong className="block text-gray-400 text-sm mb-1">Capacity Status</strong>
                        <div className="text-white flex items-center justify-between">
                          <span>{selectedEvent.attendees} / {selectedEvent.capacity} Reserved</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{width: `${Math.min(100, (selectedEvent.attendees / selectedEvent.capacity) * 100)}%`}}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {selectedEvent.recommendations && (
                    <div className="bg-blue-900/20 border border-blue-500/20 p-4 rounded-xl">
                      <strong className="block text-blue-400 mb-2">Recommendations</strong>
                      <p className="text-blue-100">{selectedEvent.recommendations}</p>
                    </div>
                  )}

                  {selectedEvent.prerequisites && (
                    <div className="bg-purple-900/20 border border-purple-500/20 p-4 rounded-xl">
                      <strong className="block text-purple-400 mb-2">Prerequisites</strong>
                      <p className="text-purple-100">{selectedEvent.prerequisites}</p>
                    </div>
                  )}

                  {selectedEvent.participants && selectedEvent.participants.length > 0 && (
                    <div>
                      <strong className="block text-gray-400 mb-2">Participants ({selectedEvent.participants.length})</strong>
                      <div className="flex flex-wrap gap-2">
                        {selectedEvent.participants.map((participant, index) => (
                          <span key={index} className="bg-slate-800 text-gray-300 px-3 py-1 rounded-full text-sm border border-slate-700">
                            {participant.name || participant}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Modal Footer / Registration Action */}
                  <div className="mt-8 pt-6 border-t border-slate-700/50 flex justify-end">
                    {user ? (
                      registered ? (
                        <button disabled className="bg-indigo-700/70 text-indigo-100 font-semibold px-8 py-3 rounded-xl cursor-not-allowed border border-indigo-400/30">
                          ✓ Already Registered
                        </button>
                      ) : !eligible ? (
                        <div className="flex flex-col items-end gap-1">
                          <button disabled className="bg-gray-700 text-gray-400 font-semibold px-8 py-3 rounded-xl cursor-not-allowed">
                            Not Eligible
                          </button>
                          <span className="text-sm text-red-400">Your year is not eligible for this event</span>
                        </div>
                      ) : !hasDeadline ? (
                        <button disabled className="bg-gray-700 text-gray-400 font-semibold px-8 py-3 rounded-xl cursor-not-allowed">
                          Registration Closed
                        </button>
                      ) : !hasCapacity ? (
                        <button disabled className="bg-gray-700 text-gray-400 font-semibold px-8 py-3 rounded-xl cursor-not-allowed">
                          Event is Full
                        </button>
                      ) : (
                        <button
                          onClick={() => handleRegister(selectedEvent)}
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(59,130,246,0.4)] transform hover:scale-105 text-lg"
                        >
                          Register for Event
                        </button>
                      )
                    ) : (
                      <button disabled className="bg-gray-800 text-gray-400 font-semibold px-8 py-3 rounded-xl border border-gray-700">
                        Log in to Register
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })()
      )}

    </div>
  );
};

export default Events;
