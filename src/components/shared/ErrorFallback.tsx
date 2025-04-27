
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ErrorFallbackProps {
  error: Error | null;
  resetErrorBoundary?: () => void;
  message?: string;
}

export function ErrorFallback({ 
  error, 
  resetErrorBoundary,
  message = "Something went wrong"
}: ErrorFallbackProps) {
  return (
    <Alert variant="destructive" className="my-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>{message}</AlertTitle>
      <AlertDescription className="mt-2">
        {error?.message}
      </AlertDescription>
      {resetErrorBoundary && (
        <Button 
          variant="outline" 
          onClick={resetErrorBoundary}
          className="mt-4"
        >
          Try again
        </Button>
      )}
    </Alert>
  );
}
