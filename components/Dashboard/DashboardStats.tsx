import { Grid3X3, Star, MapPin, Calendar } from 'lucide-react';
import { Restaurant } from '@/app/types/restaurant';

interface DashboardStatsProps {
  restaurants: Restaurant[];
}

export function DashboardStats({ restaurants }: DashboardStatsProps) {
  const total = restaurants.length;
  const avg = total > 0 ? (restaurants.reduce((acc, r) => acc + (r.evaluation.finalEvaluation || 0), 0) / total).toFixed(1) : '0.0';
  const cities = new Set(restaurants.map(r => r.city)).size;
  const thisMonth = restaurants.filter(r => {
    const date = new Date(r.updatedAt);
    const now = new Date();
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  }).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div className="card-modern p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Grid3X3 className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Restaurants</p>
            <p className="text-2xl font-bold">{total}</p>
          </div>
        </div>
      </div>
      <div className="card-modern p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <Star className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Average Rating</p>
            <p className="text-2xl font-bold">{avg}</p>
          </div>
        </div>
      </div>
      <div className="card-modern p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <MapPin className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Cities</p>
            <p className="text-2xl font-bold">{cities}</p>
          </div>
        </div>
      </div>
      <div className="card-modern p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
            <Calendar className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">This Month</p>
            <p className="text-2xl font-bold">{thisMonth}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
