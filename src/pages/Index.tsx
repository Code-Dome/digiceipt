import { useState } from "react";
import ReceiptForm from "@/components/ReceiptForm";
import { Receipt } from "@/types/receipt";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const { toast } = useToast();

  const handleSaveReceipt = (receipt: Receipt) => {
    setReceipts((prev) => [...prev, receipt]);
    toast({
      title: "Receipt saved",
      description: `Invoice #${receipt.invoiceNo} has been saved successfully.`,
    });
  };

  const handleUpdateReceipt = (updatedReceipt: Receipt) => {
    setReceipts((prev) =>
      prev.map((r) => (r.id === updatedReceipt.id ? updatedReceipt : r))
    );
    toast({
      title: "Receipt updated",
      description: `Invoice #${updatedReceipt.invoiceNo} has been updated successfully.`,
    });
  };

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Digital Receipts</h1>
        <Button onClick={() => setReceipts([...receipts, {} as Receipt])}>
          <Plus className="mr-2 h-4 w-4" /> New Receipt
        </Button>
      </div>
      
      <div className="space-y-8">
        {receipts.map((receipt, index) => (
          <ReceiptForm
            key={receipt.id || index}
            initialData={receipt}
            onSave={handleSaveReceipt}
            onUpdate={handleUpdateReceipt}
          />
        ))}
        
        {receipts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No receipts yet. Create one to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;