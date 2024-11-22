import { useState, useRef, useEffect } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";

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
      options: type === "dropdown" ? [""] : undefined,
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
                  <div key={field.id} className="grid gap-2">
                    <Input
                      placeholder="Field Label"
                      value={field.label}
                      onChange={(e) =>
                        updateCustomField(field.id, { label: e.target.value })
                      }
                    />
                    {field.type === "text" && (
                      <Input
                        placeholder="Value"
                        value={field.value}
                        onChange={(e) =>
                          updateCustomField(field.id, { value: e.target.value })
                        }
                      />
                    )}
                    {field.type === "dropdown" && (
                      <div className="space-y-2">
                        <Input
                          placeholder="Options (comma-separated)"
                          value={field.options?.join(", ")}
                          onChange={(e) =>
                            updateCustomField(field.id, {
                              options: e.target.value.split(",").map((s) => s.trim()),
                            })
                          }
                        />
                        <Select
                          value={field.value}
                          onValueChange={(value) =>
                            updateCustomField(field.id, { value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select option" />
                          </SelectTrigger>
                          <SelectContent>
                            {field.options?.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    {field.type === "checkbox" && (
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={field.id}
                          checked={field.value === "true"}
                          onCheckedChange={(checked) =>
                            updateCustomField(field.id, {
                              value: checked ? "true" : "false",
                            })
                          }
                        />
                        <label
                          htmlFor={field.id}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {field.label || "Checkbox"}
                        </label>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

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
                  onClick={clearSignature}
                  className="mt-2"
                >
                  Clear Signature
                </Button>
              </div>
            </div>

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