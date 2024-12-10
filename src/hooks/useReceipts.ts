import { useState, useEffect } from 'react';
import { Receipt } from '@/types/receipt';
import { useToast } from '@/hooks/use-toast';

export const useReceipts = () => {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [filteredReceipts, setFilteredReceipts] = useState<Receipt[]>([]);
  const { toast } = useToast();

  const loadReceipts = () => {
    const savedReceipts = JSON.parse(localStorage.getItem("receipts") || "[]") as Receipt[];
    const uniqueReceipts = Array.from(
      new Map(savedReceipts.map(receipt => [receipt.id, receipt])).values()
    );
    setReceipts(uniqueReceipts);
    setFilteredReceipts(uniqueReceipts);
  };

  useEffect(() => {
    loadReceipts();
  }, []);

  const handleArchive = (receipt: Receipt) => {
    const archivedReceipts = JSON.parse(localStorage.getItem("archivedReceipts") || "[]") as Receipt[];
    const existingArchived = archivedReceipts.find(r => r.id === receipt.id);
    
    if (!existingArchived) {
      // Update archived receipts
      const updatedArchived = [...archivedReceipts, receipt];
      localStorage.setItem("archivedReceipts", JSON.stringify(updatedArchived));
      
      // Update active receipts in localStorage and state
      const updatedReceipts = receipts.filter(r => r.id !== receipt.id);
      localStorage.setItem("receipts", JSON.stringify(updatedReceipts));
      setReceipts(updatedReceipts);
      setFilteredReceipts(updatedReceipts);
      
      toast({
        title: "Receipt archived",
        description: `Invoice #${receipt.invoiceNo} has been archived.`,
      });
    } else {
      toast({
        title: "Already archived",
        description: `Invoice #${receipt.invoiceNo} is already in the archive.`,
        variant: "destructive",
      });
    }
  };

  const handleDelete = (receipt: Receipt) => {
    const updatedReceipts = receipts.filter(r => r.id !== receipt.id);
    setReceipts(updatedReceipts);
    setFilteredReceipts(updatedReceipts);
    localStorage.setItem("receipts", JSON.stringify(updatedReceipts));
    
    toast({
      title: "Receipt deleted",
      description: `Invoice #${receipt.invoiceNo} has been deleted.`,
    });
  };

  const handleFilterChange = (filters: Record<string, string>) => {
    let filtered = [...receipts];

    if (filters.invoiceNo) {
      filtered = filtered.filter((receipt) =>
        receipt.invoiceNo.toLowerCase().includes(filters.invoiceNo.toLowerCase())
      );
    }

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

  return {
    receipts,
    filteredReceipts,
    handleArchive,
    handleDelete,
    handleFilterChange,
    loadReceipts, // Export loadReceipts for manual refresh
  };
};