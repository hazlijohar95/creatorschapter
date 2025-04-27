
import { useState } from "react";
import { handleError, showErrorToast, AppError } from "@/lib/errorHandling";
import { useToast } from "./use-toast";

interface UseDataOperationOptions {
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
  successMessage?: string;
}

// Generic hook for handling data operations with consistent error handling
export function useDataOperation<T, P extends any[]>(
  operation: (...args: P) => Promise<T>,
  options: UseDataOperationOptions = {}
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AppError | null>(null);
  const { toast } = useToast();
  
  const defaultOptions = {
    showSuccessToast: true,
    showErrorToast: true,
    successMessage: "Operation completed successfully",
    ...options
  };

  const execute = async (...args: P): Promise<T | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await operation(...args);
      
      if (defaultOptions.showSuccessToast) {
        toast({
          title: "Success",
          description: defaultOptions.successMessage
        });
      }
      
      return result;
    } catch (err: unknown) {
      const appError = handleError(err);
      setError(appError);
      
      if (defaultOptions.showErrorToast) {
        showErrorToast(appError);
      }
      
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    execute,
    loading,
    error,
    clearError: () => setError(null)
  };
}
