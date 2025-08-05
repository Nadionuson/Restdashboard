import { Restaurant } from '@/app/types/restaurant';

export function useDashboardStats(restaurants: Restaurant[]) {
  const totalRestaurants = restaurants.length;
  const averageRating =
    totalRestaurants > 0
      ? (
          restaurants.reduce(
            (acc, r) => acc + (r.evaluation.finalEvaluation || 0),
            0
          ) / totalRestaurants
        ).toFixed(1)
      : '0.0';
  const uniqueCities = new Set(restaurants.map((r) => r.city)).size;
  const thisMonthCount = restaurants.filter((r) => {
    const date = new Date(r.updatedAt);
    const now = new Date();
    return (
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  }).length;

  return { totalRestaurants, averageRating, uniqueCities, thisMonthCount };
}
