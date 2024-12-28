import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CustomFieldInput } from "@/components/CustomFieldInput";
import { CustomField, FieldType } from "@/types/receipt";

interface CustomFieldsSectionProps {
  customFields: CustomField[];
  onAddField: (type: FieldType) => void;
  onUpdateField: (id: string, updates: Partial<CustomField>) => void;
  onRemoveField: (id: string) => void;
  setHasFieldErrors: (hasError: boolean) => void;
}

export const CustomFieldsSection = ({
  customFields,
  onAddField,
  onUpdateField,
  onRemoveField,
  setHasFieldErrors,
}: CustomFieldsSectionProps) => {
  return (
    <div className="space-y-4">
      <Label>Custom Fields</Label>
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => onAddField("text")}
          className="bg-white hover:bg-violet-50 text-violet-700 border-violet-200 dark:bg-gray-900 dark:hover:bg-gray-800 dark:text-violet-400 dark:border-gray-700"
        >
          Add Text Field
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => onAddField("dropdown")}
          className="bg-white hover:bg-violet-50 text-violet-700 border-violet-200 dark:bg-gray-900 dark:hover:bg-gray-800 dark:text-violet-400 dark:border-gray-700"
        >
          Add Dropdown
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => onAddField("checkbox")}
          className="bg-white hover:bg-violet-50 text-violet-700 border-violet-200 dark:bg-gray-900 dark:hover:bg-gray-800 dark:text-violet-400 dark:border-gray-700"
        >
          Add Checkbox
        </Button>
      </div>

      <div className="space-y-4">
        {customFields.map((field) => (
          <CustomFieldInput
            key={field.id}
            field={field}
            onUpdate={onUpdateField}
            onRemove={onRemoveField}
            setHasError={setHasFieldErrors}
          />
        ))}
      </div>
    </div>
  );
};