import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-violet-700">Digital Receipts</h1>
        <Button 
          onClick={() => navigate("/create")}
          className="bg-violet-600 hover:bg-violet-700 text-white"
        >
          <Plus className="mr-2 h-4 w-4" /> New Receipt
        </Button>
      </div>
      
      <div className="text-center py-12">
        <p className="text-muted-foreground">Welcome to Digital Receipts! Click the button above to create your first receipt.</p>
      </div>
    </div>
  );
};

export default Index;