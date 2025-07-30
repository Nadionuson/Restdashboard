// hooks/useRestaurants.ts

import { useState, useEffect } from 'react';
import { Restaurant } from '../types/restaurant';
import router from 'next/router';

export const useRestaurants = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  const [locations, setLocations] = useState<string[]>([]);

  // Fetch restaurants on page load
  const fetchRestaurants = async () => {
    try {
    const res = await fetch('/api/restaurants');
    const data = await res.json();
    setRestaurants(data);
    setFilteredRestaurants(data); // Initially, show all restaurants
    fetchLocations();
    } catch(err){
      console.error('Failed to fetch restaurants', err);
      router.push('/error');
    }
  };

  // Fetch locations for dropdown filter
  const fetchLocations = async () => {
    try{
    const res = await fetch('/api/locations');
    const data = await res.json();
    setLocations(data.map((location: { city: string }) => location.city));
    }
    catch(err){
      console.error('Failed to fetch locations', err);
      router.push('/error');
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  return { restaurants, refetch: fetchRestaurants, filteredRestaurants, setFilteredRestaurants, locations };
};
