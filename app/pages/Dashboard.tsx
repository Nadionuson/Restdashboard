'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RestaurantList } from '@/components/RestaurantList';
import { useRestaurants } from '@/app/hooks/useRestaurant';
import { Restaurant } from '@/app/types/restaurant';
import { DashboardFilters } from  '@/components/DashboardFilters';
import { RestaurantModal } from '@/components/DashboardModal';

export default function Dashboard() {
  const { restaurants, refetch } = useRestaurants();
  const [editing, setEditing] = useState<Restaurant | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [locations, setLocations] = useState<string[]>([]);
  const [locationFilter, setLocationFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [finalEvaluationFilter, setFinalEvaluationFilter] = useState('');
  const [nameSearchFilter, setNameSearchFilter] = useState('');
  const [hashtagFilter, setHashtagFilter] = useState('');

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
      ? r.evaluation.finalEvaluation >=  Number(finalEvaluationFilter)
      : true;
    const matchesName = nameSearchFilter
      ? r.name.toLowerCase().includes(nameSearchFilter.replace('*', '').toLowerCase())
      : true;
    const matchesHashtag = hashtagFilter
      ? r.hashtags?.some((tag) => tag.name === hashtagFilter)
      : true;
  
    return (
      matchesLocation &&
      matchesStatus &&
      matchesFinalEvaluation &&
      matchesName &&
      matchesHashtag
    );
  });
  

  const handleSave = async (restaurant: Restaurant) => {
    const isEdit = restaurant.id > 0;
    const endpoint = isEdit ? `/api/restaurants/${restaurant.id}` : '/api/restaurants';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(restaurant),
      });

      if (!res.ok) throw new Error("Failed to save restaurant");

      await refetch();
      setShowModal(false);
      setEditing(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/restaurants/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error("Failed to delete restaurant");

      await refetch();
    } catch (error) {
      console.error('Error deleting restaurant:', error);
    }
  };

  return (
    <div className="p-4 max-w-5xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">🍽️ Restaurant Dashboard</h1>

      <DashboardFilters
        locations={locations}
        locationFilter={locationFilter}
        setLocationFilter={setLocationFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        finalEvaluationFilter={finalEvaluationFilter}
        setFinalEvaluationFilter={setFinalEvaluationFilter}
        nameSearchFilter={nameSearchFilter}
        setNameSearchFilter={setNameSearchFilter}
        hashtagFilter={hashtagFilter}
        setHashtagFilter={setHashtagFilter}
      />

      <Button variant="default" onClick={() => { setEditing(null); setShowModal(true); }}>
        Add New Restaurant
      </Button>

      <RestaurantList
        restaurants={filteredRestaurants}
        handleDelete={handleDelete}
        setShowModal={setShowModal}
        setEditing={setEditing}
      />

      <RestaurantModal
        showModal={showModal}
        setShowModal={setShowModal}
        editing={editing}
        onSubmit={handleSave}
      />
    </div>
  );
}
