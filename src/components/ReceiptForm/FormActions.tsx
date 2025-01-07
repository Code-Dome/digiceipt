import { Button } from "@/components/ui/button";
import SignatureCanvas from "react-signature-canvas";

interface FormActionsProps {
  sigCanvas: React.RefObject<SignatureCanvas>;
  onSave: () => void;
  hasFieldErrors: boolean;
  isEditing: boolean;
}

export const FormActions = ({ sigCanvas, onSave, hasFieldErrors, isEditing }: FormActionsProps) => {
  return (
    <div className="space-y-4">
      <Button 
        onClick={onSave} 
        className="w-full sm:w-auto mt-4"
        disabled={hasFieldErrors}
      >
        {isEditing ? "Update Receipt" : "Save Receipt"}
      </Button>
      {hasFieldErrors && (
        <p className="text-sm text-destructive mt-2">
          Please fix the duplicate options in your custom fields before saving.
        </p>
      )}
    </div>
  );
};