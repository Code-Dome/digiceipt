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
import { Plus, Archive, Printer, Download, Home, Settings } from "lucide-react";
import { useReceipts } from "@/hooks/useReceipts";
import { useReceiptActions } from "@/hooks/useReceiptActions";
import { useAdminAuth } from "@/hooks/useAdminAuth";

const View = () => {
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);
  const navigate = useNavigate();
  const { 
    filteredReceipts, 
    handleArchive, 
    handleDelete, 
    handleFilterChange 
  } = useReceipts();
  const { printReceipt, downloadReceipt } = useReceiptActions();
  const { isAdmin } = useAdminAuth();

  const handleUpdate = (updatedReceipt: Receipt) => {
    const savedReceipts = JSON.parse(localStorage.getItem("receipts") || "[]");
    const updatedReceipts = savedReceipts.map((receipt: Receipt) =>
      receipt.id === updatedReceipt.id ? updatedReceipt : receipt
    );
    localStorage.setItem("receipts", JSON.stringify(updatedReceipts));
    setSelectedReceipt(null);
  };

  return (
    <div className="container py-8 dark:bg-gray-900">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="bg-white hover:bg-violet-50 text-violet-700 border-violet-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-violet-400 dark:border-gray-600"
          >
            <Home className="w-4 h-4 mr-2" />
            Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-violet-700 dark:text-violet-400">View Receipts</h1>
        </div>
        <div className="flex gap-2">
          {isAdmin && (
            <Button
              variant="outline"
              onClick={() => navigate('/admin')}
              className="bg-white hover:bg-violet-50 text-violet-700 border-violet-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-violet-400 dark:border-gray-600"
            >
              <Settings className="w-4 h-4 mr-2" />
              Admin Settings
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => navigate('/archive')}
            className="bg-white hover:bg-violet-50 text-violet-700 border-violet-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-violet-400 dark:border-gray-600"
          >
            <Archive className="w-4 h-4 mr-2" />
            View Archive
          </Button>
          <Button 
            onClick={() => navigate('/create')}
            className="bg-violet-600 hover:bg-violet-700 text-white dark:bg-violet-700 dark:hover:bg-violet-800"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Invoice
          </Button>
        </div>
      </div>
      
      <div className="space-y-6">     
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
