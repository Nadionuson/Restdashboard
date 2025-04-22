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
    };
    onSubmit(newRestaurant);
  };

  return (
    <form onSubmit={handleSubmit} className="max-h-[80vh] overflow-y-auto space-y-4 px-2">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-white pb-4 border-b border-gray-200 shadow-sm backdrop-blur-md">
        <div className="text-xl font-semibold py-2">
          {initialData ? 'Edit Restaurant' : 'Add New Restaurant'}
        </div>
      </div>
  
      {/* Name */}
      <div>
        <label className="block text-sm font-medium">Name</label>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </div>
  
      {/* Location */}
      <div>
        <label className="block text-sm font-medium">Location</label>
        <Input value={location} onChange={(e) => setLocation(e.target.value)} />
      </div>
  
      {/* Status */}
      <div>
        <label className="block text-sm font-medium">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as RestaurantStatus)}
          className="w-full border p-2 rounded"
        >
          <option value="Want to go">Want to go</option>
          <option value="Tried it">Tried it</option>
        </select>
      </div>
  
      {/* Last Visited Date */}
      {status === 'Tried it' && (
        <div>
          <label className="block text-sm font-medium">Last Visited Date</label>
          <Input
            type="date"
            value={lastVisitedDate}
            onChange={(e) => setLastVisitedDate(e.target.value)}
          />
        </div>
      )}
  
      {/* Highlights */}
      <div>
        <label className="block text-sm font-medium">Highlights</label>
        <Input value={highlights} onChange={(e) => setHighlights(e.target.value)} />
      </div>
  
      {/* Ratings */}
      <div>
        <label className="block text-sm font-medium">Ratings</label>
        <div className="space-y-2">
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
  
      {/* Hashtags */}
      <div>
        <HashtagSelector
          availableHashtags={availableHashtags}
          selectedHashtags={selectedHashtags}
          onSelectHashtag={handleSelectHashtag}
          onRemoveHashtag={handleRemoveHashtag}
        />
      </div>
  
      {/* Submit Button */}
      <div className="pt-4">
        <Button type="submit" className="w-full">
          {initialData ? 'Update Restaurant' : 'Add Restaurant'}
        </Button>
      </div>
    </form>
  );
  
};
