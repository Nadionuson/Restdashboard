export type Evaluation = {
  locationRating: number;
  serviceRating: number;
  priceQualityRating: number;
  foodQualityRating: number;
  atmosphereRating: number;
  finalEvaluation: number;
};

export type RestaurantStatus = 'Want to go' | 'Tried it';

export type Hashtag = {
  id: number;
  name: string;
};

export type User = {
  email: string;
  id: number;
  username: string;
};

export type Restaurant = {
  id: number;
  name: string;
  city: string;
  neighborhood?: string;
  status: RestaurantStatus;
  evaluation: Evaluation;
  highlights: string;
  address: string;
  phoneNumber: string;
  openingHours: string;
  hashtags?: Hashtag[];
  isPrivate: boolean;
  owner?: User;  // Include user info
  createdAt: string | Date;
  updatedAt: string | Date;
};

// Helper function to calculate the final evaluation
export const getFinalEvaluation = (evaluation: Evaluation): number => {
  const { locationRating, serviceRating, priceQualityRating, foodQualityRating, atmosphereRating } = evaluation;
  return (
    (locationRating + serviceRating + priceQualityRating + foodQualityRating + atmosphereRating) / 5
  );
};
