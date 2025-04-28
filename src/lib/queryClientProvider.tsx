
import { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useConfigStore } from "@/store/configStore";

interface QueryProviderProps {
  children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  const { prefetchData } = useConfigStore();
  
  // Use state to ensure the client persists across renders
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
        gcTime: 1000 * 60 * 60 * 24, // Keep unused data in cache for 24 hours
        retry: 1, // Only retry failed requests once
        refetchOnMount: prefetchData, // Only refetch if prefetchData is enabled
        refetchOnWindowFocus: prefetchData, // Only refetch if prefetchData is enabled
        refetchOnReconnect: true, // Always refetch on reconnection
      },
      mutations: {
        retry: 1,
        onError: (error) => {
          console.error('Mutation error:', error);
          // We could add global error handling here
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
