import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Receipt } from "@/types/receipt";
import { CustomFiltersModal } from "./CustomFiltersModal";
import { X } from "lucide-react";
import { format, parse } from "date-fns";

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
    
    const formattedFilters = {
      ...newFilters,
      dateFrom: newFilters.dateFrom ? 
        format(parse(newFilters.dateFrom, 'yyyy-MM-dd', new Date()), 'dd/MM/yyyy') : '',
      dateTo: newFilters.dateTo ? 
        format(parse(newFilters.dateTo, 'yyyy-MM-dd', new Date()), 'dd/MM/yyyy') : '',
    };
    
    onFilterChange({ ...formattedFilters, ...customFilters });
  };

  const handleCustomFilterChange = (newCustomFilters: Record<string, string>) => {
    setCustomFilters(newCustomFilters);
    onFilterChange({ ...filters, ...newCustomFilters });
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
    <div className="space-y-4 p-4 bg-violet-50 rounded-lg border border-violet-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="grid gap-4 md:grid-cols-4">
        <div className="space-y-2">
          <Label htmlFor="invoiceNo" className="dark:text-gray-300">Invoice Number</Label>
          <Input
            id="invoiceNo"
            value={filters.invoiceNo}
            onChange={(e) => handleFilterChange("invoiceNo", e.target.value)}
            placeholder="Search by invoice number"
            className="bg-white border-violet-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dateFrom" className="dark:text-gray-300">Date From</Label>
          <div className="relative">
            <Input
              id="dateFrom"
              type="date"
              value={filters.dateFrom}
              onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
              className="bg-white border-violet-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            {filters.dateFrom && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleFilterChange("dateFrom", "")}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 hover:bg-violet-100 rounded-full dark:hover:bg-gray-600"
              >
                <X className="h-4 w-4 text-violet-700 dark:text-violet-400" />
              </Button>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="dateTo" className="dark:text-gray-300">Date To</Label>
          <div className="relative">
            <Input
              id="dateTo"
              type="date"
              value={filters.dateTo}
              onChange={(e) => handleFilterChange("dateTo", e.target.value)}
              className="bg-white border-violet-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            {filters.dateTo && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleFilterChange("dateTo", "")}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 hover:bg-violet-100 rounded-full dark:hover:bg-gray-600"
              >
                <X className="h-4 w-4 text-violet-700 dark:text-violet-400" />
              </Button>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <Label className="dark:text-gray-300">Custom Fields</Label>
          <CustomFiltersModal
            availableCustomFields={availableCustomFields}
            customFilters={customFilters}
            onFilterChange={handleCustomFilterChange}
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button
          variant="outline"
          onClick={clearAllFilters}
          className="bg-white hover:bg-violet-50 text-violet-700 border-violet-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-violet-400 dark:border-gray-600"
        >
          Clear All Filters
        </Button>
      </div>
    </div>
  );
};