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

interface ReceiptFormProps {
  initialData?: Receipt;
  onSave: (receipt: Receipt) => void;
  onUpdate: (receipt: Receipt) => void;
}

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
      options: type === "dropdown" ? ["Option 1"] : undefined,
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

  const clearSignature = () => {
    if (sigCanvas.current) {
      sigCanvas.current.clear();
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="flex justify-between">
            <div>
              <p className="font-semibold">Invoice #{receipt.invoiceNo}</p>
              <p className="text-sm text-muted-foreground">{receipt.timestamp}</p>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="driverName">Driver Name</Label>
              <Input
                id="driverName"
                value={receipt.driverName}
                onChange={(e) => handleInputChange("driverName", e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="horseReg">Horse Registration</Label>
              <Input
                id="horseReg"
                value={receipt.horseReg}
                onChange={(e) => handleInputChange("horseReg", e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={receipt.companyName}
                onChange={(e) => handleInputChange("companyName", e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="washType">Wash Type</Label>
              <Select
                value={receipt.washType}
                onValueChange={handleWashTypeChange}
              >
                <SelectTrigger>
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
                >
                  Add Text Field
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addCustomField("dropdown")}
                >
                  Add Dropdown
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addCustomField("checkbox")}
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
                  />
                ))}
              </div>
            </div>

            <SignaturePad sigCanvas={sigCanvas} onClear={clearSignature} />

            <Button onClick={handleSave} className="mt-4">
              {initialData?.id ? "Update Receipt" : "Save Receipt"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReceiptForm;