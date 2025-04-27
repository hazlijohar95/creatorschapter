
import { StatusBadge } from "@/components/shared/StatusBadge";

export function ApplicationStatusBadge({ status }: { status: string }) {
  return <StatusBadge status={status} />;
}
