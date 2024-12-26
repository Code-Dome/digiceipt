import { useState, useEffect, useCallback } from 'react';
import { Receipt } from '@/types/receipt';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { mapDatabaseToReceipt } from '@/utils/receiptMapper';

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

  const handleUnarchive = useCallback(async (receipt: Receipt) => {
    try {
      // First, insert the receipt back into Supabase
      const { error: insertError } = await supabase
        .from('receipts')
        .insert({
          id: receipt.id,
          user_id: receipt.user_id,
          invoice_no: receipt.invoiceNo,
          driver_name: receipt.driverName,
          horse_reg: receipt.horseReg,
          company_name: receipt.companyName,
          wash_type: receipt.washType,
          other_wash_type: receipt.otherWashType,
          custom_fields: receipt.customFields,
          signature: receipt.signature,
          removed_fields: receipt.removedFields,
          removed_custom_fields: receipt.removedCustomFields,
        });

      if (insertError) {
        console.error('Error inserting unarchived receipt:', insertError);
        toast({
          title: "Error restoring receipt",
          description: insertError.message,
          variant: 'destructive',
        });
        return;
      }

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