
import { EmptyState } from "@/components/shared/EmptyState";

export function ApplicationEmptyState() {
  return (
    <EmptyState
      icon="🕵️‍♂️"
      title="No applications found"
      description="Try another tab or adjust your filters."
    />
  );
}
