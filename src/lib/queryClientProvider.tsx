
import { ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { createQueryClient } from "./queryErrorHandling";

interface QueryProviderProps {
  children: ReactNode;
}

// Create a single instance of the query client with our standardized error handling
const queryClient = createQueryClient();

export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
