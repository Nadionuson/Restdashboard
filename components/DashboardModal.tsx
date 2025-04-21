'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { RestaurantForm } from './RestaurantForm';
import { Restaurant } from '@/app/types/restaurant';

interface RestaurantModalProps {
  showModal: boolean;
  setShowModal: (open: boolean) => void;
  editing: Restaurant | null;
  onSubmit: (restaurant: Restaurant) => void;
}

export const RestaurantModal: React.FC<RestaurantModalProps> = ({
  showModal,
  setShowModal,
  editing,
  onSubmit,
}) => {
  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogContent className="max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold mb-4">
            {editing ? 'Edit Restaurant' : 'Add New Restaurant'}
          </DialogTitle>
        </DialogHeader>
        <RestaurantForm initialData={editing} onSubmit={onSubmit} />
      </DialogContent>
    </Dialog>
  );
};
