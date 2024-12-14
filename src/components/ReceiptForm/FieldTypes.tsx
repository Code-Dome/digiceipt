import { Receipt } from "@/types/receipt";

export const defaultFields = [
  { key: "driverName", label: "Driver Name" },
  { key: "horseReg", label: "Horse Registration" },
  { key: "companyName", label: "Company Name" },
  { key: "washType", label: "Wash Type" },
];

export interface DefaultFieldsProps {
  fields: { key: string; label: string }[];
  values: Receipt;
  removedFields: string[];
  onInputChange: (field: string, value: string) => void;
  onRemoveField: (field: string) => void;
}