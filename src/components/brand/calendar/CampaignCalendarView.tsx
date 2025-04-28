
import { useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay, addDays } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMediaQuery } from "@/hooks/useMediaQuery";

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

interface Campaign {
  id: string;
  name: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  status: string;
}

interface CampaignCalendarViewProps {
  campaigns: Campaign[];
}

export function CampaignCalendarView({ campaigns }: CampaignCalendarViewProps) {
  const [view, setView] = useState("month");
  const [date, setDate] = useState(new Date());
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Convert campaigns to calendar events
  const events = campaigns
    .filter((campaign) => campaign.start_date && campaign.end_date)
    .map((campaign) => ({
      id: campaign.id,
      title: campaign.name,
      start: new Date(campaign.start_date as string),
      end: new Date(campaign.end_date as string),
      status: campaign.status,
      description: campaign.description,
    }));

  // Customize the event style based on status
  const eventStyleGetter = (event: any) => {
    let style = {
      backgroundColor: "#4f46e5", // Default color (primary)
      borderRadius: "4px",
      color: "white",
      border: "none",
      display: "block",
    };

    switch (event.status) {
      case "active":
        style.backgroundColor = "#16a34a"; // Green
        break;
      case "draft":
        style.backgroundColor = "#6b7280"; // Gray
        break;
      case "paused":
        style.backgroundColor = "#f59e0b"; // Yellow/amber
        break;
      case "completed":
        style.backgroundColor = "#8b5cf6"; // Purple
        break;
    }

    return {
      style,
    };
  };

  // Custom toolbar component
  const CustomToolbar = (toolbar: any) => {
    const goToBack = () => {
      let newDate;
      switch (toolbar.view) {
        case "month":
          newDate = new Date(
            toolbar.date.getFullYear(),
            toolbar.date.getMonth() - 1,
            1
          );
          break;
        case "week":
          newDate = addDays(toolbar.date, -7);
          break;
        case "day":
          newDate = addDays(toolbar.date, -1);
          break;
        default:
          newDate = new Date();
      }
      toolbar.onNavigate("prev", newDate);
    };

    const goToNext = () => {
      let newDate;
      switch (toolbar.view) {
        case "month":
          newDate = new Date(
            toolbar.date.getFullYear(),
            toolbar.date.getMonth() + 1,
            1
          );
          break;
        case "week":
          newDate = addDays(toolbar.date, 7);
          break;
        case "day":
          newDate = addDays(toolbar.date, 1);
          break;
        default:
          newDate = new Date();
      }
      toolbar.onNavigate("next", newDate);
    };

    const goToToday = () => {
      toolbar.onNavigate("TODAY", new Date());
    };

    const label = () => {
      const date = toolbar.date;
      const viewType = toolbar.view;

      if (viewType === "month") {
        return format(date, "MMMM yyyy");
      } else if (viewType === "week") {
        const start = startOfWeek(date);
        const end = addDays(start, 6);
        return `${format(start, "MMM d")} - ${format(end, "MMM d, yyyy")}`;
      } else if (viewType === "day") {
        return format(date, "MMMM d, yyyy");
      }
      return "";
    };

    return (
      <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={goToBack}>
            Back
          </Button>
          <Button variant="outline" size="sm" onClick={goToNext}>
            Next
          </Button>
          <Button variant="outline" size="sm" onClick={goToToday}>
            Today
          </Button>
        </div>

        <h2 className="text-xl font-semibold">{label()}</h2>

        <div className="flex items-center space-x-2">
          <Select
            value={toolbar.view}
            onValueChange={(newValue) => toolbar.onView(newValue)}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="View" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="day">Day</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  };

  // Legend for campaign statuses
  const Legend = () => (
    <div className="flex flex-wrap items-center gap-4 mt-4 mb-2">
      <div className="text-sm font-medium">Campaign Status:</div>
      <div className="flex items-center">
        <div className="w-3 h-3 rounded bg-green-500 mr-1" />
        <span className="text-sm">Active</span>
      </div>
      <div className="flex items-center">
        <div className="w-3 h-3 rounded bg-gray-500 mr-1" />
        <span className="text-sm">Draft</span>
      </div>
      <div className="flex items-center">
        <div className="w-3 h-3 rounded bg-amber-500 mr-1" />
        <span className="text-sm">Paused</span>
      </div>
      <div className="flex items-center">
        <div className="w-3 h-3 rounded bg-purple-500 mr-1" />
        <span className="text-sm">Completed</span>
      </div>
    </div>
  );

  // Empty calendar state
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
      <Legend />
      <div className="calendar-container border rounded-lg p-4 bg-background">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          eventPropGetter={eventStyleGetter}
          components={{
            toolbar: CustomToolbar,
          }}
          view={view as any}
          onView={(newView) => setView(newView)}
          date={date}
          onNavigate={(newDate) => setDate(newDate)}
          views={isMobile ? ["day", "week"] : ["month", "week", "day"]}
          popup
        />
      </div>
      <style jsx global>{`
        .rbc-event {
          padding: 4px;
        }
        .rbc-event-label {
          font-size: 0.75rem;
        }
        .rbc-event-content {
          font-size: 0.875rem;
        }
        .rbc-today {
          background-color: rgba(59, 130, 246, 0.05);
        }
      `}</style>
    </div>
  );
}
