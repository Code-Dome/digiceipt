import { useState, useEffect, useCallback } from 'react';
import { Receipt } from '@/types/receipt';
import { DatabaseReceipt } from '@/types/database';
import { useToast } from '@/components/ui/use-toast';
import { parse, isValid } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { mapDatabaseToReceipt } from '@/utils/receiptMapper';

export const useReceipts = () => {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [filteredReceipts, setFilteredReceipts] = useState<Receipt[]>([]);
  const { toast } = useToast();
  const { session } = useAuth();

  const loadReceipts = useCallback(async () => {
    if (!session?.user?.id) return;

    const { data, error } = await supabase
      .from('receipts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading receipts:', error);
      toast({
        title: 'Error loading receipts',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }

    const mappedReceipts = (data as DatabaseReceipt[]).map(mapDatabaseToReceipt);
    setReceipts(mappedReceipts);
    setFilteredReceipts(mappedReceipts);
  }, [session?.user?.id, toast]);

  useEffect(() => {
    loadReceipts();
  }, [loadReceipts]);

  const handleArchive = async (receipt: Receipt) => {
    // For now, we'll keep the archive functionality in localStorage
    const archivedReceipts = JSON.parse(localStorage.getItem("archivedReceipts") || "[]") as Receipt[];
    archivedReceipts.push(receipt);
    localStorage.setItem("archivedReceipts", JSON.stringify(archivedReceipts));
    
    const { error } = await supabase
      .from('receipts')
      .delete()
      .eq('id', receipt.id);

    if (error) {
      console.error('Error archiving receipt:', error);
      toast({
        title: 'Error archiving receipt',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }

    await loadReceipts();
    
    toast({
      title: "Receipt archived",
      description: `Invoice #${receipt.invoiceNo} has been archived.`,
      duration: 2000,
    });
  };

  const handleDelete = async (receipt: Receipt) => {
    const { error } = await supabase
      .from('receipts')
      .delete()
      .eq('id', receipt.id);

    if (error) {
      console.error('Error deleting receipt:', error);
      toast({
        title: 'Error deleting receipt',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }

    await loadReceipts();
    
    toast({
      title: "Receipt deleted",
      description: `Invoice #${receipt.invoiceNo} has been deleted.`,
      duration: 2000,
    });
  };

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
