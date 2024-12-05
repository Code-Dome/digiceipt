import { Button } from "@/components/ui/button";
import { Home, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const Templates = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="bg-white hover:bg-violet-50 text-violet-700 border-violet-200"
          >
            <Home className="w-4 h-4 mr-2" />
            Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-violet-700">Receipts</h1>
        </div>
        <Button 
          onClick={() => navigate('/create')}
          className="bg-violet-600 hover:bg-violet-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Receipt
        </Button>
      </div>

      <div className="text-center py-8">
        <p>Template functionality has been simplified. All receipts now use a consistent default style.</p>
      </div>
    </div>
  );
};

export default Templates;