import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CompanySettingsForm } from "@/components/settings/CompanySettingsForm";
import { OrganizationList } from "@/components/organization/OrganizationList";
import { CompanyManagement } from "@/components/CompanyManagement";
import { UserManagement } from "@/components/UserManagement";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Admin = () => {
  const navigate = useNavigate();

  return (
    <div className="container py-6">
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate('/')}
          className="bg-background hover:bg-muted text-primary"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        <h1 className="text-3xl font-bold text-primary">
          Admin Dashboard
        </h1>
      </div>
      
      <Tabs defaultValue="settings" className="space-y-4">
        <TabsList>
          <TabsTrigger value="settings">Company Settings</TabsTrigger>
          <TabsTrigger value="companies">Company Management</TabsTrigger>
          <TabsTrigger value="organizations">Organization Management</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="space-y-4">
          <CompanySettingsForm />
        </TabsContent>

        <TabsContent value="companies" className="space-y-4">
          <CompanyManagement />
        </TabsContent>

        <TabsContent value="organizations" className="space-y-4">
          <OrganizationList />
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <UserManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;