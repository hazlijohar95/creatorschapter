
import React from 'react';
import { AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { WaitlistErrorDialogProps } from '@/types/components/ui';

export const WaitlistErrorDialog: React.FC<WaitlistErrorDialogProps> = ({
  open,
  onOpenChange,
  errorDetails,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Submission Error Details</DialogTitle>
          <DialogDescription>
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <div className="flex">
                <AlertCircle className="text-red-500 mr-2" />
                <div>
                  <p className="text-red-700 font-medium">There was an error with your submission:</p>
                  <p className="text-sm text-red-600 mt-1">{errorDetails}</p>
                </div>
              </div>
            </div>
            <p className="mt-4">
              Please try again or contact support if the problem persists.
            </p>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
