
import { cn } from "@/lib/utils";

// This object stores only supported classNames properties for DayPicker v8+ (react-day-picker)
export const CampaignCalendarClassNames = {
  months: "flex flex-col sm:flex-row flex-wrap",
  month: "space-y-4",
  caption: "flex justify-center pt-1 relative items-center",
  caption_label: "text-base font-semibold",
  nav: "space-x-1",
  nav_button: "h-7 w-7 bg-muted hover:bg-accent rounded-md",
  nav_button_previous: "absolute left-1",
  nav_button_next: "absolute right-1",
  table: "w-full border-collapse space-y-1",
  head_row: "flex",
  head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
  row: "flex w-full mt-2",
  cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
  day: cn(
    "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
    "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground rounded-md"
  ),
  day_outside: "text-muted-foreground opacity-50", // Supported in react-day-picker v8+
  day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground rounded-md",
  day_disabled: "opacity-50 pointer-events-none",
};
