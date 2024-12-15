import { Receipt, CustomField } from "@/types/receipt";
import { Json } from "@/integrations/supabase/types";

export interface DatabaseReceipt {
  id: string;
  user_id: string;
  invoice_no: string;
  timestamp: string;
  driver_name: string | null;
  horse_reg: string | null;
  company_name: string | null;
  wash_type: string | null;
  other_wash_type: string | null;
  custom_fields: Json;
  signature: string | null;
  removed_fields: Json;
  removed_custom_fields: Json;
  created_at: string;
  updated_at: string;
}

const isCustomField = (field: unknown): field is CustomField => {
  if (typeof field !== 'object' || field === null) return false;
  const f = field as any;
  return (
    typeof f.id === 'string' &&
    typeof f.type === 'string' &&
    typeof f.label === 'string' &&
    typeof f.value === 'string' &&
    (f.options === undefined || Array.isArray(f.options))
  );
};

const isCustomFieldArray = (arr: unknown): arr is CustomField[] => {
  return Array.isArray(arr) && arr.every(isCustomField);
};

const parseJsonArray = (json: Json | null): unknown[] => {
  if (!json) return [];
  if (Array.isArray(json)) return json;
  return [];
};

export const mapDatabaseToReceipt = (dbReceipt: DatabaseReceipt): Receipt => {
  const customFields = parseJsonArray(dbReceipt.custom_fields);
  const removedFields = parseJsonArray(dbReceipt.removed_fields);
  const removedCustomFields = parseJsonArray(dbReceipt.removed_custom_fields);

  return {
    id: dbReceipt.id,
    invoiceNo: dbReceipt.invoice_no,
    timestamp: dbReceipt.timestamp,
    driverName: dbReceipt.driver_name || "",
    horseReg: dbReceipt.horse_reg || "",
    companyName: dbReceipt.company_name || "",
    washType: dbReceipt.wash_type || "",
    otherWashType: dbReceipt.other_wash_type || "",
    customFields: isCustomFieldArray(customFields) ? customFields : [],
    signature: dbReceipt.signature || "",
    removedFields: Array.isArray(removedFields) ? removedFields.filter((f): f is string => typeof f === 'string') : [],
    removedCustomFields: isCustomFieldArray(removedCustomFields) ? removedCustomFields : [],
  };
};

export const mapReceiptToDatabase = (receipt: Receipt, userId: string): Omit<DatabaseReceipt, 'created_at' | 'updated_at'> => ({
  id: receipt.id,
  user_id: userId,
  invoice_no: receipt.invoiceNo,
  timestamp: receipt.timestamp,
  driver_name: receipt.driverName,
  horse_reg: receipt.horseReg,
  company_name: receipt.companyName,
  wash_type: receipt.washType,
  other_wash_type: receipt.otherWashType,
  custom_fields: JSON.parse(JSON.stringify(receipt.customFields)) as Json,
  signature: receipt.signature,
  removed_fields: JSON.parse(JSON.stringify(receipt.removedFields)) as Json,
  removed_custom_fields: JSON.parse(JSON.stringify(receipt.removedCustomFields)) as Json,
});