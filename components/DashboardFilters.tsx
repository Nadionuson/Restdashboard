'use client';

import React from 'react';
import { Filters } from './ui/filter';

interface DashboardFiltersProps {
  locations: string[];
  locationFilter: string;
  setLocationFilter: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  finalEvaluationFilter: string;
  setFinalEvaluationFilter: (value: string) => void;
  nameSearchFilter: string;
  setNameSearchFilter: (value: string) => void;
}

export const DashboardFilters: React.FC<DashboardFiltersProps> = ({
  locations,
  locationFilter,
  setLocationFilter,
  statusFilter,
  setStatusFilter,
  finalEvaluationFilter,
  setFinalEvaluationFilter,
  nameSearchFilter,
  setNameSearchFilter,
}) => {
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
        locations={locations}
        locationFilter={locationFilter}
        setLocationFilter={setLocationFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        finalEvaluationFilter={finalEvaluationFilter}
        setFinalEvaluationFilter={setFinalEvaluationFilter}
      />
    </>
  );
};
