
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { ApplicationStatusBadge } from "../ApplicationStatusBadge";

interface Props {
  creatorName: string;
  creatorHandle: string;
  avatar: string;
  status: "pending" | "approved" | "rejected" | "in_discussion";
}

export function ApplicationDetailHeader({
  creatorName,
  creatorHandle,
  avatar,
  status
}: Props) {
  return (
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-3">
        <Avatar className="h-12 w-12">
          <AvatarImage src={avatar} />
          <AvatarFallback>{creatorName.substring(0, 2)}</AvatarFallback>
        </Avatar>
        <div>
          <SheetTitle className="text-lg font-space">{creatorName}</SheetTitle>
          <SheetDescription>{creatorHandle}</SheetDescription>
        </div>
      </div>
      <ApplicationStatusBadge status={status} />
    </div>
  );
}
