// components/RestaurantList.tsx

import { Card } from './ui/card';
import { Button } from './ui/button';
import { Restaurant } from '../app/types/restaurant';

interface RestaurantListProps {
  restaurants: Restaurant[];
  handleDelete: (id: number) => void;
  setShowModal: (show: boolean) => void;
  setEditing: (restaurant: Restaurant | null) => void;
}

export const RestaurantList: React.FC<RestaurantListProps> = ({ restaurants, handleDelete, setShowModal, setEditing }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {restaurants.map((r) => (
        <Card
          key={r.id}
          onClick={() => {
            setEditing(r);
            setShowModal(true);
          }}
          className="cursor-pointer hover:shadow-lg"
        >
          <h2 className="text-xl font-semibold">{r.name}</h2>
          <p className="text-sm text-gray-600">{r.location}</p>
          <p className="text-sm italic">{r.status === 'Tried it' ? 'Tried it' : 'Want to go'}</p>
          {r.lastVisitedDate && (
            <p className="text-sm text-gray-600">
              Last visited on{' '}
              {new Date(r.lastVisitedDate).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })}
            </p>
          )}
          <div className="mt-2 text-sm">
            <span className="font-semibold">Final Rating:</span> {r.evaluation.finalEvaluation}
          </div>
          {/* Display Hashtags */}
      {r.hashtags && r.hashtags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {r.hashtags?.map((tag) => (
            <span
              key={tag.name}
              className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full"
            >
              #{tag.name}
            </span>
          ))}
        </div>
      )}
          <Button className="mt-2" onClick={(e) => { e.stopPropagation(); handleDelete(r.id); }}>
            Delete
          </Button>
        </Card>
      ))}
    </div>
  );
};
