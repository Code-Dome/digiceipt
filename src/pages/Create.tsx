import ReceiptForm from "@/components/ReceiptForm";
import { Receipt } from "@/types/receipt";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const Create = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSave = (receipt: Receipt) => {
    const savedReceipts = JSON.parse(localStorage.getItem("receipts") || "[]");
    const archivedReceipts = JSON.parse(localStorage.getItem("archivedReceipts") || "[]");
    
    const isDuplicate = [...savedReceipts, ...archivedReceipts].some(
      (r) => r.invoiceNo === receipt.invoiceNo
    );

    if (isDuplicate) {
      toast({
        title: "Error",
        description: `Invoice #${receipt.invoiceNo} already exists. Please use a different invoice number.`,
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem(
      "receipts",
      JSON.stringify([...savedReceipts, receipt])
    );
    
    toast({
      title: "Receipt created",
      description: `Invoice #${receipt.invoiceNo} has been created successfully.`,
    });
    
    navigate("/view", { state: { focusId: receipt.id } });
  };

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate("/view")}
            className="bg-white hover:bg-violet-50 text-violet-700 border-violet-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to View
          </Button>
          <h1 className="text-3xl font-bold text-violet-700">Create Receipt</h1>
        </div>
      </div>
      <ReceiptForm onSave={handleSave} onUpdate={() => {}} />
    </div>
  );
};

export default Create;