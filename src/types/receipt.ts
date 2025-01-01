import { CompanySettings } from "./companySettings";

export interface Receipt {
  id: string;
  invoiceNo: string;
  timestamp: string;
  driverName: string;
  horseReg: string;
  companyName: string;
  washType: string;
  otherWashType?: string;
  customFields: CustomField[];
  signature: string;
  removedFields?: string[];
  removedCustomFields?: CustomField[];
  organizationId: string | null;
}

export interface CustomField {
  id: string;
  type: FieldType;
  label: string;
  value: string;
  options?: string[];
}

export type FieldType = "text" | "dropdown" | "checkbox";

export interface TemplateStyle {
  id: string;
  name: string;
  description: string;
  icon: string;
  generateHTML: (receipt: Receipt, settings: CompanySettings) => string;
}