import { useState, useEffect } from 'react';
import { DayCard } from './components/DayCard.tsx';
import { WeeklySummary } from './components/WeeklySummary.tsx';

export interface TimeEntry {
  id: string;
  tag: string;
  hours: number;
}

export interface DayData {
  day: string;
  entries: TimeEntry[];
}

const INITIAL_WEEK_DATA: DayData[] = [
  { day: 'Mandag', entries: [] },
  { day: 'Tirsdag', entries: [] },
  { day: 'Onsdag', entries: [] },
  { day: 'Torsdag', entries: [] },
  { day: 'Fredag', entries: [] },
];

export default function App() {
  const [weekData, setWeekData] = useState<DayData[]>(() => {
    const saved = localStorage.getItem('timetrack-weekdata');
    return saved ? JSON.parse(saved) : INITIAL_WEEK_DATA;
  });

  const [tagHistory, setTagHistory] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('timetrack-taghistory');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  useEffect(() => {
    localStorage.setItem('timetrack-weekdata', JSON.stringify(weekData));
  }, [weekData]);

  useEffect(() => {
    localStorage.setItem('timetrack-taghistory', JSON.stringify(Array.from(tagHistory)));
  }, [tagHistory]);

  const addEntry = (dayIndex: number, tag: string, hours: number) => {
    const newEntry: TimeEntry = {
      id: `${Date.now()}-${Math.random()}`,
      tag,
      hours,
    };

    setTagHistory((prev: Set<string>) => new Set([...prev, tag]));

    setWeekData((prev: DayData[]) => {
      const updated = [...prev];
      updated[dayIndex] = {
        ...updated[dayIndex],
        entries: [...updated[dayIndex].entries, newEntry],
      };
      return updated;
    });
  };

  const updateEntry = (dayIndex: number, entryId: string, tag: string, hours: number) => {
    setTagHistory((prev: Set<string>) => new Set([...prev, tag]));

    setWeekData((prev: DayData[]) => {
      const updated = [...prev];
      updated[dayIndex] = {
        ...updated[dayIndex],
        entries: updated[dayIndex].entries.map((entry: TimeEntry) =>
          entry.id === entryId ? { ...entry, tag, hours } : entry
        ),
      };
      return updated;
    });
  };

  const deleteEntry = (dayIndex: number, entryId: string) => {
    setWeekData((prev: DayData[]) => {
      const updated = [...prev];
      updated[dayIndex] = {
        ...updated[dayIndex],
        entries: updated[dayIndex].entries.filter((entry: TimeEntry) => entry.id !== entryId),
      };
      return updated;
    });
  };

  const getAllTags = () => {
    return Array.from(tagHistory);
  };

  const clearWeek = () => {
    setWeekData(INITIAL_WEEK_DATA);
  };

  const totalWeekHours = weekData.reduce(
    (sum: number, day: DayData) => sum + day.entries.reduce((daySum: number, entry: TimeEntry) => daySum + entry.hours, 0),
    0
  );

  const [showClearDialog, setShowClearDialog] = useState(false);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1>Tidsregistrering - Uge {new Date().getWeek()}</h1>
          <button
            onClick={() => setShowClearDialog(true)}
            className="py-2 px-4 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-md transition-colors cursor-pointer"
          >
            Ryd uge
          </button>
        </div>

        {showClearDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-card border border-border rounded-lg p-6 max-w-md mx-4">
              <h2 className="mb-4">Bekræft rydning</h2>
              <p className="mb-6 text-muted-foreground">
                Er du sikker på at du vil rydde alle tidsregistreringer for denne uge?
                Dine tidligere brugte tags bliver gemt.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    clearWeek();
                    setShowClearDialog(false);
                  }}
                  className="flex-1 py-2 px-4 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-md transition-colors"
                >
                  Ja, ryd ugen
                </button>
                <button
                  onClick={() => setShowClearDialog(false)}
                  className="flex-1 py-2 px-4 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-md transition-colors"
                >
                  Annuller
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6">
          {weekData.map((dayData: DayData, index: number) => (
            <DayCard
              key={dayData.day}
              dayData={dayData}
              dayIndex={index}
              onAddEntry={addEntry}
              onUpdateEntry={updateEntry}
              onDeleteEntry={deleteEntry}
              availableTags={getAllTags()}
            />
          ))}
        </div>

        <WeeklySummary totalHours={totalWeekHours} />
      </div>
    </div>
  );
}

declare global {
  interface Date {
    getWeek(): number;
  }
}

Date.prototype.getWeek = function() {
  const date = new Date(this.getTime());
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
  const week1 = new Date(date.getFullYear(), 0, 4);
  return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
};