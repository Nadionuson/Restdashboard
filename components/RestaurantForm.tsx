import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Restaurant, Evaluation, getFinalEvaluation, RestaurantStatus, Hashtag } from '../app/types/restaurant';
import StarRating from './ui/starRating';
import HashtagSelector from './hashtagSelector';
import { 
  MapPin, 
  Building2, 
  Star, 
  Hash, 
  Eye, 
  EyeOff, 
  Save,
  X,
  Plus
} from 'lucide-react';
import { Badge } from './ui/badge';
import router from 'next/router';

interface RestaurantFormProps {
  initialData: Restaurant | null;
  onSubmit: (restaurant: Restaurant) => void;
}

export const RestaurantForm: React.FC<RestaurantFormProps> = ({ initialData, onSubmit }) => {
  const [id] = useState(initialData?.id ?? 0);
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [neighborhood, setneighborhood] = useState('');
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
      setneighborhood(initialData.neighborhood || '');
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
    
    // Default neighborhood to city if it's empty
    const finalneighborhood = neighborhood.trim() || city;
    
    const newRestaurant: Restaurant = {
      id,
      name,
      city,
      neighborhood: finalneighborhood,
      status,
      highlights,
      evaluation,
      hashtags: selectedHashtags,
      isPrivate: isPrivate,
      createdAt,
      updatedAt,
    };
    onSubmit(newRestaurant);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center space-x-2">
          <Building2 className="w-5 h-5 text-muted-foreground" />
          <span>Basic Information</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-medium">
              <Building2 className="w-4 h-4 text-muted-foreground" />
              <span>Restaurant Name</span>
            </label>
            <Input 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Enter restaurant name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-medium">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span>City</span>
            </label>
            <Input 
              value={city} 
              onChange={(e) => setCity(e.target.value)} 
              placeholder="Enter city"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-sm font-medium">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span>Neighborhood</span>
          </label>
          <Input 
            value={neighborhood} 
            onChange={(e) => setneighborhood(e.target.value)} 
            placeholder="Optional - neighborhood, street, etc."
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-sm font-medium">
            <Star className="w-4 h-4 text-muted-foreground" />
            <span>Status</span>
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as RestaurantStatus)}
            className="input-modern"
          >
            <option value="Want to go">Want to go</option>
            <option value="Tried it">Tried it</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-sm font-medium">
            <Eye className="w-4 h-4 text-muted-foreground" />
            <span>Visibility</span>
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isPrivate"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
              className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2"
            />
            <label htmlFor="isPrivate" className="text-sm text-muted-foreground">
              Make this restaurant private
            </label>
          </div>
        </div>
      </div>

      {/* Ratings Section - Only show if status is "Tried it" */}
      {status === 'Tried it' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center space-x-2">
            <Star className="w-5 h-5 text-muted-foreground" />
            <span>Ratings</span>
            {evaluation.finalEvaluation > 0 && (
              <Badge variant="default" size="sm">
                {evaluation.finalEvaluation.toFixed(1)} / 5.0
              </Badge>
            )}
          </h3>
          
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
              label="Food Quality"
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

      {/* Hashtags Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center space-x-2">
          <Hash className="w-5 h-5 text-muted-foreground" />
          <span>Hashtags</span>
        </h3>
        
        {/* Selected Hashtags */}
        {selectedHashtags.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Selected hashtags:</label>
            <div className="flex flex-wrap gap-2">
              {selectedHashtags.map((tag) => (
                <Badge 
                  key={tag.id} 
                  variant="secondary" 
                  size="sm"
                  className="group cursor-pointer"
                >
                  #{tag.name}
                  <button
                    type="button"
                    onClick={() => handleRemoveHashtag(tag)}
                    className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Hashtag Selector */}
        <HashtagSelector
          availableHashtags={availableHashtags}
          selectedHashtags={selectedHashtags}
          onSelectHashtag={handleSelectHashtag}
          onRemoveHashtag={handleRemoveHashtag}
        />
      </div>

      {/* Highlights Section */}
      <div className="space-y-2">
        <label className="flex items-center space-x-2 text-sm font-medium">
          <Plus className="w-4 h-4 text-muted-foreground" />
          <span>Highlights & Notes</span>
        </label>
        <textarea
          value={highlights}
          onChange={(e) => setHighlights(e.target.value)}
          placeholder="Add any highlights, notes, or memorable experiences..."
          className="input-modern min-h-[100px] resize-none"
          rows={4}
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-border">
        <Button 
          type="submit" 
          className="btn-modern bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Save className="w-4 h-4 mr-2" />
          {initialData ? 'Update Restaurant' : 'Add Restaurant'}
        </Button>
      </div>
    </form>
  );
};
