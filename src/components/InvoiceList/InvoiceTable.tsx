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
import { Edit, Archive, RotateCcw, Trash2, Printer, Download } from "lucide-react";
import { useMemo } from "react";
import { 
  archiveReceipt, 
  unarchiveReceipt, 
  deleteReceipt, 
  printReceipt, 
  downloadReceipt 
} from "@/utils/receiptActions";
import { useToast } from "@/components/ui/use-toast";
import { format, parseISO } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
              <TableCell>{formatDate(invoice.timestamp)}</TableCell>
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
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(invoice)}
                    className="hover:bg-violet-100"
                  >
                    <Edit className="h-4 w-4 text-violet-700" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => printReceipt(invoice)}
                    className="hover:bg-violet-100"
                  >
                    <Printer className="h-4 w-4 text-violet-700" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => downloadReceipt(invoice)}
                    className="hover:bg-violet-100"
                  >
                    <Download className="h-4 w-4 text-violet-700" />
                  </Button>
                  {isArchivePage ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleUnarchive(invoice)}
                      className="hover:bg-violet-100"
                    >
                      <RotateCcw className="h-4 w-4 text-violet-700" />
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleArchive(invoice)}
                      className="hover:bg-violet-100"
                    >
                      <Archive className="h-4 w-4 text-violet-700" />
                    </Button>
                  )}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-red-100"
                      >
                        <Trash2 className="h-4 w-4 text-red-700" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Receipt</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete Invoice #{invoice.invoiceNo}? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(invoice)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
