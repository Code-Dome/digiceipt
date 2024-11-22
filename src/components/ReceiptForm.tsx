import { useState, useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import { format } from "date-fns-tz";
import { v4 as uuidv4 } from "uuid";
import { Receipt, CustomField, FieldType } from "@/types/receipt";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { CustomFieldInput } from "./CustomFieldInput";
import { SignaturePad } from "./SignaturePad";
import { DefaultFields } from "./DefaultFields";
import { RestoreFields } from "./RestoreFields";

interface ReceiptFormProps {
  initialData?: Receipt;
  onSave: (receipt: Receipt) => void;
  onUpdate: (receipt: Receipt) => void;
}

const defaultFields = [
  { key: "driverName", label: "Driver Name" },
  { key: "horseReg", label: "Horse Registration" },
  { key: "companyName", label: "Company Name" },
];

const ReceiptForm = ({ initialData, onSave, onUpdate }: ReceiptFormProps) => {
  const [receipt, setReceipt] = useState<Receipt>(() => ({
    id: initialData?.id || uuidv4(),
    invoiceNo: initialData?.invoiceNo || `INV-${Math.floor(Math.random() * 10000)}`,
    timestamp: initialData?.timestamp || format(new Date(), "dd/MM/yyyy HH:mm:ss", { timeZone: "Africa/Johannesburg" }),
    driverName: initialData?.driverName || "",
    horseReg: initialData?.horseReg || "",
    companyName: initialData?.companyName || "",
    washType: initialData?.washType || "",
    otherWashType: initialData?.otherWashType || "",
    customFields: initialData?.customFields || [],
    signature: initialData?.signature || "",
    removedFields: initialData?.removedFields || [],
    removedCustomFields: initialData?.removedCustomFields || [],
  }));

  const sigCanvas = useRef<SignatureCanvas>(null);
  const [showOtherWashType, setShowOtherWashType] = useState(receipt.washType === "Other");

  const handleInputChange = (field: keyof Receipt, value: string) => {
    setReceipt((prev) => ({ ...prev, [field]: value }));
  };

  const handleWashTypeChange = (value: string) => {
    setShowOtherWashType(value === "Other");
    setReceipt((prev) => ({
      ...prev,
      washType: value,
      otherWashType: value !== "Other" ? "" : prev.otherWashType,
    }));
  };

  const addCustomField = (type: FieldType) => {
    const newField: CustomField = {
      id: uuidv4(),
      type,
      label: "",
      value: "",
      options: type === "dropdown" || type === "checkbox" ? [""] : undefined,
    };
    setReceipt((prev) => ({
      ...prev,
      customFields: [...prev.customFields, newField],
    }));
  };

  const updateCustomField = (id: string, updates: Partial<CustomField>) => {
    setReceipt((prev) => ({
      ...prev,
      customFields: prev.customFields.map((field) =>
        field.id === id ? { ...field, ...updates } : field
      ),
    }));
  };

  const removeCustomField = (id: string) => {
    setReceipt((prev) => {
      const fieldToRemove = prev.customFields.find((field) => field.id === id);
      if (!fieldToRemove) return prev;

      return {
        ...prev,
        customFields: prev.customFields.filter((field) => field.id !== id),
        removedCustomFields: [...(prev.removedCustomFields || []), fieldToRemove],
      };
    });
  };

  const removeDefaultField = (field: string) => {
    setReceipt((prev) => ({
      ...prev,
      removedFields: [...(prev.removedFields || []), field],
      [field]: "",
    }));
  };

  const restoreDefaultField = (field: string) => {
    setReceipt((prev) => ({
      ...prev,
      removedFields: (prev.removedFields || []).filter((f) => f !== field),
    }));
  };

  const restoreCustomField = (field: CustomField) => {
    setReceipt((prev) => ({
      ...prev,
      customFields: [...prev.customFields, field],
      removedCustomFields: (prev.removedCustomFields || []).filter(
        (f) => f.id !== field.id
      ),
    }));
  };

  const handleSave = () => {
    if (sigCanvas.current) {
      const signature = sigCanvas.current.toDataURL();
      const updatedReceipt = { ...receipt, signature };
      if (initialData?.id) {
        onUpdate(updatedReceipt);
      } else {
        onSave(updatedReceipt);
      }
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="flex justify-between">
            <div>
              <p className="font-semibold text-violet-700">Invoice #{receipt.invoiceNo}</p>
              <p className="text-sm text-violet-500">{receipt.timestamp}</p>
            </div>
          </div>

          <div className="grid gap-4">
            <DefaultFields
              fields={defaultFields}
              values={receipt}
              removedFields={receipt.removedFields || []}
              onInputChange={handleInputChange}
              onRemoveField={removeDefaultField}
            />

            <RestoreFields
              removedFields={receipt.removedFields || []}
              removedCustomFields={receipt.removedCustomFields || []}
              defaultFields={defaultFields}
              onRestoreField={restoreDefaultField}
              onRestoreCustomField={restoreCustomField}
            />

            <div className="grid gap-2">
              <Label htmlFor="washType">Wash Type</Label>
              <Select
                value={receipt.washType}
                onValueChange={handleWashTypeChange}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select wash type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Side Tipper">Side Tipper</SelectItem>
                  <SelectItem value="Full Wash">Full Wash</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {showOtherWashType && (
              <div className="grid gap-2">
                <Label htmlFor="otherWashType">Specify Other Wash Type</Label>
                <Input
                  id="otherWashType"
                  value={receipt.otherWashType}
                  onChange={(e) => handleInputChange("otherWashType", e.target.value)}
                />
              </div>
            )}

            <div className="space-y-4">
              <Label>Custom Fields</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addCustomField("text")}
                  className="bg-white hover:bg-violet-50 text-violet-700 border-violet-200"
                >
                  Add Text Field
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addCustomField("dropdown")}
                  className="bg-white hover:bg-violet-50 text-violet-700 border-violet-200"
                >
                  Add Dropdown
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addCustomField("checkbox")}
                  className="bg-white hover:bg-violet-50 text-violet-700 border-violet-200"
                >
                  Add Checkbox
                </Button>
              </div>

              <div className="space-y-4">
                {receipt.customFields.map((field) => (
                  <CustomFieldInput
                    key={field.id}
                    field={field}
                    onUpdate={updateCustomField}
                    onRemove={removeCustomField}
                  />
                ))}
              </div>
            </div>

            <SignaturePad 
              sigCanvas={sigCanvas} 
              onClear={() => sigCanvas.current?.clear()} 
              initialSignature={initialData?.signature}
            />

            <Button 
              onClick={handleSave} 
              className="mt-4 bg-violet-600 hover:bg-violet-700 text-white"
            >
              {initialData?.id ? "Update Receipt" : "Save Receipt"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReceiptForm;
