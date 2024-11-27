import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

interface CustomFiltersModalProps {
  availableCustomFields: string[];
  customFilters: Record<string, string>;
  onFilterChange: (filters: Record<string, string>) => void;
}

export const CustomFiltersModal = ({
  availableCustomFields,
  customFilters,
  onFilterChange,
}: CustomFiltersModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState(customFilters);

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
  };

  const removeFilter = (key: string) => {
    const newFilters = { ...localFilters };
    delete newFilters[key];
    setLocalFilters(newFilters);
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      onFilterChange(localFilters);
    }
    setIsOpen(open);
  };

  const activeFiltersCount = Object.keys(customFilters).length;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-white hover:bg-violet-50 text-violet-700 border-violet-200"
        >
          Custom Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Custom Filters</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          {availableCustomFields.map((fieldLabel) => (
            <div key={fieldLabel} className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor={`custom-${fieldLabel}`}>{fieldLabel}</Label>
                {localFilters[fieldLabel] && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFilter(fieldLabel)}
                    className="h-6 w-6 hover:bg-violet-100"
                  >
                    <X className="h-4 w-4 text-violet-700" />
                  </Button>
                )}
              </div>
              <Input
                id={`custom-${fieldLabel}`}
                value={localFilters[fieldLabel] || ""}
                onChange={(e) => handleFilterChange(fieldLabel, e.target.value)}
                placeholder={`Filter by ${fieldLabel.toLowerCase()}`}
                className="bg-white border-violet-200"
              />
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};