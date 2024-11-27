import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Receipt } from "@/types/receipt";
import { CustomFiltersModal } from "./CustomFiltersModal";

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
        <div className="space-y-2">
          <Label>Custom Fields</Label>
          <CustomFiltersModal
            availableCustomFields={availableCustomFields}
            customFilters={customFilters}
            onFilterChange={handleCustomFilterChange}
          />
        </div>
      </div>
    </div>
  );
};