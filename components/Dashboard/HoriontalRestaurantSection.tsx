import { useState, useMemo, useRef, useEffect } from 'react';
import { Restaurant } from '@/app/types/restaurant';
import { RestaurantCard } from '../RestaurantCard';
import { SortDropdown } from '@/components/SortDropDown';

interface HorizontalRestaurantSectionProps {
  title: string;
  restaurants: Restaurant[];
  currentUserId?: number;
  setEditing: (restaurant: Restaurant | null) => void;
  setShowModal: (show: boolean) => void;
  handleDelete: (id: number) => void;
  showSort?: boolean;
}

export function HorizontalRestaurantSection({
  title,
  restaurants,
  currentUserId,
  setEditing,
  setShowModal,
  handleDelete,
  showSort = false,
}: HorizontalRestaurantSectionProps) {
  const [sort, setSort] = useState<'date' | 'rating' | 'name'>('date');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const sortedRestaurants = useMemo(() => {
    return [...restaurants].sort((a, b) => {
      if (sort === 'rating') {
        return (b.evaluation.finalEvaluation || 0) - (a.evaluation.finalEvaluation || 0);
      } else if (sort === 'name') {
        return a.name.localeCompare(b.name);
      } else {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  }, [restaurants, sort]);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = 0;
    }
  }, [sort]);

  if (restaurants.length === 0) return null;

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        {showSort && <SortDropdown value={sort} onChange={setSort} />}
      </div>
      <div
        ref={scrollContainerRef}
        className="flex space-x-4 overflow-x-auto py-2"
      >
        {sortedRestaurants.map((restaurant) => (
          <RestaurantCard
            key={restaurant.id}
            restaurant={restaurant}
            currentUserId={currentUserId}
            setEditing={setEditing}
            setShowModal={setShowModal}
            handleDelete={handleDelete}
          />
        ))}
      </div>
    </section>
  );
}
