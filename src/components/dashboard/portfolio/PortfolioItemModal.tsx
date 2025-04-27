
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PortfolioItemForm } from "./PortfolioItemForm";
import { PortfolioItem } from "@/types/portfolio";
import ErrorBoundary from "@/components/shared/ErrorBoundary";

interface PortfolioItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item?: PortfolioItem;
  userId?: string;
}

export default function PortfolioItemModal({ 
  isOpen, 
  onClose, 
  item, 
  userId 
}: PortfolioItemModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{item ? "Edit Portfolio Item" : "Add New Portfolio Item"}</DialogTitle>
        </DialogHeader>
        <ErrorBoundary>
          <PortfolioItemForm onClose={onClose} item={item} userId={userId} />
        </ErrorBoundary>
      </DialogContent>
    </Dialog>
  );
}
