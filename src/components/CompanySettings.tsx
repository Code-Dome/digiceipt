import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { useToast } from "./ui/use-toast";
import { CompanySettings as CompanySettingsType } from "@/types/companySettings";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Building, Save, Trash2, Users, ChevronDown } from "lucide-react";
import { Card } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Profile {
  id: string;
  username: string | null;
  organization_id: string | null;
}

interface Organization {
  id: string;
  name: string;
}

export const CompanySettings = () => {
  const { toast } = useToast();
  const { user, isAdmin } = useAuth();
  const [settings, setSettings] = useState<CompanySettingsType>({
    companyName: "",
    address: "",
    termsAndConditions: ""
  });
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [users, setUsers] = useState<Profile[]>([]);

  useEffect(() => {
    if (user) {
      fetchSettings();
      if (isAdmin) {
        fetchOrganizations();
        fetchUsers();
      }
    }
  }, [user, isAdmin]);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('company_settings')
        .select('company_name, address, terms_and_conditions')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setSettings({
          companyName: data.company_name || "",
          address: data.address || "",
          termsAndConditions: data.terms_and_conditions || ""
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast({
        title: "Error fetching settings",
        description: "Failed to load company settings.",
        variant: "destructive"
      });
    }
  };

  const fetchOrganizations = async () => {
    try {
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .order('name');

      if (error) throw error;
      setOrganizations(data || []);
    } catch (error) {
      console.error('Error fetching organizations:', error);
      toast({
        title: "Error",
        description: "Failed to load organizations",
        variant: "destructive"
      });
    }
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, organization_id');

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive"
      });
    }
  };

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('company_settings')
        .upsert({
          user_id: user?.id,
          company_name: settings.companyName,
          address: settings.address,
          terms_and_conditions: settings.termsAndConditions,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Settings saved",
        description: "Company settings have been updated successfully."
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error saving settings",
        description: "Failed to save company settings.",
        variant: "destructive"
      });
    }
  };

  const handleClear = async () => {
    try {
      const { error } = await supabase
        .from('company_settings')
        .update({
          company_name: "",
          address: "",
          terms_and_conditions: "",
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user?.id);

      if (error) throw error;

      setSettings({
        companyName: "",
        address: "",
        termsAndConditions: ""
      });

      toast({
        title: "Settings cleared",
        description: "Company settings have been cleared successfully."
      });
    } catch (error) {
      console.error('Error clearing settings:', error);
      toast({
        title: "Error clearing settings",
        description: "Failed to clear company settings.",
        variant: "destructive"
      });
    }
  };

  const getUsersInOrganization = (organizationId: string) => {
    return users.filter(user => user.organization_id === organizationId);
  };

  return (
    <Card className="bg-background border border-border">
      <div className="p-4 sm:p-6 border-b border-border">
        <div className="flex items-center gap-2">
          <Building className="w-5 h-5 text-primary" />
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">
            Company Settings
          </h2>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-300px)]">
        <div className="p-4 sm:p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              id="companyName"
              value={settings.companyName}
              onChange={(e) => setSettings(prev => ({ ...prev, companyName: e.target.value }))}
              placeholder="Enter company name"
              className="bg-background"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={settings.address}
              onChange={(e) => setSettings(prev => ({ ...prev, address: e.target.value }))}
              placeholder="Enter company address"
              className="bg-background resize-none h-24"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="termsAndConditions">Terms & Conditions</Label>
            <Textarea
              id="termsAndConditions"
              value={settings.termsAndConditions}
              onChange={(e) => setSettings(prev => ({ ...prev, termsAndConditions: e.target.value }))}
              placeholder="Enter terms and conditions"
              className="bg-background resize-none h-48"
            />
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleSave}
              className="flex-1"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Settings
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear Data
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear Company Settings</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to clear all company settings? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleClear} className="bg-destructive text-destructive-foreground">
                    Clear Settings
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          {isAdmin && (
            <div className="mt-8">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Organizations</h3>
              </div>
              
              <Accordion type="single" collapsible className="w-full">
                {organizations.map((org) => (
                  <AccordionItem key={org.id} value={org.id}>
                    <AccordionTrigger className="hover:no-underline">
                      <span className="flex items-center gap-2">
                        <Building className="w-4 h-4" />
                        {org.name}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 pl-6">
                        {getUsersInOrganization(org.id).map((user) => (
                          <div key={user.id} className="flex items-center gap-2 text-sm">
                            <Users className="w-4 h-4 text-muted-foreground" />
                            <span>{user.username || 'Unnamed User'}</span>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};