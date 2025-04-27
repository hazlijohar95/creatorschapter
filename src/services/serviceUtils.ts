
import { handleError, AppError, ErrorCategory } from "@/lib/errorHandling";

// Wrap async operations with consistent error handling
export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  contextMessage?: string
): Promise<T> {
  try {
    return await operation();
  } catch (error: unknown) {
    // Transform to AppError and throw
    const appError = handleError(error, contextMessage);
    throw appError;
  }
}

// Check if a value is an AppError
export function isAppError(value: unknown): value is AppError {
  return (
    typeof value === "object" &&
    value !== null &&
    "category" in value &&
    "message" in value
  );
}

// Helper to check if the error is a specific category
export function isErrorOfCategory(error: unknown, category: ErrorCategory): boolean {
  if (isAppError(error)) {
    return error.category === category;
  }
  return false;
}
