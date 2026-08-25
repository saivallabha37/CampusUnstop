import React from 'react';

const categories = ['Technical', 'Cultural', 'Workshop', 'Sports', 'Other'];
const statuses = [
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'ongoing', label: 'Ongoing' },
  { value: 'past', label: 'Past' },
  { value: 'all', label: 'All events' }
];
const dateOptions = [
  { value: 'today', label: 'Today' },
  { value: 'tomorrow', label: 'Tomorrow' },
  { value: 'week', label: 'This week' },
  { value: 'month', label: 'This month' }
];

const EventFilters = ({
  open,
  category,
  datePreset,
  customDate,
  status,
  eligibleOnly,
  user,
  onCategoryChange,
  onDatePresetChange,
  onCustomDateChange,
  onStatusChange,
  onEligibleOnlyChange,
  onClear,
  onClose
}) => {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/80 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="glass-dark max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-t-2xl border border-slate-700/60 p-6 shadow-[0_0_50px_rgba(59,130,246,0.2)] sm:rounded-2xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-wider text-blue-300">Refine events</p>
            <h2 className="mt-1 text-2xl font-bold text-white">Find your next event</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close filters"
            className="rounded-lg p-2 text-xl text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
          >
            x
          </button>
        </div>

        <div className="space-y-6">
          <fieldset>
            <legend className="mb-3 text-sm font-semibold text-white">Category</legend>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              <button
                type="button"
                onClick={() => onCategoryChange('all')}
                className={`rounded-lg border px-3 py-2 text-sm transition-colors ${category === 'all' ? 'border-blue-400 bg-blue-600 text-white' : 'border-slate-700 bg-slate-900/60 text-gray-300 hover:border-blue-400/60'}`}
              >
                All categories
              </button>
              {categories.map((item) => (
                <button
                  type="button"
                  key={item}
                  onClick={() => onCategoryChange(item)}
                  className={`rounded-lg border px-3 py-2 text-sm transition-colors ${category === item ? 'border-blue-400 bg-blue-600 text-white' : 'border-slate-700 bg-slate-900/60 text-gray-300 hover:border-blue-400/60'}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-3 text-sm font-semibold text-white">Date</legend>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <button
                type="button"
                onClick={() => onDatePresetChange('')}
                className={`rounded-lg border px-3 py-2 text-sm transition-colors ${!datePreset && !customDate ? 'border-blue-400 bg-blue-600 text-white' : 'border-slate-700 bg-slate-900/60 text-gray-300 hover:border-blue-400/60'}`}
              >
                Any date
              </button>
              {dateOptions.map((item) => (
                <button
                  type="button"
                  key={item.value}
                  onClick={() => onDatePresetChange(item.value)}
                  className={`rounded-lg border px-3 py-2 text-sm transition-colors ${datePreset === item.value ? 'border-blue-400 bg-blue-600 text-white' : 'border-slate-700 bg-slate-900/60 text-gray-300 hover:border-blue-400/60'}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <label className="mt-3 block text-sm text-gray-300">
              Custom date
              <input
                type="date"
                value={customDate}
                onChange={(event) => onCustomDateChange(event.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>
          </fieldset>

          <fieldset>
            <legend className="mb-3 text-sm font-semibold text-white">Event status</legend>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {statuses.map((item) => (
                <button
                  type="button"
                  key={item.value}
                  onClick={() => onStatusChange(item.value)}
                  className={`rounded-lg border px-3 py-2 text-sm transition-colors ${status === item.value ? 'border-blue-400 bg-blue-600 text-white' : 'border-slate-700 bg-slate-900/60 text-gray-300 hover:border-blue-400/60'}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </fieldset>

          {user && (
            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-700 bg-slate-900/50 p-3 text-sm text-gray-200">
              <input
                type="checkbox"
                checked={eligibleOnly}
                onChange={(event) => onEligibleOnlyChange(event.target.checked)}
                className="h-4 w-4 accent-blue-500"
              />
              Show only events I&apos;m eligible for
            </label>
          )}
        </div>

        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClear}
            className="rounded-lg border border-slate-600 px-5 py-2.5 font-semibold text-gray-200 transition-colors hover:bg-slate-700/60"
          >
            Clear all
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-2.5 font-semibold text-white transition-all hover:from-blue-500 hover:to-purple-500"
          >
            Show events
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventFilters;
