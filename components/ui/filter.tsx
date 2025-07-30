// components/ui/filter.tsx
interface FiltersProps {
  city: string[];
  cityFilter: string;
  setcityFilter: (value: string) => void;
  neighborhoods: string[];               // NEW
  neighborhoodFilter: string;            // NEW
  setneighborhoodFilter: (value: string) => void; // NEW
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  finalEvaluationFilter: string;
  setFinalEvaluationFilter: (value: string) => void;
  hashtagFilter: string;
  setHashtagFilter: (value: string) => void;
  hashtags: string[];
}

export const Filters = ({
  city,
  cityFilter,
  setcityFilter,
  neighborhoods,
  neighborhoodFilter,
  setneighborhoodFilter,
  statusFilter,
  setStatusFilter,
  finalEvaluationFilter,
  setFinalEvaluationFilter,
  hashtagFilter,
  setHashtagFilter,
  hashtags
}: FiltersProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
      <div>
        <label htmlFor="location-filter" className="block mb-1 font-medium text-gray-700">
          Filter by City
        </label>
        <select
          id="location-filter"
          value={cityFilter}
          onChange={(e) => setcityFilter(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="">All Cities</option>
          {city.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="detailed-location-filter" className="block mb-1 font-medium text-gray-700">
          Filter by Neighborhood
        </label>
        <select
          id="detailed-location-filter"
          value={neighborhoodFilter}
          onChange={(e) => setneighborhoodFilter(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="">All Neighborhoods</option>
          {neighborhoods.map((dloc) => (
            <option key={dloc} value={dloc}>
              {dloc}
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

      <div>
        <label htmlFor="hashtag-filter" className="block mb-1 font-medium text-gray-700">
          Filter by Hashtag
        </label>
        <select
          id="hashtag-filter"
          value={hashtagFilter}
          onChange={(e) => setHashtagFilter(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="">All Hashtags</option>
          {hashtags.map((tag) => (
            <option key={tag} value={tag}>
              #{tag}
            </option>
          ))}
        </select>
      </div>

    </div>
  );
};
