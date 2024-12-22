import { useEffect } from "react";
import { InvoiceTable } from "@/components/InvoiceList/InvoiceTable";
import { usePostHog } from "@/contexts/PostHogContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const View = () => {
  const posthog = usePostHog();
  const navigate = useNavigate();

  useEffect(() => {
    posthog.capture("view_page_visited");
  }, [posthog]);

  return (
    <div className="container py-8">
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="outline"
          onClick={() => navigate("/")}
          className="bg-white hover:bg-violet-50 text-violet-700 border-violet-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-violet-400 dark:border-gray-600"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        <h1 className="text-3xl font-bold text-violet-700 dark:text-violet-400">
          View Receipts
        </h1>
      </div>
      <InvoiceTable 
        invoices={[]} 
        onEdit={() => {}} 
        onArchive={() => {}}
      />
    </div>
  );
};

export default View;