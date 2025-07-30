'use client';

import React, { useEffect, useState } from 'react';
import { Filters } from './ui/filter';
import router from 'next/router';
import { MapPin, Tag, Star, Filter as FilterIcon } from 'lucide-react';
import { Badge } from './ui/badge';

interface DashboardFiltersProps {
  cities: string[];
  cityFilter: string;
  setCityFilter: (value: string) => void;
  neighborhoods: string[];
  neighborhoodFilter: string;
  setneighborhoodFilter: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  finalEvaluationFilter: string;
  setFinalEvaluationFilter: (value: string) => void;
  nameSearchFilter: string;
  setNameSearchFilter: (value: string) => void;
  hashtagFilter: string;
  setHashtagFilter: (value: string) => void;
}

export const DashboardFilters: React.FC<DashboardFiltersProps> = ({
  cities,
  cityFilter,
  setCityFilter,
  neighborhoods,
  neighborhoodFilter,
  setneighborhoodFilter,
  statusFilter,
  setStatusFilter,
  finalEvaluationFilter,
  setFinalEvaluationFilter,
  nameSearchFilter,
  setNameSearchFilter,
  hashtagFilter,
  setHashtagFilter,
}) => {
  const [hashtags, setHashtags] = useState<string[]>([]);

  useEffect(() => {
    const fetchHashtags = async () => {
      try {
        const res = await fetch('/api/hashtags');
        const data = await res.json();
        setHashtags(data.map((tag: { name: string }) => tag.name));
      } catch (err) {
        console.error('Failed to fetch hashtags', err);
        router.push('/error');
      }
    };

    fetchHashtags();
  }, []);

  const clearAllFilters = () => {
    setCityFilter('');
    setneighborhoodFilter('');
    setStatusFilter('');
    setFinalEvaluationFilter('');
    setHashtagFilter('');
  };

  const hasActiveFilters = cityFilter || neighborhoodFilter || statusFilter || finalEvaluationFilter || hashtagFilter;

  return (
    <div className="space-y-6">
      {/* Filter Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* City Filter */}
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-sm font-medium">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span>City</span>
          </label>
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="input-modern"
          >
            <option value="">All Cities</option>
            {cities?.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

                 {/* Neighborhood Filter */}
         <div className="space-y-2">
           <label className="flex items-center space-x-2 text-sm font-medium">
             <MapPin className="w-4 h-4 text-muted-foreground" />
             <span>Neighborhood</span>
           </label>
           <select
             value={neighborhoodFilter}
             onChange={(e) => setneighborhoodFilter(e.target.value)}
             className="input-modern"
           >
             <option value="">All Neighborhoods</option>
             {neighborhoods?.map((location) => (
               <option key={location} value={location}>
                 {location}
               </option>
             ))}
           </select>
         </div>

        {/* Status Filter */}
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-sm font-medium">
            <FilterIcon className="w-4 h-4 text-muted-foreground" />
            <span>Status</span>
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-modern"
          >
            <option value="">All Status</option>
            <option value="visited">Visited</option>
            <option value="want to visit">Want to Visit</option>
            <option value="not recommended">Not Recommended</option>
          </select>
        </div>

        {/* Rating Filter */}
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-sm font-medium">
            <Star className="w-4 h-4 text-muted-foreground" />
            <span>Min Rating</span>
          </label>
          <select
            value={finalEvaluationFilter}
            onChange={(e) => setFinalEvaluationFilter(e.target.value)}
            className="input-modern"
          >
            <option value="">Any Rating</option>
            <option value="4">4+ Stars</option>
            <option value="3">3+ Stars</option>
            <option value="2">2+ Stars</option>
            <option value="1">1+ Star</option>
          </select>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border/50">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-muted-foreground">Active filters:</span>
            <div className="flex flex-wrap gap-2">
              {cityFilter && (
                <Badge variant="default" size="sm">
                  <MapPin className="w-3 h-3 mr-1" />
                  {cityFilter}
                </Badge>
              )}
              {neighborhoodFilter && (
                <Badge variant="default" size="sm">
                  <MapPin className="w-3 h-3 mr-1" />
                  {neighborhoodFilter}
                </Badge>
              )}
              {statusFilter && (
                <Badge variant="default" size="sm">
                  <FilterIcon className="w-3 h-3 mr-1" />
                  {statusFilter}
                </Badge>
              )}
              {finalEvaluationFilter && (
                <Badge variant="default" size="sm">
                  <Star className="w-3 h-3 mr-1" />
                  {finalEvaluationFilter}+ stars
                </Badge>
              )}
              {hashtagFilter && (
                <Badge variant="default" size="sm">
                  <Tag className="w-3 h-3 mr-1" />
                  #{hashtagFilter}
                </Badge>
              )}
            </div>
          </div>
          <button
            onClick={clearAllFilters}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
};
