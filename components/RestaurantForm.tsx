import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Restaurant, Evaluation, getFinalEvaluation, RestaurantStatus, Hashtag } from '../app/types/restaurant';
import StarRating from './ui/starRating';
import HashtagSelector from './hashtagSelector'; // Make sure the import path is correct

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
      return new Date(initialData.lastVisitedDate).toISOString().split('T')[0];
    }
    return '';
  });
  const [isPrivate, setIsPrivate] = useState(initialData?.isPrivate ?? false);
  const [evaluation, setEvaluation] = useState<Evaluation>({
    locationRating: 0,
    serviceRating: 0,
    priceQualityRating: 0,
    foodQualityRating: 0,
    atmosphereRating: 0,
    finalEvaluation: 0,
  });
  const [selectedHashtags, setSelectedHashtags] = useState<Hashtag[]>([]);

  const [availableHashtags, setAvailableHashtags] = useState<Hashtag[]>([]);

  const ALLOWED_HASHTAGS = ['Date', 'Family', 'Sangria', 'Dessert', 'Pateo', 'Rooftop'];

  const handleSelectHashtag = (hashtag: Hashtag) => {
    setSelectedHashtags((prev) => [...prev, hashtag]);
  };

  const handleRemoveHashtag = (hashtag: Hashtag) => {
    setSelectedHashtags((prev) => prev.filter((h) => h.id !== hashtag.id));
  };

  useEffect(() => {
    const fetchHashtags = async () => {
      try {

        const res = await fetch('/api/hashtags');
        const data = await res.json();

        setAvailableHashtags(data);

      } catch (err) {
        console.error('Failed to load hashtags', err);
      }
    };

    fetchHashtags();
  }, []);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setLocation(initialData.location);
      setStatus(initialData.status);
      setHighlights(initialData.highlights || '');
      setEvaluation(initialData.evaluation);
      setSelectedHashtags(initialData.hashtags || []);
      setIsPrivate(initialData.isPrivate ?? false);
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
      hashtags: selectedHashtags,
      isPrivate: isPrivate,

    };
    onSubmit(newRestaurant);
    window.location.reload();
  };

  return (
    <div className="h-[calc(100vh-4rem)] overflow-hidden"> {/* Outer container with full height minus any navbar if you have one */}
      <form onSubmit={handleSubmit} className="h-full flex flex-col text-xs">
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 bg-background border-b border-border px-4 py-1 space-y-2">
          {/* Line 1: Name + Location */}
          <div className="flex flex-col md:flex-row gap-2">
            <div className="flex-1">
              <label className="block text-xs font-medium">Name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} className="w-full border p-2 rounded text-xs" />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium">Location</label>
              <Input value={location} onChange={(e) => setLocation(e.target.value)} className="w-full border p-2 rounded text-xs" />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as RestaurantStatus)}
                className="w-full border p-2 rounded text-xs"
              >
                <option value="Want to go">Want to go</option>
                <option value="Tried it">Tried it</option>
              </select>
            </div>
            {status === 'Tried it' && (
              <div className="flex-1">
                <label className="block text-xs font-medium">Last Visited Date</label>
                <Input
                  className="w-full border p-2 rounded text-xs"
                  type="date"
                  value={lastVisitedDate}
                  onChange={(e) => setLastVisitedDate(e.target.value)}
                />
              </div>
            )}
          </div>

          {/* Line 2: Status + Date */}
          <div className="flex flex-col md:flex-row gap-2">
            
          </div>

          {/* Line 3: Save Button */}
          {/* Line 3: Save Button */}
<div className="space-y-1">
  <Button type="submit" className="w-full">
    {initialData ? 'Update Restaurant' : 'Add Restaurant'}
  </Button>

  {/* Hashtag preview with remove functionality */}
  {selectedHashtags.length > 0 && (
    <div className="flex flex-wrap gap-1 pt-1">
      {selectedHashtags.map((tag) => (
        <span
          key={tag.id}
          className="bg-muted text-muted-foreground px-2 py-0.5 rounded-full text-[10px] flex items-center gap-1"
        >
          #{tag.name}
          <button
            onClick={() => handleRemoveHashtag(tag)} // Remove hashtag on click
            className="text-xs text-red-500 hover:text-red-700"
          >
            &times;
          </button>
        </span>
      ))}
    </div>
  )}
</div>

        </div>

        {/* Scrollable body content */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
         

          {/* Ratings */}
          {status === 'Tried it' && (
          <div>
            <label className="block text-xs font-medium mb-1">Ratings</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <StarRating
                label="Location"
                value={evaluation.locationRating}
                onChange={(value) => setEvaluation(prev => ({ ...prev, locationRating: value }))}
              />
              <StarRating
                label="Service"
                value={evaluation.serviceRating}
                onChange={(value) => setEvaluation(prev => ({ ...prev, serviceRating: value }))}
              />
              <StarRating
                label="Price/Quality"
                value={evaluation.priceQualityRating}
                onChange={(value) => setEvaluation(prev => ({ ...prev, priceQualityRating: value }))}
              />
              <StarRating
                label="Food"
                value={evaluation.foodQualityRating}
                onChange={(value) => setEvaluation(prev => ({ ...prev, foodQualityRating: value }))}
              />
              <StarRating
                label="Atmosphere"
                value={evaluation.atmosphereRating}
                onChange={(value) => setEvaluation(prev => ({ ...prev, atmosphereRating: value }))}
              />
            </div>
          </div>
          )}

        <div className="flex items-center space-x-2">
          <input
    type="checkbox"
    id="isPrivate"
    checked={isPrivate}
    onChange={(e) => setIsPrivate(e.target.checked)}
  />
          <label htmlFor="isPrivate" className="text-sm">Private</label>
        </div>

          {/* Hashtags */}
          <div>
            <HashtagSelector
              availableHashtags={availableHashtags}
              selectedHashtags={selectedHashtags}
              onSelectHashtag={handleSelectHashtag}
              onRemoveHashtag={handleRemoveHashtag}
            />
          </div>

           {/* Highlights */}
           <div>
            <label className="block text-xs font-medium">Highlights</label>
            <Input value={highlights} onChange={(e) => setHighlights(e.target.value)} className="w-full border p-2 rounded text-xs" />
          </div>
        </div>
      </form>
    </div>
  );


};
