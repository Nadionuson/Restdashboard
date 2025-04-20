// components/ui/filter.tsx
interface FiltersProps {
    locations: string[];
    locationFilter: string;
    setLocationFilter: (value: string) => void;
    statusFilter: string;
    setStatusFilter: (value: string) => void;
    finalEvaluationFilter: string; // New prop
    setFinalEvaluationFilter: (value: string) => void; // New setter function
  }
  
  export const Filters = ({
    locations,
    locationFilter,
    setLocationFilter,
    statusFilter,
    setStatusFilter,
    finalEvaluationFilter,
    setFinalEvaluationFilter,
  }: FiltersProps) => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div>
          <label htmlFor="location-filter" className="block mb-1 font-medium text-gray-700">
            Filter by Location
          </label>
          <select
            id="location-filter"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">All Locations</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>
  
        <div>
          <label htmlFor="status-filter" className="block mb-1 font-medium text-gray-700">
            Filter by Status
          </label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">All Statuses</option>
            <option value="Tried it">Tried it</option>
            <option value="Want to go">Want to go</option>
          </select>
        </div>
  
        <div>
          <label htmlFor="final-evaluation-filter" className="block mb-1 font-medium text-gray-700">
            Filter by Final Evaluation
          </label>
          <select
            id="final-evaluation-filter"
            value={finalEvaluationFilter}
            onChange={(e) => setFinalEvaluationFilter(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">All Ratings</option>
            {[1, 2, 3, 4, 5].map((rating) => (
              <option key={rating} value={rating}>
                {Array.from({ length: rating }, (_, index) => (
                  <span key={index} className="text-yellow-500">★</span>
                ))}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  };
  