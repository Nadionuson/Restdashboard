// pages/Dashboard.tsx
'use client'

import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { RestaurantForm } from '@/components/RestaurantForm';
import { Restaurant } from '../types/restaurant';
import { RestaurantList } from '../../components/RestaurantList';
import { useRestaurants } from '../hooks/useRestaurant';
import { Filters } from '../../components/ui/filter';

export default function Dashboard() {
  const { restaurants, refetch } = useRestaurants();
  const [editing, setEditing] = useState<Restaurant | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [locations, setLocations] = useState<string[]>([]);
  const [locationFilter, setLocationFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [finalEvaluationFilter, setFinalEvaluationFilter] = useState('');
  const [nameSearchFilter, setNameSearchFilter] = useState('');  // New state for name search

  // Fetch locations on load
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

  const filteredRestaurants = restaurants.filter((r) => {
    const matchesLocation = locationFilter ? r.location === locationFilter : true;
    const matchesStatus = statusFilter ? r.status === statusFilter : true;
    const matchesFinalEvaluation = finalEvaluationFilter
      ? r.evaluation.finalEvaluation === Number(finalEvaluationFilter)
      : true;
    const matchesName = nameSearchFilter
      ? r.name.toLowerCase().includes(nameSearchFilter.replace('*', '').toLowerCase())
      : true;
    return matchesLocation && matchesStatus && matchesFinalEvaluation && matchesName;
  });

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
      const res = await fetch(`/api/restaurants/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error("Failed to delete restaurant");
      }

      await refetch(); // <-- Refresh list after delete

    } catch (error) {
      console.error('Error deleting restaurant:', error);
    }
  };

  return (
    <div className="p-4 max-w-5xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">🍽️ Restaurant Dashboard</h1>

      <div className="mb-4">
        <label htmlFor="name-search" className="block mb-1 font-medium text-gray-700">
          Search by Name
        </label>
        <input
          type="text"
          id="name-search"
          value={nameSearchFilter}
          onChange={(e) => setNameSearchFilter(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Search by restaurant name"
        />
      </div>

      <Filters
        locations={locations}
        locationFilter={locationFilter}
        setLocationFilter={setLocationFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        finalEvaluationFilter={finalEvaluationFilter}
        setFinalEvaluationFilter={setFinalEvaluationFilter}
      />

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
