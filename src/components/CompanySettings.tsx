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