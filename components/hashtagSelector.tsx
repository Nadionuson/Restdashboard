import React, { useState, useEffect } from 'react';
import { Hashtag } from '@/app/types/restaurant';

interface HashtagSelectorProps {
  availableHashtags: Hashtag[];
  selectedHashtags: Hashtag[];
  onSelectHashtag: (hashtag: Hashtag) => void;
  onRemoveHashtag: (hashtag: Hashtag) => void;
}

const HashtagSelector: React.FC<HashtagSelectorProps> = ({
  availableHashtags,
  selectedHashtags,
  onSelectHashtag,
  onRemoveHashtag,
}) => {
  const [newHashtagName, setNewHashtagName] = useState('');
  const [selectedHashtag, setSelectedHashtag] = useState<string>(''); // Track the selected hashtag
  

  const handleAddHashtag = () => {
    const trimmed = newHashtagName.trim();

    // Prevent adding empty or duplicate hashtags
    if (!trimmed || selectedHashtags.some(h => h.name === trimmed)) return;

    const newHashtag: Hashtag = {
      id: Date.now(), // Temporary ID; replace with real one from backend if needed
      name: trimmed,
    };

    onSelectHashtag(newHashtag);
    setNewHashtagName('');
  };

  const handleSelectHashtag = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedName = e.target.value;
    if (!selectedName || selectedHashtags.some(h => h.name === selectedName)) return;

    const hashtag: Hashtag = {
      id: Date.now(), // Temporary ID
      name: selectedName,
    };

    onSelectHashtag(hashtag);
    setSelectedHashtag(selectedName); // Update the selected hashtag state
  };

  console.log("Available Hashtags:", availableHashtags);
  return (
    <div>
      {/* Select Hashtags Dropdown */}
      <div>
        <label htmlFor="hashtag" className="block text-sm font-medium text-gray-700">Select Hashtags</label>
        <div className="space-y-2">
          <select
            id="hashtag"
            className="w-full p-2 border border-gray-300 rounded"
            onChange={handleSelectHashtag}
            value={selectedHashtag} // Set the selected value here
          >
            <option value="" disabled>Select a hashtag</option>
            {availableHashtags.map((hashtag) => (
              <option key={hashtag.id} value={hashtag.name}>  {/* Using id for key */}
               #{hashtag.name} 
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Add New Hashtag */}
      <div className="mt-4">
        <label htmlFor="newHashtag" className="block text-sm font-medium text-gray-700">Add New Hashtag</label>
        <div className="flex space-x-2">
          <input
            id="newHashtag"
            type="text"
            value={newHashtagName}
            onChange={(e) => setNewHashtagName(e.target.value)}
            className="border p-2 rounded"
            placeholder="New hashtag"
          />
          <button
            type="button"
            onClick={handleAddHashtag}
            className="bg-blue-500 text-white p-2 rounded"
          >
            Add
          </button>
        </div>
      </div>

      {/* Display Selected Hashtags */}
      
    </div>
  );
};

export default HashtagSelector;
