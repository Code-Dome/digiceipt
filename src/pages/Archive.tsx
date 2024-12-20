import { useState, useEffect, useCallback } from "react";
import { Receipt } from "@/types/receipt";
import { InvoiceTable } from "@/components/InvoiceList/InvoiceTable";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useReceipts } from "@/hooks/useReceipts";

const Archive = () => {
  const [archivedReceipts, setArchivedReceipts] = useState<Receipt[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { loadReceipts } = useReceipts(); // Get loadReceipts from the hook
  
 const loadArchivedReceipts = useCallback(() => {
  const archived = JSON.parse(localStorage.getItem('archivedReceipts') || '[]') as Receipt[];

  const uniqueReceipts = Array.from(
    new Map(archived.map((receipt) => [receipt.id, receipt])).values()
  );
  setArchivedReceipts(uniqueReceipts);
}, []); // No dependencies to avoid re-creating the function
  
useEffect(() => {
  loadArchivedReceipts();
}, [loadArchivedReceipts]); // Dependency is the stable `loadArchivedReceipts`

  const handleUnarchive = (receipt: Receipt) => {
      const activeReceipts = JSON.parse(localStorage.getItem('receipts') || '[]') as Receipt[];

      const updatedActive = [...activeReceipts, receipt];
      localStorage.setItem('receipts', JSON.stringify(updatedActive));
      
      // Update archived receipts in localStorage and state
      const updatedArchived = archivedReceipts.filter(r => r.id !== receipt.id);
      localStorage.setItem('archivedReceipts', JSON.stringify(updatedArchived));
      setArchivedReceipts(updatedArchived);
      
      // Refresh the active receipts list
      loadReceipts();
      loadArchivedReceipts();
      
      toast({
        title: "Receipt restored",
        description: `Invoice #${receipt.invoiceNo} has been restored to active receipts.`,
      });
  };

  const handleDelete = (receipt: Receipt) => {
    const updatedReceipts = archivedReceipts.filter(r => r.id !== receipt.id);
    setArchivedReceipts(updatedReceipts);
    localStorage.setItem('archivedReceipts', JSON.stringify(updatedReceipts));
    
    toast({
      title: "Receipt deleted",
      description: `Invoice #${receipt.invoiceNo} has been permanently deleted.`,
    });
  };

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/view')}
            className="text-violet-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Active Receipts
          </Button>
          <h1 className="text-3xl font-bold text-violet-700">Archived Receipts</h1>
        </div>
      </div>
      
      <InvoiceTable
        invoices={archivedReceipts}
        onEdit={() => {}}
        onUnarchive={handleUnarchive}
        onDelete={handleDelete}
        isArchivePage={true}
      />
    </div>
  );
};

export default Archive;
