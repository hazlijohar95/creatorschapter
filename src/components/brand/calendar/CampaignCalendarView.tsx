
import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/lib/auth";

interface Campaign {
  id: string;
  name: string;
  status: string;
  start_date: string | null;
  end_date: string | null;
  budget: number | null;
}

interface CampaignEvent {
  date: Date;
  campaign: Campaign;
  type: "start" | "end" | "milestone";
}

export function CampaignCalendarView() {
  const { user } = useAuthStore();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<"month" | "week" | "day">("month");
  
  const { data: campaigns, isLoading } = useQuery({
    queryKey: ["calendar-campaigns", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("campaigns")
        .select("*")
        .eq("brand_id", user?.id)
        .order("start_date", { ascending: true });
        
      if (error) throw error;
      return data as Campaign[];
    },
  });

  // Generate events from campaign data
  const events: CampaignEvent[] = React.useMemo(() => {
    if (!campaigns) return [];
    
    const allEvents: CampaignEvent[] = [];
    
    campaigns.forEach(campaign => {
      if (campaign.start_date) {
        allEvents.push({
          date: new Date(campaign.start_date),
          campaign,
          type: "start"
        });
      }
      
      if (campaign.end_date) {
        allEvents.push({
          date: new Date(campaign.end_date),
          campaign,
          type: "end"
        });
      }
    });
    
    return allEvents;
  }, [campaigns]);
  
  // Function to check if a date has events
  const hasEventsOnDay = (day: Date) => {
    return events.some(event => 
      format(event.date, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
    );
  };
  
  // Get events for the selected date
  const eventsForSelectedDate = date 
    ? events.filter(event => format(event.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'))
    : [];

  // Fixed: Use an object type for classNames instead of a function
  const dayStyles = {
    day: "relative",
    day_has_event: "bg-primary/10 rounded-md"
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between">
            <CardTitle className="text-xl font-semibold">Campaign Calendar</CardTitle>
            <Tabs value={view} onValueChange={(v) => setView(v as "month" | "week" | "day")}>
              <TabsList>
                <TabsTrigger value="month">Month</TabsTrigger>
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="day">Day</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-[300px_1fr] gap-6">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="border rounded-md p-2"
              modifiersClassNames={{
                selected: "bg-primary text-primary-foreground",
              }}
              classNames={{
                day_today: "bg-accent text-accent-foreground",
                day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
              }}
              components={{
                DayContent: ({ date: dayDate, ...props }) => {
                  const hasEvent = hasEventsOnDay(dayDate);
                  return (
                    <div {...props} className={`${props.className || ''} ${hasEvent ? "font-semibold relative" : ""}`}>
                      {format(dayDate, 'd')}
                      {hasEvent && <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 h-1 w-1 bg-primary rounded-full"></span>}
                    </div>
                  );
                },
              }}
            />
            
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-lg font-medium">
                  {date ? format(date, 'MMMM d, yyyy') : "No date selected"}
                </h3>
              </div>
              
              {isLoading ? (
                <div className="text-muted-foreground">Loading events...</div>
              ) : eventsForSelectedDate.length > 0 ? (
                <div className="space-y-3">
                  {eventsForSelectedDate.map((event, i) => (
                    <div key={`${event.campaign.id}-${event.type}-${i}`} className="border rounded-md p-3 flex justify-between">
                      <div>
                        <h4 className="font-medium">{event.campaign.name}</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <Badge variant={event.type === "start" ? "outline" : "default"}>
                            {event.type === "start" ? "Campaign Start" : "Campaign End"}
                          </Badge>
                          <span>{format(event.date, 'h:mm a')}</span>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        <span className="text-sm text-muted-foreground">No creators assigned</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-muted-foreground italic">No events for this date</div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
