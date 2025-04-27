
export function OpportunityLoadingState() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse border h-[280px] rounded-lg bg-muted/40"
        >
          <div className="h-24 bg-muted rounded-t-lg" />
          <div className="p-4 space-y-3">
            <div className="h-5 bg-muted rounded w-3/4" />
            <div className="h-4 bg-muted rounded w-1/2" />
            <div className="h-16 bg-muted rounded w-full" />
            <div className="h-8 bg-muted rounded w-full" />
          </div>
        </div>
      ))}
    </>
  );
}
