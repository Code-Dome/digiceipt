import { useState, useEffect } from "react";
import { Receipt } from "@/types/receipt";
import { InvoiceTable } from "@/components/InvoiceList/InvoiceTable";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Archive = () => {
  const [archivedReceipts, setArchivedReceipts] = useState<Receipt[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadArchivedReceipts = () => {
      const archived = JSON.parse(localStorage.getItem('archivedReceipts') || '[]');
      // Ensure no duplicates by using a Map with ID as key
      const uniqueReceipts = Array.from(
        new Map(archived.map((receipt: Receipt) => [receipt.id, receipt])).values()
      );
      setArchivedReceipts(uniqueReceipts);
    };

    loadArchivedReceipts();
  }, []);

  const handleUnarchive = (receipt: Receipt) => {
    const activeReceipts = JSON.parse(localStorage.getItem('receipts') || '[]');
    activeReceipts.push(receipt);
    localStorage.setItem('receipts', JSON.stringify(activeReceipts));
    
    const updatedArchived = archivedReceipts.filter(r => r.id !== receipt.id);
    setArchivedReceipts(updatedArchived);
    localStorage.setItem('archivedReceipts', JSON.stringify(updatedArchived));
  };

  const handleDelete = (receipt: Receipt) => {
    const updatedReceipts = archivedReceipts.filter(r => r.id !== receipt.id);
    setArchivedReceipts(updatedReceipts);
    localStorage.setItem('archivedReceipts', JSON.stringify(updatedReceipts));
  };

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/view')}
            className="text-violet-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Active Receipts
          </Button>
          <h1 className="text-3xl font-bold text-violet-700">Archived Receipts</h1>
        </div>
      </div>
      
      <InvoiceTable
        invoices={archivedReceipts}
        onEdit={() => {}}
        onUnarchive={handleUnarchive}
        onDelete={handleDelete}
        isArchivePage={true}
      />
    </div>
  );
};

export default Archive;