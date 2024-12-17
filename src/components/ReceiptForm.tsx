import { useState, useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import { formatInTimeZone } from "date-fns-tz";
import { parseISO } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import { Receipt, CustomField, FieldType } from "@/types/receipt";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CustomFieldInput } from "./CustomFieldInput";
import { SignaturePad } from "./SignaturePad";
import { DefaultFields } from "./DefaultFields";
import { RestoreFields } from "./RestoreFields";
import { useToast } from "@/hooks/use-toast";
import { defaultFields } from "./ReceiptForm/FieldTypes";

const generateUniqueInvoiceNo = () => {
  const savedReceipts = JSON.parse(localStorage.getItem("receipts") || "[]");
  const archivedReceipts = JSON.parse(localStorage.getItem("archivedReceipts") || "[]");
  const allReceipts = [...savedReceipts, ...archivedReceipts];
  
  let invoiceNo;
  do {
    invoiceNo = `INV-${Math.floor(Math.random() * 10000)}`;
  } while (allReceipts.some(r => r.invoiceNo === invoiceNo));
  
  return invoiceNo;
};

const ReceiptForm = ({ initialData, onSave, onUpdate }: { 
  initialData?: Receipt;
  onSave: (receipt: Receipt) => void;
  onUpdate: (receipt: Receipt) => void;
}) => {
  const [receipt, setReceipt] = useState<Receipt>(() => ({
    id: initialData?.id || uuidv4(),
    invoiceNo: initialData?.invoiceNo || generateUniqueInvoiceNo(),
    timestamp: initialData?.timestamp || new Date().toISOString(),
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

  const formatDate = (dateString: string) => {
    try {
      return formatInTimeZone(
        parseISO(dateString),
        'Africa/Johannesburg',
        'dd/MM/yyyy HH:mm:ss'
      );
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  const sigCanvas = useRef<SignatureCanvas>(null);
  const [showOtherWashType, setShowOtherWashType] = useState(receipt.washType === "Other");
  const [hasFieldErrors, setHasFieldErrors] = useState(false);

  const handleInputChange = (field: keyof Receipt, value: string) => {
    setReceipt((prev) => ({ ...prev, [field]: value }));
    if (field === "washType") {
      setShowOtherWashType(value === "Other");
    }
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
    <Card className="w-full dark:bg-gray-800 dark:border-gray-700">
      <CardContent className="p-6">
        <div className="space-y-8">
          <div className="flex justify-between">
            <div>
              <p className="font-semibold text-violet-700 dark:text-violet-400">Invoice #{receipt.invoiceNo}</p>
              <p className="text-sm text-violet-500 dark:text-violet-300">
                {formatDate(receipt.timestamp)}
              </p>
            </div>
          </div>

          <div className="grid gap-6">
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

            {showOtherWashType && !receipt.removedFields?.includes('washType') && (
              <div className="grid gap-2">
                <Label htmlFor="otherWashType">Specify Other Wash Type</Label>
                <Input
                  id="otherWashType"
                  value={receipt.otherWashType}
                  onChange={(e) => handleInputChange("otherWashType", e.target.value)}
                  className="dark:bg-gray-900 dark:border-gray-700 dark:text-white"
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
                  className="bg-white hover:bg-violet-50 text-violet-700 border-violet-200 dark:bg-gray-900 dark:hover:bg-gray-800 dark:text-violet-400 dark:border-gray-700"
                >
                  Add Text Field
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addCustomField("dropdown")}
                  className="bg-white hover:bg-violet-50 text-violet-700 border-violet-200 dark:bg-gray-900 dark:hover:bg-gray-800 dark:text-violet-400 dark:border-gray-700"
                >
                  Add Dropdown
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addCustomField("checkbox")}
                  className="bg-white hover:bg-violet-50 text-violet-700 border-violet-200 dark:bg-gray-900 dark:hover:bg-gray-800 dark:text-violet-400 dark:border-gray-700"
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
                    setHasError={setHasFieldErrors}
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
              className="mt-4 bg-violet-600 hover:bg-violet-700 text-white dark:bg-violet-700 dark:hover:bg-violet-800"
              disabled={hasFieldErrors}
            >
              {initialData?.id ? "Update Receipt" : "Save Receipt"}
            </Button>
            {hasFieldErrors && (
              <p className="text-sm text-destructive mt-2">
                Please fix the duplicate options in your custom fields before saving.
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReceiptForm;
