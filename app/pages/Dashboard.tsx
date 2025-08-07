'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Plus, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRestaurants } from '@/app/hooks/useRestaurant';
import { PrivacyLevel, Restaurant } from '@/app/types/restaurant';
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
import { SortDropdown } from '@/components/SortDropDown';

export default function Dashboard() {
  const { restaurants, refetch } = useRestaurants();

  const [editing, setEditing] = useState<Restaurant | null>(null);
  const [showModal, setShowModal] = useState(false);
  const { cities } = useLocations();
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
        return isSelected ? [] : ['all'];
      }
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

  const [recentSort, setRecentSort] = useState<"date" | "rating" | "name">("date");

  const recentlyAdded = [...enrichedRestaurants]
    .filter(r => new Date(r.createdAt) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
    .sort((a, b) => {
      if (recentSort === "rating") {
        return (b.evaluation.finalEvaluation || 0) - (a.evaluation.finalEvaluation || 0);
      } else if (recentSort === "name") {
        return a.name.localeCompare(b.name);
      } else {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    })
    .slice(0, 10);

  const myRestaurants = enrichedRestaurants.filter(r => r.owner?.id === currentUserId);
  const friendRestaurants = enrichedRestaurants.filter(r => friendIds.includes(r.owner?.id ?? -1));
  const publicSuggestions = enrichedRestaurants.filter(r =>
    r.privacyLevel !== PrivacyLevel.PRIVATE &&
    r.owner?.id !== currentUserId &&
    !friendIds.includes(r.owner?.id ?? -1)
  );

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/signin');
    }
  }, [status, router]);

  useEffect(() => {
    if (cityFilter) {
      const cityRestaurants = restaurants.filter(r => r.city === cityFilter);
      const uniqueneighborhoods = [...new Set(cityRestaurants.map(r => r.neighborhood))].filter((n): n is string => typeof n === 'string');
      setNeighborhoodsState(uniqueneighborhoods);
      if (neighborhoodFilter && !uniqueneighborhoods.includes(neighborhoodFilter)) {
        setneighborhoodFilter('');
      }
    } else {
      const allneighborhoods = [...new Set(restaurants.map(r => r.neighborhood))].filter((n): n is string => typeof n === 'string');
      setNeighborhoodsState(allneighborhoods);
    }
  }, [cityFilter, restaurants, neighborhoodFilter]);

  const { handleSave } = useRestaurantActions(refetch, setShowModal, setEditing);

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
        {/* Welcome */}
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

        {/* Filters */}
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
          showSort // ⬅️ Sorting enabled
        />

        <HorizontalRestaurantSection
          title="Suggested for You"
          restaurants={publicSuggestions}
          currentUserId={currentUserId}
          setEditing={setEditing}
          setShowModal={setShowModal}
          handleDelete={handleDelete}
          showSort // ⬅️ Sorting enabled
        />

        <HorizontalRestaurantSection
          title="My Restaurants"
          restaurants={myRestaurants}
          currentUserId={currentUserId}
          setEditing={setEditing}
          setShowModal={setShowModal}
          handleDelete={handleDelete}
          showSort // ⬅️ Sorting enabled
        />

        <HorizontalRestaurantSection
          title="Friends' Restaurants"
          restaurants={friendRestaurants}
          currentUserId={currentUserId}
          setEditing={setEditing}
          setShowModal={setShowModal}
          handleDelete={handleDelete}
          showSort // ⬅️ Sorting enabled
        />



        <RestaurantModal
          showModal={showModal}
          setShowModal={setShowModal}
          editing={editing}
          onSubmit={handleSave}
        />
      </main>
    </div>
  );
}
