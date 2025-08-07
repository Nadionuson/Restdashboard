import { useMemo } from 'react';
import { Restaurant } from '@/app/types/restaurant';

interface UseDashboardFiltersProps {
  restaurants: Restaurant[];
  currentUserId?: number;
  friendIds: number[];
  visibilityFilters: string[];
  cityFilter: string;
  neighborhoodFilter: string;
  statusFilter: string;
  finalEvaluationFilter: string;
  nameSearchFilter: string;
  hashtagFilter: string[];
}

export function useDashboardFilters({
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
}: UseDashboardFiltersProps) {
  // Enrich restaurants with owner info
  const enrichedRestaurants = useMemo(() => restaurants.map((r) => ({
    ...r,
    owner: {
      ...r.owner,
      email: r.owner?.email ?? '',
      username: r.owner?.username ?? '',
      id: r.owner?.id ?? 0,
      isFriend: friendIds.includes(r.owner?.id ?? 0),
    },
  })), [restaurants, friendIds]);

  const filteredRestaurants = useMemo(() => enrichedRestaurants.filter((r) => {
    const matchesVisibility = (() => {
      if (visibilityFilters.includes('all')) return true;
      const isMine = r.owner?.id === currentUserId;
      const isFriend = r.owner?.isFriend && r.owner?.id !== currentUserId;
      if (visibilityFilters.includes('mine') && isMine) return true;
      if (visibilityFilters.includes('friends') && isFriend) return true;
      return false;
    })();
    const matchesCity = cityFilter ? r.city === cityFilter : true;
    const matchesNeighborhood = neighborhoodFilter ? r.neighborhood === neighborhoodFilter : true;
    const matchesStatus = statusFilter ? r.status === statusFilter : true;
    const matchesFinalEvaluation = finalEvaluationFilter
      ? r.evaluation.finalEvaluation >= Number(finalEvaluationFilter)
      : true;
    const matchesName = nameSearchFilter
      ? r.name.toLowerCase().includes(nameSearchFilter.replace('*', '').toLowerCase())
      : true;
    const matchesHashtag = hashtagFilter.length
      ? hashtagFilter.every((tag) => r.hashtags?.some((h) => h.name === tag))
      : true;
    return (
      matchesVisibility &&
      matchesCity &&
      matchesNeighborhood &&
      matchesStatus &&
      matchesFinalEvaluation &&
      matchesName &&
      matchesHashtag
    );
  }), [enrichedRestaurants, visibilityFilters, currentUserId, cityFilter, neighborhoodFilter, statusFilter, finalEvaluationFilter, nameSearchFilter, hashtagFilter]);

  const allHashtags = useMemo(() => Array.from(
    new Set(
      restaurants.flatMap((r) => r.hashtags?.map((tag) => tag.name) || [])
    )
  ).sort(), [restaurants]);


  return { enrichedRestaurants, filteredRestaurants, allHashtags };
}
