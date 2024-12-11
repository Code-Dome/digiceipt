import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { Receipt } from "@/types/receipt";
import { CompanySelect } from "./ReceiptForm/CompanySelect";

interface DefaultFieldsProps {
  fields: { key: string; label: string }[];
  values: Receipt;
  removedFields: string[];
  onInputChange: (field: string, value: string) => void;
  onRemoveField: (field: string) => void;
}

export const DefaultFields = ({
  fields,
  values,
  removedFields,
  onInputChange,
  onRemoveField,
}: DefaultFieldsProps) => {
  return (
    <>
      {fields.map(
        ({ key, label }) =>
          !removedFields.includes(key) && (
            <div key={key} className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor={key}>{label}</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemoveField(key)}
                  className="hover:bg-destructive/10"
                >
                  <X className="h-4 w-4 text-destructive" />
                </Button>
              </div>
              {key === "companyName" ? (
                <CompanySelect
                  value={values[key]}
                  onChange={(value) => onInputChange(key, value)}
                />
              ) : (
                <Input
                  id={key}
                  value={values[key as keyof Receipt] as string || ""}
                  onChange={(e) => onInputChange(key, e.target.value)}
                  className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
              )}
            </div>
          )
      )}
    </>
  );
};