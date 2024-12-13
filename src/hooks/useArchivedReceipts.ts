import { useState, useEffect, useCallback } from 'react';
import { Receipt } from '@/types/receipt';
import { useToast } from '@/components/ui/use-toast';

export const useArchivedReceipts = () => {
  const [archivedReceipts, setArchivedReceipts] = useState<Receipt[]>([]);
  const { toast } = useToast();

  const loadArchivedReceipts = useCallback(() => {
    const saved = JSON.parse(localStorage.getItem("archivedReceipts") || "[]") as Receipt[];
    const uniqueReceipts = Array.from(
      new Map(saved.map(receipt => [receipt.id, receipt])).values()
    );
    setArchivedReceipts(uniqueReceipts);
  }, []);

  useEffect(() => {
    loadArchivedReceipts();
  }, [loadArchivedReceipts]);

  const handleUnarchive = useCallback((receipt: Receipt) => {
    const activeReceipts = JSON.parse(localStorage.getItem('receipts') || '[]') as Receipt[];
    
    // Update active receipts
    const updatedActive = [...activeReceipts, receipt];
    localStorage.setItem('receipts', JSON.stringify(updatedActive));
    
    // Update archived receipts
    const updatedArchived = archivedReceipts.filter(r => r.id !== receipt.id);
    localStorage.setItem('archivedReceipts', JSON.stringify(updatedArchived));
    
    // Update state immediately
    setArchivedReceipts(updatedArchived);
    
    toast({
      title: "Receipt restored",
      description: `Invoice #${receipt.invoiceNo} has been restored to active receipts.`,
      duration: 2000,
    });
  }, [archivedReceipts, toast]);

  const handleDelete = useCallback((receipt: Receipt) => {
    const updatedReceipts = archivedReceipts.filter(r => r.id !== receipt.id);
    setArchivedReceipts(updatedReceipts);
    localStorage.setItem("archivedReceipts", JSON.stringify(updatedReceipts));
    
    toast({
      title: "Receipt deleted",
      description: `Invoice #${receipt.invoiceNo} has been permanently deleted.`,
      duration: 2000,
    });
  }, [archivedReceipts, toast]);

  return {
    archivedReceipts,
    handleUnarchive,
    handleDelete,
    loadArchivedReceipts,
  };
};