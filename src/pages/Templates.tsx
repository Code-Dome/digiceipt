import { ReceiptTemplateSelector } from "@/components/ReceiptTemplateSelector";
import { Button } from "@/components/ui/button";
import { Home, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Receipt } from "@/types/receipt";
import { useToast } from "@/components/ui/use-toast";

const Templates = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const receipt = location.state?.receipt as Receipt;

  const handleTemplateSelect = (template: any) => {
    if (receipt) {
      localStorage.setItem(`template_${receipt.id}`, JSON.stringify(template));
      toast({
        title: "Template selected",
        description: "Your template has been saved successfully.",
      });
      navigate('/view', { state: { focusId: receipt.id } });
    } else {
      localStorage.setItem('defaultTemplate', JSON.stringify(template));
      toast({
        title: "Default template set",
        description: "This template will be used for new receipts.",
      });
      navigate('/');
    }
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
          <h1 className="text-3xl font-bold text-violet-700">Receipt Templates</h1>
        </div>
        {!receipt && (
          <Button 
            onClick={() => navigate('/create')}
            className="bg-violet-600 hover:bg-violet-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Receipt
          </Button>
        )}
      </div>

      <ReceiptTemplateSelector 
        receipt={receipt || {
          id: 'preview',
          invoiceNo: 'PREVIEW-001',
          timestamp: new Date().toISOString(),
          driverName: 'John Doe',
          horseReg: 'HR123',
          companyName: 'Example Co.',
          washType: 'Full Wash',
          customFields: [],
          signature: '',
        }}
        onTemplateSelect={handleTemplateSelect}
      />
    </div>
  );
};

export default Templates;