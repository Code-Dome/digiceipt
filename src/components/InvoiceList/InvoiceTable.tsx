import { Receipt } from "@/types/receipt";
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

interface InvoiceTableProps {
  invoices: Receipt[];
  onEdit: (invoice: Receipt) => void;
}

export const InvoiceTable = ({ invoices, onEdit }: InvoiceTableProps) => {
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