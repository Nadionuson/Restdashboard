'use client';

import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Restaurant } from '../app/types/restaurant';
import { 
  Star, 
  MapPin, 
  Calendar, 
  User, 
  Trash2, 
  Edit, 
  Eye,
  Hash,
  MoreVertical,
  ArrowUpDown
} from 'lucide-react';
import { EmptyState } from './ui/empty-state';
import { Badge } from './ui/badge';

interface RestaurantListProps {
  restaurants: Restaurant[];
  currentUserId: Number | undefined;
  handleDelete: (id: number) => void;
  setShowModal: (show: boolean) => void;
  setEditing: (restaurant: Restaurant | null) => void;
}

export const RestaurantList: React.FC<RestaurantListProps> = ({
  restaurants,
  currentUserId,
  handleDelete,
  setShowModal,
  setEditing,
}) => {
  const [sortMode, setSortMode] = useState<'rating' | 'name'>('rating');

  const sortedRestaurants = React.useMemo(() => {
    if (sortMode === 'rating') {
      return [...restaurants].sort(
        (a, b) => (b.evaluation.finalEvaluation ?? 0) - (a.evaluation.finalEvaluation ?? 0)
      );
    }
    if (sortMode === 'name') {
      return [...restaurants].sort((a, b) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      );
    }
    
    return restaurants;
  }, [sortMode, restaurants]);

  const getRatingVariant = (rating: number) => {
    if (rating >= 4) return 'success';
    if (rating >= 3) return 'warning';
    return 'destructive';
  };

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'visited':
        return 'success';
      case 'want to visit':
        return 'default';
      case 'not recommended':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">Restaurants</h3>
          <p className="text-sm text-muted-foreground">
            {sortedRestaurants.length} restaurant{sortedRestaurants.length !== 1 ? 's' : ''} found
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
          <select
            value={sortMode}
            onChange={(e) => setSortMode(e.target.value as 'rating' | 'name')}
            className="input-modern text-sm w-32"
          >
            <option value="rating">Rating</option>
            <option value="name">Name</option>
          </select>
        </div>
      </div>

      {/* Restaurant Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedRestaurants.map((r) => {
          const isOwner = r.owner?.id === Number(currentUserId);
          const isPublic = !r.isPrivate;

          return (
            <Card 
              key={r.id} 
              className={`card-modern group overflow-hidden ${
                isOwner 
                  ? 'cursor-pointer hover:shadow-lg hover:-translate-y-1' 
                  : 'bg-muted/50 opacity-75'
              }`}
              onClick={() => {
                if (isOwner) {
                  setEditing(r);
                  setShowModal(true);
                }
              }}
            >
              {/* Card Header */}
              <div className="p-6 pb-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold truncate mb-1">{r.name}</h3>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span className="truncate">{r.city}</span>
                      {r.neighborhood && r.neighborhood !== r.city && (
                        <span className="text-xs text-muted-foreground">• {r.neighborhood}</span>
                      )}
                    </div>
                  </div>
                  
                  {isOwner && (
                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditing(r);
                          setShowModal(true);
                        }}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(r.id);
                        }}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>

                {/* Rating */}
                <div className="flex items-center space-x-2 mb-3">
                  <Badge variant={getRatingVariant(r.evaluation.finalEvaluation || 0)} size="sm">
                    <Star className="w-3 h-3 mr-1" />
                    {r.evaluation.finalEvaluation || 0}
                  </Badge>
                  
                  <Badge variant={getStatusVariant(r.status)} size="sm">
                    {r.status}
                  </Badge>
                </div>

                {/* Hashtags */}
                {r.hashtags && r.hashtags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {r.hashtags.slice(0, 3).map((tag) => (
                      <span
                        key={tag.name}
                        className="inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs bg-muted text-muted-foreground"
                      >
                        <Hash className="w-3 h-3" />
                        <span>{tag.name}</span>
                      </span>
                    ))}
                    {r.hashtags.length > 3 && (
                      <span className="text-xs text-muted-foreground">
                        +{r.hashtags.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="px-6 py-4 bg-muted/30 border-t border-border/50">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {new Date(r.updatedAt).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <User className="w-3 h-3" />
                    <span className="truncate max-w-20">{r.owner?.username ?? 'Unknown'}</span>
                    {isOwner && (
                      <span className="ml-1">
                        {r.isPrivate ? (
                          <Eye className="w-3 h-3" />
                        ) : (
                          <span className="text-green-600">●</span>
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {sortedRestaurants.length === 0 && (
        <EmptyState
          icon={MapPin}
          title="No restaurants found"
          description="Try adjusting your filters or add your first restaurant to get started."
        />
      )}
    </div>
  );
};
