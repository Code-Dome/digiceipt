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
    if (!session?.user?.id) {
      console.log('No authenticated user found');
      return;
    }

    try {
      // First get the user's profile to check organization
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('organization_id, is_admin')
        .eq('id', session.user.id)
        .maybeSingle();

      if (profileError) {
        console.error('Error loading profile:', profileError);
        toast({
          title: 'Error loading profile',
          description: profileError.message,
          variant: 'destructive',
        });
        return;
      }

      // If no profile found, show a message and return
      if (!profileData) {
        console.error('No profile found for user');
        toast({
          title: 'Profile not found',
          description: 'Your user profile could not be found. Please contact support.',
          variant: 'destructive',
        });
        return;
      }

      let query = supabase
        .from('receipts')
        .select('*')
        .order('created_at', { ascending: false });

      // If user is not admin, filter by their organization
      if (!profileData.is_admin && profileData.organization_id) {
        query = query.eq('organization_id', profileData.organization_id);
      }

      const { data, error } = await query;

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
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred while loading receipts.',
        variant: 'destructive',
      });
    }
  }, [session?.user?.id, toast]);

  useEffect(() => {
    loadReceipts();
  }, [loadReceipts]);

  const handleArchive = async (receipt: Receipt) => {
    try {
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
    } catch (error) {
      console.error('Unexpected error during archive:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred while archiving the receipt.',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (receipt: Receipt) => {
    try {
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
    } catch (error) {
      console.error('Unexpected error during delete:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred while deleting the receipt.',
        variant: 'destructive',
      });
    }
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
