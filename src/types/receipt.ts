export type FieldType = 'text' | 'dropdown' | 'checkbox';

export interface CustomField {
  id: string;
  type: FieldType;
  label: string;
  value: string;
  options?: string[];
}

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
}