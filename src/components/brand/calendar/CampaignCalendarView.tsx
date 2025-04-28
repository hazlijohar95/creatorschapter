
import { useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./styles/calendar.css";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { CalendarToolbar } from "./components/CalendarToolbar";
import { CalendarLegend } from "./components/CalendarLegend";
import type { CampaignCalendarViewProps, CalendarEvent } from "./types";

const locales = {
  "en-US": require("date-fns/locale/en-US"),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales,
});

export function CampaignCalendarView({ campaigns }: CampaignCalendarViewProps) {
  const [view, setView] = useState("month");
  const [date, setDate] = useState(new Date());
  const isMobile = useMediaQuery("(max-width: 768px)");

  const events: CalendarEvent[] = campaigns
    .filter((campaign) => campaign.start_date && campaign.end_date)
    .map((campaign) => ({
      id: campaign.id,
      title: campaign.name,
      start: new Date(campaign.start_date as string),
      end: new Date(campaign.end_date as string),
      status: campaign.status,
      description: campaign.description,
    }));

  const eventStyleGetter = (event: CalendarEvent) => {
    let style = {
      backgroundColor: "#4f46e5",
      borderRadius: "4px",
      color: "white",
      border: "none",
      display: "block",
    };

    switch (event.status) {
      case "active":
        style.backgroundColor = "#16a34a";
        break;
      case "draft":
        style.backgroundColor = "#6b7280";
        break;
      case "paused":
        style.backgroundColor = "#f59e0b";
        break;
      case "completed":
        style.backgroundColor = "#8b5cf6";
        break;
    }

    return { style };
  };

  if (events.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg bg-muted/20">
        <h3 className="text-lg font-medium">No campaigns scheduled</h3>
        <p className="text-muted-foreground mt-1">
          Create campaigns with start and end dates to see them on the calendar
        </p>
      </div>
    );
  }

  return (
    <div>
      <CalendarLegend />
      <div className="calendar-container border rounded-lg p-4 bg-background">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          eventPropGetter={eventStyleGetter}
          components={{
            toolbar: CalendarToolbar,
          }}
          view={view as any}
          onView={(newView) => setView(newView)}
          date={date}
          onNavigate={(newDate) => setDate(newDate)}
          views={isMobile ? ["day", "week"] : ["month", "week", "day"]}
          popup
        />
      </div>
    </div>
  );
}
