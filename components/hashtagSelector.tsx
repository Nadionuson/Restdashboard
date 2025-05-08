import React, { useState } from 'react';
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
  const [selectedHashtag, setSelectedHashtag] = useState<string>('');

  const handleAddHashtag = () => {
    let trimmed = newHashtagName.trim().replace(/^#/, ''); // Remove leading #

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
    setSelectedHashtag(selectedName);
  };

  return (
    <div>
      {/* Select Hashtags Dropdown */}
      <div>
        <label htmlFor="hashtag" className="block text-sm font-medium text-gray-700">
          Select Hashtags
        </label>
        <div className="space-y-2">
          <select
            id="hashtag"
            className="w-full p-2 border border-gray-300 rounded"
            onChange={handleSelectHashtag}
            value={selectedHashtag}
          >
            <option value="" disabled>Select a hashtag</option>
            {availableHashtags.map((hashtag) => (
              <option key={hashtag.id} value={hashtag.name}>
                #{hashtag.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Add New Hashtag */}
      <div className="mt-4">
        <label htmlFor="newHashtag" className="block text-sm font-medium text-gray-700">
          Add New Hashtag
        </label>
        <div className="flex space-x-2">
          <input
            id="newHashtag"
            type="text"
            value={newHashtagName}
            onChange={(e) => setNewHashtagName(e.target.value)}
            className="border p-2 rounded"
            placeholder="e.g. sangria"
          />
          <button
            type="button"
            onClick={handleAddHashtag}
            className="bg-blue-500 text-white p-2 rounded"
          >
            Add
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Don’t include the <span className="font-mono">#</span> — we’ll add it for you.
        </p>
        {newHashtagName.trim() && (
          <p className="text-sm text-gray-700 mt-1">
            Preview: <span className="font-mono text-blue-600">#{newHashtagName.trim().replace(/^#/, '')}</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default HashtagSelector;
