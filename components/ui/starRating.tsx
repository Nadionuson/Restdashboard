import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  label?: string;
  value: number;
  onChange: (rating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({ label, value, onChange }) => {
  const handleClick = (rating: number) => {
    onChange(rating);
  };

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">{label}</span>
          <span className="text-xs text-muted-foreground">{value}/5</span>
        </div>
      )}
      <div className="flex items-center space-x-1">
        {Array.from({ length: 5 }, (_, index) => {
          const starIndex = index + 1;
          const isFilled = starIndex <= value;
          
          return (
            <button
              key={starIndex}
              type="button"
              onClick={() => handleClick(starIndex)}
              className="p-1 transition-all duration-200 ease-in-out hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded"
            >
              <Star
                className={`w-5 h-5 transition-colors duration-200 ${
                  isFilled 
                    ? 'text-yellow-500 fill-current' 
                    : 'text-muted-foreground/30 hover:text-yellow-400'
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default StarRating;
