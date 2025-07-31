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
  const [neighborhood, setNeighborhood] = useState('');
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

  // New AI-derived fields
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [openingHours, setOpeningHours] = useState('');
  const [loadingDetails, setLoadingDetails] = useState(false);

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
      setNeighborhood(initialData.neighborhood || '');
      setStatus(initialData.status);
      setHighlights(initialData.highlights || '');
      setEvaluation(initialData.evaluation);
      setSelectedHashtags(initialData.hashtags || []);
      setIsPrivate(initialData.isPrivate ?? false);
      setCreatedAt(initialData.createdAt);
      setUpdatedAt(initialData.updatedAt);
      setAddress(initialData.address ?? '');
      setPhoneNumber(initialData.phoneNumber ?? '');
      setOpeningHours(initialData.openingHours ?? '');
    }
  }, [initialData]);

  useEffect(() => {
    const finalEvaluation = getFinalEvaluation(evaluation);
    setEvaluation((prev) => ({ ...prev, finalEvaluation }));
  }, [
    evaluation.locationRating,
    evaluation.serviceRating,
    evaluation.priceQualityRating,
    evaluation.foodQualityRating,
    evaluation.atmosphereRating,
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalNeighborhood = neighborhood.trim() || city;
    const newRestaurant: Restaurant = {
      id,
      name,
      city,
      neighborhood: finalNeighborhood,
      status,
      highlights,
      evaluation,
      hashtags: selectedHashtags,
      isPrivate,
      createdAt,
      updatedAt,
      address,
      phoneNumber,
      openingHours
    };
    onSubmit(newRestaurant);
  };

  const handleGetDetails = async () => {
    if (!name || !city || !neighborhood) {
      alert('Please fill in Name, City, and Neighborhood to get additional info.');
      return;
    }
    setLoadingDetails(true);
    try {
      const res = await fetch('/api/enrich', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, city, neighborhood }),
      });
      const data = await res.json();
      if (res.ok) {
        setAddress(data.address ?? '');
        setPhoneNumber(data.phoneNumber ?? '');
        setOpeningHours(data.openingHours ?? '');
      } else {
        console.error(data.error);
        alert('Failed to refresh additional info.');
      }
    } catch (err) {
      console.error(err);
      alert('Error contacting enrich API.');
    } finally {
      setLoadingDetails(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center space-x-2">
          <Building2 className="w-5 h-5 text-muted-foreground" />
          <span>Basic Information</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Restaurant name" required />
          <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" required />
        </div>

        <Input value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} placeholder="Neighborhood" />

        <select value={status} onChange={(e) => setStatus(e.target.value as RestaurantStatus)} className="input-modern">
          <option value="Want to go">Want to go</option>
          <option value="Tried it">Tried it</option>
        </select>

        <div className="flex items-center gap-2">
          <input type="checkbox" id="isPrivate" checked={isPrivate} onChange={(e) => setIsPrivate(e.target.checked)} />
          <label htmlFor="isPrivate">Private</label>
        </div>

        {/* AI Fields */}
        <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Address" />
        <Input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="Phone Number" />
        <Input value={openingHours} onChange={(e) => setOpeningHours(e.target.value)} placeholder="Opening Hours" />

        <Button
          type="button"
          onClick={handleGetDetails}
          disabled={loadingDetails}
          className="bg-secondary text-secondary-foreground"
        >
          {loadingDetails ? 'Refreshing...' : 'Refresh Additional Info'}
        </Button>
      </div>

      {/* Ratings */}
      {status === 'Tried it' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StarRating label="Location" value={evaluation.locationRating} onChange={(val) => setEvaluation(prev => ({ ...prev, locationRating: val }))} />
          <StarRating label="Service" value={evaluation.serviceRating} onChange={(val) => setEvaluation(prev => ({ ...prev, serviceRating: val }))} />
          <StarRating label="Price/Quality" value={evaluation.priceQualityRating} onChange={(val) => setEvaluation(prev => ({ ...prev, priceQualityRating: val }))} />
          <StarRating label="Food Quality" value={evaluation.foodQualityRating} onChange={(val) => setEvaluation(prev => ({ ...prev, foodQualityRating: val }))} />
          <StarRating label="Atmosphere" value={evaluation.atmosphereRating} onChange={(val) => setEvaluation(prev => ({ ...prev, atmosphereRating: val }))} />
        </div>
      )}

      {/* Hashtags */}
      <div className="space-y-2">
        <HashtagSelector
          availableHashtags={availableHashtags}
          selectedHashtags={selectedHashtags}
          onSelectHashtag={(tag) => setSelectedHashtags((prev) => [...prev, tag])}
          onRemoveHashtag={(tag) => setSelectedHashtags((prev) => prev.filter(h => h.id !== tag.id))}
        />
      </div>

      {/* Highlights */}
      <textarea
        value={highlights}
        onChange={(e) => setHighlights(e.target.value)}
        placeholder="Notes, highlights..."
        className="input-modern w-full min-h-[100px]"
      />

      {/* Submit */}
      <div className="flex justify-end pt-4 border-t border-border">
        <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Save className="w-4 h-4 mr-2" />
          {initialData ? 'Update Restaurant' : 'Add Restaurant'}
        </Button>
      </div>
    </form>
  );
};
