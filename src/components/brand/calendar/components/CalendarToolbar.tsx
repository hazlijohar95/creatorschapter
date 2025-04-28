
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, addDays, startOfWeek } from "date-fns";

interface CalendarToolbarProps {
  date: Date;
  view: string;
  onNavigate: (action: string, date: Date) => void;
  onView: (view: string) => void;
}

export function CalendarToolbar({ date, view, onNavigate, onView }: CalendarToolbarProps) {
  const goToBack = () => {
    let newDate;
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
    onNavigate("prev", newDate);
  };

  const goToNext = () => {
    let newDate;
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
    onNavigate("next", newDate);
  };

  const goToToday = () => {
    onNavigate("TODAY", new Date());
  };

  const label = () => {
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
        <Select value={view} onValueChange={onView}>
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
}
