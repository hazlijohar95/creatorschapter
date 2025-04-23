
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: "pending" | "approved" | "rejected" | "in_discussion" | string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  switch (status) {
    case "pending":
      return (
        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
          Pending Review
        </Badge>
      );
    case "approved":
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200">
          Approved
        </Badge>
      );
    case "rejected":
      return (
        <Badge className="bg-red-100 text-red-800 border-red-200">
          Not Selected
        </Badge>
      );
    case "in_discussion":
      return (
        <Badge className="bg-blue-100 text-blue-700 border-blue-200">
          In Discussion
        </Badge>
      );
    default:
      return (
        <Badge className="bg-gray-100 text-gray-800 border-gray-200">
          {status}
        </Badge>
      );
  }
}
