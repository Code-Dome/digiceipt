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
import { Plus } from "lucide-react";

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

    // Focus on newly created receipt if specified
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

    if (filters.invoiceNo) {
      filtered = filtered.filter((receipt) =>
        receipt.invoiceNo.toLowerCase().includes(filters.invoiceNo.toLowerCase())
      );
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(
        (receipt) => new Date(receipt.timestamp) >= new Date(filters.dateFrom)
      );
    }

    if (filters.dateTo) {
      filtered = filtered.filter(
        (receipt) => new Date(receipt.timestamp) <= new Date(filters.dateTo)
      );
    }

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

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-violet-700">View Receipts</h1>
        <Button 
          onClick={() => navigate('/create')}
          className="bg-violet-600 hover:bg-violet-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Invoice
        </Button>
      </div>
      
      <div className="space-y-6">
        <InvoiceFilters onFilterChange={handleFilterChange} />
        
        <InvoiceTable
          invoices={filteredReceipts}
          onEdit={setSelectedReceipt}
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