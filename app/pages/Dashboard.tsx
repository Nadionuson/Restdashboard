// pages/Dashboard.tsx
'use client'

import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { RestaurantForm } from '@/components/RestaurantForm';
import { Restaurant } from '../types/restaurant';
import { RestaurantList } from '../../components/RestaurantList';
import { useRestaurants } from '../hooks/useRestaurant';
import { Client } from 'pg';

export default function Dashboard() {
  const { restaurants, refetch } = useRestaurants();
  const [editing, setEditing] = useState<Restaurant | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [locations, setLocations] = useState<string[]>([]); // Store distinct locations
  const [locationFilter, setLocationFilter] = useState('');
  

  // Fetch distinct locations on load
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await fetch('/api/locations');
        const data = await res.json();
        setLocations(data);
      } catch (error) {
        console.error('Failed to fetch locations', error);
      }
    };

    fetchLocations();
  }, []);

  const filteredRestaurants = locationFilter
  ? restaurants.filter((r) => r.location === locationFilter)
  : restaurants;

  const handleSave = async (restaurant: Restaurant) => {
    const isEdit = restaurant.id > 0;
    const endpoint = isEdit ? `/api/restaurants/${restaurant.id}` : '/api/restaurants';
    const method = isEdit ? 'PUT' : 'POST';
  
    try {
      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(restaurant),
      });
  
      if (!res.ok) throw new Error("Failed to save restaurant");
  
    await refetch(); // <-- Refresh list after save
    setShowModal(false);
    setEditing(null);

    } catch (err) {
      console.error(err);
    }
  };
  

  const handleDelete = async (id: number) => {
    try {
      // Call the DELETE API endpoint to remove the restaurant
      const res = await fetch(`/api/restaurants/${id}`, {
        method: 'DELETE',
      });
  
      if (!res.ok) {
        throw new Error("Failed to delete restaurant");
      }

      await refetch(); // <-- Refresh list after save

    } catch (error) {
      console.error('Error deleting restaurant:', error);
    }
  };

  return (
    <div className="p-4 max-w-5xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">🍽️ Restaurant Dashboard</h1>

      <div className="mb-4">
  <label htmlFor="location-filter" className="block mb-1 font-medium text-gray-700">
    Filter by Location
  </label>
  <select
  id="location-filter"
  value={locationFilter}
  onChange={(e) => setLocationFilter(e.target.value)}
  className="w-full p-2 border border-gray-300 rounded"
>
  <option value="">All Locations</option>
  {locations.map((loc) => (
    <option key={loc} value={loc}>
      {loc}
    </option>
  ))}
</select>
</div>


      <Button onClick={() => { setEditing(null); setShowModal(true); }}>
        Add New Restaurant
      </Button>

      <RestaurantList
        restaurants={filteredRestaurants}
        handleDelete={handleDelete}
        setShowModal={setShowModal}
        setEditing={setEditing}
      />

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-h-[90vh] overflow-y-auto p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold mb-4">
              {editing ? 'Edit Restaurant' : 'Add New Restaurant'}
            </DialogTitle>
          </DialogHeader>
          <RestaurantForm initialData={editing} onSubmit={handleSave} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
