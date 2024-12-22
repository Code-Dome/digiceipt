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
    <h1 className="text-3xl font-bold mb-8 text-violet-700 dark:text-violet-400">
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
