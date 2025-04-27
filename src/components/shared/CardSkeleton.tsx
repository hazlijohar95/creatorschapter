
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Define allowed Tailwind height scale values you intend to use
type AllowedHeightScale = 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24 | 32;

interface CardSkeletonProps {
  hasHeader?: boolean;
  headerHeightScale?: AllowedHeightScale;
  rows?: number;
  className?: string;
}

export function CardSkeleton({
  hasHeader = true,
  headerHeightScale = 5,
  rows = 3,
  className = ""
}: CardSkeletonProps) {
  // Construct the literal class name string for Tailwind to find
  const headerHeightClass = `h-${headerHeightScale}`; // e.g., "h-5" or "h-4"

  return (
    <Card className={className}>
      {hasHeader && (
        <CardHeader className="pb-2">
          <Skeleton className={`w-1/3 ${headerHeightClass}`} />
        </CardHeader>
      )}
      <CardContent className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} className="w-full h-4" />
        ))}
      </CardContent>
    </Card>
  );
}
