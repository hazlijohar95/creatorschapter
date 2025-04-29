
/**
 * UI component types
 */

export interface StatusBadgeProps {
  status: string;
  variant?: "compact" | "default";
}

export interface WaitlistErrorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  errorDetails: string | null;
}

export interface WaitlistSuccessMessageProps {
  hasEmailError?: boolean;
}
