
import React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: string;
  status?: string;
}

interface ScheduleCalendarProps {
  events: CalendarEvent[];
  title?: string;
  onDateSelect?: (date: Date | undefined) => void;
  onEventClick?: (event: CalendarEvent) => void;
}

export function ScheduleCalendar({
  events,
  title = "Campaign Schedule",
  onDateSelect,
  onEventClick
}: ScheduleCalendarProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());
  
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (onDateSelect) onDateSelect(date);
  };
  
  const handleEventClick = (event: CalendarEvent) => {
    if (onEventClick) onEventClick(event);
  };
  
  // Helper to check if a date has events
  const hasEventsOnDay = (day: Date) => {
    return events.some(event => 
      format(event.date, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
    );
  };
  
  // Get events for selected date
  const selectedDateEvents = selectedDate 
    ? events.filter(event => format(event.date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd'))
    : [];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-[1fr_300px] gap-6">
          <div className="order-2 md:order-1 space-y-4">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-muted-foreground" />
              <h3 className="text-lg font-medium">
                {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : "Select a date"}
              </h3>
            </div>
            
            {selectedDateEvents.length > 0 ? (
              <div className="space-y-3">
                {selectedDateEvents.map((event) => (
                  <div 
                    key={event.id}
                    onClick={() => handleEventClick(event)}
                    className="border rounded-md p-3 cursor-pointer hover:bg-accent"
                  >
                    <div className="flex justify-between">
                      <h4 className="font-medium">{event.title}</h4>
                      {event.status && (
                        <Badge variant="outline">{event.status}</Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      <Badge variant="secondary">{event.type}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-muted-foreground italic py-8 text-center">
                No events scheduled for this date
              </div>
            )}
          </div>
          
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            className="border rounded-md p-3 order-1 md:order-2"
            components={{
              DayContent: ({ date, ...props }) => {
                const hasEvent = hasEventsOnDay(date);
                return (
                  <div {...props} className={`${props.className || ''} ${hasEvent ? "font-semibold relative" : ""}`}>
                    {format(date, 'd')}
                    {hasEvent && <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 h-1 w-1 bg-primary rounded-full"></span>}
                  </div>
                );
              },
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
