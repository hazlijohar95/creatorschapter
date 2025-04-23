
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetFooter } from "@/components/ui/sheet";
import { ApplicationDetailHeader } from "./ApplicationDetailHeader";
import { ApplicationDetailTags } from "./ApplicationDetailTags";
import { ApplicationDetailTabs } from "./ApplicationDetailTabs";
import { ApplicationDetailFooter } from "./ApplicationDetailFooter";

interface Application {
  id: number;
  creatorName: string;
  creatorHandle: string;
  avatar: string;
  campaign: string;
  date: string;
  status: "pending" | "approved" | "rejected" | "in_discussion";
  message: string;
  categories: string[];
  match: number;
  isNew: boolean;
  budget: string;
  audienceSize?: string;
  engagement?: string;
  notes?: string[];
}

interface ApplicationDetailPanelProps {
  application: Application | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
  onDiscuss: (id: number) => void;
  onAddNote: (id: number, note: string) => void;
}

export function ApplicationDetailPanel({
  application,
  isOpen,
  onClose,
  onApprove,
  onReject,
  onDiscuss,
  onAddNote
}: ApplicationDetailPanelProps) {
  const [activeTab, setActiveTab] = useState("details");

  if (!application) return null;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl overflow-y-auto">
        <SheetHeader className="space-y-3 pb-4">
          <ApplicationDetailHeader
            creatorName={application.creatorName}
            creatorHandle={application.creatorHandle}
            avatar={application.avatar}
            status={application.status}
          />
          <ApplicationDetailTags categories={application.categories} />
        </SheetHeader>
        <ApplicationDetailTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          application={{
            id: application.id,
            campaign: application.campaign,
            budget: application.budget,
            date: application.date,
            message: application.message,
            audienceSize: application.audienceSize,
            engagement: application.engagement,
            match: application.match,
            notes: application.notes,
          }}
          onAddNote={onAddNote}
        />
        <SheetFooter className="pt-4 border-t mt-6 flex flex-col sm:flex-row gap-2">
          <ApplicationDetailFooter
            status={application.status}
            onReject={() => {
              onReject(application.id);
              onClose();
            }}
            onDiscuss={() => {
              onDiscuss(application.id);
              onClose();
            }}
            onApprove={() => {
              onApprove(application.id);
              onClose();
            }}
          />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
