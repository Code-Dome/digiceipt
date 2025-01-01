import { useState, useRef, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";
import { v4 as uuidv4 } from "uuid";
import { Receipt, CustomField, FieldType } from "@/types/receipt";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DefaultFields } from "./DefaultFields";
import { RestoreFields } from "./RestoreFields";
import { SignaturePad } from "./SignaturePad";
import { HeaderSection } from "./ReceiptForm/HeaderSection";
import { CustomFieldsSection } from "./ReceiptForm/CustomFieldsSection";
import { defaultFields } from "./ReceiptForm/FieldTypes"; // Add this import
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

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

const ReceiptForm = ({ 
  initialData, 
  onSave, 
  onUpdate 
}: { 
  initialData?: Receipt;
  onSave: (receipt: Receipt) => void;
  onUpdate: (receipt: Receipt) => void;
}) => {
  const { user } = useAuth();
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
    organizationId: initialData?.organizationId || null,
  }));

  const [userProfile, setUserProfile] = useState<{ organization_id: string | null } | null>(null);
  const sigCanvas = useRef<SignatureCanvas>(null);
  const [showOtherWashType, setShowOtherWashType] = useState(receipt.washType === "Other");
  const [hasFieldErrors, setHasFieldErrors] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      setUserProfile(data);
      if (!initialData) {
        setReceipt(prev => ({
          ...prev,
          organizationId: data.organization_id
        }));
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

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
      const updatedReceipt = { 
        ...receipt, 
        signature,
        organizationId: userProfile?.organization_id || null
      };
      if (initialData?.id) {
        onUpdate(updatedReceipt);
      } else {
        onSave(updatedReceipt);
      }
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto dark:bg-gray-800 dark:border-gray-700">
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-6">
          <HeaderSection 
            invoiceNo={receipt.invoiceNo} 
            timestamp={receipt.timestamp} 
          />

          <div className="grid gap-6">
            <DefaultFields
              fields={defaultFields} // Use the imported defaultFields
              values={receipt}
              removedFields={receipt.removedFields || []}
              onInputChange={handleInputChange}
              onRemoveField={removeDefaultField}
            />

            <RestoreFields
              removedFields={receipt.removedFields || []}
              removedCustomFields={receipt.removedCustomFields || []}
              defaultFields={defaultFields} // Use the imported defaultFields
              onRestoreField={restoreDefaultField}
              onRestoreCustomField={restoreCustomField}
            />

            <CustomFieldsSection
              customFields={receipt.customFields}
              onAddField={addCustomField}
              onUpdateField={updateCustomField}
              onRemoveField={removeCustomField}
              setHasFieldErrors={setHasFieldErrors}
            />

            <SignaturePad 
              sigCanvas={sigCanvas} 
              onClear={() => sigCanvas.current?.clear()} 
              initialSignature={initialData?.signature}
            />

            <Button 
              onClick={handleSave} 
              className="w-full sm:w-auto mt-4 bg-violet-600 hover:bg-violet-700 text-white dark:bg-violet-700 dark:hover:bg-violet-800"
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
