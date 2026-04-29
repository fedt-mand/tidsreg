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
    <div className="bg-card border border-border rounded-lg p-4 flex flex-col h-full">
      <h3 className="mb-3">{dayData.day}</h3>

      <div className="flex-1 space-y-2 mb-3">
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
          className="w-full py-2 px-3 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-md transition-colors"
        >
          + Tilføj
        </button>
      )}

      <div className="mt-3 pt-3 border-t border-border">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Total:</span>
          <span className="font-medium">{dailyTotal.toFixed(1)} t</span>
        </div>
      </div>
    </div>
  );
}