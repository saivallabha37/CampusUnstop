import React from 'react';
import SpotlightCard from './reactbits/SpotlightCard';
import EventImage from './EventImage';

const EventCard = ({
  event,
  eligible,
  registered,
  hasDeadline,
  hasCapacity,
  onClick,
  onRegister,
  user
}) => {
  return (
    <div onClick={onClick} className="cursor-pointer h-full">
      <SpotlightCard
        className="glass-dark rounded-2xl hover:border-blue-400/50 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(59,130,246,0.3)] h-full flex flex-col overflow-hidden p-0"
        spotlightColor="rgba(139, 92, 246, 0.25)"
      >
        {/* Top Image Section */}
        <div className="w-full aspect-[16/9] relative bg-slate-900 border-b border-slate-700/50">
          <EventImage 
            src={event.imageUrl} 
            alt={event.title}
            className="w-full h-full object-cover"
          />
          {/* Category Badge overlaying the image */}
          <div className="absolute top-4 right-4">
            <span className="text-xs font-medium bg-blue-600/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-white shadow-lg border border-blue-400/30">
              {event.category}
            </span>
          </div>
        </div>

        {/* Middle Information Section */}
        <div className="p-6 flex-grow flex flex-col space-y-4">
          <h3 className="text-xl font-semibold text-white line-clamp-2 leading-tight">
            {event.title}
          </h3>

          <div className="space-y-2 text-sm text-gray-400 bg-slate-800/40 p-4 rounded-xl border border-slate-700/50 flex-grow">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-gray-300">
                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{new Date(event.date).toLocaleDateString()}</span>
              </div>
            </div>

            {event.location && (
              <div className="flex justify-between items-center mt-2">
                <div className="flex items-center gap-2 text-gray-300">
                  <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="line-clamp-1">{event.location}</span>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-700/50">
              <span className="text-gray-400">Capacity</span>
              <span className="font-medium text-gray-300">
                {event.attendees}/{event.capacity}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Actions Section */}
        <div className="px-6 pb-6 pt-0 flex justify-between items-center">
          {/* Status Indicator */}
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
              new Date(event.date) > new Date()
                ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                : new Date(event.date).toDateString() === new Date().toDateString()
                ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
            }`}
          >
            {new Date(event.date) > new Date()
              ? 'Upcoming'
              : new Date(event.date).toDateString() === new Date().toDateString()
              ? 'Today'
              : 'Past'}
          </span>

          {/* Registration Button */}
          {user && (
            <div onClick={(e) => e.stopPropagation()}>
              {registered ? (
                <button
                  disabled
                  className="bg-indigo-700/70 text-indigo-100 font-semibold px-4 py-1.5 text-sm rounded-lg cursor-not-allowed border border-indigo-400/30"
                >
                  ✓ Registered
                </button>
              ) : !eligible ? (
                <button
                  disabled
                  className="bg-gray-700 text-gray-400 font-semibold px-4 py-1.5 text-sm rounded-lg cursor-not-allowed opacity-70"
                >
                  Not Eligible
                </button>
              ) : !hasDeadline ? (
                <button
                  disabled
                  className="bg-gray-700 text-gray-400 font-semibold px-4 py-1.5 text-sm rounded-lg cursor-not-allowed"
                >
                  Closed
                </button>
              ) : !hasCapacity ? (
                <button
                  disabled
                  className="bg-gray-700 text-gray-400 font-semibold px-4 py-1.5 text-sm rounded-lg cursor-not-allowed"
                >
                  Full
                </button>
              ) : (
                <button
                  onClick={() => onRegister(event)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold px-4 py-1.5 text-sm rounded-lg transition-all duration-300 shadow-[0_0_10px_rgba(59,130,246,0.5)] transform hover:scale-105"
                >
                  Register
                </button>
              )}
            </div>
          )}
        </div>
      </SpotlightCard>
    </div>
  );
};

export default EventCard;
