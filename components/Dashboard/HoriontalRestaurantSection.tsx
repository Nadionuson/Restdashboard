// components/HorizontalRestaurantSection.tsx
'use client';

import { useRef } from 'react';
import { RestaurantCard } from '../RestaurantCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Restaurant } from '@/app/types/restaurant'; // adjust to your types

interface Props {
  title: string;
  restaurants: Restaurant[];
  currentUserId: number | undefined;
  setEditing: (r: Restaurant | null) => void;
  setShowModal: (b: boolean) => void;
  handleDelete: (id: number) => void;
}

export const HorizontalRestaurantSection: React.FC<Props> = ({
  title,
  restaurants,
  currentUserId,
  setEditing,
  setShowModal,
  handleDelete,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    const container = containerRef.current;
    if (!container) return;

    const scrollAmount = 300;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  if (!restaurants.length) return null;

  return (
    <div className="my-8">
      <div className="flex items-center justify-between px-2 mb-2">
        <h2 className="text-xl font-semibold">{title}</h2>
        <div className="space-x-2">
          <button onClick={() => scroll('left')}>
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button onClick={() => scroll('right')}>
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="flex overflow-x-auto space-x-4 pb-2 px-2 scroll-smooth"
      >
        {restaurants.map((r) => (
          <div key={r.id} className="min-w-[300px] max-w-[300px] flex-shrink-0">
            <RestaurantCard
              restaurant={r}
              currentUserId={currentUserId}
              setEditing={setEditing}
              setShowModal={setShowModal}
              handleDelete={handleDelete}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
