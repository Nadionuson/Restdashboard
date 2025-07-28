import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Restaurant, Evaluation, getFinalEvaluation, RestaurantStatus, Hashtag } from '../app/types/restaurant';
import StarRating from './ui/starRating';
import HashtagSelector from './hashtagSelector'; // Make sure the import path is correct
import router from 'next/router';

interface RestaurantFormProps {
  initialData: Restaurant | null;
  onSubmit: (restaurant: Restaurant) => void;
}

export const RestaurantForm: React.FC<RestaurantFormProps> = ({ initialData, onSubmit }) => {
  const [id] = useState(initialData?.id ?? 0);
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [detailedLocation, setDetailedLocation] = useState('');
  const [status, setStatus] = useState<RestaurantStatus>('Want to go');
  const [createdAt, setCreatedAt] = useState<string | Date>('');
  const [updatedAt, setUpdatedAt] = useState<string | Date>('');
  const [highlights, setHighlights] = useState('');
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
        router.push('/error');
      }
    };

    fetchHashtags();
  }, []);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setCity(initialData.city || '');
      setStatus(initialData.status);
      setHighlights(initialData.highlights || '');
      setEvaluation(initialData.evaluation);
      setSelectedHashtags(initialData.hashtags || []);
      setIsPrivate(initialData.isPrivate ?? false);
      setCreatedAt(initialData.createdAt);
      setUpdatedAt(initialData.updatedAt);
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
      city,
      detailedLocation,
      status,
      highlights,
      evaluation,
      hashtags: selectedHashtags,
      isPrivate: isPrivate,
      createdAt,
      updatedAt,
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
              <label className="block text-xs font-medium">City</label>
              <Input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full border p-2 rounded text-xs"
              />
            </div>

            {/* Detailed Location */}
            <div className="flex-1">
              <label className="block text-xs font-medium">Detailed Location</label>
              <Input
                value={detailedLocation}
                onChange={(e) => setDetailedLocation(e.target.value)}
                className="w-full border p-2 rounded text-xs"
                placeholder="Optional - part of the city"
              />
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
