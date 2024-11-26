import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Receipt } from "@/types/receipt";
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
    // Get unique custom field labels from all invoices
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

  const handleCustomFilterChange = (key: string, value: string) => {
    const newCustomFilters = { ...customFilters, [key]: value };
    setCustomFilters(newCustomFilters);
    onFilterChange({ ...filters, ...newCustomFilters });
  };

  const removeCustomFilter = (key: string) => {
    const newCustomFilters = { ...customFilters };
    delete newCustomFilters[key];
    setCustomFilters(newCustomFilters);
    onFilterChange({ ...filters, ...newCustomFilters });
  };

  return (
    <div className="space-y-4 p-4 bg-violet-50 rounded-lg border border-violet-200">
      <div className="grid gap-4 md:grid-cols-3">
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
          <Input
            id="dateFrom"
            type="date"
            value={filters.dateFrom}
            onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
            className="bg-white border-violet-200"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dateTo">Date To</Label>
          <Input
            id="dateTo"
            type="date"
            value={filters.dateTo}
            onChange={(e) => handleFilterChange("dateTo", e.target.value)}
            className="bg-white border-violet-200"
          />
        </div>
      </div>

      {availableCustomFields.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-violet-900 mb-3">Custom Fields</h3>
          <div className="grid gap-4 md:grid-cols-3">
            {availableCustomFields.map((fieldLabel) => (
              <div key={fieldLabel} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor={`custom-${fieldLabel}`}>{fieldLabel}</Label>
                  {customFilters[fieldLabel] && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeCustomFilter(fieldLabel)}
                      className="h-6 w-6 hover:bg-violet-100"
                    >
                      <X className="h-4 w-4 text-violet-700" />
                    </Button>
                  )}
                </div>
                <Input
                  id={`custom-${fieldLabel}`}
                  value={customFilters[fieldLabel] || ""}
                  onChange={(e) => handleCustomFilterChange(fieldLabel, e.target.value)}
                  placeholder={`Filter by ${fieldLabel.toLowerCase()}`}
                  className="bg-white border-violet-200"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};