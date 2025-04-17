// hooks/useRestaurants.ts

import { useState, useEffect } from 'react';
import { Restaurant } from '../types/restaurant';

export const useRestaurants = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  const [locations, setLocations] = useState<string[]>([]);

  // Fetch restaurants on page load
  const fetchRestaurants = async () => {
    const res = await fetch('/api/restaurants');
    const data = await res.json();
    setRestaurants(data);
    setFilteredRestaurants(data); // Initially, show all restaurants
    fetchLocations();
  };

  // Fetch locations for dropdown filter
  const fetchLocations = async () => {
    const res = await fetch('/api/restaurants/locations');
    const data = await res.json();
    setLocations(data.locations);
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  return { restaurants, filteredRestaurants, setFilteredRestaurants, locations };
};
