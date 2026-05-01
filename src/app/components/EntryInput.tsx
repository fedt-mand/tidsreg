import { useState, useRef, useEffect } from 'react';

interface EntryInputProps {
  initialTag?: string;
  initialHours?: number;
  onSave: (tag: string, hours: number) => void;
  onCancel: () => void;
  availableTags: string[];
}

export function EntryInput({
  initialTag = '',
  initialHours = 0,
  onSave,
  onCancel,
  availableTags,
}: EntryInputProps) {
  const [tag, setTag] = useState(initialTag);
  const [hours, setHours] = useState(initialHours.toString());
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showPlaceholders, setShowPlaceholders] = useState(true);
  const tagInputRef = useRef<HTMLInputElement>(null);
  const hoursInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialHours && initialHours > 0) {
      hoursInputRef.current?.focus();
    } else {
      tagInputRef.current?.focus();
    }
  }, []);

  const filteredTags = availableTags.filter((t) =>
    t.toLowerCase().includes(tag.toLowerCase())
  );

  const handleSubmit = () => {
    const hoursNum = parseFloat(hours);
    if (tag.trim() && !isNaN(hoursNum) && hoursNum > 0) {
      onSave(tag.trim(), hoursNum);
      setTag('');
      setHours('');
      setShowPlaceholders(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <div className="space-y-1.5">
      <div className="relative">
        <input
          ref={tagInputRef}
          type="text"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          onKeyDown={handleKeyDown}
          placeholder={showPlaceholders ? '' : ''}
          className="w-full px-3 py-1.5 bg-input-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
        />

        {showSuggestions && filteredTags.length > 0 && tag.length > 0 && (
          <div className="absolute z-50 w-full top-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-40 overflow-y-auto">
            {filteredTags.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  setTag(t);
                  setShowSuggestions(false);
                }}
                className="w-full px-3 py-2 text-left hover:bg-accent hover:text-accent-foreground"
              >
                {t}
              </button>
            ))}
          </div>
        )}
      </div>

      <input
        ref={hoursInputRef}
        type="number"
        value={hours}
        onChange={(e) => setHours(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={showPlaceholders ? 'Timer' : ''}
        step="0.5"
        min="0"
        className="w-full px-3 py-1.5 bg-input-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
      />

      <div className="flex gap-2">
        <button
          onClick={handleSubmit}
          style={{ backgroundColor: '#44A447' }}
          className="flex-1 py-1.5 px-3 text-white rounded-md transition-colors hover:opacity-90"
        >
          Gem
        </button>
        <button
          onClick={onCancel}
          className="flex-1 py-1.5 px-3 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-md transition-colors"
        >
          Annuller
        </button>
      </div>
    </div>
  );
}