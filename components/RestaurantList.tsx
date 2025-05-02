'use client';

import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Restaurant } from '../app/types/restaurant';


interface RestaurantListProps {
  restaurants: Restaurant[];
  currentUserId: Number | undefined;
  handleDelete: (id: number) => void;
  setShowModal: (show: boolean) => void;
  setEditing: (restaurant: Restaurant | null) => void;
}


export const RestaurantList: React.FC<RestaurantListProps> = ({
  restaurants,
  currentUserId,
  handleDelete,
  setShowModal,
  setEditing,
}) => {
  const [sortMode, setSortMode] = useState<'random' | 'rating' | 'name'>('random');
  const [shuffledRestaurants, setShuffledRestaurants] = useState<Restaurant[]>([]);

  useEffect(() => {
    setShuffledRestaurants([...restaurants].sort(() => Math.random() - 0.5));
  }, [restaurants]);

  const sortedRestaurants = React.useMemo(() => {
    if (sortMode === 'rating') {
      return [...restaurants].sort(
        (a, b) => (b.evaluation.finalEvaluation ?? 0) - (a.evaluation.finalEvaluation ?? 0)
      );
    }
    if (sortMode === 'name') {
      return [...restaurants].sort((a, b) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      );
    }
    
    return shuffledRestaurants;
  }, [sortMode, restaurants, shuffledRestaurants]);

  return (
    <>
      <div className="mb-4">
        <label className="mr-2 font-semibold">Sort by:</label>
        <select
          value={sortMode}
          onChange={(e) => setSortMode(e.target.value as 'random' | 'rating' | 'name')}
          className="border border-gray-300 rounded px-2 py-1 text-sm bg-white"
        >
          <option value="random">Random</option>
          <option value="rating">Rating</option>
          <option value="name">Name</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedRestaurants.map((r) => {
         
          const isOwner = r.owner?.id === Number(currentUserId);
          const isPublic = !r.isPrivate;

          // Only clickable if it's the owner's restaurant
          const cardProps = isOwner
            ? {
                onClick: () => {
                  setEditing(r);
                  setShowModal(true);
                },
                className: 'cursor-pointer hover:shadow-lg',
              }
            : {
                onClick: () => {},
                className: 'bg-gray-100 text-gray-500 opacity-70 pointer-events-none',
              };

          return (
            <Card key={r.id} {...cardProps}>
              <h2 className="text-xl font-semibold">{r.name}</h2>
              <p className="text-sm">{r.location}</p>
              <p className="text-sm italic">{r.status}</p>

              <p className="text-sm text-gray-600">
  Added on{' '}
  {new Date(r.updatedAt).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })}
</p>

              <div className="mt-2 text-sm">
                <span className="font-semibold">Final Rating:</span>{' '}
                {r.evaluation.finalEvaluation}
              </div>

              {r.hashtags && r.hashtags?.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {r.hashtags.map((tag) => (
                    <span
                      key={tag.name}
                      className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full"
                    >
                      #{tag.name}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-2 text-xs text-gray-500">
              Owner: {r.owner?.username ?? 'Unknown'}
  {isOwner && (
    <>
      {' '}| Private: {r.isPrivate ? 'Yes' : 'No'}
    </>
  )}
              </div>

              {/* Delete button only for owner */}
              {isOwner && (
                <Button
                  className="mt-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(r.id);
                  }}
                >
                  Delete
                </Button>
              )}
            </Card>
          );
        })}
      </div>
    </>
  );
};
