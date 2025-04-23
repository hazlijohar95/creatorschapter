
import { useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collaboration } from "./CollaborationCard";
import { Badge } from "@/components/ui/badge";

interface CollaborationCalendarProps {
  collaborations: Collaboration[];
}

export function CollaborationCalendar({ collaborations }: CollaborationCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  // Create a map of dates to collaborations for easy lookup
  const collaborationsByDate = collaborations.reduce((acc, collab) => {
    const date = new Date(collab.deadline).toDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(collab);
    return acc;
  }, {} as Record<string, Collaboration[]>);
  
  // Get collaborations for the selected date
  const selectedDateStr = selectedDate?.toDateString() || '';
  const selectedDateCollaborations = collaborationsByDate[selectedDateStr] || [];
  
  // Generate calendar day content to show dots for dates with collaborations
  const getDayContent = (day: Date) => {
    const dateStr = day.toDateString();
    const hasCollaborations = !!collaborationsByDate[dateStr]?.length;
    
    if (hasCollaborations) {
      const count = collaborationsByDate[dateStr].length;
      return (
        <div className="relative w-full h-full flex items-center justify-center">
          <span>{day.getDate()}</span>
          <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-primary"></span>
          {count > 1 && (
            <span className="absolute top-1 right-1 text-[8px] font-bold bg-primary text-white rounded-full w-3 h-3 flex items-center justify-center">
              {count}
            </span>
          )}
        </div>
      );
    }
    
    return <span>{day.getDate()}</span>;
  };
  
  // Get the status color for a collaboration
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "completed": return "bg-blue-100 text-blue-800";
      case "declined": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <CalendarIcon className="mr-2 h-5 w-5" />
            Calendar View
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            disabled={{ before: new Date(new Date().setDate(new Date().getDate() - 90)) }}
            className="rounded-md border"
            components={{
              DayContent: ({ day }) => getDayContent(day),
            }}
          />
        </CardContent>
      </Card>
      
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg">
            {selectedDate ? (
              <span>
                {selectedDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            ) : (
              "Select a date"
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedDateCollaborations.length > 0 ? (
            <div className="space-y-4">
              {selectedDateCollaborations.map((collab) => (
                <div key={collab.id} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">{collab.title}</p>
                    <p className="text-sm text-muted-foreground">{collab.brand_name}</p>
                  </div>
                  <Badge className={getStatusColor(collab.status)}>
                    {collab.status.charAt(0).toUpperCase() + collab.status.slice(1)}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              <p>No collaborations scheduled for this date.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
