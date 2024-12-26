import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { WashingStats } from "@/components/WashingStats";
import { CompanyStats } from "@/components/CompanyStats";
import { TimeStats } from "@/components/TimeStats";

const Stats = () => {
  const navigate = useNavigate();

  return (
    <div className="container py-4 md:py-8 px-4 md:px-6">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          onClick={() => navigate("/")}
          className="bg-white hover:bg-violet-50 text-violet-700 border-violet-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-violet-400 dark:border-gray-600"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        <h1 className="text-2xl md:text-3xl font-bold text-violet-700 dark:text-violet-400">
          Statistics Dashboard
        </h1>
      </div>

      <div className="space-y-8">
        <WashingStats />
        <CompanyStats />
        <TimeStats />
      </div>
    </div>
  );
};

export default Stats;