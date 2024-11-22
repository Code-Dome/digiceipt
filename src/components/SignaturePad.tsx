import { useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface SignaturePadProps {
  sigCanvas: React.RefObject<SignatureCanvas>;
  onClear: () => void;
  initialSignature?: string;
}

export const SignaturePad = ({ sigCanvas, onClear, initialSignature }: SignaturePadProps) => {
  useEffect(() => {
    if (initialSignature && sigCanvas.current) {
      const img = new Image();
      img.onload = () => {
        const canvas = sigCanvas.current;
        if (canvas) {
          const ctx = canvas.getCanvas().getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0);
          }
        }
      };
      img.src = initialSignature;
    }
  }, [initialSignature, sigCanvas]);

  return (
    <div className="space-y-2">
      <Label>Signature</Label>
      <div className="border rounded-md p-2">
        <SignatureCanvas
          ref={sigCanvas}
          canvasProps={{
            className: "signature-pad",
            width: 500,
            height: 200,
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