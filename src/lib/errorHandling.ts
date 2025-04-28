
import { toast } from "sonner";
import { PostgrestError, AuthError } from "@supabase/supabase-js";

// Error categories for better organization
export enum ErrorCategory {
  NETWORK = "network",
  AUTH = "authentication",
  PERMISSION = "permission",
  VALIDATION = "validation",
  NOT_FOUND = "not_found",
  UNKNOWN = "unknown"
}

export interface AppError {
  message: string;
  category: ErrorCategory;
  originalError?: Error | PostgrestError | AuthError | unknown;
  code?: string;
  context?: Record<string, any>;
}

// Function to determine error category based on the error
export function categorizeError(error: any): ErrorCategory {
  if (!navigator.onLine) {
    return ErrorCategory.NETWORK;
  }

  // Supabase specific error handling
  if (error?.code) {
    // Auth errors
    if (error.code === "auth/invalid-email" || 
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password" ||
        error.code === "auth/email-already-in-use") {
      return ErrorCategory.AUTH;
    }
    
    // Permission errors
    if (error.code === "42501" || error.code === "PGRST301") {
      return ErrorCategory.PERMISSION;
    }
    
    // Not found errors
    if (error.code === "PGRST204" || error.code === "404") {
      return ErrorCategory.NOT_FOUND;
    }
    
    // Validation errors
    if (error.code.startsWith("22") || error.code.startsWith("23")) {
      return ErrorCategory.VALIDATION;
    }
  }
  
  // Basic network error detection
  if (error instanceof TypeError && error.message === "Failed to fetch") {
    return ErrorCategory.NETWORK;
  }
  
  return ErrorCategory.UNKNOWN;
}

// Main error handler function that processes errors and returns a standardized AppError
export function handleError(error: any, contextMessage?: string): AppError {
  console.error("Error occurred:", error);
  
  const category = categorizeError(error);
  
  // Create a user-friendly message based on error category
  let userMessage = "An unexpected error occurred. Please try again.";
  
  switch (category) {
    case ErrorCategory.NETWORK:
      userMessage = "Network connection issue. Please check your internet connection and try again.";
      break;
    case ErrorCategory.AUTH:
      userMessage = "Authentication error. Please sign in again.";
      break;
    case ErrorCategory.PERMISSION:
      userMessage = "You don't have permission to perform this action.";
      break;
    case ErrorCategory.VALIDATION:
      userMessage = "Invalid data. Please check your input and try again.";
      break;
    case ErrorCategory.NOT_FOUND:
      userMessage = "The requested resource was not found.";
      break;
  }
  
  // Add context message if provided
  if (contextMessage) {
    userMessage = `${contextMessage}: ${userMessage}`;
  }
  
  // Prepare error object with consistent structure
  const appError: AppError = {
    message: userMessage,
    category,
    originalError: error,
    code: error?.code,
    context: {
      timestamp: new Date().toISOString(),
      path: window.location.pathname
    }
  };
  
  // Log detailed error information for debugging
  logError(appError);
  
  return appError;
}

// Display toast notification for error
export function showErrorToast(error: AppError) {
  toast.error("Error", {
    description: error.message
  });
}

// Centralized error logging
function logError(error: AppError) {
  // In a production app, this could send errors to a monitoring service
  console.error("Structured error:", {
    message: error.message,
    category: error.category,
    code: error.code,
    context: error.context,
    originalError: error.originalError
  });
}
