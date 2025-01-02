import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CompanySettings } from "@/components/CompanySettings";
import { UserManagement } from "@/components/UserManagement";
import { OrganizationList } from "@/components/organization/OrganizationList";
import { ArrowLeft, Building2, Users, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Admin = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

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

      <Tabs defaultValue="settings" className="space-y-4">
        <TabsList className="w-full h-auto flex flex-col sm:flex-row sm:h-10 bg-muted p-1 gap-2 sm:gap-0">
          <TabsTrigger value="settings" className="w-full sm:w-auto data-[state=active]:bg-background">
            <Settings className="w-4 h-4 mr-2" />
            Company Settings
          </TabsTrigger>
          <TabsTrigger value="organizations" className="w-full sm:w-auto data-[state=active]:bg-background">
            <Building2 className="w-4 h-4 mr-2" />
            Organizations
          </TabsTrigger>
          <TabsTrigger value="users" className="w-full sm:w-auto data-[state=active]:bg-background">
            <Users className="w-4 h-4 mr-2" />
            Users
          </TabsTrigger>
        </TabsList>

        <TabsContent value="settings">
          <CompanySettings />
        </TabsContent>

        <TabsContent value="organizations">
          <Card className="p-4 sm:p-6">
            <OrganizationList />
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <UserManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;