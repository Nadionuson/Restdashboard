// pages/Dashboard.tsx

import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { RestaurantForm } from '@/components/RestaurantForm';
import { Restaurant } from '../types/restaurant';
import { RestaurantList } from '../../components/RestaurantList';
import { useRestaurants } from '../hooks/useRestaurant';

export default function Dashboard() {
  const { restaurants } = useRestaurants();
  const [editing, setEditing] = useState<Restaurant | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [locations, setLocations] = useState<string[]>([]); // Store distinct locations

  // Fetch distinct locations on load
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await fetch('/api/locations');
        const data = await res.json();
        setLocations(data);
      } catch (error) {
        console.error('Failed to fetch locations', error);
      }
    };

    fetchLocations();
  }, []);

  const handleSave = async (restaurant: Restaurant) => {
    // Implement saving logic here
  };

  const handleDelete = async (id: number) => {
    // Implement delete logic here
  };

  return (
    <div className="p-4 max-w-5xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">🍽️ Restaurant Dashboard</h1>

      <Button onClick={() => { setEditing(null); setShowModal(true); }}>
        Add New Restaurant
      </Button>

      <RestaurantList
        restaurants={restaurants}
        handleDelete={handleDelete}
        setShowModal={setShowModal}
        setEditing={setEditing}
      />

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-h-[90vh] overflow-y-auto p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold mb-4">
              {editing ? 'Edit Restaurant' : 'Add New Restaurant'}
            </DialogTitle>
          </DialogHeader>
          <RestaurantForm initialData={editing} onSubmit={handleSave} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
