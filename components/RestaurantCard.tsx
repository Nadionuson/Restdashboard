import { Restaurant, PrivacyLevel } from "@/app/types/restaurant";
import { Star, MapPin, Calendar, User, Eye, Hash, Edit, Trash2, Cpu, Phone, Clock } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";


type Props = {
  restaurant: Restaurant;
  currentUserId?: number;
  setEditing: (r: Restaurant | null) => void;
  setShowModal: (b: boolean) => void;
  handleDelete?: (id: number) => void;
};

export const RestaurantCard: React.FC<Props> = ({
  restaurant,
  currentUserId,
  setEditing,
  setShowModal,
  handleDelete,
}) => {
  const isOwner = restaurant.owner?.id === currentUserId;

  const getRatingVariant = (rating: number) => {
    if (rating >= 4) return "success";
    if (rating >= 3) return "warning";
    return "destructive";
  };

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "visited":
        return "success";
      case "want to visit":
        return "default";
      case "not recommended":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <div
      onClick={() => {
        if (isOwner) {
          setEditing(restaurant);
          setShowModal(true);
        }
      }}
      className={`bg-white p-4 rounded-lg shadow-md cursor-pointer transition-all group ${isOwner ? "hover:shadow-lg hover:-translate-y-1" : "opacity-70 pointer-events-none"
        }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold truncate">{restaurant.name}</h3>
          {restaurant.contactDetail?.address && (
            <span title="Address available" aria-label="Address available" className="inline-block">
              <Cpu className="w-5 h-5 text-indigo-600" />
            </span>
          )}
          {restaurant.contactDetail?.phoneNumber && (
            <span title="Phone number available" aria-label="Phone number available" className="inline-block">
              <Phone className="w-5 h-5 text-green-600" />
            </span>
          )}
          {restaurant.contactDetail?.openingHours && (
            <span title="Schedule available" aria-label="Schedule available" className="inline-block">
              <Clock className="w-5 h-5 text-green-600" />
            </span>
          )}
          {restaurant.contactDetail?.latitude && (
            <span title="Geocoordinates available" aria-label="Geocoordinates available" className="inline-block">
              <MapPin className="w-5 h-5 text-green-600" />
            </span>
          )}
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <MapPin className="w-4 h-4" />
            <span>{restaurant.city}</span>
            {restaurant.neighborhood && restaurant.neighborhood !== restaurant.city && (
              <span className="text-xs text-gray-400">• {restaurant.neighborhood}</span>
            )}
          </div>
        </div>

        {/* Edit/Delete buttons for owners, show on hover */}
        {isOwner && (
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                setEditing(restaurant);
                setShowModal(true);
              }}
              className="h-8 w-8 p-0"
            >
              <Edit className="w-4 h-4" />
            </Button>
            {handleDelete && (
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(restaurant.id);
                }}
                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Rating & Status */}
      <div className="flex items-center space-x-2 mb-2">
        <Badge variant={getRatingVariant(restaurant.evaluation?.finalEvaluation || 0)} size="sm">
          <Star className="w-3 h-3 mr-1" />
          {restaurant.evaluation?.finalEvaluation || 0}
        </Badge>

        <Badge variant={getStatusVariant(restaurant.status)} size="sm">
          {restaurant.status}
        </Badge>
      </div>

      {/* Hashtags */}
      {restaurant.hashtags && restaurant.hashtags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {restaurant.hashtags.slice(0, 3).map((tag) => (
            <span
              key={tag.name}
              className="inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs bg-gray-200 text-gray-700"
            >
              <Hash className="w-3 h-3" />
              <span>{tag.name}</span>
            </span>
          ))}
          {restaurant.hashtags.length > 3 && (
            <span className="text-xs text-gray-500">+{restaurant.hashtags.length - 3} more</span>
          )}
        </div>
      )}

      {/* Footer with owner & last updated */}
      <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-200 pt-2">
        <div className="flex items-center space-x-2">
          <Calendar className="w-3 h-3" />
          <span>
            {new Date(restaurant.updatedAt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>

        <div className="flex items-center space-x-1">
          <User className="w-3 h-3" />
          <span className="truncate max-w-[80px]">{restaurant.owner?.username || "Unknown"}</span>
          {isOwner && (
            <span className="ml-1">
              {restaurant.privacyLevel === PrivacyLevel.PRIVATE ? (
                <Eye className="w-3 h-3" />
              ) : (
                <span className="text-green-600">●</span>
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
