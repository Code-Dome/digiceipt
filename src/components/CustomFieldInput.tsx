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
  return (
    <div className="grid gap-2">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Field Label"
          value={field.label}
          onChange={(e) => onUpdate(field.id, { label: e.target.value })}
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => onRemove(field.id)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {field.type === "text" && (
        <Input
          placeholder="Value"
          value={field.value}
          onChange={(e) => onUpdate(field.id, { value: e.target.value })}
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
            <SelectTrigger>
              <SelectValue placeholder="Select option" />
            </SelectTrigger>
            <SelectContent>
              {(field.options || []).map((option) => (
                option && (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                )
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {field.type === "checkbox" && (
        <div className="space-y-2">
          <FieldOptions
            options={field.options || []}
            onChange={(options) => onUpdate(field.id, { options })}
          />
          <div className="space-y-2">
            {(field.options || []).map((option) => (
              option && (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${field.id}-${option}`}
                    checked={field.value.includes(option)}
                    onCheckedChange={(checked) => {
                      const values = new Set(field.value.split(',').filter(Boolean));
                      if (checked) {
                        values.add(option);
                      } else {
                        values.delete(option);
                      }
                      onUpdate(field.id, { value: Array.from(values).join(',') });
                    }}
                  />
                  <label
                    htmlFor={`${field.id}-${option}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {option}
                  </label>
                </div>
              )
            ))}
          </div>
        </div>
      )}
    </div>
  );
};