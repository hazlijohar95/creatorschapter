
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";
import { CampaignCalendarClassNames } from "./CampaignCalendarConfig";

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
            classNames={CampaignCalendarClassNames}
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
