import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Restaurant, Evaluation, getFinalEvaluation, RestaurantStatus, Hashtag } from '../app/types/restaurant';
import StarRating from './ui/starRating';
import { HashtagSelector } from './hashtagSelector';

interface RestaurantFormProps {
  initialData: Restaurant | null;
  onSubmit: (restaurant: Restaurant) => void;
}

export const RestaurantForm: React.FC<RestaurantFormProps> = ({ initialData, onSubmit }) => {
  const [id] = useState(initialData?.id ?? 0);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState<RestaurantStatus>('Want to go');
  const [highlights, setHighlights] = useState('');
  const [lastVisitedDate, setLastVisitedDate] = useState<string>(() => {
    if (initialData?.lastVisitedDate) {
      // Convert to yyyy-mm-dd string if it's a Date or ISO string
      return new Date(initialData.lastVisitedDate).toISOString().split('T')[0];
    }
    return '';
  });
  const [evaluation, setEvaluation] = useState<Evaluation>({
    locationRating: 0,
    serviceRating: 0,
    priceQualityRating: 0,
    foodQualityRating: 0,
    atmosphereRating: 0,
    finalEvaluation: 0,
  });
  const [selectedHashtags, setSelectedHashtags] = useState<Hashtag[]>([]); // For storing selected hashtags

  const ALLOWED_HASHTAGS = ['Date', 'Family', 'Sangria', 'Dessert', 'Pateo', 'Rooftop'];

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setLocation(initialData.location);
      setStatus(initialData.status);
      setHighlights(initialData.highlights || '');
      setEvaluation(initialData.evaluation);
      setSelectedHashtags(initialData.hashtags || []); // Initialize selected hashtags
    }
  }, [initialData]);

  useEffect(() => {
    const finalEvaluation = getFinalEvaluation(evaluation);
    setEvaluation((prev) => ({
      ...prev,
      finalEvaluation,
    }));
  }, [
    evaluation.locationRating,
    evaluation.serviceRating,
    evaluation.priceQualityRating,
    evaluation.foodQualityRating,
    evaluation.atmosphereRating,
  ]);

  const handleHashtagSelect = (hashtag: string) => {
    // Check if hashtag is already selected to avoid duplicates
    if (!selectedHashtags.some((tag) => tag.name === hashtag)) {
      setSelectedHashtags((prev) => [...prev, { id: Date.now(), name: hashtag }]);
    }
  };

  const handleHashtagDeselect = (hashtag: string) => {
    setSelectedHashtags((prev) => prev.filter((tag) => tag.name !== hashtag));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRestaurant: Restaurant = {
      id,
      name,
      location,
      status,
      highlights,
      lastVisitedDate: status === 'Tried it' && lastVisitedDate ? new Date(lastVisitedDate) : null,
      evaluation,
      hashtags: selectedHashtags, // Include selected hashtags
    };
    onSubmit(newRestaurant);
  };

  return (
    <form onSubmit={handleSubmit} className="max-h-[80vh] overflow-y-auto space-y-4 px-2">
      {/* Sticky Top Section */}
      <div className="sticky top-0 z-10 bg-white pb-4 border-b border-gray-200 shadow-sm backdrop-blur-md">
        {/* Line 1: Name + Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Restaurant Name</label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter restaurant name"
              required
            />
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter location"
              required
            />
          </div>
        </div>

        {/* Line 2: Status + Last Visited Date (conditionally shown) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as RestaurantStatus)}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="Want to go">Want to go</option>
              <option value="Tried it">Tried it</option>
            </select>
          </div>
          {status === 'Tried it' && (
            <div>
              <label htmlFor="lastVisitedDate" className="block text-sm font-medium text-gray-700">Last Visited Date</label>
              <Input
                id="lastVisitedDate"
                type="date"
                value={lastVisitedDate}
                onChange={(e) => setLastVisitedDate(e.target.value)}
                required={status === 'Tried it'}
              />
            </div>
          )}
        </div>

        {/* Line 3: Final Evaluation + Save Button */}
        <div className="py-2 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Final Evaluation</label>
            <Input
              value={evaluation.finalEvaluation.toFixed(1)}
              disabled
              className="bg-gray-100"
            />
          </div>
          <div className="md:self-end">
            <Button type="submit" className="mt-2 md:mt-0">
              {initialData ? 'Save Changes' : 'Add Restaurant'}
            </Button>
          </div>
        </div>

      </div>

      {/* Hashtag Section */}
      <div className="space-y-4">
        <HashtagSelector
          availableHashtags={ALLOWED_HASHTAGS}
          selectedHashtags={selectedHashtags.map((h) => h.name)} // Send only the names for display
          onHashtagSelect={handleHashtagSelect}
          onHashtagDeselect={handleHashtagDeselect} onNewHashtag={function (newHashtag: string): void {
            throw new Error('Function not implemented.');
          } }        />
      </div>

      {/* Rest of the scrollable content */}
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-lg">Evaluation</h3>
          <div className="space-y-2">
            {[ 
              { label: 'Location', key: 'locationRating' },
              { label: 'Service', key: 'serviceRating' },
              { label: 'Price-Quality', key: 'priceQualityRating' },
              { label: 'Food Quality', key: 'foodQualityRating' },
              { label: 'Atmosphere', key: 'atmosphereRating' },
            ].map((item) => (
              <div key={item.key}>
                <label className="text-sm">{item.label} Rating</label>
                <StarRating
                  value={evaluation[item.key as keyof Evaluation] as number}
                  onChange={(rating) =>
                    setEvaluation((prev) => ({
                      ...prev,
                      [item.key]: rating,
                    }))
                  }
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="highlights" className="block text-sm font-medium text-gray-700">Highlights</label>
          <Input
            id="highlights"
            value={highlights}
            onChange={(e) => setHighlights(e.target.value)}
            placeholder="Enter highlights (optional)"
          />
        </div>
      </div>
    </form>
  );
};
