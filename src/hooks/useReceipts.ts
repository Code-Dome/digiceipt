import { useState, useEffect, useCallback } from 'react';
import { Receipt } from '@/types/receipt';
import { useToast } from '@/components/ui/use-toast';
import { parse, isValid } from 'date-fns';

export const useReceipts = () => {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [filteredReceipts, setFilteredReceipts] = useState<Receipt[]>([]);
  const { toast } = useToast();

  const loadReceipts = useCallback(() => {
    const savedReceipts = JSON.parse(localStorage.getItem("receipts") || "[]") as Receipt[];
    const uniqueReceipts = Array.from(
      new Map(savedReceipts.map(receipt => [receipt.id, receipt])).values()
    );
    setReceipts(uniqueReceipts);
    setFilteredReceipts(uniqueReceipts);
  }, []);

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
    
    setReceipts([...updatedReceipts]); // Ensure new reference
    setFilteredReceipts(filteredReceipts.filter(r => r.id !== receipt.id)); // Ensure filtering is updated
    console.log(updatedReceipts)
    toast({
      title: "Receipt archived",
      description: `Invoice #${receipt.invoiceNo} has been archived.`,
      duration: 2000,
    });
  } else {
    toast({
      title: "Already archived",
      description: `Invoice #${receipt.invoiceNo} is already in the archive.`,
      variant: "destructive",
      duration: 2000,
    });
  }
};

  const handleDelete = useCallback((receipt: Receipt) => {
    const updatedReceipts = receipts.filter(r => r.id !== receipt.id);
    setReceipts(updatedReceipts);
    setFilteredReceipts(prev => prev.filter(r => r.id !== receipt.id));
    localStorage.setItem("receipts", JSON.stringify(updatedReceipts));
    
    toast({
      title: "Receipt deleted",
      description: `Invoice #${receipt.invoiceNo} has been deleted.`,
      duration: 2000,
    });
  }, [receipts, toast]);

  const handleFilterChange = useCallback((filters: Record<string, string>) => {
    let filtered = [...receipts];

    if (filters.invoiceNo) {
      filtered = filtered.filter((receipt) =>
        receipt.invoiceNo.toLowerCase().includes(filters.invoiceNo.toLowerCase())
      );
    }

    if (filters.dateFrom || filters.dateTo) {
      filtered = filtered.filter((receipt) => {
        const datePart = receipt.timestamp.split(' ')[0];
        const receiptDate = parse(datePart, 'dd/MM/yyyy', new Date());
        
        if (!isValid(receiptDate)) {
          console.log('Invalid receipt date:', receipt.timestamp);
          return false;
        }

        if (filters.dateFrom) {
          const fromDate = parse(filters.dateFrom, 'dd/MM/yyyy', new Date());
          if (isValid(fromDate)) {
            fromDate.setHours(0, 0, 0, 0);
            if (receiptDate < fromDate) {
              return false;
            }
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
  }, [receipts]);

  return {
    receipts,
    filteredReceipts,
    handleArchive,
    handleDelete,
    handleFilterChange,
    loadReceipts,
  };
};
