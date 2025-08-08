'use client';

import React from 'react';
import Select from 'react-select';
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
  hashtagFilter: string[];
  setHashtagFilter: (value: string[]) => void;
  allHashtags: string[];
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
  hashtagFilter,
  setHashtagFilter,
  allHashtags,
}) => {
  const clearAllFilters = () => {
    setCityFilter('');
    setneighborhoodFilter('');
    setStatusFilter('');
    setFinalEvaluationFilter('');
    setHashtagFilter([]);
  };

  const hasActiveFilters =
    !!cityFilter ||
    !!neighborhoodFilter ||
    !!statusFilter ||
    !!finalEvaluationFilter ||
    (hashtagFilter && hashtagFilter.length > 0);

  const hashtagOptions = allHashtags.map((tag) => ({
    label: `#${tag}`,
    value: tag,
  }));

  return (
    <div className="space-y-6">
      {/* Filter Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* City */}
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
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* Neighborhood */}
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
            {neighborhoods.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
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
            <option value="Tried it">Visited</option>
            <option value="Want to go">Want to Visit</option>
          </select>
        </div>

        {/* Rating */}
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

        {/* Hashtag Multi-Select */}
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-sm font-medium">
            <Tag className="w-4 h-4 text-muted-foreground" />
            <span>Hashtags</span>
          </label>
          <Select
            isMulti
            options={hashtagOptions}
            value={hashtagOptions.filter((opt) =>
              hashtagFilter.includes(opt.value)
            )}
            onChange={(selected) =>
              setHashtagFilter(selected.map((s) => s.value))
            }
            placeholder="Select hashtags..."
            className="react-select-container"
            classNamePrefix="react-select"
          />
        </div>
      </div>

      {/* Active Filters */}
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
              {hashtagFilter.map((tag) => (
                <Badge key={tag} variant="default" size="sm">
                  <Tag className="w-3 h-3 mr-1" />
                  #{tag}
                </Badge>
              ))}
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
