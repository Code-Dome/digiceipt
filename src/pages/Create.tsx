import ReceiptForm from "@/components/ReceiptForm";
import { Receipt } from "@/types/receipt";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const Create = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSave = (receipt: Receipt) => {
    // Check both active and archived receipts for duplicate invoice numbers
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
      <h1 className="text-3xl font-bold text-violet-700 mb-8">Create Receipt</h1>
      <ReceiptForm onSave={handleSave} onUpdate={() => {}} />
    </div>
  );
};

export default Create;