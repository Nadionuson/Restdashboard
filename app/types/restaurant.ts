export type Evaluation = {
  locationRating: number;
  serviceRating: number;
  priceQualityRating: number;
  foodQualityRating: number;
  atmosphereRating: number;
  finalEvaluation: number
};

export type RestaurantStatus = 'Want to go' | 'Tried it';
export type Hashtag = {
  id: number;
  name: string;
};

export type Restaurant = {
  id: number;
  name: string;
  location: string;
  status: RestaurantStatus;
  evaluation: Evaluation;
  highlights: string;
  lastVisitedDate: Date | null; 
  hashtags?: Hashtag[];
};

// Helper function to calculate the final evaluation
export const getFinalEvaluation = (evaluation: Evaluation): number => {
  const { locationRating, serviceRating, priceQualityRating, foodQualityRating, atmosphereRating } = evaluation;
  return (
    (locationRating + serviceRating + priceQualityRating + foodQualityRating + atmosphereRating) / 5
  );
};


