import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { receiptTemplates } from "@/utils/templates";
import { Receipt } from "@/types/receipt";
import { CompanySettings } from "@/types/companySettings";
import { useState } from "react";

interface ReceiptTemplateSelectorProps {
  receipt: Receipt;
  onTemplateSelect: (template: any) => void;
}

export const ReceiptTemplateSelector = ({
  receipt,
  onTemplateSelect,
}: ReceiptTemplateSelectorProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const settings: CompanySettings = JSON.parse(localStorage.getItem("companySettings") || "{}");

  const handlePreview = (template: any) => {
    setSelectedTemplate(template);
  };

  const handleSelect = () => {
    if (selectedTemplate) {
      onTemplateSelect(selectedTemplate);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-white hover:bg-violet-50 text-violet-700 border-violet-200">
          Choose Template
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Select Receipt Template</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          {receiptTemplates.map((template) => (
            <div
              key={template.id}
              className={`border rounded-lg p-4 cursor-pointer hover:border-violet-500 transition-all ${
                selectedTemplate?.id === template.id ? 'border-violet-500 ring-2 ring-violet-200' : ''
              }`}
              onClick={() => handlePreview(template)}
            >
              <h3 className="font-semibold mb-2">{template.name}</h3>
              <p className="text-sm text-gray-500 mb-4">{template.description}</p>
              <div className="bg-white rounded-lg shadow p-4 max-h-[300px] overflow-y-auto">
                <div 
                  dangerouslySetInnerHTML={{ 
                    __html: template.generateHTML(receipt, settings) 
                  }} 
                />
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-4">
          <Button
            onClick={handleSelect}
            disabled={!selectedTemplate}
            className="bg-violet-600 hover:bg-violet-700"
          >
            Use Template
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};