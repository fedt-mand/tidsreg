import { useState } from 'react';
import { TimeEntry } from '../App.tsx';
import { EntryInput } from './EntryInput.tsx';
import { Trash2 } from 'lucide-react';

interface EntryItemProps {
  entry: TimeEntry;
  onUpdate: (tag: string, hours: number) => void;
  onDelete: () => void;
  availableTags: string[];
  hoveredTag: string | null;
  setHoveredTag: (tag: string | null) => void;
}

export function EntryItem({ entry, onUpdate, onDelete, availableTags, hoveredTag, setHoveredTag }: EntryItemProps) {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <EntryInput
        initialTag={entry.tag}
        initialHours={entry.hours}
        onSave={(tag, hours) => {
          onUpdate(tag, hours);
          setIsEditing(false);
        }}
        onCancel={() => setIsEditing(false)}
        availableTags={availableTags}
      />
    );
  }

  return (
    <div 
      className="flex items-center justify-between p-1.5 bg-accent/50 rounded-md group"
      style={{ backgroundColor: hoveredTag === entry.tag ? '#D3D3D3' : undefined }}
      onMouseEnter={() => setHoveredTag(entry.tag)}
      onMouseLeave={() => setHoveredTag(null)}
    >
      <div 
        onClick={() => setIsEditing(true)}
        className="flex-1 min-w-0 flex items-baseline gap-2 cursor-pointer hover:bg-accent/70 p-0.5 rounded transition-colors"
      >
        <div className="truncate">{entry.tag}</div>
        <div className="text-sm text-muted-foreground whitespace-nowrap">{entry.hours} t</div>
      </div>

      <div className="flex gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={onDelete}
          className="p-1.5 hover:bg-destructive hover:text-destructive-foreground rounded-md transition-colors"
          title="Slet"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}