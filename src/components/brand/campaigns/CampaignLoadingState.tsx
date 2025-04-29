
import { Skeleton } from "@/components/ui/skeleton";

export function CampaignLoadingState() {
  return (
    <div className="animate-in fade-in-50 space-y-6">
      {/* Header skeleton */}
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>
      
      {/* Filter bar skeleton */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-10 w-[180px]" />
        <Skeleton className="h-10 w-[120px]" />
        <Skeleton className="h-10 w-[150px] ml-auto" />
      </div>
      
      {/* Analytics skeleton */}
      <div className="h-[200px] bg-muted/20 rounded-lg border p-6">
        <div className="grid grid-cols-4 gap-4 h-full">
          <Skeleton className="h-full w-full" />
          <Skeleton className="h-full w-full" />
          <Skeleton className="h-full w-full" />
          <Skeleton className="h-full w-full" />
        </div>
      </div>
      
      {/* Cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="border rounded-lg p-4 space-y-3 animate-in fade-in-50 duration-300" style={{animationDelay: `${i * 50}ms`}}>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex gap-2 pt-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
