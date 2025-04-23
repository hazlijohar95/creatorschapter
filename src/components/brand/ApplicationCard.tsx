
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Check, X } from "lucide-react";
import { ApplicationStatusBadge } from "./ApplicationStatusBadge";
import { Badge } from "@/components/ui/badge";

interface Application {
  id: number;
  creatorName: string;
  creatorHandle: string;
  avatar: string;
  campaign: string;
  date: string;
  status: "pending" | "approved" | "rejected";
  message: string;
  categories: string[];
  match: number;
  isNew: boolean;
  budget: string;
}

export function ApplicationCard({ application, onApprove, onReject }: {
  application: Application;
  onApprove?: (id: number) => void;
  onReject?: (id: number) => void;
}) {
  let matchColor = "bg-orange-500";
  if (application.match >= 90) matchColor = "bg-green-500";
  else if (application.match >= 80) matchColor = "bg-blue-500";
  else if (application.match >= 70) matchColor = "bg-yellow-500";

  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-md border hover:shadow-xl animate-fade-in transition-all duration-150 bg-card">
      <CardHeader className="pb-4 flex flex-row justify-between items-center bg-gradient-to-br from-background/80 to-muted/20">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={application.avatar} />
            <AvatarFallback>{application.creatorName.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg font-space font-bold">{application.creatorName}</CardTitle>
            <CardDescription className="pt-0 text-[15px]">{application.creatorHandle}</CardDescription>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          {application.isNew && (
            <Badge className="bg-green-100 text-green-800 rounded-full mb-1 font-bold text-xs border border-green-200">New</Badge>
          )}
          <ApplicationStatusBadge status={application.status} />
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-2 pt-0">
        <p className="text-sm text-muted-foreground line-clamp-3">{application.message}</p>
        <div className="flex flex-wrap gap-2 mt-2">
          {application.categories.map(tag => (
            <Badge key={tag} variant="secondary" className="bg-secondary/90 text-xs px-2 font-medium">{tag}</Badge>
          ))}
        </div>
        <div className="mt-4 space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Match score</span>
            <span className="font-bold">{application.match}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div className={`h-1.5 rounded-full transition-all duration-300 ${matchColor}`} style={{ width: `${application.match}%` }} />
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t bg-muted/40 pt-3 flex flex-col gap-2">
        <div className="flex justify-between items-center w-full">
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <span className="font-semibold">Campaign:</span>
            <span>{application.campaign}</span>
          </div>
          <div className="text-xs text-muted-foreground font-medium">
            <span className="font-semibold">{application.budget}</span> &bull; {application.date}
          </div>
        </div>
        <div className="flex justify-between items-center w-full">
          <div className="flex gap-2">
            {application.status === "pending" && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-green-700 border-green-200 hover:bg-green-50 hover:border-green-400 transition-colors"
                  onClick={() => onApprove?.(application.id)}
                >
                  <Check className="mr-1 h-4 w-4" /> Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-700 border-red-200 hover:bg-red-50 hover:border-red-400 transition-colors"
                  onClick={() => onReject?.(application.id)}
                >
                  <X className="mr-1 h-4 w-4" /> Reject
                </Button>
              </>
            )}
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              <MessageSquare className="mr-1 h-4 w-4" /> Message
            </Button>
            <Button size="sm" className="font-semibold">View Profile</Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
