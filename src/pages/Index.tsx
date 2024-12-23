import { Button } from "@/components/ui/button";
import { Plus, FileText, LogOut, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { usePostHog } from "@/contexts/PostHogContext";
import { WashingStats } from "@/components/WashingStats";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

const Index = () => {
  const navigate = useNavigate();
  const { logout, isAdmin, isAuthenticated } = useAuth();
  const posthog = usePostHog();

  const handleCreateClick = () => {
    posthog.capture('create_receipt_clicked');
    navigate("/create");
  };

  const handleViewClick = () => {
    posthog.capture('view_receipts_clicked');
    navigate("/view");
  };

  const handleSettingsClick = () => {
    posthog.capture('settings_page_accessed');
    navigate("/admin");
  };

  const handleLogout = async () => {
    posthog.capture('user_logged_out');
    await logout();
  };

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-violet-700 dark:text-violet-400">Digital Receipts</h1>
        <div className="flex gap-2 items-center">
          <ThemeSwitcher />
          {isAdmin && (
            <Button 
              onClick={handleSettingsClick}
              variant="outline"
              className="bg-white hover:bg-violet-50 text-violet-700 border-violet-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-violet-400 dark:border-gray-600"
            >
              <Settings className="mr-2 h-4 w-4" /> Settings
            </Button>
          )}
          <Button 
            onClick={handleLogout}
            variant="outline"
            className="bg-white hover:bg-violet-50 text-violet-700 border-violet-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-violet-400 dark:border-gray-600"
          >
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 mb-8">
        <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700 h-full flex flex-col">
          <h2 className="text-xl font-semibold text-violet-700 dark:text-violet-400 mb-4">Create Receipt</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow">Generate a new digital receipt with custom fields and signature.</p>
          <Button 
            onClick={handleCreateClick}
            className="w-full bg-violet-600 hover:bg-violet-700 dark:bg-violet-700 dark:hover:bg-violet-800"
          >
            <Plus className="mr-2 h-4 w-4" /> New Receipt
          </Button>
        </div>

        <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700 h-full flex flex-col">
          <h2 className="text-xl font-semibold text-violet-700 dark:text-violet-400 mb-4">View Receipts</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow">Access and manage all your created digital receipts.</p>
          <Button 
            onClick={handleViewClick}
            className="w-full bg-violet-600 hover:bg-violet-700 dark:bg-violet-700 dark:hover:bg-violet-800"
          >
            <FileText className="mr-2 h-4 w-4" /> View Receipts
          </Button>
        </div>
      </div>

      <WashingStats />
    </div>
  );
};

export default Index;