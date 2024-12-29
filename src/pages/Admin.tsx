import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CompanySettings } from "@/components/CompanySettings";
import { UserManagement } from "@/components/UserManagement";
import { ArrowLeft, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCompanyManagement } from "@/hooks/useCompanyManagement";
import { useState } from "react";
import { Input } from "@/components/ui/input";

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
    <div className="container max-w-7xl mx-auto p-4 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold text-foreground">
            Settings
          </h1>
        </div>
      </div>

      <Tabs defaultValue="companies" className="space-y-4">
        <TabsList className="w-full h-auto flex flex-col sm:flex-row sm:h-10 bg-muted p-1 gap-2 sm:gap-0">
          <TabsTrigger value="companies" className="w-full sm:w-auto data-[state=active]:bg-background">
            Company Management
          </TabsTrigger>
          <TabsTrigger value="users" className="w-full sm:w-auto data-[state=active]:bg-background">
            User Management
          </TabsTrigger>
          <TabsTrigger value="settings" className="w-full sm:w-auto data-[state=active]:bg-background">
            Company Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="companies">
          <Card className="p-4 sm:p-6">
            <h2 className="text-xl font-bold mb-4 text-foreground">Add New Company</h2>
            <div className="space-y-4">
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