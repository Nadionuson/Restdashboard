import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface HashtagModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (newHashtag: string) => void;
}

export const HashtagModal: React.FC<HashtagModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [newHashtag, setNewHashtag] = useState('');

  const handleCreate = () => {
    if (newHashtag.trim()) {
      onCreate(newHashtag);
      setNewHashtag('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-md w-1/3">
        <h2 className="text-xl font-semibold mb-4">Create New Hashtag</h2>
        <Input
          value={newHashtag}
          onChange={(e) => setNewHashtag(e.target.value)}
          placeholder="Enter a new hashtag"
        />
        <div className="mt-4 flex justify-between">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleCreate}>Create</Button>
        </div>
      </div>
    </div>
  );
};
