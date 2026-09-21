import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EventImage from './EventImage';

const CompactEventCard = ({ event, onClick }) => {
  return (
    <div 
      onClick={() => onClick(event)}
      className="flex items-center gap-4 bg-[#11131f] hover:bg-[#1a1d2d] border border-white/5 rounded-xl p-3 cursor-pointer transition-all duration-300 group"
    >
      <div className="hidden sm:block w-20 h-16 rounded-lg overflow-hidden shrink-0">
        <EventImage imageUrl={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
      </div>
      <div className="flex-grow min-w-0 flex flex-col justify-center">
        <h4 className="text-white font-semibold truncate text-sm mb-1">{event.title}</h4>
        <div className="text-xs text-gray-400 flex items-center gap-2">
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          {event.location && (
            <>
              <span className="text-gray-600">•</span>
              <span className="flex items-center gap-1 truncate">
                <svg className="w-3.5 h-3.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {event.location}
              </span>
            </>
          )}
        </div>
        <div className="mt-1.5 flex gap-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20 truncate">
            {event.category}
          </span>
        </div>
      </div>
      <div className="shrink-0 text-gray-600 group-hover:text-purple-400 transition-colors">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
      </div>
    </div>
  );
};

const UpcomingEventCard = ({ event, onClick }) => {
  return (
    <div 
      onClick={() => onClick(event)}
      className="bg-[#11131f] hover:bg-[#1a1d2d] border border-white/5 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 group flex flex-col h-full"
    >
      <div className="h-32 w-full overflow-hidden relative">
        <EventImage imageUrl={event.imageUrl} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute top-2 right-2 px-2.5 py-1 rounded-md text-xs font-semibold bg-black/60 backdrop-blur-md text-white border border-white/10">
          {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h4 className="text-white font-bold text-base mb-2 line-clamp-2">{event.title}</h4>
        <div className="mt-auto space-y-2">
          {event.location && (
            <div className="text-xs text-gray-400 flex items-center gap-1.5">
              <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="truncate">{event.location}</span>
            </div>
          )}
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
            <span className="px-2.5 py-1 rounded text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 truncate max-w-[120px]">
              {event.category}
            </span>
            <div className="text-purple-400 group-hover:translate-x-1 transition-transform">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const EventCalendar = ({ events, onEventClick }) => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const eventsByDate = {};
  events.forEach(event => {
    const d = new Date(event.date);
    if (Number.isNaN(d.getTime())) return;
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    if (!eventsByDate[dateStr]) eventsByDate[dateStr] = [];
    eventsByDate[dateStr].push(event);
  });

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToToday = () => {
    const today = new Date();
    setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDate(today);
  };

  const calendarCells = [];
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i;
    calendarCells.push({ year: month === 0 ? year - 1 : year, month: month === 0 ? 11 : month - 1, date: d, isCurrentMonth: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarCells.push({ year, month, date: d, isCurrentMonth: true });
  }
  const remainingCells = 42 - calendarCells.length;
  for (let d = 1; d <= remainingCells; d++) {
    calendarCells.push({ year: month === 11 ? year + 1 : year, month: month === 11 ? 0 : month + 1, date: d, isCurrentMonth: false });
  }

  const selectedDateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
  const selectedDayEvents = eventsByDate[selectedDateStr] || [];

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  // Compute upcoming events (next 3 future events across all dates)
  const now = new Date();
  const upcomingEvents = [...events]
    .filter(e => {
      const d = new Date(e.date);
      return !Number.isNaN(d.getTime()) && d > now;
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3);

  return (
    <div className="w-full max-w-[1400px] mx-auto space-y-8 pb-12">
      
      {/* 1. Calendar Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-white/5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0 mt-1">
            <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Campus Events Calendar</h1>
            <p className="text-gray-400 mt-1">Discover and explore events happening around campus</p>
          </div>
        </div>
        <button 
          onClick={() => navigate('/events')}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-6 py-2.5 rounded-full font-medium transition-all shadow-[0_0_15px_rgba(147,51,234,0.3)] hover:shadow-[0_0_25px_rgba(147,51,234,0.5)] shrink-0"
        >
          Go to Events
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
        </button>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT: Calendar controls and grid */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Calendar Controls */}
          <div className="flex items-center justify-between bg-[#0f111a] border border-white/5 rounded-2xl p-4">
            <button onClick={goToToday} className="px-5 py-2 text-sm font-medium bg-[#1a1d2d] hover:bg-[#25293d] text-white rounded-lg transition-colors border border-white/5">
              Today
            </button>
            <div className="flex items-center gap-6">
              <button onClick={prevMonth} className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
              </button>
              <h2 className="text-xl font-bold text-white w-40 text-center">
                {monthNames[month]} {year}
              </h2>
              <button onClick={nextMonth} className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
            <div className="hidden sm:block w-[72px]"></div> {/* Spacer for centering */}
          </div>

          {/* Calendar Grid */}
          <div className="bg-[#0f111a] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
            {/* Day Headers */}
            <div className="grid grid-cols-7 border-b border-white/5 bg-black/20">
              {dayNames.map(day => (
                <div key={day} className="py-4 text-center text-xs font-bold text-gray-500 tracking-widest">
                  {day}
                </div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 grid-rows-6">
              {calendarCells.map((cell, index) => {
                const dateStr = `${cell.year}-${String(cell.month + 1).padStart(2, '0')}-${String(cell.date).padStart(2, '0')}`;
                const dayEvents = eventsByDate[dateStr] || [];
                
                const today = new Date();
                const isToday = today.getDate() === cell.date && today.getMonth() === cell.month && today.getFullYear() === cell.year;
                const isSelected = selectedDate.getDate() === cell.date && selectedDate.getMonth() === cell.month && selectedDate.getFullYear() === cell.year;

                return (
                  <div 
                    key={`${cell.year}-${cell.month}-${cell.date}-${index}`}
                    onClick={() => {
                      setSelectedDate(new Date(cell.year, cell.month, cell.date));
                      if (!cell.isCurrentMonth) {
                        setCurrentDate(new Date(cell.year, cell.month, 1));
                      }
                    }}
                    className={`min-h-[100px] md:min-h-[130px] p-2 border-r border-b border-white/5 cursor-pointer transition-colors relative flex flex-col
                      ${!cell.isCurrentMonth ? 'bg-black/20 text-gray-600' : 'bg-transparent text-gray-300 hover:bg-white/[0.02]'}
                      ${isSelected ? 'bg-purple-500/10 border-purple-500/30 shadow-[inset_0_0_0_1px_rgba(168,85,247,0.3)]' : ''}
                    `}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className={`text-sm font-semibold w-7 h-7 flex items-center justify-center rounded-full
                        ${isToday ? 'bg-purple-500 text-white shadow-[0_0_12px_rgba(168,85,247,0.6)]' : ''}
                        ${isSelected && !isToday ? 'text-purple-300 font-bold' : ''}
                      `}>
                        {cell.date}
                      </span>
                      
                      {/* Mobile Indicator Dots */}
                      <div className="xl:hidden flex gap-0.5 pt-1.5">
                        {dayEvents.slice(0, 3).map((e, i) => (
                          <div key={i} className="w-1.5 h-1.5 rounded-full bg-purple-400"></div>
                        ))}
                        {dayEvents.length > 3 && <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>}
                      </div>
                    </div>

                    {/* Desktop Event Badges */}
                    <div className="hidden xl:flex flex-col gap-1.5 overflow-hidden flex-grow">
                      {dayEvents.slice(0, 3).map(event => {
                        const isPast = new Date(event.date) < today;
                        return (
                          <div
                            key={event._id}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedDate(new Date(cell.year, cell.month, cell.date));
                              onEventClick(event);
                            }}
                            className={`text-xs px-2 py-1 rounded-md truncate transition-all border
                              ${isPast 
                                ? 'bg-[#1a1d2d] border-white/5 text-gray-500 hover:bg-[#25293d]' 
                                : 'bg-purple-500/10 border-purple-500/20 text-purple-200 hover:bg-purple-500/20'}
                            `}
                          >
                            <span className="opacity-70 mr-1">{new Date(event.date).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }).replace(' ', '')}</span>
                            <span className="font-medium">{event.title}</span>
                          </div>
                        );
                      })}
                      {dayEvents.length > 3 && (
                        <div 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDate(new Date(cell.year, cell.month, cell.date));
                            if (!cell.isCurrentMonth) setCurrentDate(new Date(cell.year, cell.month, 1));
                          }}
                          className="text-[11px] text-gray-400 font-medium py-0.5 px-1 hover:text-white hover:bg-white/5 rounded transition-colors w-fit cursor-pointer"
                        >
                          +{dayEvents.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT: Selected Day Panel */}
        <div className="lg:col-span-4 flex flex-col h-full">
          <div className="bg-[#0f111a] border border-white/5 rounded-2xl flex flex-col h-full shadow-xl overflow-hidden sticky top-24">
            
            {/* Panel Header */}
            <div className="p-6 border-b border-white/5 bg-black/20">
              <h3 className="text-gray-400 text-sm font-medium mb-1">Events on</h3>
              <h2 className="text-2xl font-bold text-white mb-3">
                {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
              </h2>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm font-medium">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div>
                {selectedDayEvents.length} {selectedDayEvents.length === 1 ? 'event' : 'events'}
              </div>
            </div>

            {/* Event List */}
            <div className="p-4 flex-grow overflow-y-auto max-h-[600px] space-y-3 custom-scrollbar">
              {selectedDayEvents.length > 0 ? (
                selectedDayEvents.map(event => (
                  <CompactEventCard key={event._id} event={event} onClick={onEventClick} />
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 py-12">
                  <svg className="w-12 h-12 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p>No events scheduled</p>
                  <p className="text-sm mt-1">Select another day</p>
                </div>
              )}
            </div>

            {/* View All Button */}
            {selectedDayEvents.length > 0 && (
              <div className="p-4 border-t border-white/5 bg-black/20">
                <button 
                  onClick={() => navigate('/events')}
                  className="w-full py-3 rounded-xl bg-[#1a1d2d] hover:bg-[#25293d] text-white font-medium border border-white/5 transition-colors flex items-center justify-center gap-2"
                >
                  View All Events
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 15. UPCOMING EVENTS SECTION */}
      {upcomingEvents.length > 0 && (
        <div className="pt-8 mt-12 border-t border-white/5">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white">Upcoming Events</h2>
            </div>
            <button 
              onClick={() => navigate('/events')}
              className="text-sm font-semibold text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1 group"
            >
              View All
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map(event => (
              <UpcomingEventCard key={event._id} event={event} onClick={onEventClick} />
            ))}
          </div>
        </div>
      )}

      {/* Add custom scrollbar styling globally for this component scope */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
};

export default EventCalendar;
