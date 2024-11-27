import { useEffect, useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

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
    <div className="space-y-3">
      <Label className="text-sm font-medium text-gray-700">Signature</Label>
      <Card className="p-4 bg-white shadow-sm hover:shadow transition-shadow duration-200">
        <div ref={containerRef} className="border rounded-lg border-gray-200 p-2 bg-white">
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
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onClear}
          className="mt-3 btn-outline"
        >
          Clear Signature
        </Button>
      </Card>
    </div>
  );
};