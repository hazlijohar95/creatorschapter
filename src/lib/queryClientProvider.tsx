
import { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useConfigStore } from "@/store/configStore";
import { handleError, showErrorToast, ErrorCategory } from "@/lib/errorHandling";

interface QueryProviderProps {
  children: ReactNode;
}

// Define a proper type for the mutation context
interface MutationContext {
  timestamp?: number;
}

export function QueryProvider({ children }: QueryProviderProps) {
  const { prefetchData } = useConfigStore();
  
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
        gcTime: 1000 * 60 * 60 * 24, // Keep unused data in cache for 24 hours
        retry: (failureCount, error) => {
          // Don't retry on 404s or auth errors
          const appError = handleError(error);
          if (appError.category === ErrorCategory.NOT_FOUND || appError.category === ErrorCategory.AUTH) {
            return false;
          }
          return failureCount < 2;
        },
        refetchOnMount: prefetchData,
        refetchOnWindowFocus: prefetchData,
        refetchOnReconnect: true,
      },
      mutations: {
        onError: (error) => {
          const appError = handleError(error);
          showErrorToast(appError);
        },
        onMutate: () => {
          // Show pending toast for long-running mutations
          return { timestamp: Date.now() } as MutationContext;
        },
        onSettled: (_, error, variables, context) => {
          const typedContext = context as MutationContext;
          if (!error && typedContext?.timestamp) {
            const duration = Date.now() - typedContext.timestamp;
            // Only show success toast for operations that took longer than 1 second
            if (duration > 1000) {
              // toast.success("Operation completed successfully");
            }
          }
        }
      }
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
