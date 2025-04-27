
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface CardSkeletonProps {
  hasHeader?: boolean;
  headerHeight?: number;
  rows?: number;
  className?: string;
}

export function CardSkeleton({ 
  hasHeader = true, 
  headerHeight = 20,
  rows = 3,
  className = ""
}: CardSkeletonProps) {
  return (
    <Card className={className}>
      {hasHeader && (
        <CardHeader className="pb-2">
          <Skeleton className={`w-1/3 h-${headerHeight}`} />
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
