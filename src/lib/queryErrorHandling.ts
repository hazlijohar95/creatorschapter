
import { QueryClient } from "@tanstack/react-query";
import { handleError, showErrorToast } from "./errorHandling";

// Default error handler for React Query
export const defaultQueryErrorHandler = (error: unknown, contextMessage?: string) => {
  const appError = handleError(error, contextMessage);
  showErrorToast(appError);
  return appError;
};

// Create a configured query client with default error handling
export const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: (failureCount, error) => {
          // Don't retry for permission errors or validation errors
          const appError = handleError(error);
          if (appError.category === "permission" || appError.category === "validation") {
            return false;
          }
          // Only retry network issues and unknown errors up to 3 times
          return failureCount < 3;
        },
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5, // 5 minutes
      },
      mutations: {
        onError: (error) => {
          defaultQueryErrorHandler(error);
        }
      }
    }
  });
};

// A hook-ready wrapper for error handling in custom query hooks
export function handleQueryError(error: unknown, contextMessage?: string) {
  return defaultQueryErrorHandler(error, contextMessage);
}
