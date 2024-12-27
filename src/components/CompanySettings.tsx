import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { useToast } from "./ui/use-toast";
import { CompanySettings as CompanySettingsType } from "@/types/companySettings";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const CompanySettings = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [settings, setSettings] = useState<CompanySettingsType>({
    companyName: "",
    address: "",
    termsAndConditions: ""
  });

  useEffect(() => {
    if (user) {
      fetchSettings();
    }
  }, [user]);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('company_settings')
        .select('company_name, address, terms_and_conditions')
        .eq('user_id', user?.id)
        .single();

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

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg border border-violet-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="space-y-2">
        <Label htmlFor="companyName" className="dark:text-gray-300">Company Name</Label>
        <Input
          id="companyName"
          value={settings.companyName}
          onChange={(e) => setSettings(prev => ({ ...prev, companyName: e.target.value }))}
          placeholder="Enter company name"
          className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="address" className="dark:text-gray-300">Address</Label>
        <Input
          id="address"
          value={settings.address}
          onChange={(e) => setSettings(prev => ({ ...prev, address: e.target.value }))}
          placeholder="Enter company address"
          className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="termsAndConditions" className="dark:text-gray-300">Terms & Conditions</Label>
        <Textarea
          id="termsAndConditions"
          value={settings.termsAndConditions}
          onChange={(e) => setSettings(prev => ({ ...prev, termsAndConditions: e.target.value }))}
          placeholder="Enter terms and conditions"
          className="min-h-[100px] dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
        />
      </div>

      <Button 
        onClick={handleSave} 
        className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold dark:bg-violet-700 dark:hover:bg-violet-800"
      >
        Save Settings
      </Button>
    </div>
  );
};