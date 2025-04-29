
import { Badge } from "@/components/ui/badge";
import { StatusBadgeProps } from "@/types/components/ui";
import { ApplicationStatus } from "@/types/shared/status";

export function StatusBadge({ status, variant = "default" }: StatusBadgeProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "pending":
        return {
          colorClass: "bg-yellow-100 text-yellow-800 border-yellow-200",
          text: variant === "compact" ? "Pending" : "Pending Review"
        };
      case "approved":
        return {
          colorClass: "bg-green-100 text-green-800 border-green-200",
          text: variant === "compact" ? "Approved" : "Approved"
        };
      case "rejected":
        return {
          colorClass: "bg-red-100 text-red-800 border-red-200",
          text: variant === "compact" ? "Rejected" : "Not Selected"
        };
      case "in_discussion":
        return {
          colorClass: "bg-blue-100 text-blue-700 border-blue-200",
          text: variant === "compact" ? "In Discussion" : "In Discussion"
        };
      default:
        return {
          colorClass: "bg-gray-100 text-gray-800 border-gray-200",
          text: status
        };
    }
  };

  const { colorClass, text } = getStatusConfig(status);
  
  return (
    <Badge 
      className={`border font-bold ${variant === "compact" ? "text-xs px-2 py-1 rounded-full" : ""} ${colorClass}`}
    >
      {text}
    </Badge>
  );
}
