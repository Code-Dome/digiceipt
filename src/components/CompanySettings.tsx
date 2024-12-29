import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { useToast } from "./ui/use-toast";
import { CompanySettings as CompanySettingsType } from "@/types/companySettings";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Building, Save } from "lucide-react";
import { Card } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";

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
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setSettings({
          companyName: data.company_name || "",
          address: data.address || "",
          termsAndConditions: data.terms_and_conditions || ""
        });
      } else {
        // If no settings exist, create default settings
        const { error: insertError } = await supabase
          .from('company_settings')
          .insert({
            user_id: user?.id,
            company_name: "",
            address: "",
            terms_and_conditions: ""
          });

        if (insertError) {
          console.error('Error creating default settings:', insertError);
          toast({
            title: "Error creating settings",
            description: "Failed to create default company settings.",
            variant: "destructive"
          });
        }
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
    <Card className="bg-background border border-border">
      <div className="p-4 md:p-6 border-b border-border">
        <div className="flex items-center gap-2">
          <Building className="w-5 h-5 text-primary" />
          <h2 className="text-xl md:text-2xl font-bold text-foreground">
            Company Settings
          </h2>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-300px)]">
        <div className="p-4 md:p-6 space-y-6">
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

          <Button 
            onClick={handleSave}
            className="w-full"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </ScrollArea>
    </Card>
  );
};