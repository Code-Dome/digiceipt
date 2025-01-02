import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCompanyManagement } from "@/hooks/useCompanyManagement";
import { Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export const CompanyManagement = () => {
  const [newCompanyName, setNewCompanyName] = useState("");
  const { companies, addCompany, removeCompany } = useCompanyManagement();
  const { toast } = useToast();

  const handleAddCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompanyName.trim()) {
      toast({
        title: "Error",
        description: "Company name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    await addCompany(newCompanyName.trim());
    setNewCompanyName("");
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-violet-700 dark:text-violet-400">
          Company Management
        </h2>
        
        <form onSubmit={handleAddCompany} className="flex gap-2 mb-6">
          <Input
            type="text"
            value={newCompanyName}
            onChange={(e) => setNewCompanyName(e.target.value)}
            placeholder="Enter company name"
            className="flex-1"
          />
          <Button type="submit">Add Company</Button>
        </form>

        <div className="space-y-2">
          {companies.map((company) => (
            <div
              key={company.id}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md"
            >
              <span>{company.name}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeCompany(company.id)}
                className="text-destructive hover:text-destructive/90"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};