
import { format, isValid, parseISO } from "date-fns";

export function formatDate(dateString: string): string {
  try {
    const date = parseISO(dateString);
    return isValid(date) ? format(date, "MMM d, yyyy") : "Invalid date";
  } catch (err) {
    console.error("Date formatting error:", err);
    return "Invalid date";
  }
}
