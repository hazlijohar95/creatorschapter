
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getCalendarLabel, getNavigationDate } from "../utils/dateUtils";

interface CalendarToolbarProps {
  date: Date;
  view: string;
  onNavigate: (action: string, date: Date) => void;
  onView: (view: string) => void;
}

export function CalendarToolbar({ date, view, onNavigate, onView }: CalendarToolbarProps) {
  const goToBack = () => {
    const newDate = getNavigationDate(view, date, "prev");
    onNavigate("prev", newDate);
  };

  const goToNext = () => {
    const newDate = getNavigationDate(view, date, "next");
    onNavigate("next", newDate);
  };

  const goToToday = () => {
    onNavigate("TODAY", new Date());
  };

  const label = getCalendarLabel(view, date);

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

      <h2 className="text-xl font-semibold">{label}</h2>

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
