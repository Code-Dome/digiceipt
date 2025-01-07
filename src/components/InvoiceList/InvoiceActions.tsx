import { Receipt } from "@/types/receipt";
import { Button } from "@/components/ui/button";
import { Edit, Archive, RotateCcw, Trash2, Printer, Download } from "lucide-react";
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

interface InvoiceActionsProps {
  invoice: Receipt;
  isArchivePage?: boolean;
  onEdit: (invoice: Receipt) => void;
  onArchive: (invoice: Receipt) => void;
  onUnarchive: (invoice: Receipt) => void;
  onDelete: (invoice: Receipt) => void;
  onPrint: (invoice: Receipt) => void;
  onDownload: (invoice: Receipt) => void;
}

export const InvoiceActions = ({
  invoice,
  isArchivePage = false,
  onEdit,
  onArchive,
  onUnarchive,
  onDelete,
  onPrint,
  onDownload,
}: InvoiceActionsProps) => {
  return (
    <div className="flex gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onEdit(invoice)}
        className="hover:bg-accent"
      >
        <Edit className="h-4 w-4 text-primary" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onPrint(invoice)}
        className="hover:bg-accent"
      >
        <Printer className="h-4 w-4 text-primary" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDownload(invoice)}
        className="hover:bg-accent"
      >
        <Download className="h-4 w-4 text-primary" />
      </Button>
      {isArchivePage ? (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onUnarchive(invoice)}
          className="hover:bg-accent"
        >
          <RotateCcw className="h-4 w-4 text-primary" />
        </Button>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onArchive(invoice)}
          className="hover:bg-accent"
        >
          <Archive className="h-4 w-4 text-primary" />
        </Button>
      )}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4 text-destructive" />
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
              onClick={() => onDelete(invoice)}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};