import { Receipt } from "@/types/receipt";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { useMemo } from "react";
import { 
  archiveReceipt, 
  unarchiveReceipt, 
  deleteReceipt, 
  printReceipt, 
  downloadReceipt 
} from "@/utils/receiptActions";
import { useToast } from "@/components/ui/use-toast";
import { formatInTimeZone } from "date-fns-tz";
import { parseISO } from "date-fns";
import { InvoiceActions } from "./InvoiceActions";
import { InvoiceTableHeader } from "./InvoiceTableHeader";

interface InvoiceTableProps {
  invoices: Receipt[];
  onEdit: (invoice: Receipt) => void;
  onArchive?: (invoice: Receipt) => void;
  onUnarchive?: (invoice: Receipt) => void;
  onDelete?: (invoice: Receipt) => void;
  isArchivePage?: boolean;
}

export const InvoiceTable = ({ 
  invoices, 
  onEdit, 
  onArchive, 
  onUnarchive,
  onDelete,
  isArchivePage = false 
}: InvoiceTableProps) => {
  const { toast } = useToast();
  
  const formatDate = (dateString: string) => {
    try {
      return formatInTimeZone(
        parseISO(dateString),
        'Africa/Johannesburg',
        'dd/MM/yyyy HH:mm:ss'
      );
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  const customFieldLabels = useMemo(() => {
    const labels = new Set<string>();
    invoices.forEach(invoice => {
      invoice.customFields.forEach(field => {
        labels.add(field.label);
      });
    });
    return Array.from(labels);
  }, [invoices]);

  const getCustomFieldValue = (invoice: Receipt, label: string) => {
    const field = invoice.customFields.find(f => f.label === label);
    return field?.value || "";
  };

  const handleArchive = (invoice: Receipt) => {
    archiveReceipt(invoice);
    if (onArchive) {
      onArchive(invoice);
    }
    toast({
      title: "Receipt archived",
      description: `Invoice #${invoice.invoiceNo} has been archived.`,
    });
  };

  const handleUnarchive = (invoice: Receipt) => {
    unarchiveReceipt(invoice);
    if (onUnarchive) {
      onUnarchive(invoice);
    }
    toast({
      title: "Receipt unarchived",
      description: `Invoice #${invoice.invoiceNo} has been unarchived.`,
    });
  };

  const handleDelete = (invoice: Receipt) => {
    deleteReceipt(invoice, isArchivePage);
    if (onDelete) {
      onDelete(invoice);
    }
    toast({
      title: "Receipt deleted",
      description: `Invoice #${invoice.invoiceNo} has been deleted.`,
    });
  };

  return (
    <div className="rounded-md border border-input">
      <Table>
        <InvoiceTableHeader customFieldLabels={customFieldLabels} />
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id} className="hover:bg-muted/50">
              <TableCell className="font-medium text-foreground">{invoice.invoiceNo}</TableCell>
              <TableCell className="text-foreground">{formatDate(invoice.timestamp)}</TableCell>
              <TableCell className="text-foreground">{invoice.driverName}</TableCell>
              <TableCell className="text-foreground">{invoice.companyName}</TableCell>
              <TableCell className="text-foreground">{invoice.washType}</TableCell>
              {customFieldLabels.map(label => (
                <TableCell 
                  key={label}
                  className={!getCustomFieldValue(invoice, label) ? "text-muted-foreground" : "text-foreground"}
                >
                  {getCustomFieldValue(invoice, label) || "N/A"}
                </TableCell>
              ))}
              <TableCell>
                <InvoiceActions
                  invoice={invoice}
                  isArchivePage={isArchivePage}
                  onEdit={onEdit}
                  onArchive={handleArchive}
                  onUnarchive={handleUnarchive}
                  onDelete={handleDelete}
                  onPrint={printReceipt}
                  onDownload={downloadReceipt}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};