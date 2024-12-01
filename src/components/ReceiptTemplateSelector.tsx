import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { receiptTemplates, TemplateStyle } from "@/utils/receiptTemplates";
import { Receipt } from "@/types/receipt";

interface ReceiptTemplateSelectorProps {
  receipt: Receipt;
  onTemplateSelect: (template: TemplateStyle) => void;
}

export const ReceiptTemplateSelector = ({
  receipt,
  onTemplateSelect,
}: ReceiptTemplateSelectorProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Choose Template</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Select Receipt Template</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          {receiptTemplates.map((template) => (
            <div
              key={template.id}
              className="border rounded-lg p-4 cursor-pointer hover:border-primary"
              onClick={() => onTemplateSelect(template)}
            >
              <h3 className="font-semibold mb-2">{template.name}</h3>
              <p className="text-sm text-gray-500 mb-4">{template.description}</p>
              {template.preview && (
                <img
                  src={template.preview}
                  alt={template.name}
                  className="w-full h-auto rounded-md"
                />
              )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};