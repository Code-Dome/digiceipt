import { useState, useEffect } from "react";
import { Receipt } from "@/types/receipt";
import { InvoiceFilters } from "@/components/InvoiceList/InvoiceFilters";
import { InvoiceTable } from "@/components/InvoiceList/InvoiceTable";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import ReceiptForm from "@/components/ReceiptForm";
import { Button } from "@/components/ui/button";
import { Plus, Archive, Printer, Download, Home } from "lucide-react";
import { printReceipt, downloadReceipt, archiveReceipt } from "@/utils/receiptActions";
import { CompanySettings } from "@/components/CompanySettings";

const View = () => {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [filteredReceipts, setFilteredReceipts] = useState<Receipt[]>([]);
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const savedReceipts = JSON.parse(localStorage.getItem("receipts") || "[]");
    setReceipts(savedReceipts);
    setFilteredReceipts(savedReceipts);

    const focusId = location.state?.focusId;
    if (focusId) {
      const receipt = savedReceipts.find((r: Receipt) => r.id === focusId);
      if (receipt) {
        setSelectedReceipt(receipt);
      }
    }
  }, [location.state?.focusId]);

  const handleFilterChange = (filters: Record<string, string>) => {
    let filtered = [...receipts];

    // Filter by invoice number
    if (filters.invoiceNo) {
      filtered = filtered.filter((receipt) =>
        receipt.invoiceNo.toLowerCase().includes(filters.invoiceNo.toLowerCase())
      );
    }

    // Filter by date range
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      fromDate.setHours(0, 0, 0, 0);
      filtered = filtered.filter((receipt) => {
        const receiptDate = new Date(receipt.timestamp);
        return receiptDate >= fromDate;
      });
    }

    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter((receipt) => {
        const receiptDate = new Date(receipt.timestamp);
        return receiptDate <= toDate;
      });
    }

    // Filter by custom fields
    Object.entries(filters).forEach(([key, value]) => {
      if (!["invoiceNo", "dateFrom", "dateTo"].includes(key) && value) {
        filtered = filtered.filter((receipt) => {
          const customField = receipt.customFields.find(
            (field) => field.label === key
          );
          return customField?.value.toLowerCase().includes(value.toLowerCase());
        });
      }
    });

    setFilteredReceipts(filtered);
  };

  const handleUpdate = (updatedReceipt: Receipt) => {
    const updatedReceipts = receipts.map((receipt) =>
      receipt.id === updatedReceipt.id ? updatedReceipt : receipt
    );
    localStorage.setItem("receipts", JSON.stringify(updatedReceipts));
    setReceipts(updatedReceipts);
    setFilteredReceipts(updatedReceipts);
    setSelectedReceipt(null);
    
    toast({
      title: "Receipt updated",
      description: `Invoice #${updatedReceipt.invoiceNo} has been updated successfully.`,
    });
  };

  const handleArchive = (receipt: Receipt) => {
    archiveReceipt(receipt);
    const updatedReceipts = receipts.filter(r => r.id !== receipt.id);
    setReceipts(updatedReceipts);
    setFilteredReceipts(updatedReceipts);
    toast({
      title: "Receipt archived",
      description: `Invoice #${receipt.invoiceNo} has been archived.`,
    });
    if (selectedReceipt?.id === receipt.id) {
      setSelectedReceipt(null);
    }
  };

  const handleDelete = (receipt: Receipt) => {
    const updatedReceipts = receipts.filter(r => r.id !== receipt.id);
    setReceipts(updatedReceipts);
    setFilteredReceipts(updatedReceipts);
    if (selectedReceipt?.id === receipt.id) {
      setSelectedReceipt(null);
    }
  };

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="bg-white hover:bg-violet-50 text-violet-700 border-violet-200"
          >
            <Home className="w-4 h-4 mr-2" />
            Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-violet-700">View Receipts</h1>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => navigate('/archive')}
            className="bg-white hover:bg-violet-50 text-violet-700 border-violet-200"
          >
            <Archive className="w-4 h-4 mr-2" />
            View Archived
          </Button>
          <Button 
            onClick={() => navigate('/create')}
            className="bg-violet-600 hover:bg-violet-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Invoice
          </Button>
        </div>
      </div>
      
      <div className="space-y-6">
        <CompanySettings />
        
        <InvoiceFilters 
          invoices={receipts}
          onFilterChange={handleFilterChange} 
        />
        
        {selectedReceipt && (
          <div className="flex gap-2 mb-4">
            <Button
              variant="outline"
              onClick={() => printReceipt(selectedReceipt)}
              className="bg-white hover:bg-violet-50 text-violet-700 border-violet-200"
            >
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button
              variant="outline"
              onClick={() => downloadReceipt(selectedReceipt)}
              className="bg-white hover:bg-violet-50 text-violet-700 border-violet-200"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button
              variant="outline"
              onClick={() => handleArchive(selectedReceipt)}
              className="bg-white hover:bg-violet-50 text-violet-700 border-violet-200"
            >
              <Archive className="w-4 h-4 mr-2" />
              Archive
            </Button>
          </div>
        )}

        <InvoiceTable
          invoices={filteredReceipts}
          onEdit={setSelectedReceipt}
          onArchive={handleArchive}
          onDelete={handleDelete}
        />

        <Dialog 
          open={!!selectedReceipt} 
          onOpenChange={(open) => !open && setSelectedReceipt(null)}
        >
          <DialogContent className="max-w-[800px] w-[90vw] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Receipt #{selectedReceipt?.invoiceNo}</DialogTitle>
            </DialogHeader>
            {selectedReceipt && (
              <ReceiptForm
                initialData={selectedReceipt}
                onSave={() => {}}
                onUpdate={handleUpdate}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default View;