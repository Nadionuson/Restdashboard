'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

import { Button } from '@/components/ui/button';
import LogoutButton from '@/components/ui/logoutButton';
import { RestaurantList } from '@/components/RestaurantList';
import { useRestaurants } from '@/app/hooks/useRestaurant';
import { Restaurant } from '@/app/types/restaurant';
import { DashboardFilters } from '@/components/DashboardFilters';
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

  const router = useRouter();
  const { data: session, status } = useSession();

  const currentUserId = session?.user?.id ? Number(session.user.id) : undefined;

  // Redirect unauthenticated users
  useEffect(() => {
    console.log(status);
    if (status === 'unauthenticated') {
      router.replace('/signin');
    }
  }, [status, router]);

  // Fetch location data only once on mount
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
  }, []); // Empty dependency array ensures this runs only once

  // Filter restaurants based on filters
  const filteredRestaurants = restaurants.filter((r) => {
    const matchesLocation = locationFilter ? r.location === locationFilter : true;
    const matchesStatus = statusFilter ? r.status === statusFilter : true;
    const matchesFinalEvaluation = finalEvaluationFilter
      ? r.evaluation.finalEvaluation >= Number(finalEvaluationFilter)
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

  // Handle saving or editing a restaurant
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

      if (!res.ok) throw new Error('Failed to save restaurant');

      await refetch();
      setShowModal(false);
      setEditing(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Handle restaurant deletion
  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/restaurants/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete restaurant');

      await refetch();
    } catch (error) {
      console.error('Error deleting restaurant:', error);
    }
  };

  // ✅ Here we conditionally render content, but NOT conditionally call hooks
  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    
      // Ensure session is available before proceeding
  //if (status === 'loading') return <p>Loading...</p>;

    
    <div className="p-4 max-w-5xl mx-auto space-y-6">

      <div>
        <h1>Welcome, {session?.user?.email} 👋 {session?.user && <LogoutButton />}</h1>
        
      </div>
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
        currentUserId={currentUserId}
        handleDelete={handleDelete}
        setShowModal={setShowModal}
        setEditing={setEditing}       />

      <RestaurantModal
        showModal={showModal}
        setShowModal={setShowModal}
        editing={editing}
        onSubmit={handleSave}
      />
    </div>
  );
}
