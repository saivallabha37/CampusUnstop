import React, { useState } from 'react';

const EventCalendar = ({ events, onEventClick }) => {
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

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-2xl p-4 sm:p-6 shadow-xl gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
          <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {monthNames[month]} {year}
        </h2>
        <div className="flex items-center gap-2 sm:gap-4">
          <button onClick={goToToday} className="px-4 py-2 text-sm font-medium bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors border border-slate-700 hover:border-slate-600">
            Today
          </button>
          <div className="flex items-center bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
            <button onClick={prevMonth} className="p-2 hover:bg-slate-700 text-gray-300 hover:text-white transition-colors" aria-label="Previous month">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <div className="w-px h-6 bg-slate-700"></div>
            <button onClick={nextMonth} className="p-2 hover:bg-slate-700 text-gray-300 hover:text-white transition-colors" aria-label="Next month">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
        {/* Day Headers */}
        <div className="grid grid-cols-7 border-b border-slate-800">
          {dayNames.map(day => (
            <div key={day} className="py-3 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">
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
                  // If clicking a date from prev/next month, jump to that month
                  if (!cell.isCurrentMonth) {
                    setCurrentDate(new Date(cell.year, cell.month, 1));
                  }
                }}
                className={`min-h-[80px] md:min-h-[120px] p-1 md:p-2 border-r border-b border-slate-800/50 cursor-pointer transition-colors relative
                  ${!cell.isCurrentMonth ? 'bg-slate-950/40 text-gray-600' : 'bg-transparent text-gray-300 hover:bg-slate-800/50'}
                  ${isSelected ? 'ring-2 ring-inset ring-purple-500/50 bg-purple-500/5' : ''}
                `}
              >
                <div className="flex justify-between items-start">
                  <span className={`text-xs md:text-sm font-medium w-6 h-6 md:w-8 md:h-8 flex items-center justify-center rounded-full
                    ${isToday ? 'bg-blue-600 text-white shadow-[0_0_10px_rgba(37,99,235,0.5)]' : ''}
                  `}>
                    {cell.date}
                  </span>
                  
                  {/* Mobile Indicator Dots */}
                  <div className="md:hidden flex gap-0.5 pt-1">
                    {dayEvents.slice(0, 3).map((e, i) => (
                      <div key={i} className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                    ))}
                    {dayEvents.length > 3 && <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div>}
                  </div>
                </div>

                {/* Desktop Event Badges */}
                <div className="hidden md:flex flex-col gap-1 mt-1 overflow-y-auto max-h-[80px] no-scrollbar">
                  {dayEvents.slice(0, 3).map(event => {
                    const isPast = new Date(event.date) < new Date();
                    return (
                      <div
                        key={event._id}
                        onClick={(e) => {
                          e.stopPropagation(); // prevent triggering date selection
                          onEventClick(event);
                        }}
                        className={`text-xs px-2 py-1 rounded truncate transition-colors border
                          ${isPast ? 'bg-slate-800/50 border-slate-700/50 text-gray-400 hover:bg-slate-700' : 'bg-blue-600/20 border-blue-500/30 text-blue-300 hover:bg-blue-600/40'}
                        `}
                        title={event.title}
                      >
                        {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {event.title}
                      </div>
                    );
                  })}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-center text-gray-400 font-medium py-0.5 hover:text-white">
                      +{dayEvents.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Day View (Primarily for Mobile, but useful on desktop too) */}
      <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-xl">
        <h3 className="text-xl font-bold text-white mb-4 border-b border-slate-800 pb-2">
          Events on {selectedDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        </h3>
        {selectedDayEvents.length > 0 ? (
          <div className="space-y-3">
            {selectedDayEvents.map(event => (
              <div 
                key={event._id}
                onClick={() => onEventClick(event)}
                className="flex items-center gap-4 bg-slate-800/40 hover:bg-slate-800 border border-slate-700/50 rounded-xl p-3 cursor-pointer transition-colors"
              >
                <div className="hidden sm:block w-20 h-14 bg-slate-900 rounded-lg overflow-hidden shrink-0">
                  {event.imageUrl ? (
                    <img src={event.imageUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-700">
                       <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>
                  )}
                </div>
                <div className="flex-grow min-w-0">
                  <h4 className="text-white font-medium truncate">{event.title}</h4>
                  <div className="text-sm text-gray-400 flex items-center gap-2 mt-0.5">
                    <span className="text-blue-400">{new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <span>•</span>
                    <span className="truncate">{event.category}</span>
                  </div>
                </div>
                <div className="shrink-0 text-gray-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            No events scheduled for this day.
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCalendar;
