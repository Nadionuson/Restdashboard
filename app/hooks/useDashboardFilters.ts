import { useState } from 'react';

function useDashboardFilters() {
  const [cityFilter, setCityFilter] = useState('');
  const [neighborhoodFilter, setNeighborhoodFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [finalEvaluationFilter, setFinalEvaluationFilter] = useState('');
  const [nameSearchFilter, setNameSearchFilter] = useState('');
  const [hashtagFilter, setHashtagFilter] = useState('');
  const [showMineOnly, setShowMineOnly] = useState(true);
  const [justFriends, setJustFriends] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  return {
    cityFilter, setCityFilter,
    neighborhoodFilter, setNeighborhoodFilter,
    statusFilter, setStatusFilter,
    finalEvaluationFilter, setFinalEvaluationFilter,
    nameSearchFilter, setNameSearchFilter,
    hashtagFilter, setHashtagFilter,
    showMineOnly, setShowMineOnly,
    justFriends, setJustFriends,
    showFilters, setShowFilters
  };
}

export default useDashboardFilters;
