
import { CalendarEvent } from "../types";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { format } from "date-fns";
import { Info } from "lucide-react";

interface CalendarEventProps {
  event: CalendarEvent;
}

export function CalendarEventComponent({ event }: CalendarEventProps) {
  const getStatusColor = () => {
    switch (event.status) {
      case "active": return "bg-green-500";
      case "draft": return "bg-gray-500";
      case "paused": return "bg-amber-500";
      case "completed": return "bg-purple-500";
      default: return "bg-blue-500";
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-1">
        <span className="font-medium truncate">{event.title}</span>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-3.5 w-3.5 text-muted-foreground ml-1 flex-shrink-0" />
            </TooltipTrigger>
            <TooltipContent side="top">
              <div className="space-y-1 max-w-[200px]">
                <p className="text-xs font-medium">
                  {format(event.start, "MMM d")} - {format(event.end, "MMM d, yyyy")}
                </p>
                {event.description && <p className="text-xs text-muted-foreground">{event.description}</p>}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="flex items-center mt-auto">
        <Badge variant="outline" className={`text-[10px] px-1 py-0 ${getStatusColor()} text-white`}>
          {event.status}
        </Badge>
      </div>
    </div>
  );
}
