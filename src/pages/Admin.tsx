import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CompanySettingsForm } from "@/components/settings/CompanySettingsForm";
import { OrganizationList } from "@/components/organization/OrganizationList";
import { CompanyManagement } from "@/components/CompanyManagement";

const Admin = () => {
  return (
    <div className="container py-6">
      <h1 className="text-3xl font-bold mb-6 text-violet-700 dark:text-violet-400">
        Admin Dashboard
      </h1>
      
      <Tabs defaultValue="settings" className="space-y-4">
        <TabsList>
          <TabsTrigger value="settings">Company Settings</TabsTrigger>
          <TabsTrigger value="companies">Company Management</TabsTrigger>
          <TabsTrigger value="organizations">Organization Management</TabsTrigger>
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
      </Tabs>
    </div>
  );
};

export default Admin;