
import { Badge } from "@/components/ui/badge";

type StatusColor = {
  bg: string;
  text: string;
  border: string;
};

type StatusConfig = {
  [key: string]: {
    label: string;
    colors: StatusColor;
  };
};

const statusConfig: StatusConfig = {
  pending: {
    label: "Pending",
    colors: {
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      border: "border-yellow-200"
    }
  },
  approved: {
    label: "Approved",
    colors: {
      bg: "bg-green-100",
      text: "text-green-800",
      border: "border-green-200"
    }
  },
  rejected: {
    label: "Rejected",
    colors: {
      bg: "bg-red-100",
      text: "text-red-800",
      border: "border-red-200"
    }
  },
  in_discussion: {
    label: "In Discussion",
    colors: {
      bg: "bg-blue-100",
      text: "text-blue-700",
      border: "border-blue-200"
    }
  }
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || {
    label: status,
    colors: {
      bg: "bg-gray-100",
      text: "text-gray-800",
      border: "border-gray-200"
    }
  };

  return (
    <Badge 
      className={`px-2 py-1 rounded-full text-xs font-bold border ${config.colors.bg} ${config.colors.text} ${config.colors.border} ${className || ''}`}
    >
      {config.label}
    </Badge>
  );
}
