import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { useToast } from "./ui/use-toast";
import { CompanySettings as CompanySettingsType } from "@/types/companySettings";

export const CompanySettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<CompanySettingsType>({
    companyName: "",
    address: "",
    termsAndConditions: ""
  });

  useEffect(() => {
    const savedSettings = localStorage.getItem('companySettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('companySettings', JSON.stringify(settings));
    toast({
      title: "Settings saved",
      description: "Company settings have been updated successfully."
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="companyName">Company Name</Label>
        <Input
          id="companyName"
          value={settings.companyName}
          onChange={(e) => setSettings(prev => ({ ...prev, companyName: e.target.value }))}
          placeholder="Enter company name"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          value={settings.address}
          onChange={(e) => setSettings(prev => ({ ...prev, address: e.target.value }))}
          placeholder="Enter company address"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="termsAndConditions">Terms & Conditions</Label>
        <Textarea
          id="termsAndConditions"
          value={settings.termsAndConditions}
          onChange={(e) => setSettings(prev => ({ ...prev, termsAndConditions: e.target.value }))}
          placeholder="Enter terms and conditions"
          className="min-h-[100px]"
        />
      </div>

      <Button onClick={handleSave} className="w-full">
        Save Settings
      </Button>
    </div>
  );
};