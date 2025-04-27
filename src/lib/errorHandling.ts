
import { toast } from "@/components/ui/use-toast";
import { PostgrestError } from "@supabase/supabase-js";

export type ServiceError = {
  message: string;
  code?: string;
  details?: string;
};

export function handleError(error: Error | PostgrestError | null | unknown, context?: string): ServiceError {
  console.error(`Error${context ? ` in ${context}` : ''}:`, error);

  // Handle Supabase PostgrestError
  if (error && typeof error === 'object' && 'code' in error) {
    const pgError = error as PostgrestError;
    
    // Common Postgres error codes
    switch (pgError.code) {
      case '23505':
        return { message: 'This record already exists', code: pgError.code, details: pgError.details };
      case '23503':
        return { message: 'This operation would break data relationships', code: pgError.code, details: pgError.details };
      case '42P01':
        return { message: 'Database configuration error', code: pgError.code };
      default:
        return { message: pgError.message, code: pgError.code, details: pgError.details };
    }
  }

  // Handle standard Error objects
  if (error instanceof Error) {
    return { message: error.message };
  }

  // Generic error
  return { message: 'An unexpected error occurred' };
}

export function showErrorToast(error: ServiceError) {
  toast({
    title: "Error",
    description: error.message,
    variant: "destructive",
  });
}

export async function handleServiceRequest<T>(
  context: string,
  operation: () => Promise<T>
): Promise<{ data: T | null; error: ServiceError | null }> {
  try {
    const result = await operation();
    return { data: result, error: null };
  } catch (error) {
    const serviceError = handleError(error, context);
    showErrorToast(serviceError);
    return { data: null, error: serviceError };
  }
}
