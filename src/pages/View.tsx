import { useState } from "react";
import { Receipt } from "@/types/receipt";
import { InvoiceFilters } from "@/components/InvoiceList/InvoiceFilters";
import { InvoiceTable } from "@/components/InvoiceList/InvoiceTable";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import ReceiptForm from "@/components/ReceiptForm";
import { Button } from "@/components/ui/button";
import { Plus, Archive, Printer, Download, Home, FileText } from "lucide-react";
import { CompanySettings } from "@/components/CompanySettings";
import { useReceipts } from "@/hooks/useReceipts";
import { useReceiptActions } from "@/hooks/useReceiptActions";

const View = () => {
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);
  const navigate = useNavigate();
  const { 
    filteredReceipts, 
    handleArchive, 
    handleDelete, 
    handleFilterChange 
  } = useReceipts();
  const { printReceipt, downloadReceipt, navigateToTemplates } = useReceiptActions();

  const handleUpdate = (updatedReceipt: Receipt) => {
    const savedReceipts = JSON.parse(localStorage.getItem("receipts") || "[]");
    const updatedReceipts = savedReceipts.map((receipt: Receipt) =>
      receipt.id === updatedReceipt.id ? updatedReceipt : receipt
    );
    localStorage.setItem("receipts", JSON.stringify(updatedReceipts));
    setSelectedReceipt(null);
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
          invoices={filteredReceipts}
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
            <Button
              variant="outline"
              onClick={() => navigateToTemplates(selectedReceipt)}
              className="bg-white hover:bg-violet-50 text-violet-700 border-violet-200"
            >
              <FileText className="w-4 h-4 mr-2" />
              Choose Template
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