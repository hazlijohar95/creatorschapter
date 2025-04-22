import {
  add,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isEqual,
  isSameDay,
  isSameMonth,
  isToday,
  parse,
  parseISO,
  startOfToday,
} from "date-fns"
import { useState } from "react"

import { cn } from "@/lib/utils"

export interface Event {
  id: string
  name: string
  date: Date
}

interface ScheduleCalendarProps extends React.HTMLAttributes<HTMLDivElement> {
  events?: Event[]
  getDayClassName?: (date: {
    displayMonth: Date
    activeModifiers: any
  }) => string
}

export function ScheduleCalendar({
  className,
  events: initialEvents = [],
  getDayClassName,
  ...props
}: ScheduleCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(startOfToday())
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)
  const [events, setEvents] = useState(initialEvents)

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  })

  function startOfMonth(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), 1)
  }

  function goToPreviousMonth() {
    setCurrentMonth(add(currentMonth, { months: -1 }))
  }

  function goToNextMonth() {
    setCurrentMonth(add(currentMonth, { months: 1 }))
  }

  function goToToday() {
    setCurrentMonth(startOfToday())
  }

  const handleDayClick = (day: Date) => {
    setSelectedDay(day)
  }

  return (
    <div className={cn("md:w-[350px]", className)} {...props}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            className="rounded-md p-1 transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => goToPreviousMonth()}
          >
            <span className="sr-only">Go to previous month</span>
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <button
            type="button"
            className="rounded-md p-1 transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => goToNextMonth()}
          >
            <span className="sr-only">Go to next month</span>
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-7 gap-2">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <div key={day} className="text-center text-xs font-medium uppercase">
            {day}
          </div>
        ))}
        {days.map((day, dayIdx) => {
          const dayIsToday = isToday(day)
          const dayIsSelected = selectedDay
            ? isSameDay(day, selectedDay)
            : false
          const monthIsCurrent = isSameMonth(day, currentMonth)

          const eventForDay = events.find((event) =>
            isSameDay(parseISO(event.date.toISOString()), day)
          )

          return (
            <div key={dayIdx} className="relative">
              <button
                type="button"
                onClick={() => handleDayClick(day)}
                className={cn(
                  "mx-auto flex h-9 w-9 items-center justify-center rounded-full border p-0 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50",
                  monthIsCurrent ? "text-foreground" : "text-muted-foreground",
                  dayIsToday && "font-semibold",
                  dayIsSelected && "bg-secondary text-secondary-foreground",
                  !monthIsCurrent && "opacity-50",
                  typeof getDayClassName === 'function' ? getDayClassName({ displayMonth: currentMonth, activeModifiers: {} }) : undefined
                )}
              >
                <time dateTime={format(day, "yyyy-MM-dd")}>
                  {format(day, "d")}
                </time>
              </button>
              {eventForDay ? (
                <div className="absolute top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-primary" />
              ) : null}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ChevronLeftIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      strokeWidth={1.5}
      stroke="currentColor"
      viewBox="0 0 24 24"
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
    </svg>
  )
}

function ChevronRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      strokeWidth={1.5}
      stroke="currentColor"
      viewBox="0 0 24 24"
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
  )
}
