import { CustomField, FieldType } from "@/types/receipt";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FieldOptions } from "./FieldOptions";

interface CustomFieldInputProps {
  field: CustomField;
  onUpdate: (id: string, updates: Partial<CustomField>) => void;
  onRemove: (id: string) => void;
}

export const CustomFieldInput = ({ field, onUpdate, onRemove }: CustomFieldInputProps) => {
  // Filter out empty or whitespace-only options
  const validOptions = (field.options || []).filter(option => option && option.trim().length > 0);
  
  // Clean up value to only include valid options
  const cleanValue = field.type === 'checkbox' 
    ? field.value.split(',').filter(v => validOptions.includes(v)).join(',')
    : field.value;

  if (cleanValue !== field.value) {
    onUpdate(field.id, { value: cleanValue });
  }

  return (
    <div className="grid gap-2 p-4 border border-violet-200 rounded-lg bg-violet-50">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Field Label"
          value={field.label}
          onChange={(e) => onUpdate(field.id, { label: e.target.value })}
          className="bg-white border-violet-200"
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => onRemove(field.id)}
          className="hover:bg-destructive/10 border-violet-200"
        >
          <X className="h-4 w-4 text-destructive" />
        </Button>
      </div>

      {field.type === "text" && (
        <Input
          placeholder="Value"
          value={field.value}
          onChange={(e) => onUpdate(field.id, { value: e.target.value })}
          className="bg-white border-violet-200"
        />
      )}

      {field.type === "dropdown" && (
        <div className="space-y-2">
          <FieldOptions
            options={field.options || []}
            onChange={(options) => onUpdate(field.id, { options })}
          />
          <Select
            value={field.value}
            onValueChange={(value) => onUpdate(field.id, { value })}
          >
            <SelectTrigger className="bg-white border-violet-200">
              <SelectValue placeholder="Select option" />
            </SelectTrigger>
            <SelectContent>
              {validOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {field.type === "checkbox" && validOptions.length > 0 && (
        <div className="space-y-2">
          <FieldOptions
            options={field.options || []}
            onChange={(options) => onUpdate(field.id, { options })}
          />
          <div className="space-y-2">
            {validOptions.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={`${field.id}-${option}`}
                  checked={field.value.split(',').includes(option)}
                  onCheckedChange={(checked) => {
                    const values = new Set(field.value.split(',').filter(Boolean));
                    if (checked) {
                      values.add(option);
                    } else {
                      values.delete(option);
                    }
                    onUpdate(field.id, { value: Array.from(values).join(',') });
                  }}
                  className="border-violet-200 data-[state=checked]:bg-violet-600"
                />
                <label
                  htmlFor={`${field.id}-${option}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {option}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};