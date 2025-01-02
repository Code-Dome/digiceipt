import { Building } from "lucide-react";
import { Card } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { CompanySettingsForm } from "./settings/CompanySettingsForm";

export const CompanySettings = () => {
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
        <div className="p-4 sm:p-6">
          <CompanySettingsForm />
        </div>
      </ScrollArea>
    </Card>
  );
};