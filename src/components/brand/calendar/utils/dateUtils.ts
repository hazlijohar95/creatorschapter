
import { format, parse, startOfWeek, getDay, addDays } from "date-fns";
import { Campaign } from "../types";

export const locales = {
  "en-US": require("date-fns/locale/en-US"),
};

export function getCalendarLabel(view: string, date: Date): string {
  if (view === "month") {
    return format(date, "MMMM yyyy");
  } else if (view === "week") {
    const start = startOfWeek(date);
    const end = addDays(start, 6);
    return `${format(start, "MMM d")} - ${format(end, "MMM d, yyyy")}`;
  } else if (view === "day") {
    return format(date, "MMMM d, yyyy");
  }
  return "";
}

export function getNavigationDate(view: string, date: Date, direction: "next" | "prev"): Date {
  let newDate;
  
  if (direction === "prev") {
    switch (view) {
      case "month":
        newDate = new Date(date.getFullYear(), date.getMonth() - 1, 1);
        break;
      case "week":
        newDate = addDays(date, -7);
        break;
      case "day":
        newDate = addDays(date, -1);
        break;
      default:
        newDate = new Date();
    }
  } else {
    switch (view) {
      case "month":
        newDate = new Date(date.getFullYear(), date.getMonth() + 1, 1);
        break;
      case "week":
        newDate = addDays(date, 7);
        break;
      case "day":
        newDate = addDays(date, 1);
        break;
      default:
        newDate = new Date();
    }
  }
  
  return newDate;
}

export function campaignToCalendarEvent(campaign: Campaign) {
  if (!campaign.start_date || !campaign.end_date) return null;
  
  return {
    id: campaign.id,
    title: campaign.name,
    start: new Date(campaign.start_date),
    end: new Date(campaign.end_date),
    status: campaign.status,
    description: campaign.description,
  };
}
