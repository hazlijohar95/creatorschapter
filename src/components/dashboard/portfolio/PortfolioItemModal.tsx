
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PortfolioItemForm } from "./PortfolioItemForm";

interface PortfolioItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item?: any;
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
        <PortfolioItemForm onClose={onClose} item={item} userId={userId} />
      </DialogContent>
    </Dialog>
  );
}
