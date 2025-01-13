import { Button } from "@/components/ui/button";
import { Plus, FileText, LogOut, Settings, BarChart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { useEffect } from "react";

const Index = () => {
  const navigate = useNavigate();
  const { logout, isAdmin, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleCreateClick = () => {
    navigate("/create");
  };

  const handleViewClick = () => {
    navigate("/view");
  };

  const handleStatsClick = () => {
    navigate("/stats");
  };

  const handleSettingsClick = () => {
    navigate("/admin");
  };

  const handleLogout = async () => {
    await logout();
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container py-4 md:py-8 px-4 md:px-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-primary dark:text-primary">Digital Receipts</h1>
        <div className="flex flex-wrap gap-2 items-center">
          <ThemeSwitcher />
          <Button 
            onClick={handleStatsClick}
            variant="outline"
            className="w-full md:w-auto bg-background hover:bg-muted text-foreground border-input"
          >
            <BarChart className="mr-2 h-4 w-4" /> Statistics
          </Button>
          {isAdmin && (
            <Button 
              onClick={handleSettingsClick}
              variant="outline"
              className="w-full md:w-auto bg-background hover:bg-muted text-foreground border-input"
            >
              <Settings className="mr-2 h-4 w-4" /> Settings
            </Button>
          )}
          <Button 
            onClick={handleLogout}
            variant="outline"
            className="w-full md:w-auto bg-background hover:bg-muted text-foreground border-input"
          >
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 md:mb-8">
        <div className="p-4 md:p-6 bg-background rounded-lg shadow-sm border border-input hover:shadow-md transition-shadow h-full flex flex-col">
          <h2 className="text-lg md:text-xl font-semibold text-primary mb-3 md:mb-4">Create Receipt</h2>
          <p className="text-sm md:text-base text-muted-foreground mb-4 flex-grow">Generate a new digital receipt with custom fields and signature.</p>
          <Button 
            onClick={handleCreateClick}
            className="w-full bg-primary hover:bg-primary/90"
          >
            <Plus className="mr-2 h-4 w-4" /> New Receipt
          </Button>
        </div>

        <div className="p-4 md:p-6 bg-background rounded-lg shadow-sm border border-input hover:shadow-md transition-shadow h-full flex flex-col">
          <h2 className="text-lg md:text-xl font-semibold text-primary mb-3 md:mb-4">View Receipts</h2>
          <p className="text-sm md:text-base text-muted-foreground mb-4 flex-grow">Access and manage all your created digital receipts.</p>
          <Button 
            onClick={handleViewClick}
            className="w-full bg-primary hover:bg-primary/90"
          >
            <FileText className="mr-2 h-4 w-4" /> View Receipts
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;