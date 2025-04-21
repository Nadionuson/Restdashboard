import { Dialog } from "@headlessui/react";
import { RestaurantForm } from "./EvaluationStars";
import { Button } from './ui/button';

type RestaurantDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  restaurant: any;
  onSave: (data: any) => void;
};

export const RestaurantDrawer = ({ isOpen, onClose, restaurant, onSave }: RestaurantDrawerProps) => {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <div className="p-4 max-w-lg mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Edit Restaurant</h2>
        
        {/* Display Hashtags */}
        <div className="mb-4">
          <h3 className="text-xl font-medium">Hashtags</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {restaurant.hashtags && restaurant.hashtags.length > 0 ? (
              restaurant.hashtags.map((hashtag: string, index: number) => (
                <span key={index} className="bg-gray-200 text-sm py-1 px-2 rounded-full">#{hashtag}</span>
              ))
            ) : (
              <p>No hashtags added yet</p>
            )}
          </div>
        </div>

        {/* Restaurant Form */}
        <RestaurantForm restaurant={restaurant} onSave={onSave} />
        
        {/* Close Button */}
        <div className="mt-4">
          <Button variant="outline" onClick={onClose}>Close</Button>
        </div>
      </div>
    </Dialog>
  );
};
