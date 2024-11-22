import { useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface SignaturePadProps {
  sigCanvas: React.RefObject<SignatureCanvas>;
  onClear: () => void;
}

export const SignaturePad = ({ sigCanvas, onClear }: SignaturePadProps) => {
  return (
    <div className="space-y-2">
      <Label>Signature</Label>
      <div className="border rounded-md p-2">
        <SignatureCanvas
          ref={sigCanvas}
          canvasProps={{
            className: "signature-pad",
          }}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onClear}
          className="mt-2"
        >
          Clear Signature
        </Button>
      </div>
    </div>
  );
};