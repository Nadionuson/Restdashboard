'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import {
  Plus,
  Filter,
  Search,
  Grid3X3,
  Star,
  MapPin,
  Calendar,
  User,
  Users,
  Globe2
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import LogoutButton from '@/components/ui/logoutButton';
import { RestaurantList } from '@/components/RestaurantList';
import { useRestaurants } from '@/app/hooks/useRestaurant';
import { Restaurant } from '@/app/types/restaurant';
import { DashboardFilters } from '@/components/DashboardFilters';
import { RestaurantModal } from '@/components/DashboardModal';
import { Loading } from '@/components/ui/loading';

export default function Dashboard() {
  const { restaurants, refetch } = useRestaurants();
  

  const [editing, setEditing] = useState<Restaurant | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [cities, setCities] = useState<string[]>([]);
  const [cityFilter, setCityFilter] = useState('');
  const [neighborhoods, setneighborhoods] = useState<string[]>([]);
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

const enrichedRestaurants = restaurants.map((r) => ({
  ...r,
  owner: {
    ...r.owner,
    email: r.owner?.email ?? '',
    username: r.owner?.username ?? '',
    id: r.owner?.id ?? 0,
    isFriend: friendIds.includes(r.owner?.id ?? 0),
  },
}));

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

       

        // Case 1: if API returns object { cities: string[], neighborhoods: string[] }
        if (Array.isArray(data.cities) && Array.isArray(data.neighborhoods)) {
          setCities(data.cities);
          setneighborhoods(data.neighborhoods);
        }

        // Case 2: fallback if it returns a single array
        else if (Array.isArray(data)) {
          setCities(data);
          setneighborhoods(data);
        }

        // Error fallback
        else {
          throw new Error('Unexpected data format in /api/locations');
        }

      } catch (error) {
        console.error('Failed to fetch locations', error);
        router.push('/error');
      }
    };
    fetchLocations();
  }, []);

  // Update detailed locations based on selected city filter
  useEffect(() => {
    if (cityFilter) {
      // Filter restaurants by selected city and get unique detailed locations
      const cityRestaurants = restaurants.filter(r => r.city === cityFilter);
      const uniqueneighborhoods = [...new Set(cityRestaurants.map(r => r.neighborhood))].filter((location): location is string => Boolean(location));
      setneighborhoods(uniqueneighborhoods);

      // Clear detailed location filter if the current value is not available for the selected city
      if (neighborhoodFilter && !uniqueneighborhoods.includes(neighborhoodFilter)) {
        setneighborhoodFilter('');
      }
    } else {
      // If no city is selected, show all unique detailed locations from all restaurants
      const allneighborhoods = [...new Set(restaurants.map(r => r.neighborhood))].filter((location): location is string => Boolean(location));
      setneighborhoods(allneighborhoods);
    }
  }, [cityFilter, restaurants, neighborhoodFilter]);

 const allHashtags = Array.from(
  new Set(
    restaurants.flatMap((r) => r.hashtags?.map((tag) => tag.name) || [])
  )
).sort();

  const filteredRestaurants = enrichedRestaurants.filter((r) => {
    

  const matchesVisibility = (() => {
    if (visibilityFilters.includes('all')) return true;

    const isMine = r.owner?.id === currentUserId;
    const isFriend = r.owner?.isFriend && r.owner?.id !== currentUserId;

    if (visibilityFilters.includes('mine') && isMine) return true;
    if (visibilityFilters.includes('friends') && isFriend) return true;

    return false;
  })();

    const matchesCity = cityFilter ? r.city === cityFilter : true;
    const matchesneighborhood = neighborhoodFilter ? r.neighborhood === neighborhoodFilter : true;
    const matchesStatus = statusFilter ? r.status === statusFilter : true;
    const matchesFinalEvaluation = finalEvaluationFilter
      ? r.evaluation.finalEvaluation >= Number(finalEvaluationFilter)
      : true;
    const matchesName = nameSearchFilter
      ? r.name.toLowerCase().includes(nameSearchFilter.replace('*', '').toLowerCase())
      : true;
    const matchesHashtag = hashtagFilter.length
  ? hashtagFilter.every((tag) =>
      r.hashtags?.some((h) => h.name === tag)
    )
  : true;

    return (
      matchesVisibility &&
      matchesCity &&
      matchesneighborhood &&
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
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loading size="lg" text="Loading your dashboard..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Grid3X3 className="w-5 h-5 text-primary-foreground" />
                </div>
                <h1 className="text-xl font-semibold">Restaurant Hub</h1>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <User className="w-4 h-4" />
                <Link href="/account" className="text-sm text-muted-foreground hover:underline">
                  {session?.user?.username}
                </Link>
              </div>
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="card-modern p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Grid3X3 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Restaurants</p>
                <p className="text-2xl font-bold">{filteredRestaurants.length}</p>
              </div>
            </div>
          </div>

          <div className="card-modern p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average Rating</p>
                <p className="text-2xl font-bold">
                  {filteredRestaurants.length > 0
                    ? (filteredRestaurants.reduce((acc, r) => acc + (r.evaluation.finalEvaluation || 0), 0) / filteredRestaurants.length).toFixed(1)
                    : '0.0'
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="card-modern p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Cities</p>
                <p className="text-2xl font-bold">{new Set(filteredRestaurants.map(r => r.city)).size}</p>
              </div>
            </div>
          </div>

          <div className="card-modern p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold">
                  {filteredRestaurants.filter(r => {
                    const date = new Date(r.updatedAt);
                    const now = new Date();
                    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
                  }).length}
                </p>
              </div>
            </div>
          </div>
        </div>

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

          {/* Quick Filters */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              Quick Filter
            </label>
            <div className="flex gap-2 flex-wrap">

              <button
                type="button"
                onClick={() => toggleFilter('all')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border 
        ${visibilityFilters.includes('all')
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background text-muted-foreground border-border hover:bg-muted'}`}
              >
                <Globe2 className="w-4 h-4" />
                Show Me Everything
              </button>
              <button
                type="button"
                onClick={() => toggleFilter('friends')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border 
        ${visibilityFilters.includes('friends')
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background text-muted-foreground border-border hover:bg-muted'}`}
              >
                <Users className="w-4 h-4" />
                Friends'
              </button>
              <button
                type="button"
                onClick={() => toggleFilter('mine')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border 
        ${visibilityFilters.includes('mine')
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background text-muted-foreground border-border hover:bg-muted'}`}
              >
                <User className="w-4 h-4" />
                Just Mine
              </button>
            </div>
          </div>



          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={nameSearchFilter}
              onChange={(e) => setNameSearchFilter(e.target.value)}
              className="input-modern pl-10"
              placeholder="Search restaurants by name..."
            />
          </div>

          {showFilters && (
            <DashboardFilters
              cities={cities}
              cityFilter={cityFilter}
              setCityFilter={setCityFilter}
              neighborhoods={neighborhoods}
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

        {/* Restaurant List */}
        <RestaurantList
          restaurants={filteredRestaurants}
          currentUserId={currentUserId}
          handleDelete={handleDelete}
          setShowModal={setShowModal}
          setEditing={setEditing}
        />

        {/* Modal */}
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
