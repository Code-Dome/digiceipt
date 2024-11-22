import { Button } from "@/components/ui/button";
import { CustomField } from "@/types/receipt";
import { RefreshCw } from "lucide-react";

interface RestoreFieldsProps {
  removedFields: string[];
  removedCustomFields: CustomField[];
  defaultFields: { key: string; label: string }[];
  onRestoreField: (field: string) => void;
  onRestoreCustomField: (field: CustomField) => void;
}

export const RestoreFields = ({
  removedFields,
  removedCustomFields,
  defaultFields,
  onRestoreField,
  onRestoreCustomField,
}: RestoreFieldsProps) => {
  if (removedFields.length === 0 && removedCustomFields.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-4 p-4 bg-violet-50 rounded-lg border border-violet-200">
      <p className="w-full text-sm font-medium text-violet-700 mb-2">Restore removed fields:</p>
      {removedFields.map((field) => (
        <Button
          key={field}
          variant="outline"
          size="sm"
          onClick={() => onRestoreField(field)}
          className="bg-white hover:bg-violet-100 text-violet-700 border-violet-200"
        >
          <RefreshCw className="h-3 w-3 mr-2" />
          {defaultFields.find((f) => f.key === field)?.label}
        </Button>
      ))}
      {removedCustomFields
        .filter((field) => field.label)
        .map((field) => (
          <Button
            key={field.id}
            variant="outline"
            size="sm"
            onClick={() => onRestoreCustomField(field)}
            className="bg-white hover:bg-violet-100 text-violet-700 border-violet-200"
          >
            <RefreshCw className="h-3 w-3 mr-2" />
            {field.label} ({field.type})
          </Button>
        ))}
    </div>
  );
};