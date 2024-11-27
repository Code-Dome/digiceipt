import { Button } from "@/components/ui/button";
import { Plus, FileText, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-violet-700">Digital Receipts</h1>
        <div className="flex gap-2">
          <Button 
            onClick={() => logout()}
            variant="outline"
            className="bg-white hover:bg-violet-50 text-violet-700 border-violet-200"
          >
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold text-violet-700 mb-4">Create Receipt</h2>
          <p className="text-gray-600 mb-4">Generate a new digital receipt with custom fields and signature.</p>
          <Button 
            onClick={() => navigate("/create")}
            className="w-full bg-violet-600 hover:bg-violet-700"
          >
            <Plus className="mr-2 h-4 w-4" /> New Receipt
          </Button>
        </div>

        <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold text-violet-700 mb-4">View Receipts</h2>
          <p className="text-gray-600 mb-4">Access and manage all your created digital receipts.</p>
          <Button 
            onClick={() => navigate("/view")}
            className="w-full bg-violet-600 hover:bg-violet-700"
          >
            <FileText className="mr-2 h-4 w-4" /> View Receipts
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;