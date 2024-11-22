import { Receipt, CustomField } from "@/types/receipt";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { useMemo } from "react";

interface InvoiceTableProps {
  invoices: Receipt[];
  onEdit: (invoice: Receipt) => void;
}

export const InvoiceTable = ({ invoices, onEdit }: InvoiceTableProps) => {
  // Get all unique custom field labels across all invoices
  const customFieldLabels = useMemo(() => {
    const labels = new Set<string>();
    invoices.forEach(invoice => {
      invoice.customFields.forEach(field => {
        labels.add(field.label);
      });
    });
    return Array.from(labels);
  }, [invoices]);

  // Helper function to find custom field value
  const getCustomFieldValue = (invoice: Receipt, label: string) => {
    const field = invoice.customFields.find(f => f.label === label);
    return field?.value || "";
  };

  return (
    <div className="rounded-md border border-violet-200">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice #</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Driver Name</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Wash Type</TableHead>
            {customFieldLabels.map(label => (
              <TableHead key={label}>{label}</TableHead>
            ))}
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell className="font-medium">{invoice.invoiceNo}</TableCell>
              <TableCell>{invoice.timestamp}</TableCell>
              <TableCell>{invoice.driverName}</TableCell>
              <TableCell>{invoice.companyName}</TableCell>
              <TableCell>{invoice.washType}</TableCell>
              {customFieldLabels.map(label => (
                <TableCell 
                  key={label}
                  className={!getCustomFieldValue(invoice, label) ? "text-gray-300" : ""}
                >
                  {getCustomFieldValue(invoice, label) || "N/A"}
                </TableCell>
              ))}
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(invoice)}
                  className="hover:bg-violet-100"
                >
                  <Edit className="h-4 w-4 text-violet-700" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};