import React, { useState } from 'react';
import { Hashtag } from '@/app/types/restaurant';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Hash, Plus, X } from 'lucide-react';

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
    setSelectedHashtag('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddHashtag();
    }
  };

  // Filter out already selected hashtags from available options
  const availableOptions = availableHashtags.filter(
    hashtag => !selectedHashtags.some(selected => selected.name === hashtag.name)
  );

  return (
    <div className="space-y-4">
      {/* Select Existing Hashtags */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">
          Select from existing hashtags:
        </label>
        <select
          className="input-modern"
          onChange={handleSelectHashtag}
          value={selectedHashtag}
        >
          <option value="">Choose a hashtag...</option>
          {availableOptions.map((hashtag) => (
            <option key={hashtag.id} value={hashtag.name}>
              #{hashtag.name}
            </option>
          ))}
        </select>
      </div>

      {/* Add New Hashtag */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">
          Create new hashtag:
        </label>
        <div className="flex space-x-2">
          <Input
            type="text"
            value={newHashtagName}
            onChange={(e) => setNewHashtagName(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="e.g. sangria, italian, romantic"
            className="flex-1"
          />
          <Button
            type="button"
            onClick={handleAddHashtag}
            disabled={!newHashtagName.trim() || selectedHashtags.some(h => h.name === newHashtagName.trim().replace(/^#/, ''))}
            size="sm"
            className="btn-modern"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        
        {newHashtagName.trim() && (
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <span>Preview:</span>
            <Badge variant="outline" size="sm">
              #{newHashtagName.trim().replace(/^#/, '')}
            </Badge>
          </div>
        )}
        
        <p className="text-xs text-muted-foreground">
          Don't include the # — we'll add it automatically.
        </p>
      </div>

      {/* Available Hashtags Quick Add */}
      {availableOptions.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Quick add:
          </label>
          <div className="flex flex-wrap gap-2">
            {availableOptions.slice(0, 8).map((hashtag) => (
              <Badge
                key={hashtag.id}
                variant="outline"
                size="sm"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => onSelectHashtag(hashtag)}
              >
                #{hashtag.name}
              </Badge>
            ))}
            {availableOptions.length > 8 && (
              <Badge variant="outline" size="sm" className="text-muted-foreground">
                +{availableOptions.length - 8} more
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HashtagSelector;
