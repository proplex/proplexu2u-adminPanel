// Extracted UpdateAssetStatusDialog component
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface UpdateAssetStatusDialogProps {
  asset: any;
  setAsset: (asset: any) => void;
  updateStatus: () => Promise<void>;
}

const UpdateAssetStatusDialog: React.FC<UpdateAssetStatusDialogProps> = ({ asset, setAsset, updateStatus }) => {
  const isStatusOpen = !!asset;

  return (
    <Dialog open={isStatusOpen} onOpenChange={() => setAsset(null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            Do you want to update the Asset status?
          </DialogTitle>
          <DialogDescription>
            We will update the Asset status to {asset?.status === "active" ? "Inactive" : "Active"}.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" onClick={updateStatus}>
            Confirm
          </Button>
          <Button type="button" variant="outline" onClick={() => setAsset(null)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateAssetStatusDialog;