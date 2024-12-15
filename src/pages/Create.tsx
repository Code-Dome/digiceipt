import ReceiptForm from "@/components/ReceiptForm";
import { Receipt } from "@/types/receipt";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const Create = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { session } = useAuth();

  const handleSave = async (receipt: Receipt) => {
    if (!session?.user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to create receipts",
        variant: "destructive",
      });
      return;
    }

    const { data: existingReceipts, error: fetchError } = await supabase
      .from('receipts')
      .select('invoice_no')
      .or(`invoice_no.eq.${receipt.invoiceNo}`);

    if (fetchError) {
      toast({
        title: "Error",
        description: "Failed to check for duplicate invoice numbers",
        variant: "destructive",
      });
      return;
    }

    if (existingReceipts && existingReceipts.length > 0) {
      toast({
        title: "Error",
        description: `Invoice #${receipt.invoiceNo} already exists. Please use a different invoice number.`,
        variant: "destructive",
      });
      return;
    }

    const { error: insertError } = await supabase
      .from('receipts')
      .insert([
        {
          ...receipt,
          user_id: session.user.id,
        }
      ]);

    if (insertError) {
      toast({
        title: "Error",
        description: "Failed to create receipt",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Receipt created",
      description: `Invoice #${receipt.invoiceNo} has been created successfully.`,
    });
    
    navigate("/view", { state: { focusId: receipt.id } });
  };

  return (
    <div className="container py-8 dark:bg-gray-900">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate("/view")}
            className="bg-white hover:bg-violet-50 text-violet-700 border-violet-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-violet-400 dark:border-gray-600"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to View
          </Button>
          <h1 className="text-3xl font-bold text-violet-700 dark:text-violet-400">Create Receipt</h1>
        </div>
      </div>
      <ReceiptForm onSave={handleSave} onUpdate={() => {}} />
    </div>
  );
};

export default Create;