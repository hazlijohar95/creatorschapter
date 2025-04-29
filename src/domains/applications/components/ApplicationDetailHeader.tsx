
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/shared/StatusBadge";

interface ApplicationDetailHeaderProps {
  creatorName: string;
  creatorHandle: string;
  avatar: string;
  status: string;
}

export function ApplicationDetailHeader({
  creatorName,
  creatorHandle,
  avatar,
  status,
}: ApplicationDetailHeaderProps) {
  return (
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-3">
        <Avatar className="h-12 w-12 border">
          <AvatarImage src={avatar} alt={creatorName} />
          <AvatarFallback>{creatorName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold text-lg">{creatorName}</h3>
          <p className="text-sm text-muted-foreground">{creatorHandle}</p>
        </div>
      </div>
      <StatusBadge status={status} />
    </div>
  );
}
