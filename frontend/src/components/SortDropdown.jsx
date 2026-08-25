import React, { useState } from 'react';

const sortOptions = [
  { value: 'nearest', label: 'Date: Nearest first' },
  { value: 'latest', label: 'Date: Latest first' },
  { value: 'recent', label: 'Recently added' },
  { value: 'available', label: 'Most available seats' }
];

const SortDropdown = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const selected = sortOptions.find((option) => option.value === value) || sortOptions[0];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((isOpen) => !isOpen)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 rounded-lg border border-slate-700 bg-slate-900/80 px-4 py-3 text-left text-sm font-semibold text-white transition-colors hover:border-purple-400/70 focus:outline-none focus:ring-2 focus:ring-purple-500 sm:w-auto"
      >
        <span>Sort: {selected.label.replace('Date: ', '')}</span>
        <span aria-hidden="true">v</span>
      </button>
      {open && (
        <div className="absolute right-0 top-full z-30 mt-2 w-full min-w-[220px] rounded-lg border border-slate-700 bg-slate-900 p-1 shadow-xl sm:w-auto">
          {sortOptions.map((option) => (
            <button
              type="button"
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className={`block w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${value === option.value ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-slate-800 hover:text-white'}`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SortDropdown;
