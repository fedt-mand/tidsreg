import { useState } from 'react';
import { TimeEntry, DayData } from '../App.tsx';
import { EntryInput } from './EntryInput.tsx';
import { EntryItem } from './EntryItem.tsx';

interface DayCardProps {
  dayData: DayData;
  dayIndex: number;
  onAddEntry: (dayIndex: number, tag: string, hours: number) => void;
  onUpdateEntry: (dayIndex: number, entryId: string, tag: string, hours: number) => void;
  onDeleteEntry: (dayIndex: number, entryId: string) => void;
  availableTags: string[];
}

export function DayCard({
  dayData,
  dayIndex,
  onAddEntry,
  onUpdateEntry,
  onDeleteEntry,
  availableTags,
}: DayCardProps) {
  const [isAdding, setIsAdding] = useState(false);

  const dailyTotal = dayData.entries.reduce((sum, entry) => sum + entry.hours, 0);

  const handleAdd = (tag: string, hours: number) => {
    onAddEntry(dayIndex, tag, hours);
    setIsAdding(false);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-3 flex flex-col h-full">
      <h3 className="mb-2">{dayData.day}</h3>

      <div className="flex-1 space-y-1.5 mb-2">
        {dayData.entries.map((entry) => (
          <EntryItem
            key={entry.id}
            entry={entry}
            onUpdate={(tag: string, hours: number) => onUpdateEntry(dayIndex, entry.id, tag, hours)}
            onDelete={() => onDeleteEntry(dayIndex, entry.id)}
            availableTags={availableTags}
          />
        ))}
      </div>

      {isAdding ? (
        <EntryInput
          onSave={handleAdd}
          onCancel={() => setIsAdding(false)}
          availableTags={availableTags}
        />
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          style={{ backgroundColor: '#8EED90' }}
          className="w-full py-1.5 px-3 text-black rounded-md transition-colors hover:opacity-90 cursor-pointer"
        >
          + Tilføj
        </button>
      )}

      <div className="mt-2 pt-2 border-t border-border">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Total:</span>
          <span className="font-medium">{dailyTotal.toFixed(1)} t</span>
        </div>
      </div>
    </div>
  );
}