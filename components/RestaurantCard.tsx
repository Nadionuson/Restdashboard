// components/RestaurantCard.tsx
import { Restaurant } from "@/app/types/restaurant";

type Props = {
  restaurant: Restaurant;
  currentUserId: number | undefined;
  setEditing: (r: Restaurant | null) => void;
  setShowModal: (b: boolean) => void;
  handleDelete?: (id: number) => void;
};

export const RestaurantCard: React.FC<Props> = ({
  restaurant,
  setEditing,
  setShowModal,
}) => {
  return (
    <div
      onClick={() => {
        setEditing(restaurant);
        setShowModal(true);
      }}
      className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg cursor-pointer transition-all"
    >
      <h3 className="text-lg font-semibold">{restaurant.name}</h3>
      <p className="text-sm text-gray-500">{restaurant.city || restaurant.neighborhood}</p>

      <div className="mt-2 flex flex-wrap gap-1">
        {restaurant.hashtags?.map((tag, i) => (
          <span
            key={i}
            className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full"
          >
            #{tag.name}
          </span>
        ))}
      </div>
    </div>
  );
};
