import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { CompanySettings as CompanySettingsType } from "@/types/companySettings";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Save, Trash2 } from "lucide-react";
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

export const CompanySettingsForm = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [settings, setSettings] = useState<CompanySettingsType>({
    companyName: "",
    address: "",
    termsAndConditions: ""
  });

  useEffect(() => {
    const loadSettings = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('company_settings')
        .select('company_name, address, terms_and_conditions')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error loading settings:', error);
        toast({
          title: "Error loading settings",
          description: "Failed to load company settings.",
          variant: "destructive"
        });
        return;
      }

      if (data) {
        setSettings({
          companyName: data.company_name || "",
          address: data.address || "",
          termsAndConditions: data.terms_and_conditions || ""
        });
      }
    };

    loadSettings();
  }, [user]);

  const handleSave = async () => {
    try {
      // First, delete any existing settings for this user
      await supabase
        .from('company_settings')
        .delete()
        .eq('user_id', user?.id);

      // Then insert the new settings
      const { error } = await supabase
        .from('company_settings')
        .insert({
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
        .delete()
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

  return (
    <div className="space-y-6">
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
    </div>
  );
};