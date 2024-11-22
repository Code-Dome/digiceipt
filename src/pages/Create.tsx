import ReceiptForm from "@/components/ReceiptForm";
import { Receipt } from "@/types/receipt";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const Create = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSave = (receipt: Receipt) => {
    // In a real app, this would be an API call
    const savedReceipts = JSON.parse(localStorage.getItem("receipts") || "[]");
    localStorage.setItem(
      "receipts",
      JSON.stringify([...savedReceipts, receipt])
    );
    
    toast({
      title: "Receipt created",
      description: `Invoice #${receipt.invoiceNo} has been created successfully.`,
    });
    
    // Navigate to view page and focus on the new receipt
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