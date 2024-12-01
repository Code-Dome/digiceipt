import { ReceiptTemplateSelector } from "@/components/ReceiptTemplateSelector";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Receipt } from "@/types/receipt";
import { useToast } from "@/components/ui/use-toast";

const Templates = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const receipt = location.state?.receipt as Receipt;

  if (!receipt) {
    navigate('/create');
    return null;
  }

  const handleTemplateSelect = (template: any) => {
    // Store the selected template in localStorage
    localStorage.setItem(`template_${receipt.id}`, JSON.stringify(template));
    toast({
      title: "Template selected",
      description: "Your template has been saved successfully.",
    });
    navigate('/view', { state: { focusId: receipt.id } });
  };

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
          <h1 className="text-3xl font-bold text-violet-700">Select Template</h1>
        </div>
      </div>

      <ReceiptTemplateSelector 
        receipt={receipt}
        onTemplateSelect={handleTemplateSelect}
      />
    </div>
  );
};

export default Templates;