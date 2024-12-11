import { useState, useEffect } from 'react';
import { Receipt } from '@/types/receipt';
import { useToast } from '@/hooks/use-toast';
import { parse, isValid } from 'date-fns';

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
      const updatedArchived = [...archivedReceipts, receipt];
      localStorage.setItem("archivedReceipts", JSON.stringify(updatedArchived));
      
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

    if (filters.dateFrom || filters.dateTo) {
      filtered = filtered.filter((receipt) => {
        const receiptDate = parse(receipt.timestamp, 'dd/MM/yyyy', new Date());
        
        if (!isValid(receiptDate)) {
          return true; // Skip invalid dates
        }

        if (filters.dateFrom) {
          const fromDate = parse(filters.dateFrom, 'dd/MM/yyyy', new Date());
          if (isValid(fromDate) && receiptDate < fromDate) {
            return false;
          }
        }

        if (filters.dateTo) {
          const toDate = parse(filters.dateTo, 'dd/MM/yyyy', new Date());
          if (isValid(toDate)) {
            toDate.setHours(23, 59, 59, 999);
            if (receiptDate > toDate) {
              return false;
            }
          }
        }

        return true;
      });
    }

    // Handle custom field filters
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
    loadReceipts,
  };
};