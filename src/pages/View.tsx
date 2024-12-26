import { useEffect, useState } from "react";
import { InvoiceTable } from "@/components/InvoiceList/InvoiceTable";
import { InvoiceFilters } from "@/components/InvoiceList/InvoiceFilters";
import { usePostHog } from "@/contexts/PostHogContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Archive } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useReceipts } from "@/hooks/useReceipts";
import { Receipt } from "@/types/receipt";
import { useToast } from "@/hooks/use-toast";

const View = () => {
  const posthog = usePostHog();
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    receipts,
    filteredReceipts,
    handleArchive,
    handleDelete,
    handleFilterChange,
    loadReceipts,
  } = useReceipts();

  useEffect(() => {
    posthog.capture("view_page_visited");
    loadReceipts();
  }, [posthog, loadReceipts]);

  const handleEditReceipt = (receipt: Receipt) => {
    // Store the receipt data in localStorage for editing
    localStorage.setItem("editReceipt", JSON.stringify(receipt));
    navigate("/create");
  };

  const handleArchiveClick = () => {
    navigate("/archive");
  };

  const onArchive = async (receipt: Receipt) => {
    await handleArchive(receipt);
    toast({
      title: "Receipt Archived",
      description: `Receipt #${receipt.invoiceNo} has been archived successfully.`,
    });
  };

  const onDelete = async (receipt: Receipt) => {
    await handleDelete(receipt);
    toast({
      title: "Receipt Deleted",
      description: `Receipt #${receipt.invoiceNo} has been deleted successfully.`,
    });
  };

  return (
    <div className="container py-4 md:py-8 px-4 md:px-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="bg-white hover:bg-violet-50 text-violet-700 border-violet-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-violet-400 dark:border-gray-600"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold text-violet-700 dark:text-violet-400">
            View Receipts
          </h1>
        </div>
        <Button
          variant="outline"
          onClick={handleArchiveClick}
          className="w-full md:w-auto bg-white hover:bg-violet-50 text-violet-700 border-violet-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-violet-400 dark:border-gray-600"
        >
          <Archive className="w-4 h-4 mr-2" />
          View Archive
        </Button>
      </div>

      <div className="space-y-6">
        <InvoiceFilters
          invoices={receipts}
          onFilterChange={handleFilterChange}
        />
        
        <InvoiceTable
          invoices={filteredReceipts}
          onEdit={handleEditReceipt}
          onArchive={onArchive}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
};

export default View;