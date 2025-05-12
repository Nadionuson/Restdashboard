// hooks/useRestaurants.ts
import { useState, useEffect } from 'react';
import { Restaurant } from '../types/restaurant';
import router from 'next/router';

export const useRestaurants = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [friendIds, setFriendIds] = useState<number[]>([]);

  const fetchRestaurants = async () => {
    try {
      const res = await fetch('/api/restaurants');
      const data = await res.json();
      setRestaurants(data.restaurants || []);
      setFriendIds(data.friendIds || []);
    } catch (err) {
      console.error('Failed to fetch restaurants', err);
      router.push('/error');
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  return { restaurants, friendIds, refetch: fetchRestaurants };
};
