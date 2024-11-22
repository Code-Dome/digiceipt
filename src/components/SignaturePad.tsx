import { useEffect, useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface SignaturePadProps {
  sigCanvas: React.RefObject<SignatureCanvas>;
  onClear: () => void;
  initialSignature?: string;
}

export const SignaturePad = ({ sigCanvas, onClear, initialSignature }: SignaturePadProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const resizeCanvas = () => {
      if (sigCanvas.current && containerRef.current) {
        const canvas = sigCanvas.current;
        const container = containerRef.current;
        const rect = container.getBoundingClientRect();
        
        canvas.getCanvas().width = rect.width;
        canvas.getCanvas().height = 200;
        
        // Clear and redraw if there's an initial signature
        if (initialSignature) {
          const img = new Image();
          img.onload = () => {
            const ctx = canvas.getCanvas().getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0);
            }
          };
          img.src = initialSignature;
        }
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [sigCanvas, initialSignature]);

  return (
    <div className="space-y-2">
      <Label>Signature</Label>
      <div ref={containerRef} className="border rounded-md p-2">
        <SignatureCanvas
          ref={sigCanvas}
          canvasProps={{
            className: "signature-pad w-full",
            style: { 
              width: '100%',
              height: '200px',
              backgroundColor: '#fff'
            }
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