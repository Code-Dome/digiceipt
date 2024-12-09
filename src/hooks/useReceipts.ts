import { useState, useEffect } from 'react';
import { Receipt } from '@/types/receipt';
import { useToast } from '@/hooks/use-toast';

export const useReceipts = () => {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [filteredReceipts, setFilteredReceipts] = useState<Receipt[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const savedReceipts = JSON.parse(localStorage.getItem("receipts") || "[]") as Receipt[];
    // Ensure no duplicates in initial load
    const uniqueReceipts = Array.from(
      new Map(savedReceipts.map(receipt => [receipt.id, receipt])).values()
    );
    setReceipts(uniqueReceipts);
    setFilteredReceipts(uniqueReceipts);
  }, []);

  const handleArchive = (receipt: Receipt) => {
    const archivedReceipts = JSON.parse(localStorage.getItem("archivedReceipts") || "[]") as Receipt[];
    // Check if receipt already exists in archive
    const existingArchived = archivedReceipts.find(r => r.id === receipt.id);
    
    if (!existingArchived) {
      // Update localStorage
      localStorage.setItem("archivedReceipts", JSON.stringify([...archivedReceipts, receipt]));
      
      // Update UI state
      const updatedReceipts = receipts.filter(r => r.id !== receipt.id);
      setReceipts(updatedReceipts);
      setFilteredReceipts(updatedReceipts);
      localStorage.setItem("receipts", JSON.stringify(updatedReceipts));
      
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
  };
};