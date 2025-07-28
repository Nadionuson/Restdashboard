'use client';

import React, { useEffect, useState } from 'react';
import { Filters } from './ui/filter';
import router from 'next/router';

interface DashboardFiltersProps {
  cities: string[];
  cityFilter: string;
  setCityFilter: (value: string) => void;
  detailedLocations: string[];                  // NEW
  detailedLocationFilter: string;               // NEW
  setDetailedLocationFilter: (value: string) => void; // NEW
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
  detailedLocations,
  detailedLocationFilter,
  setDetailedLocationFilter,
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

  return (
    <>
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
        city={cities}
        cityFilter={cityFilter}
        setcityFilter={setCityFilter}
        detailedLocations={detailedLocations}
        detailedLocationFilter={detailedLocationFilter}
        setDetailedLocationFilter={setDetailedLocationFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        finalEvaluationFilter={finalEvaluationFilter}
        setFinalEvaluationFilter={setFinalEvaluationFilter}
        hashtags={hashtags}
        hashtagFilter={hashtagFilter}
        setHashtagFilter={setHashtagFilter}
      />
    </>
  );
};
