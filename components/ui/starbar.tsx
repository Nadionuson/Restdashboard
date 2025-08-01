import React from 'react';

export const StarBar: React.FC<{ rating: number; max?: number }> = ({ rating, max = 5 }) => {
  return (
    <div className="relative inline-block text-sm font-bold leading-none">
      {/* Background (gray) stars */}
      <div className="text-muted">
        {'★'.repeat(max)}
      </div>

      {/* Foreground (filled) stars clipped by width */}
      <div
        className="absolute top-0 left-0 text-yellow-500 overflow-hidden"
        style={{ width: `${(rating / max) * 100}%` }}
      >
        {'★'.repeat(max)}
      </div>
    </div>
  );
};
