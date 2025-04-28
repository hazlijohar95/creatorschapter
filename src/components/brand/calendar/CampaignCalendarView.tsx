
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./styles/calendar.css";
import { locales } from "./utils/dateUtils";
import { useCalendar } from "./hooks/useCalendar";
import { CalendarToolbar } from "./components/CalendarToolbar";
import { CalendarLegend } from "./components/CalendarLegend";
import { CalendarEmptyState } from "./components/CalendarEmptyState";
import type { CampaignCalendarViewProps, CalendarViewType } from "./types";

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales,
});

export function CampaignCalendarView({ campaigns, onCreateClick }: CampaignCalendarViewProps) {
  const {
    view,
    date,
    events,
    eventStyleGetter,
    handleViewChange, 
    handleNavigate,
    availableViews,
  } = useCalendar(campaigns);

  if (events.length === 0) {
    return <CalendarEmptyState onCreateClick={onCreateClick} />;
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
          view={view}
          onView={(newView) => handleViewChange(newView as CalendarViewType)}
          date={date}
          onNavigate={(newDate) => handleNavigate(newDate)}
          views={availableViews.reduce((viewsObj, viewName) => {
            return { ...viewsObj, [viewName]: true };
          }, {})}
          popup
        />
      </div>
    </div>
  );
}
