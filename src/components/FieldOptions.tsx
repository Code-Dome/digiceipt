import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Minus } from "lucide-react";

interface FieldOptionsProps {
  options: string[];
  onChange: (options: string[]) => void;
}

export const FieldOptions = ({ options, onChange }: FieldOptionsProps) => {
  const addOption = () => {
    onChange([...options, ""]);
  };

  const removeOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index);
    onChange(newOptions);
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    onChange(newOptions);
  };

  return (
    <div className="space-y-2">
      {options.map((option, index) => (
        <div key={index} className="flex gap-2">
          <Input
            placeholder={`Option ${index + 1}`}
            value={option}
            onChange={(e) => updateOption(index, e.target.value)}
            className="bg-white border-violet-200"
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => removeOption(index)}
            className="hover:bg-destructive/10 border-violet-200"
          >
            <Minus className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={addOption}
        className="w-full bg-white hover:bg-violet-50 text-violet-700 border-violet-200"
      >
        <Plus className="h-4 w-4 mr-2" /> Add Option
      </Button>
    </div>
  );
};