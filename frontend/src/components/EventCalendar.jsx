import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EventImage from './EventImage';

// Helper to assign consistent colors to categories/events
const getCategoryColor = (category) => {
  const colors = [
    { bg: 'bg-blue-500/20', text: 'text-blue-300', dot: 'bg-blue-500', border: 'border-blue-500/20' },
    { bg: 'bg-green-500/20', text: 'text-green-300', dot: 'bg-green-500', border: 'border-green-500/20' },
    { bg: 'bg-pink-500/20', text: 'text-pink-300', dot: 'bg-pink-500', border: 'border-pink-500/20' },
    { bg: 'bg-yellow-500/20', text: 'text-yellow-300', dot: 'bg-yellow-500', border: 'border-yellow-500/20' },
    { bg: 'bg-purple-500/20', text: 'text-purple-300', dot: 'bg-purple-500', border: 'border-purple-500/20' }
  ];
  if (!category) return colors[0];
  const charCode = category.charCodeAt(0) + category.length;
  return colors[charCode % colors.length];
};

const CompactEventCard = ({ event, onClick }) => {
  const color = getCategoryColor(event.category);
  return (
    <div 
      onClick={() => onClick(event)}
      className="flex gap-3 bg-[#11131f] border border-white/5 rounded-xl p-3 hover:border-white/10 cursor-pointer group transition-colors"
    >
      <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
        <EventImage imageUrl={event.imageUrl} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-white text-sm font-semibold truncate group-hover:text-purple-400 transition-colors">{event.title}</h4>
        <div className="text-gray-400 text-xs flex items-center gap-1.5 mt-1.5">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="truncate">{new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
        {event.location && (
          <div className="text-gray-400 text-xs flex items-center gap-1.5 mt-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate">{event.location}</span>
          </div>
        )}
        <div className="flex gap-2 mt-2">
          <span className={`px-2 py-0.5 rounded text-[9px] font-medium border ${color.bg} ${color.text} ${color.border} truncate`}>
            {event.category || 'General'}
          </span>
        </div>
      </div>
      <div className="flex items-center text-gray-600 group-hover:text-purple-400 transition-colors">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
      </div>
    </div>
  );
};

const UpcomingEventCard = ({ event, onClick }) => {
  return (
    <div 
      onClick={() => onClick(event)}
      className="flex gap-3 bg-[#11131f] border border-white/5 rounded-xl p-3 hover:border-white/10 cursor-pointer group transition-colors"
    >
      <div className="w-20 h-16 rounded-lg overflow-hidden shrink-0">
        <EventImage imageUrl={event.imageUrl} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
      </div>
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <h4 className="text-white text-sm font-bold truncate group-hover:text-purple-400 transition-colors">{event.title}</h4>
        <div className="text-gray-400 text-[11px] flex items-center gap-1.5 mt-1.5">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="truncate">{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        </div>
        {event.location && (
          <div className="text-gray-400 text-[11px] flex items-center gap-1.5 mt-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate">{event.location}</span>
          </div>
        )}
      </div>
      <div className="flex items-center text-gray-600 group-hover:text-purple-400 transition-colors pr-1">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
      </div>
    </div>
  );
};

const EventCalendar = ({ events, onEventClick }) => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('month');
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

  const prevPeriod = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(year, month - 1, 1));
    } else {
      setCurrentDate(new Date(year, month, currentDate.getDate() - 7));
    }
  };

  const nextPeriod = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(year, month + 1, 1));
    } else {
      setCurrentDate(new Date(year, month, currentDate.getDate() + 7));
    }
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
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

  const getWeekCells = () => {
    const cells = [];
    const currentDay = currentDate.getDay(); // 0 (Sun) to 6 (Sat)
    const sunday = new Date(currentDate);
    sunday.setDate(currentDate.getDate() - currentDay);
    
    for (let i = 0; i < 7; i++) {
      const d = new Date(sunday);
      d.setDate(sunday.getDate() + i);
      cells.push({
        year: d.getFullYear(),
        month: d.getMonth(),
        date: d.getDate(),
        isCurrentMonth: d.getMonth() === month
      });
    }
    return cells;
  };

  const cellsToRender = viewMode === 'month' ? calendarCells : getWeekCells();

  const selectedDateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
  const selectedDayEvents = eventsByDate[selectedDateStr] || [];

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Compute upcoming events (next 3 future events across all dates)
  const now = new Date();
  const upcomingEvents = [...events]
    .filter(e => {
      const d = new Date(e.date);
      return !Number.isNaN(d.getTime()) && d >= new Date(now.getFullYear(), now.getMonth(), now.getDate());
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3);

  return (
    <div className="w-full max-w-[1440px] mx-auto space-y-6 pb-12">
      
      {/* 1. Calendar Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl border border-purple-500/30 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Campus Events Calendar</h1>
            <p className="text-gray-400 text-sm">Discover and explore events happening around campus</p>
          </div>
        </div>
        <button 
          onClick={() => navigate('/events')}
          className="flex items-center gap-2 border border-purple-500/30 text-purple-300 hover:bg-purple-500/10 px-5 py-2 rounded-lg text-sm font-medium transition-colors shrink-0"
        >
          Go to Events
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>

      {/* Main Layout: 2 Columns on Desktop */}
      <div className="flex flex-col xl:flex-row gap-6 items-start">
        
        {/* LEFT: Calendar controls and grid */}
        <div className="w-full xl:flex-1 flex flex-col gap-4">
          
          {/* Calendar Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={goToToday} 
                className="px-4 py-1.5 text-sm font-medium bg-[#1a1d2d] hover:bg-[#25293d] text-purple-300 border border-purple-500/30 rounded-lg transition-colors"
              >
                Today
              </button>
              <div className="flex bg-[#1a1d2d] rounded-lg border border-white/5 overflow-hidden">
                <button onClick={prevPeriod} className="px-3 py-1.5 hover:bg-white/5 text-gray-400 hover:text-white transition-colors border-r border-white/5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                </button>
                <button onClick={nextPeriod} className="px-3 py-1.5 hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
              <h2 className="text-xl font-bold text-white ml-2">
                {monthNames[month]} {year}
              </h2>
            </div>
            <div className="hidden sm:flex bg-[#1a1d2d] p-1 rounded-lg border border-white/5">
              <button 
                onClick={() => setViewMode('month')}
                className={`px-4 py-1 text-sm font-medium rounded-md transition-colors ${viewMode === 'month' ? 'bg-purple-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
              >
                Month
              </button>
              <button 
                onClick={() => setViewMode('week')}
                className={`px-4 py-1 text-sm font-medium rounded-md transition-colors ${viewMode === 'week' ? 'bg-purple-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
              >
                Week
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="bg-[#0f111a] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
            {/* Day Headers */}
            <div className="grid grid-cols-7 border-b border-white/5 bg-[#141724]">
              {dayNames.map(day => (
                <div key={day} className="py-3 text-center text-xs font-semibold text-gray-400">
                  {day}
                </div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7">
              {cellsToRender.map((cell, index) => {
                const dateStr = `${cell.year}-${String(cell.month + 1).padStart(2, '0')}-${String(cell.date).padStart(2, '0')}`;
                const dayEvents = eventsByDate[dateStr] || [];
                
                const today = new Date();
                const isToday = today.getDate() === cell.date && today.getMonth() === cell.month && today.getFullYear() === cell.year;
                const isSelected = selectedDate.getDate() === cell.date && selectedDate.getMonth() === cell.month && selectedDate.getFullYear() === cell.year;

                const maxEvents = viewMode === 'month' ? 2 : 5;
                const cellHeightClass = viewMode === 'month' ? 'h-[100px] md:h-[110px]' : 'min-h-[160px] h-auto sm:min-h-[220px]';

                // Render selected cell entirely differently (as per screenshot)
                if (isSelected) {
                  return (
                    <div 
                      key={`${dateStr}-${index}`}
                      className={`${cellHeightClass} bg-purple-500/10 border border-purple-500 flex flex-col items-center justify-center p-2 cursor-default relative shadow-[inset_0_0_20px_rgba(168,85,247,0.15)]`}
                    >
                      <div className="w-9 h-9 rounded-full bg-purple-400 text-white flex items-center justify-center font-bold text-sm mb-1.5 shadow-lg shrink-0">
                        {cell.date}
                      </div>
                      <div className="text-[11px] font-semibold text-white mb-1.5 shrink-0">
                        {dayEvents.length} events
                      </div>
                      <div className="flex gap-1 flex-wrap justify-center overflow-hidden">
                        {dayEvents.slice(0, 4).map((e, i) => {
                          const dotColor = getCategoryColor(e.category).dot;
                          return <div key={i} className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></div>;
                        })}
                        {dayEvents.length > 4 && <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>}
                      </div>
                    </div>
                  );
                }

                // Render normal unselected cell
                return (
                  <div 
                    key={`${dateStr}-${index}`}
                    onClick={() => {
                      setSelectedDate(new Date(cell.year, cell.month, cell.date));
                      if (viewMode === 'month' && !cell.isCurrentMonth) {
                        setCurrentDate(new Date(cell.year, cell.month, 1));
                      }
                    }}
                    className={`${cellHeightClass} border-r border-b border-white/5 p-1.5 cursor-pointer hover:bg-white/[0.02] transition-colors flex flex-col relative
                      ${viewMode === 'month' && !cell.isCurrentMonth ? 'bg-[#0a0c12] text-gray-600' : 'bg-transparent text-gray-300'}
                      ${(index + 1) % 7 === 0 ? 'border-r-0' : ''}
                    `}
                  >
                    <div className={`text-xs font-medium mb-1 pl-1 shrink-0 ${isToday ? 'text-purple-400 font-bold' : (viewMode === 'month' && !cell.isCurrentMonth ? 'text-gray-600' : 'text-gray-400')}`}>
                      {cell.date}
                    </div>
                    
                    <div className="flex flex-col gap-1 overflow-hidden flex-1">
                      {dayEvents.slice(0, maxEvents).map(event => {
                        const color = getCategoryColor(event.category);
                        return (
                          <div
                            key={event._id}
                            className={`flex items-center gap-1.5 px-1.5 py-1 rounded bg-[#1a1d2d] text-gray-300 text-[10px] truncate border border-white/5 hover:bg-white/10`}
                          >
                            <div className={`w-1.5 h-1.5 rounded-full ${color.dot} shrink-0`}></div>
                            <span className="truncate">{event.title}</span>
                          </div>
                        );
                      })}
                      {dayEvents.length > maxEvents && (
                        <div className="text-[10px] text-gray-500 pl-1 font-medium mt-0.5 shrink-0">
                          +{dayEvents.length - maxEvents} more
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
        <div className="w-full xl:w-[380px] shrink-0 flex flex-col bg-[#0f111a] border border-white/5 rounded-2xl overflow-hidden shadow-xl" style={{ maxHeight: 'calc(110px * 6 + 48px + 40px)', minHeight: viewMode === 'week' ? '400px' : 'auto' }}>
          {/* Panel Header */}
          <div className="p-5 flex justify-between items-start border-b border-white/5 bg-[#141724]">
            <div>
              <div className="text-gray-400 text-sm mb-0.5">Events on</div>
              <h2 className="text-lg font-bold text-white">
                {selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
              </h2>
            </div>
            <div className="bg-[#1a1d2d] border border-blue-500/30 text-blue-400 px-3 py-1 rounded-lg text-xs font-semibold">
              {selectedDayEvents.length} {selectedDayEvents.length === 1 ? 'event' : 'events'}
            </div>
          </div>

          {/* Event List */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 custom-scrollbar">
            {selectedDayEvents.length > 0 ? (
              selectedDayEvents.map(event => (
                <CompactEventCard key={event._id} event={event} onClick={onEventClick} />
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-500 py-12">
                <svg className="w-12 h-12 mb-3 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm">No events scheduled</p>
              </div>
            )}
          </div>

          {/* View All Button */}
          <div className="p-4 border-t border-white/5 bg-[#141724]">
            <button 
              onClick={() => navigate('/events')}
              className="w-full py-2.5 rounded-xl bg-[#1a1d2d] hover:bg-[#25293d] text-purple-300 text-sm font-medium border border-white/5 transition-colors flex items-center justify-between px-4"
            >
              <span>View All Events on {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      </div>

      {/* 15. UPCOMING EVENTS SECTION */}
      {upcomingEvents.length > 0 && (
        <div className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h2 className="text-lg font-bold text-white">Upcoming Events</h2>
            </div>
            <button 
              onClick={() => navigate('/events')}
              className="text-xs font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/30 hover:bg-blue-500/20 px-4 py-1.5 rounded-full transition-colors"
            >
              View All
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingEvents.map(event => (
              <UpcomingEventCard key={event._id} event={event} onClick={onEventClick} />
            ))}
          </div>
        </div>
      )}

      {/* Add custom scrollbar styling globally for this component scope */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
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
