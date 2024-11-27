import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Receipt } from "@/types/receipt";
import { CustomFiltersModal } from "./CustomFiltersModal";
import { X } from "lucide-react";

interface InvoiceFiltersProps {
  invoices: Receipt[];
  onFilterChange: (filters: Record<string, string>) => void;
}

export const InvoiceFilters = ({ invoices, onFilterChange }: InvoiceFiltersProps) => {
  const [filters, setFilters] = useState({
    invoiceNo: "",
    dateFrom: "",
    dateTo: "",
  });
  const [customFilters, setCustomFilters] = useState<Record<string, string>>({});
  const [availableCustomFields, setAvailableCustomFields] = useState<string[]>([]);

  useEffect(() => {
    const customFieldLabels = new Set<string>();
    invoices.forEach(invoice => {
      invoice.customFields.forEach(field => {
        customFieldLabels.add(field.label);
      });
    });
    setAvailableCustomFields(Array.from(customFieldLabels));
  }, [invoices]);

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange({ ...newFilters, ...customFilters });
  };

  const handleCustomFilterChange = (newCustomFilters: Record<string, string>) => {
    setCustomFilters(newCustomFilters);
    onFilterChange({ ...filters, ...newCustomFilters });
  };

  const clearDateFilters = () => {
    const newFilters = { ...filters, dateFrom: "", dateTo: "" };
    setFilters(newFilters);
    onFilterChange({ ...newFilters, ...customFilters });
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      invoiceNo: "",
      dateFrom: "",
      dateTo: "",
    };
    setFilters(clearedFilters);
    setCustomFilters({});
    onFilterChange(clearedFilters);
  };

  return (
    <div className="space-y-4 p-4 bg-violet-50 rounded-lg border border-violet-200">
      <div className="grid gap-4 md:grid-cols-4">
        <div className="space-y-2">
          <Label htmlFor="invoiceNo">Invoice Number</Label>
          <Input
            id="invoiceNo"
            value={filters.invoiceNo}
            onChange={(e) => handleFilterChange("invoiceNo", e.target.value)}
            placeholder="Search by invoice number"
            className="bg-white border-violet-200"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dateFrom">Date From</Label>
          <div className="relative">
            <Input
              id="dateFrom"
              type="date"
              value={filters.dateFrom}
              onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
              className="bg-white border-violet-200"
            />
            {filters.dateFrom && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleFilterChange("dateFrom", "")}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 hover:bg-violet-100 rounded-full"
              >
                <X className="h-4 w-4 text-violet-700" />
              </Button>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="dateTo">Date To</Label>
          <div className="relative">
            <Input
              id="dateTo"
              type="date"
              value={filters.dateTo}
              onChange={(e) => handleFilterChange("dateTo", e.target.value)}
              className="bg-white border-violet-200"
            />
            {filters.dateTo && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleFilterChange("dateTo", "")}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 hover:bg-violet-100 rounded-full"
              >
                <X className="h-4 w-4 text-violet-700" />
              </Button>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <Label>Custom Fields</Label>
          <CustomFiltersModal
            availableCustomFields={availableCustomFields}
            customFilters={customFilters}
            onFilterChange={handleCustomFilterChange}
          />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        {(filters.dateFrom || filters.dateTo) && (
          <Button
            variant="outline"
            onClick={clearDateFilters}
            className="bg-white hover:bg-violet-50 text-violet-700 border-violet-200"
          >
            Clear Date Filters
          </Button>
        )}
        <Button
          variant="outline"
          onClick={clearAllFilters}
          className="bg-white hover:bg-violet-50 text-violet-700 border-violet-200"
        >
          Clear All Filters
        </Button>
      </div>
    </div>
  );
};