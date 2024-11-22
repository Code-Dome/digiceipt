import { CustomField, FieldType } from "@/types/receipt";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CustomFieldInputProps {
  field: CustomField;
  onUpdate: (id: string, updates: Partial<CustomField>) => void;
}

export const CustomFieldInput = ({ field, onUpdate }: CustomFieldInputProps) => {
  return (
    <div className="grid gap-2">
      <Input
        placeholder="Field Label"
        value={field.label}
        onChange={(e) => onUpdate(field.id, { label: e.target.value })}
      />
      {field.type === "text" && (
        <Input
          placeholder="Value"
          value={field.value}
          onChange={(e) => onUpdate(field.id, { value: e.target.value })}
        />
      )}
      {field.type === "dropdown" && (
        <div className="space-y-2">
          <Input
            placeholder="Options (comma-separated)"
            value={field.options?.join(", ")}
            onChange={(e) =>
              onUpdate(field.id, {
                options: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
              })
            }
          />
          <Select
            value={field.value}
            onValueChange={(value) => onUpdate(field.id, { value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select option" />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
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
        <div className="flex items-center space-x-2">
          <Checkbox
            id={field.id}
            checked={field.value === "true"}
            onCheckedChange={(checked) =>
              onUpdate(field.id, {
                value: checked ? "true" : "false",
              })
            }
          />
          <label
            htmlFor={field.id}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {field.label || "Checkbox"}
          </label>
        </div>
      )}
    </div>
  );
};