
import { useState } from "react";
import { Calendar } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function CampaignCalendarView() {
  const [date, setDate] = useState<Date>();

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-bold">Campaign Calendar</h2>
      <Card>
        <CardContent className="p-4">
          <DayPicker
            mode="single"
            selected={date}
            onSelect={setDate}
            className={cn("border-0 shadow-none")}
            classNames={{
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
              day_outside: "text-muted-foreground opacity-50", // Changed from 'outside' to 'day_outside'
              selected:
                "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground rounded-md",
              disabled: "opacity-50 pointer-events-none",
            }}
          />
          <p>
            {date ? (
              <span>
                You selected{" "}
                {date.toLocaleDateString()}
              </span>
            ) : (
              <span>Please pick a date.</span>
            )}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
