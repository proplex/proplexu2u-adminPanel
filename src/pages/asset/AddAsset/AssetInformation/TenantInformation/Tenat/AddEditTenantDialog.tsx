import React from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../../../../../../components/ui/button";
import FormGenerator from "@/components/UseForm/FormGenerator";

interface AddEditTenantDialogProps {
  isOpen: boolean;
  isEdit: boolean;
  formConfig: any;
  onSubmit: () => void;
  onCancel: () => void;
}

const AddEditTenantDialog: React.FC<AddEditTenantDialogProps> = ({
  isOpen,
  isEdit,
  formConfig,
  onSubmit,
  onCancel,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="w-[1000px] max-w-6xl max-h-[95vh] overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit" : "Add"} Tenant</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {FormGenerator(formConfig)}
          </div>
          <DialogFooter className="flex justify-end w-full mt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="button" onClick={onSubmit}>
              Submit
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditTenantDialog;
