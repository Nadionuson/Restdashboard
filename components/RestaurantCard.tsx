import { Dialog } from "@headlessui/react";
import { RestaurantForm } from "./EvaluationStars";

type RestaurantDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  restaurant: any;
  onSave: (data: any) => void;
};

export const RestaurantDrawer = ({ isOpen, onClose, restaurant, onSave }: RestaurantDrawerProps) => {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <div>
        <h2>Edit Restaurant</h2>
        <RestaurantForm restaurant={restaurant} onSave={onSave} />
        <button onClick={onClose}>Close</button>
      </div>
    </Dialog>
  );
};
