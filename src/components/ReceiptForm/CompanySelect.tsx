import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCompanyManagement } from "@/hooks/useCompanyManagement";

interface CompanySelectProps {
  value: string;
  onChange: (value: string) => void;
}

export const CompanySelect = ({ value, onChange }: CompanySelectProps) => {
  const { companies } = useCompanyManagement();

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="bg-white dark:bg-gray-800">
        <SelectValue placeholder="Select company" />
      </SelectTrigger>
      <SelectContent>
        {companies.map((company) => (
          <SelectItem key={company.id} value={company.name}>
            {company.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};