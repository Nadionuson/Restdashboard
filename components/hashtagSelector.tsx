import React, { useState } from 'react';
import { Button } from './ui/button';
import { HashtagModal } from './HashtagModal';

interface HashtagSelectorProps {
  availableHashtags: string[];
  selectedHashtags: string[];
  onHashtagSelect: (hashtag: string) => void;
  onHashtagDeselect: (hashtag: string) => void;
  onNewHashtag: (newHashtag: string) => void;
}

export const HashtagSelector: React.FC<HashtagSelectorProps> = ({
  availableHashtags,
  selectedHashtags,
  onHashtagSelect,
  onHashtagDeselect,
  onNewHashtag,
}) => {
  const [showHashtagModal, setShowHashtagModal] = useState(false);

  const handleAddHashtagClick = (hashtag: string) => {
    if (selectedHashtags.includes(hashtag)) {
      onHashtagDeselect(hashtag);
    } else {
      onHashtagSelect(hashtag);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-medium">Select Hashtags</h3>
      <div className="space-y-2">
        <div className="flex flex-wrap gap-2">
          {selectedHashtags.map((hashtag) => (
            <div key={hashtag} className="flex items-center gap-1 bg-gray-200 text-sm py-1 px-2 rounded">
              #{hashtag}
              <Button variant="outline" size="icon" onClick={() => onHashtagDeselect(hashtag)}>
                X
              </Button>
            </div>
          ))}
        </div>
        <div>
          <h4 className="font-semibold">Available Hashtags</h4>
          <div className="space-y-1">
            {availableHashtags.map((hashtag) => (
              <div
                key={hashtag}
                className={`cursor-pointer py-1 px-2 rounded ${
                  selectedHashtags.includes(hashtag) ? 'bg-blue-500 text-white' : 'bg-gray-100'
                }`}
                onClick={() => handleAddHashtagClick(hashtag)}
              >
                #{hashtag}
              </div>
            ))}
          </div>
        </div>
        <Button onClick={() => setShowHashtagModal(true)} variant="outline" className="mt-2">
          + Add New Hashtag
        </Button>
      </div>

      <HashtagModal
        isOpen={showHashtagModal}
        onClose={() => setShowHashtagModal(false)}
        onCreate={(newHashtag) => {
          onNewHashtag(newHashtag);
          setShowHashtagModal(false);
        }}
      />
    </div>
  );
};
