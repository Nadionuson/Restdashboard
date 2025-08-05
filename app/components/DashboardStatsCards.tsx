import { Grid3X3, Star, MapPin, Calendar } from 'lucide-react';

export function DashboardStatsCards({ stats }: {
  stats: {
    totalRestaurants: number;
    averageRating: string;
    uniqueCities: number;
    thisMonthCount: number;
  }
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div className="card-modern p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Grid3X3 className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Restaurants</p>
            <p className="text-2xl font-bold">{stats.totalRestaurants}</p>
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
            <p className="text-2xl font-bold">{stats.averageRating}</p>
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
            <p className="text-2xl font-bold">{stats.uniqueCities}</p>
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
            <p className="text-2xl font-bold">{stats.thisMonthCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
