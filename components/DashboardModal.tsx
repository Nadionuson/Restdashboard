'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { RestaurantForm } from './RestaurantForm';
import { Restaurant } from '@/app/types/restaurant';
import { Building2, Edit, Plus } from 'lucide-react';

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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="p-6 pb-4 border-b border-border">
          <DialogTitle className="text-xl font-semibold flex items-center space-x-2">
            {editing ? (
              <>
                <Edit className="w-5 h-5 text-muted-foreground" />
                <span>Edit Restaurant</span>
              </>
            ) : (
              <>
                <Plus className="w-5 h-5 text-muted-foreground" />
                <span>Add New Restaurant</span>
              </>
            )}
          </DialogTitle>
        </DialogHeader>
        
        <div className="p-6">
          <RestaurantForm initialData={editing} onSubmit={onSubmit} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
