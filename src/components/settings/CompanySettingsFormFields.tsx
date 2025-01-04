import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
import { CompanySettings } from "@/types/companySettings";

interface CompanySettingsFormFieldsProps {
  settings: CompanySettings;
  onSettingsChange: (settings: CompanySettings) => void;
  onSave: () => Promise<void>;
  onClear: () => Promise<void>;
}

export const CompanySettingsFormFields = ({
  settings,
  onSettingsChange,
  onSave,
  onClear,
}: CompanySettingsFormFieldsProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="companyName">Company Name</Label>
        <Input
          id="companyName"
          value={settings.companyName}
          onChange={(e) => onSettingsChange({ ...settings, companyName: e.target.value })}
          placeholder="Enter company name"
          className="bg-background"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Textarea
          id="address"
          value={settings.address}
          onChange={(e) => onSettingsChange({ ...settings, address: e.target.value })}
          placeholder="Enter company address"
          className="bg-background resize-none h-24"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="termsAndConditions">Terms & Conditions</Label>
        <Textarea
          id="termsAndConditions"
          value={settings.termsAndConditions}
          onChange={(e) => onSettingsChange({ ...settings, termsAndConditions: e.target.value })}
          placeholder="Enter terms and conditions"
          className="bg-background resize-none h-48"
        />
      </div>

      <div className="flex gap-2">
        <Button 
          onClick={onSave}
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
              <AlertDialogAction onClick={onClear} className="bg-destructive text-destructive-foreground">
                Clear Settings
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};