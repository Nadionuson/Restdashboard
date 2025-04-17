// components/Filters.tsx

import { Select } from './ui/select';
import { Input } from './ui/input';

interface FiltersProps {
  locationFilter: string;
  setLocationFilter: (filter: string) => void;
  finalEvaluationFilter: number | '';
  setFinalEvaluationFilter: (filter: number | '') => void;
  minRating: number | '';
  setMinRating: (rating: number | '') => void;
  locations: string[];
}

export const Filters: React.FC<FiltersProps> = ({
  locationFilter,
  setLocationFilter,
  finalEvaluationFilter,
  setFinalEvaluationFilter,
  minRating,
  setMinRating,
  locations,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
      <Select
        id="locationFilter"
        value={locationFilter}
        onChange={(e) => setLocationFilter(e.target.value)}
        options={locations}
        placeholder="Select Location"
      />
      <Input
        id="finalEvaluationFilter"
        type="number"
        value={finalEvaluationFilter}
        onChange={(e) => setFinalEvaluationFilter(Number(e.target.value))}
        min={0}
        max={5}
        step={0.1}
        placeholder="Final Evaluation"
      />
      <Input
        id="minRating"
        type="number"
        value={minRating}
        onChange={(e) => setMinRating(Number(e.target.value))}
        min={0}
        max={5}
        placeholder="Min Rating"
      />
    </div>
  );
};
