import { useState, useEffect, useCallback } from 'react';
import { Receipt } from '@/types/receipt';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useArchivedReceipts = () => {
  const [archivedReceipts, setArchivedReceipts] = useState<Receipt[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

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

  const handleUnarchive = useCallback(async (receipt: Receipt) => {
    if (!user) {
      console.error('No user found');
      return;
    }

    try {
      // Convert custom fields to JSON
      const customFieldsJson = JSON.stringify(receipt.customFields || []);
      const removedFieldsJson = JSON.stringify(receipt.removedFields || []);
      const removedCustomFieldsJson = JSON.stringify(receipt.removedCustomFields || []);

      // First, insert the receipt back into Supabase
      const { data, error: insertError } = await supabase
        .from('receipts')
        .insert({
          user_id: user.id,
          driver_name: receipt.driverName,
          horse_reg: receipt.horseReg,
          company_name: receipt.companyName,
          wash_type: receipt.washType,
          other_wash_type: receipt.otherWashType,
          custom_fields: customFieldsJson,
          signature: receipt.signature,
          removed_fields: removedFieldsJson,
          removed_custom_fields: removedCustomFieldsJson,
          invoice_no: receipt.invoiceNo,
        })
        .select(); // Add .select() to return the inserted data

      if (insertError) {
        console.error('Error inserting unarchived receipt:', insertError);
        toast({
          title: "Error restoring receipt",
          description: insertError.message,
          variant: 'destructive',
        });
        return;
      }

      // Log the inserted data for debugging
      console.log('Inserted receipt data:', data);

      // Update localStorage
      const updatedArchived = archivedReceipts.filter(r => r.id !== receipt.id);
      localStorage.setItem('archivedReceipts', JSON.stringify(updatedArchived));
      
      // Update state immediately
      setArchivedReceipts(updatedArchived);
      
      toast({
        title: "Receipt restored",
        description: `Invoice #${receipt.invoiceNo} has been restored to active receipts.`,
        duration: 2000,
      });
    } catch (error) {
      console.error('Error in handleUnarchive:', error);
      toast({
        title: "Error restoring receipt",
        description: "An unexpected error occurred while restoring the receipt.",
        variant: 'destructive',
      });
    }
  }, [archivedReceipts, toast, user]);

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