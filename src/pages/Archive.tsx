import { useState, useEffect, useCallback } from "react";
import { Receipt } from "@/types/receipt";
import { InvoiceTable } from "@/components/InvoiceList/InvoiceTable";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useReceipts } from "@/hooks/useReceipts";
import { useArchivedReceipts } from "@/hooks/useArchivedReceipts";

const Archive = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { loadReceipts } = useReceipts();
  const { archivedReceipts, handleUnarchive, handleDelete, loadArchivedReceipts } = useArchivedReceipts();
  
  useEffect(() => {
    loadArchivedReceipts();
  }, [loadArchivedReceipts]);

  const onUnarchive = async (receipt: Receipt) => {
    await handleUnarchive(receipt);
    loadArchivedReceipts();
    loadReceipts();
    
    toast({
      title: "Receipt Restored",
      description: `Invoice #${receipt.invoiceNo} has been restored to active receipts.`,
    });
  };

  const onDelete = async (receipt: Receipt) => {
    await handleDelete(receipt);
    loadArchivedReceipts();
    
    toast({
      title: "Receipt Deleted",
      description: `Invoice #${receipt.invoiceNo} has been permanently deleted.`,
    });
  };

  return (
    <div className="container py-4 md:py-8 px-4 md:px-6">
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/view')}
            className="bg-background hover:bg-muted text-primary border-input"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Active Receipts
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold text-primary">
            Archived Receipts
          </h1>
        </div>
      </div>
      
      <InvoiceTable
        invoices={archivedReceipts}
        onEdit={() => {}}
        onUnarchive={onUnarchive}
        onDelete={onDelete}
        isArchivePage={true}
      />
    </div>
  );
};

export default Archive;