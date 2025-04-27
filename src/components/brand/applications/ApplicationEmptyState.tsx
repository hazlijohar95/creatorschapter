
export function ApplicationEmptyState() {
  return (
    <div className="col-span-full flex flex-col items-center py-16 animate-fade-in">
      <span className="text-5xl mb-2">🕵️‍♂️</span>
      <h2 className="text-lg font-semibold mb-1">No applications found</h2>
      <p className="text-muted-foreground mb-2">Try another tab or adjust your filters.</p>
    </div>
  );
}
