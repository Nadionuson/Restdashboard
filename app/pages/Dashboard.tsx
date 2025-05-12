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
import Link from 'next/link';

export default function Dashboard() {

  

  const { restaurants, refetch } = useRestaurants();
  const [editing, setEditing] = useState<Restaurant | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [locations, setLocations] = useState<string[]>([]);

  // Filter states
  const [locationFilter, setLocationFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [finalEvaluationFilter, setFinalEvaluationFilter] = useState('');
  const [nameSearchFilter, setNameSearchFilter] = useState('');
  const [hashtagFilter, setHashtagFilter] = useState('');
  const [visibilityFilter, setVisibilityFilter] = useState<string[]>(['mine']);

  const router = useRouter();
  const { data: session, status } = useSession();
  const currentUserId = session?.user?.id ? Number(session.user.id) : undefined;
  const friendIds: number[] = session?.user?.friendIds ?? [];

console.log('Session:', session);
console.log('Current user ID:', currentUserId);
console.log('Restaurants:', restaurants.map(r => ({ id: r.id, owner: r.OwnerId, name: r.name })));


  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/signin');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await fetch('/api/locations');
        const data = await res.json();
        setLocations(data);
      } catch (error) {
        console.error('Failed to fetch locations', error);
        router.push('/error');
      }
    };
    fetchLocations();
  }, []);

  const filteredRestaurants = restaurants.filter((r) => {
    const isMine = Number(r.OwnerId) === currentUserId;
    const isFriends = friendIds.includes(r.OwnerId);
    const isPublic = r.privacyLevel === 'PUBLIC';
    console.log('CurrentUserId', currentUserId, 'Restaurant.OwnerId', r.OwnerId);


    const matchesVisibility =
      visibilityFilter.length === 0
        ? true
        : (visibilityFilter.includes('mine') && isMine) ||
          (visibilityFilter.includes('friends') && isFriends && r.privacyLevel !== 'PRIVATE') ||
          (visibilityFilter.includes('public') && isPublic);

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
      matchesVisibility &&
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

      if (!res.ok) throw new Error('Failed to save restaurant');

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
      if (!res.ok) throw new Error('Failed to delete restaurant');

      await refetch();
    } catch (error) {
      console.error('Error deleting restaurant:', error);
      router.push('/error');
    }
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4 max-w-5xl mx-auto space-y-6">
      <div>
        <h1>
          Welcome, {session?.user.username} 👋 
          {session?.user && (
            <>
              <Link href="/account">
                <Button variant="outline" size="sm" className="ml-4">Go to Account</Button>
              </Link>
              <LogoutButton />
            </>
          )}
        </h1>
      </div>

      <h1 className="text-3xl font-bold">🍽️ Restaurant Dashboard</h1>

      {/* ✅ Visibility Filter */}
      <div className="flex items-center gap-2 mt-4 flex-wrap text-sm">
        {['mine', 'friends', 'public'].map((option) => (
          <label
            key={option}
            className={`px-3 py-1 rounded-full border cursor-pointer
              ${visibilityFilter.includes(option)
                ? 'bg-primary text-white'
                : 'bg-muted text-muted-foreground'}`}
          >
            <input
              type="checkbox"
              className="hidden"
              checked={visibilityFilter.includes(option)}
              onChange={() => {
                setVisibilityFilter((prev) =>
                  prev.includes(option)
                    ? prev.filter((v) => v !== option)
                    : [...prev, option]
                );
              }}
            />
            {option === 'mine' ? 'My Restaurants' :
              option === 'friends' ? 'Friends' : 'Public'}
          </label>
        ))}
      </div>

      {/* ✅ Filters */}
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

      {/* ✅ Add Restaurant Button */}
      <Button variant="default" onClick={() => { setEditing(null); setShowModal(true); }}>
        Add New Restaurant
      </Button>

      {/* ✅ Restaurant List */}
      <RestaurantList
        restaurants={filteredRestaurants}
        currentUserId={currentUserId}
        handleDelete={handleDelete}
        setShowModal={setShowModal}
        setEditing={setEditing}
      />

      {/* ✅ Restaurant Modal */}
      <RestaurantModal
        showModal={showModal}
        setShowModal={setShowModal}
        editing={editing}
        onSubmit={handleSave}
      />
    </div>
  );
}
