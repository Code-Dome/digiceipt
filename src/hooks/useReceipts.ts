import { useState, useEffect } from 'react';
import { Receipt } from '@/types/receipt';
import { useToast } from '@/components/ui/use-toast';

export const useReceipts = () => {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [filteredReceipts, setFilteredReceipts] = useState<Receipt[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const savedReceipts = JSON.parse(localStorage.getItem("receipts") || "[]");
    setReceipts(savedReceipts);
    setFilteredReceipts(savedReceipts);
  }, []);

  const handleArchive = (receipt: Receipt) => {
    const archivedReceipts = JSON.parse(localStorage.getItem("archivedReceipts") || "[]");
    localStorage.setItem("archivedReceipts", JSON.stringify([...archivedReceipts, receipt]));
    
    const updatedReceipts = receipts.filter(r => r.id !== receipt.id);
    localStorage.setItem("receipts", JSON.stringify(updatedReceipts));
    
    setReceipts(updatedReceipts);
    setFilteredReceipts(updatedReceipts);
    
    toast({
      title: "Receipt archived",
      description: `Invoice #${receipt.invoiceNo} has been archived.`,
    });
  };

  const handleDelete = (receipt: Receipt) => {
    const updatedReceipts = receipts.filter(r => r.id !== receipt.id);
    setReceipts(updatedReceipts);
    setFilteredReceipts(updatedReceipts);
    localStorage.setItem("receipts", JSON.stringify(updatedReceipts));
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