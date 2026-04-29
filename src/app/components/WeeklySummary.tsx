interface WeeklySummaryProps {
  totalHours: number;
}

export function WeeklySummary({ totalHours }: WeeklySummaryProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex justify-between items-center">
        <span className="text-muted-foreground">Samlet for ugen:</span>
        <span className="font-medium">{totalHours.toFixed(1)} timer</span>
      </div>
    </div>
  );
}