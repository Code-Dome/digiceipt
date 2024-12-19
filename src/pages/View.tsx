import { useEffect } from "react";
import { InvoiceList } from "@/components/InvoiceList/InvoiceTable";
import { usePostHog } from "@/contexts/PostHogContext";

const View = () => {
  const posthog = usePostHog();

  useEffect(() => {
    posthog.capture("view_page_visited");
  }, [posthog]);

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8 text-violet-700 dark:text-violet-400">
        View Receipts
      </h1>
      <InvoiceList />
    </div>
  );
};

export default View;