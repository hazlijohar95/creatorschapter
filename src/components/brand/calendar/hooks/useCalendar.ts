
import { useState } from "react";
import { Campaign, CalendarEvent, CalendarViewType } from "../types";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { campaignToCalendarEvent } from "../utils/dateUtils";

export function useCalendar(campaigns: Campaign[]) {
  const [view, setView] = useState<CalendarViewType>("month");
  const [date, setDate] = useState(new Date());
  const isMobile = useMediaQuery("(max-width: 768px)");

  const events: CalendarEvent[] = campaigns
    .filter((campaign) => campaign.start_date && campaign.end_date)
    .map((campaign) => {
      const event = campaignToCalendarEvent(campaign);
      return event ? event : null;
    })
    .filter(Boolean) as CalendarEvent[];

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

  const handleViewChange = (newView: CalendarViewType) => {
    setView(newView);
  };

  const handleNavigate = (newDate: Date) => {
    setDate(newDate);
  };

  const availableViews: CalendarViewType[] = isMobile ? ["day", "week"] : ["month", "week", "day"];

  return {
    view,
    date,
    events,
    eventStyleGetter,
    handleViewChange,
    handleNavigate,
    availableViews,
    isMobile,
  };
}
