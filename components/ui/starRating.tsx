import React from 'react';

interface StarRatingProps {
  value: number;          // The current rating (0-5)
  onChange: (rating: number) => void;  // Callback to update rating
}

const StarRating: React.FC<StarRatingProps> = ({ value, onChange }) => {
  const handleClick = (rating: number) => {
    onChange(rating); // Update the rating when a star is clicked
  };

  return (
    <div className="flex items-center space-x-1">
      {Array.from({ length: 5 }, (_, index) => {
        const starIndex = index + 1;

        return (
          <svg
            key={starIndex}
            onClick={() => handleClick(starIndex)}
            xmlns="http://www.w3.org/2000/svg"
            className={`w-8 h-8 cursor-pointer transition-all duration-200 ease-in-out
              ${starIndex <= value ? 'text-yellow-500' : 'text-yellow-300'} 
              hover:text-yellow-400`}
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 15.27l4.15 2.18-1.12-4.77 3.68-3.23-4.83-.42L10 2.5l-1.88 6.53-4.83.42 3.68 3.23-1.12 4.77L10 15.27z"
              clipRule="evenodd"
            />
          </svg>
        );
      })}
    </div>
  );
};

export default StarRating;
