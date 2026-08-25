import React from 'react';

const FilterChips = ({ chips, onRemove, onClear }) => {
  if (chips.length === 0) {
    return null;
  }

  return (
    <div className="mb-8 flex flex-wrap items-center gap-2" aria-label="Active filters">
      {chips.map((chip) => (
        <span key={chip.id} className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1.5 text-sm text-blue-100">
          {chip.label}
          <button
            type="button"
            onClick={() => onRemove(chip.id)}
            aria-label={`Remove ${chip.label} filter`}
            className="text-blue-300 transition-colors hover:text-white"
          >
            x
          </button>
        </span>
      ))}
      <button
        type="button"
        onClick={onClear}
        className="px-2 py-1.5 text-sm font-semibold text-gray-300 underline decoration-blue-400/60 underline-offset-4 transition-colors hover:text-white"
      >
        Clear all
      </button>
    </div>
  );
};

export default FilterChips;
