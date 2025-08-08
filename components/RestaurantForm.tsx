'use client';
import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  Restaurant,
  Evaluation,
  getFinalEvaluation,
  RestaurantStatus,
  Hashtag,
  PrivacyLevel,
} from '../app/types/restaurant';
import StarRating from './ui/starRating';
import HashtagSelector from './hashtagSelector';
import { Building2, Save, ChevronDown, ChevronRight, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { StarBar } from './ui/starbar';

interface RestaurantFormProps {
  initialData: Restaurant | null;
  onSubmit: (restaurant: Restaurant) => void;
}

export const RestaurantForm: React.FC<RestaurantFormProps> = ({ initialData, onSubmit }) => {
  const router = useRouter();

  const [id] = useState(initialData?.id ?? 0);
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [status, setStatus] = useState<RestaurantStatus>('Want to go');
  const [createdAt, setCreatedAt] = useState<string | Date>('');
  const [updatedAt, setUpdatedAt] = useState<string | Date>('');
  const [highlights, setHighlights] = useState('');
  const [privacyLevel, setPrivacyLevel] = useState<PrivacyLevel>(PrivacyLevel.PUBLIC);

  const [showRatings, setShowRatings] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
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

  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [openingHours, setOpeningHours] = useState('');
  const [geoCoordinates, setGeoCoordinates] = useState<{ latitude: string; longitude: string }>({ latitude: '', longitude: '' });
  const [loadingDetails, setLoadingDetails] = useState(false);

  const [routeInfo, setRouteInfo] = useState<string | null>(null);
  const [loadingRoute, setLoadingRoute] = useState(false);

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
  }, [router]);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setCity(initialData.city || '');
      setNeighborhood(initialData.neighborhood || '');
      setStatus(initialData.status);
      setHighlights(initialData.highlights || '');
      setEvaluation(initialData.evaluation);
      setSelectedHashtags(initialData.hashtags || []);
      setPrivacyLevel(initialData.privacyLevel ?? PrivacyLevel.PUBLIC);
      setCreatedAt(initialData.createdAt);
      setUpdatedAt(initialData.updatedAt);
      setAddress(String(initialData.contactDetail?.address ?? ''));
      setPhoneNumber(String(initialData.contactDetail?.phoneNumber ?? ''));
      setOpeningHours(String(initialData.contactDetail?.openingHours ?? ''));
      setGeoCoordinates({
        latitude: String(initialData.contactDetail?.latitude ?? ''),
        longitude: String(initialData.contactDetail?.longitude ?? ''),
      });
    }
  }, [initialData]);

  useEffect(() => {
    const finalEvaluation = getFinalEvaluation(evaluation);
    setEvaluation((prev) => ({ ...prev, finalEvaluation }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    evaluation.locationRating,
    evaluation.serviceRating,
    evaluation.priceQualityRating,
    evaluation.foodQualityRating,
    evaluation.atmosphereRating,
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(phoneNumber);
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
      privacyLevel,
      createdAt,
      updatedAt,
      contactDetail: {
        address,
        latitude: geoCoordinates.latitude,
        longitude: geoCoordinates.longitude,
        phoneNumber,
        website: '', // Assuming website is not provided in the form
        openingHours,
      },
    };
    console.log('Submitting restaurant:', newRestaurant);
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
        setGeoCoordinates(data.geoCoordinates ?? { latitude: '', longitude: '' });
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

  const handleRouteCheck = async () => {
    

    if (!geoCoordinates || !geoCoordinates.latitude || !geoCoordinates.longitude) {
      alert('Missing destination info');
      return;
    }

    console.log(geoCoordinates)
    if (!navigator.geolocation) {
      alert('Geolocation not supported by your browser');
      return;
    }

    setLoadingRoute(true);
    setRouteInfo(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const from = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        const to = {
            lat: parseFloat(geoCoordinates.latitude),
            lng: parseFloat(geoCoordinates.longitude),
          };

        try {
          const res = await fetch('/api/route', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ from, to, mode: 'driving-car' }),
          });

          const data = await res.json();
          setRouteInfo(res.ok ? `~${data.distanceKm} km, ~${data.durationMin} min (driving)` : 'Failed to calculate route');
        } catch (err) {
          console.error(err);
          setRouteInfo('Something went wrong.');
        } finally {
          setLoadingRoute(false);
        }
      },
      (err) => {
        console.error('Geolocation error', err);
        setRouteInfo('Could not determine your location.');
        setLoadingRoute(false);
      }
    );
  };

  // small helper to toggle via keyboard (Enter / Space)
  const handleHeaderKey = (e: React.KeyboardEvent, toggler: () => void) => {
    const key = e.key;
    if (key === 'Enter' || key === ' ' || key === 'Spacebar') {
      e.preventDefault();
      toggler();
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} placeholder="Neighborhood" />
          <select value={status} onChange={(e) => setStatus(e.target.value as RestaurantStatus)} className="input-modern">
            <option value="Want to go">Want to go</option>
            <option value="Tried it">Tried it</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-muted-foreground">Visibility</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="privacyLevel"
                value={PrivacyLevel.PUBLIC}
                checked={privacyLevel === PrivacyLevel.PUBLIC}
                onChange={() => setPrivacyLevel(PrivacyLevel.PUBLIC)}
              />
              Public
            </label>
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="privacyLevel"
                value={PrivacyLevel.FRIENDS_ONLY}
                checked={privacyLevel === PrivacyLevel.FRIENDS_ONLY}
                onChange={() => setPrivacyLevel(PrivacyLevel.FRIENDS_ONLY)}
              />
              Friends Only
            </label>
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="privacyLevel"
                value={PrivacyLevel.PRIVATE}
                checked={privacyLevel === PrivacyLevel.PRIVATE}
                onChange={() => setPrivacyLevel(PrivacyLevel.PRIVATE)}
              />
              Private
            </label>
          </div>
        </div>
      </div>

      {/* Ratings */}
      {status === 'Tried it' && (
        <div className="border rounded-lg">
          <div
            role="button"
            tabIndex={0}
            aria-expanded={showRatings}
            className="w-full px-4 py-2 flex items-center justify-between text-left text-sm font-medium bg-muted text-muted-foreground cursor-pointer"
            onClick={() => setShowRatings((prev) => !prev)}
            onKeyDown={(e) => handleHeaderKey(e, () => setShowRatings((prev) => !prev))}
          >
            <span className="flex items-center gap-2">
              Ratings
              <span className="flex items-center text-yellow-500">
                <StarBar rating={evaluation.finalEvaluation} /> ({evaluation.finalEvaluation.toFixed(1)})
              </span>
            </span>
            {showRatings ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </div>

          {showRatings && (
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-muted/40">
              <StarRating label="Location" value={evaluation.locationRating} onChange={(val) => setEvaluation(prev => ({ ...prev, locationRating: val }))} />
              <StarRating label="Service" value={evaluation.serviceRating} onChange={(val) => setEvaluation(prev => ({ ...prev, serviceRating: val }))} />
              <StarRating label="Price/Quality" value={evaluation.priceQualityRating} onChange={(val) => setEvaluation(prev => ({ ...prev, priceQualityRating: val }))} />
              <StarRating label="Food Quality" value={evaluation.foodQualityRating} onChange={(val) => setEvaluation(prev => ({ ...prev, foodQualityRating: val }))} />
              <StarRating label="Atmosphere" value={evaluation.atmosphereRating} onChange={(val) => setEvaluation(prev => ({ ...prev, atmosphereRating: val }))} />
            </div>
          )}
        </div>
      )}

      {/* Additional Info */}
      <div className="border rounded-lg">
        <div
          role="button"
          tabIndex={0}
          aria-expanded={showDetails}
          className="w-full px-4 py-2 flex items-center justify-between text-left text-sm font-medium bg-muted text-muted-foreground cursor-pointer"
          onClick={() => setShowDetails((prev) => !prev)}
          onKeyDown={(e) => handleHeaderKey(e, () => setShowDetails((prev) => !prev))}
        >
          <div className="flex items-center gap-2">
            <span>Additional Info</span>
            {address ? (
              <span className="text-green-600">👍</span>
            ) : (
              <span className="text-gray-600">⛔ Awaiting for AI</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation(); // Prevent header toggle
                handleGetDetails();
              }}
              disabled={loadingDetails}
              className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2 px-3 py-2 text-sm"
            >
              <RefreshCw className={`h-4 w-4 ${loadingDetails ? 'animate-spin' : ''}`} />
              {loadingDetails ? 'Refreshing...' : 'Refresh'}
            </Button>

            {showDetails ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 space-y-4 bg-muted/40">
            {/* If I Leave Now */}
            <div className="space-y-2">
              <label className="text-sm font-medium">If you leave now</label>
              <div className="flex gap-4 items-start">
                <Button
                  type="button"
                  onClick={handleRouteCheck}
                  disabled={loadingRoute}
                  className="btn-modern bg-muted text-muted-foreground"
                >
                  {loadingRoute ? 'Checking...' : 'If I Leave Now'}
                </Button>
                <div className="text-sm text-muted-foreground mt-1">{routeInfo || '—'}</div>
              </div>
            </div>

            {/* Info Card */}
            <div className="bg-background border border-border rounded-lg shadow-sm p-4 space-y-3 text-sm">
              {address && (
                <div className="flex items-start gap-2">
                  <span className="text-muted-foreground">
                    📍
                  </span>
                  <span>{address}</span>
                </div>
              )}

              {phoneNumber && (
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">
                    📞
                  </span>
                  <span>{phoneNumber}</span>
                </div>
              )}

              {openingHours && (
                <div className="flex items-start gap-2">
                  <span className="text-muted-foreground">
                    ⏰
                  </span>
                  <span className="whitespace-pre-line">{openingHours}</span>
                </div>
              )}
             
              {geoCoordinates.latitude && geoCoordinates.longitude && (
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">
                    🌐
                  </span>
                  <span>
                    {geoCoordinates.latitude}, {geoCoordinates.longitude}
                  </span>
                </div>
              )}

              {initialData?.contactDetail?.website && (
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">
                    🔗
                  </span>
                  <a
                    href={String(initialData.contactDetail.website)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Visit Website
                  </a>
                </div>
              )}
            </div>

          </div>
        )}
      </div>

      {/* Tell Me More */}
      <div className="border rounded-lg">
        <div
          role="button"
          tabIndex={0}
          aria-expanded={showMore}
          className="w-full px-4 py-2 flex items-center justify-between text-left text-sm font-medium bg-muted text-muted-foreground cursor-pointer"
          onClick={() => setShowMore((prev) => !prev)}
          onKeyDown={(e) => handleHeaderKey(e, () => setShowMore((prev) => !prev))}
        >
          <div className="flex items-center gap-2">
            <span>Tell me more</span>
            {selectedHashtags.length > 0 && (
              <div className="flex gap-1 items-center text-xs text-muted-foreground">
                {selectedHashtags.slice(0, 3).map((tag) => (
                  <span key={tag.id} className="bg-background border border-border rounded px-2 py-0.5">
                    #{tag.name}
                  </span>
                ))}
                {selectedHashtags.length > 3 && <span className="text-xs text-muted-foreground">+{selectedHashtags.length - 3}</span>}
              </div>
            )}
          </div>

          {showMore ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </div>

        {showMore && (
          <div className="p-4 space-y-4 bg-muted/40">
            <HashtagSelector
              availableHashtags={availableHashtags}
              selectedHashtags={selectedHashtags}
              onSelectHashtag={(tag) => setSelectedHashtags((prev) => {
                // prevent duplicates
                if (prev.some(h => h.id === tag.id)) return prev;
                return [...prev, tag];
              })}
              onRemoveHashtag={(tag) => setSelectedHashtags((prev) => prev.filter(h => h.id !== tag.id))}
            />

            <textarea
              value={highlights}
              onChange={(e) => setHighlights(e.target.value)}
              placeholder="Notes, highlights..."
              className="input-modern w-full min-h-[100px]"
            />
          </div>
        )}
      </div>

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
