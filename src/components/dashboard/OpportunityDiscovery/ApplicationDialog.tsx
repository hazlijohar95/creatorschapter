
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Campaign } from "./types";

interface ApplicationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCampaign: Campaign | null;
  applicationMessage: string;
  setApplicationMessage: (msg: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function ApplicationDialog({
  open,
  onOpenChange,
  selectedCampaign,
  applicationMessage,
  setApplicationMessage,
  onSubmit,
  isSubmitting,
}: ApplicationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Apply to Campaign</DialogTitle>
          <DialogDescription>
            Tell the brand why you're a great fit for this campaign.
          </DialogDescription>
        </DialogHeader>
        {selectedCampaign && (
          <>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">{selectedCampaign.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedCampaign.profiles.full_name}
                </p>
              </div>
              <Textarea
                placeholder="Write your application message here..."
                value={applicationMessage}
                onChange={(e) => setApplicationMessage(e.target.value)}
                rows={6}
                className="resize-none"
              />
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={onSubmit}
                disabled={!applicationMessage.trim() || isSubmitting}
              >
                {isSubmitting
                  ? (<> <span className="animate-spin">●</span> Submitting...</>)
                  : "Submit Application"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
