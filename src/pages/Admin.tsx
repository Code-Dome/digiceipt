import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CompanySettings } from "@/components/CompanySettings";
import { UserManagement } from "@/components/UserManagement";
import { ArrowLeft, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCompanyManagement } from "@/hooks/useCompanyManagement";
import { useState } from "react";

const Admin = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [newCompany, setNewCompany] = useState("");
  const { companies, addCompany, removeCompany } = useCompanyManagement();

  useEffect(() => {
    if (!isAdmin) {
      navigate("/");
    }
  }, [isAdmin, navigate]);

  return (
    <div className="container px-4 py-4 md:py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 md:mb-8">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="w-full md:w-auto bg-white hover:bg-violet-50 text-violet-700 border-violet-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-violet-400 dark:border-gray-600"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold text-violet-700 dark:text-violet-400">
            Settings
          </h1>
        </div>
      </div>

      <Tabs defaultValue="companies" className="space-y-4 md:space-y-6">
        <TabsList className="w-full md:w-auto bg-violet-50 dark:bg-gray-800 flex flex-col md:flex-row gap-2 md:gap-0 p-1">
          <TabsTrigger value="companies" className="w-full md:w-auto">Company Management</TabsTrigger>
          <TabsTrigger value="users" className="w-full md:w-auto">User Management</TabsTrigger>
          <TabsTrigger value="settings" className="w-full md:w-auto">Company Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="companies">
          <Card className="p-4 md:p-6 dark:bg-gray-800 dark:border-gray-700">
            <h2 className="text-xl md:text-2xl font-bold mb-4 dark:text-gray-200">Add New Company</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (newCompany.trim()) {
                  addCompany(newCompany.trim());
                  setNewCompany("");
                }
              }}
              className="flex flex-col md:flex-row gap-2"
            >
              <Input
                value={newCompany}
                onChange={(e) => setNewCompany(e.target.value)}
                placeholder="Enter company name"
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              />
              <Button 
                type="submit"
                className="w-full md:w-auto bg-violet-600 hover:bg-violet-700 text-white dark:bg-violet-700 dark:hover:bg-violet-800"
              >
                Add Company
              </Button>
            </form>

            <div className="mt-6 space-y-2">
              {companies.map((company) => (
                <div
                  key={company.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg dark:bg-gray-700"
                >
                  <span className="dark:text-gray-200 break-all pr-2">{company.name}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeCompany(company.id)}
                    className="shrink-0 hover:bg-red-100 dark:hover:bg-red-900"
                  >
                    <X className="h-4 w-4 text-red-700 dark:text-red-400" />
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <UserManagement />
        </TabsContent>

        <TabsContent value="settings">
          <CompanySettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;