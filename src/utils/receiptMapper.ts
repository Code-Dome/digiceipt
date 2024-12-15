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

export const mapDatabaseToReceipt = (dbReceipt: DatabaseReceipt): Receipt => ({
  id: dbReceipt.id,
  invoiceNo: dbReceipt.invoice_no,
  timestamp: dbReceipt.timestamp,
  driverName: dbReceipt.driver_name || "",
  horseReg: dbReceipt.horse_reg || "",
  companyName: dbReceipt.company_name || "",
  washType: dbReceipt.wash_type || "",
  otherWashType: dbReceipt.other_wash_type || "",
  customFields: (dbReceipt.custom_fields as CustomField[]) || [],
  signature: dbReceipt.signature || "",
  removedFields: (dbReceipt.removed_fields as string[]) || [],
  removedCustomFields: (dbReceipt.removed_custom_fields as CustomField[]) || [],
});

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
  custom_fields: receipt.customFields as Json,
  signature: receipt.signature,
  removed_fields: receipt.removedFields as Json,
  removed_custom_fields: receipt.removedCustomFields as Json,
});