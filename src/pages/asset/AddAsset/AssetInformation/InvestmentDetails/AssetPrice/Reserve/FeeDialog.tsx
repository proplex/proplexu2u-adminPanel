import { Dialog, DialogContent, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { DialogHeader } from '@/components/ui/CustomDialog';
import FormGenerator from '@/components/UseForm/FormGenerator';
import { Button } from '@/components/ui/button';
import { useFormContext } from 'react-hook-form';

interface FeeDialogProps {
  isOpen: boolean;
  isEdit: boolean;
  index: number | null;
  formConfig: any;
  onSubmit: () => void;
  onCancel: () => void;
}

const FeeDialog: React.FC<FeeDialogProps> = ({
  isOpen,
  isEdit,
  index,
  formConfig,
  onSubmit,
  onCancel,
}) => {
  const { handleSubmit } = useFormContext(); // ✅ needed to connect to react-hook-form

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="w-[1000px] max-w-3xl max-h-[95vh] overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit' : 'Add'} Fee</DialogTitle>
        </DialogHeader>


        {/* ✅ Form wrapper with handleSubmit */}
        <form onSubmit={handleSubmit(onSubmit)}>
      

            <DialogFooter className="flex justify-end w-full mt-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              {/* ✅ Submit button */}
              <Button type="submit" className="cursor-pointer">
                Submit
              </Button>
            </DialogFooter>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {FormGenerator(formConfig({ index: index ?? -1, type: 'reserves' }))}

          </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FeeDialog;
