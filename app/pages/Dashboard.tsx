'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Plus, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RestaurantList } from '@/components/RestaurantList';
import { useRestaurants } from '@/app/hooks/useRestaurant';
import { Restaurant } from '@/app/types/restaurant';
import { DashboardFilters } from '@/components/DashboardFilters';
import { RestaurantModal } from '@/components/DashboardModal';
import { Loading } from '@/components/ui/loading';
import { DashboardHeader } from '@/components/Dashboard/DashboardHeader';
import { DashboardStats } from '@/components/Dashboard/DashboardStats';
import { DashboardQuickFilters } from '@/components/Dashboard/DashboardQuickFilters';
import { DashboardSearchBar } from '@/components/Dashboard/DashboardSearchBar';
import { useDashboardFilters } from '@/app/hooks/useDashboardFilters';
import { useLocations } from '@/app/hooks/useLocations';
import { useRestaurantActions } from '@/app/hooks/useRestaurantActions';
import { HorizontalRestaurantSection } from '@/components/Dashboard/HoriontalRestaurantSection';

export default function Dashboard() {
  const { restaurants, refetch } = useRestaurants();


  const [editing, setEditing] = useState<Restaurant | null>(null);
  const [showModal, setShowModal] = useState(false);
  const { cities, setCities, neighborhoods, setNeighborhoods } = useLocations();
  const [cityFilter, setCityFilter] = useState('');
  const [neighborhoodsState, setNeighborhoodsState] = useState<string[]>([]);
  const [neighborhoodFilter, setneighborhoodFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [finalEvaluationFilter, setFinalEvaluationFilter] = useState('');
  const [nameSearchFilter, setNameSearchFilter] = useState('');
  const [hashtagFilter, setHashtagFilter] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);


  const router = useRouter();
  const { data: session, status } = useSession();

  const currentUserId = session?.user?.id ? Number(session.user.id) : undefined;
  const friendIds = session?.user?.friendIds || [];
  const [visibilityFilters, setVisibilityFilters] = useState<string[]>(['all']);
  const toggleFilter = (key: string) => {
    setVisibilityFilters((prev) => {
      const isSelected = prev.includes(key);
      if (key === 'all') {
        // Selecting "Show Me Everything" clears the others
        return isSelected ? [] : ['all'];
      }
      // Selecting "mine" or "friends" removes "all"
      const updated = isSelected
        ? prev.filter((k) => k !== key)
        : [...prev.filter((k) => k !== 'all'), key];
      return updated;
    });
  };

  const { enrichedRestaurants, filteredRestaurants, allHashtags } = useDashboardFilters({
    restaurants,
    currentUserId,
    friendIds,
    visibilityFilters,
    cityFilter,
    neighborhoodFilter,
    statusFilter,
    finalEvaluationFilter,
    nameSearchFilter,
    hashtagFilter,
  });

  const myRestaurants = enrichedRestaurants.filter(r => r.owner?.id === currentUserId);
  const friendRestaurants = enrichedRestaurants.filter(r => friendIds.includes(r.owner?.id ?? -1));
  const publicSuggestions = enrichedRestaurants.filter(r => !r.isPrivate && r.owner?.id !== currentUserId && !friendIds.includes(r.owner?.id ?? -1));
  const recentlyAdded = [...enrichedRestaurants].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 10);




  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/signin');
    }
  }, [status, router]);

  // Keep neighborhoods in sync with city filter and locations
  useEffect(() => {
    if (cityFilter) {
      // Filter restaurants by selected city and get unique detailed locations
      const cityRestaurants = restaurants.filter(r => r.city === cityFilter);
      const uniqueneighborhoods = [...new Set(cityRestaurants.map(r => r.neighborhood))].filter((location): location is string => Boolean(location));
      setNeighborhoodsState(uniqueneighborhoods);
      // Clear detailed location filter if the current value is not available for the selected city
      if (neighborhoodFilter && !uniqueneighborhoods.includes(neighborhoodFilter)) {
        setneighborhoodFilter('');
      }
    } else {
      // If no city is selected, show all unique detailed locations from all restaurants
      const allneighborhoods = [...new Set(restaurants.map(r => r.neighborhood))].filter((location): location is string => Boolean(location));
      setNeighborhoodsState(allneighborhoods);
    }
  }, [cityFilter, restaurants, neighborhoodFilter]);

  // Update detailed locations based on selected city filter
  useEffect(() => {
    if (cityFilter) {
      // Filter restaurants by selected city and get unique detailed locations
      const cityRestaurants = restaurants.filter(r => r.city === cityFilter);
      const uniqueneighborhoods = [...new Set(cityRestaurants.map(r => r.neighborhood))].filter((location): location is string => Boolean(location));
      // setNeighborhoods is now managed by useLocations, use setNeighborhoodsState for local UI

      // Clear detailed location filter if the current value is not available for the selected city
      if (neighborhoodFilter && !uniqueneighborhoods.includes(neighborhoodFilter)) {
        setneighborhoodFilter('');
      }
    } else {
      // If no city is selected, show all unique detailed locations from all restaurants
      const allneighborhoods = [...new Set(restaurants.map(r => r.neighborhood))].filter((location): location is string => Boolean(location));
      // setNeighborhoods is now managed by useLocations, use setNeighborhoodsState for local UI
    }
  }, [cityFilter, restaurants, neighborhoodFilter]);


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
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loading size="lg" text="Loading your dashboard..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader username={session?.user?.username ?? undefined} />
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-2">
                Welcome back, {session?.user.username} 👋
              </h2>
              <p className="text-muted-foreground">
                Manage your restaurant collection and discover new places
              </p>
            </div>
            <Button
              onClick={() => { setEditing(null); setShowModal(true); }}
              className="btn-modern bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Restaurant
            </Button>
          </div>
        </div>
        <DashboardStats restaurants={filteredRestaurants} />
        {/* Filters Section */}
        <div className="card-modern p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-muted-foreground" />
              <h3 className="text-lg font-semibold">Filters & Search</h3>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="btn-modern"
            >
              {showFilters ? 'Hide' : 'Show'} Filters
            </Button>
          </div>
          <DashboardQuickFilters visibilityFilters={visibilityFilters} toggleFilter={toggleFilter} />
          <DashboardSearchBar value={nameSearchFilter} onChange={setNameSearchFilter} />
          {showFilters && (
            <DashboardFilters
              cities={cities}
              cityFilter={cityFilter}
              setCityFilter={setCityFilter}
              neighborhoods={neighborhoodsState}
              neighborhoodFilter={neighborhoodFilter}
              setneighborhoodFilter={setneighborhoodFilter}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              finalEvaluationFilter={finalEvaluationFilter}
              setFinalEvaluationFilter={setFinalEvaluationFilter}
              nameSearchFilter={nameSearchFilter}
              setNameSearchFilter={setNameSearchFilter}
              hashtagFilter={hashtagFilter}
              setHashtagFilter={setHashtagFilter}
              allHashtags={allHashtags}
            />
          )}
        </div>
        <HorizontalRestaurantSection
          title="Recently Added"
          restaurants={recentlyAdded}
          currentUserId={currentUserId}
          setEditing={setEditing}
          setShowModal={setShowModal}
          handleDelete={handleDelete}
        />
      <HorizontalRestaurantSection
          title="Suggested for You"
          restaurants={publicSuggestions}
          currentUserId={currentUserId}
          setEditing={setEditing}
          setShowModal={setShowModal}
          handleDelete={handleDelete}
        />
        <HorizontalRestaurantSection
          title="My Restaurants"
          restaurants={myRestaurants}
          currentUserId={currentUserId}
          setEditing={setEditing}
          setShowModal={setShowModal}
          handleDelete={handleDelete}
        />
        <HorizontalRestaurantSection
          title="Friends' Restaurants"
          restaurants={friendRestaurants}
          currentUserId={currentUserId}
          setEditing={setEditing}
          setShowModal={setShowModal}
          handleDelete={handleDelete}
        />

        <RestaurantModal
          showModal={showModal}
          setShowModal={setShowModal}
          editing={editing}
          onSubmit={useRestaurantActions(refetch, setShowModal, setEditing).handleSave}
        />
      </main>
    </div>
  );
}
