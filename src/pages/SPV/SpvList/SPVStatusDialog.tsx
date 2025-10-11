import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface SPVStatusDialogProps {
  isOpen: boolean;
  spv: any;
  onClose: () => void;
  onConfirm: () => void;
}

const SPVStatusDialog: React.FC<SPVStatusDialogProps> = ({
  isOpen,
  spv,
  onClose,
  onConfirm,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            Do you want to update the SPV status?
          </DialogTitle>
          <DialogDescription>
            We will update the SPV status to {spv?.status === "active" ? "Draft" : "Active"}.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" onClick={onConfirm}>
            Confirm
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SPVStatusDialog;