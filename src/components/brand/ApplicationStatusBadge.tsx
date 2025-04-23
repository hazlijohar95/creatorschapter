
import { Badge } from "@/components/ui/badge";

type Status = "pending" | "approved" | "rejected" | "in_discussion";

export function ApplicationStatusBadge({ status }: { status: Status }) {
  let colorClass = "", text = "";
  
  switch (status) {
    case "pending":
      colorClass = "bg-yellow-100 text-yellow-800 border-yellow-200";
      text = "Pending";
      break;
    case "approved":
      colorClass = "bg-green-100 text-green-800 border-green-200";
      text = "Approved";
      break;
    case "rejected":
      colorClass = "bg-red-100 text-red-800 border-red-200";
      text = "Rejected";
      break;
    case "in_discussion":
      colorClass = "bg-blue-100 text-blue-700 border-blue-200";
      text = "In Discussion";
      break;
  }
  
  return (
    <Badge className={`px-2 py-1 rounded-full text-xs border font-bold ${colorClass}`}>
      {text}
    </Badge>
  );
}
