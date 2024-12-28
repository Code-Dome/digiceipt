import {
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface InvoiceTableHeaderProps {
  customFieldLabels: string[];
}

export const InvoiceTableHeader = ({ customFieldLabels }: InvoiceTableHeaderProps) => {
  return (
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
  );
};