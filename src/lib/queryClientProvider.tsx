
import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface QueryProviderProps {
  children: ReactNode;
}

// Create a client with optimized caching strategies
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
      gcTime: 1000 * 60 * 60 * 24, // Keep unused data in cache for 24 hours
      retry: 1, // Only retry failed requests once
      refetchOnMount: true, // Refetch on component mount if data is stale
      refetchOnWindowFocus: true, // Refetch when window regains focus if data is stale
      refetchOnReconnect: true, // Refetch on reconnection if data is stale
    },
  },
});

export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
