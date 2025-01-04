import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { CompanySettings as CompanySettingsType } from "@/types/companySettings";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { CompanySettingsFormFields } from "./CompanySettingsFormFields";
import { CompanySettingsFormSkeleton } from "./CompanySettingsFormSkeleton";

export const CompanySettingsForm = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<CompanySettingsType>({
    companyName: "",
    address: "",
    termsAndConditions: ""
  });

  useEffect(() => {
    const loadSettings = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('company_settings')
          .select('*')
          .eq('user_id', user.id)
          .limit(1)
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
        console.error('Error loading settings:', error);
        toast({
          title: "Error loading settings",
          description: "Failed to load company settings.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, [user, toast]);

  const handleSave = async () => {
    if (!user) return;

    try {
      // First, delete any existing settings for this user
      await supabase
        .from('company_settings')
        .delete()
        .eq('user_id', user.id);

      // Then insert the new settings
      const { error } = await supabase
        .from('company_settings')
        .insert({
          user_id: user.id,
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
    if (!user) return;

    try {
      const { error } = await supabase
        .from('company_settings')
        .delete()
        .eq('user_id', user.id);

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

  if (isLoading) {
    return <CompanySettingsFormSkeleton />;
  }

  return (
    <CompanySettingsFormFields
      settings={settings}
      onSettingsChange={setSettings}
      onSave={handleSave}
      onClear={handleClear}
    />
  );
};