import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

export interface Company {
  id: string;
  name: string;
}

export const useCompanyManagement = () => {
  const [companies, setCompanies] = useState<Company[]>(() => {
    const saved = localStorage.getItem('companies');
    return saved ? JSON.parse(saved) : [];
  });
  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem('companies', JSON.stringify(companies));
  }, [companies]);

  const addCompany = (name: string) => {
    const newCompany = {
      id: crypto.randomUUID(),
      name,
    };
    setCompanies([...companies, newCompany]);
    toast({
      title: "Company added",
      description: `${name} has been added to the list.`,
    });
  };

  const removeCompany = (id: string) => {
    setCompanies(companies.filter(company => company.id !== id));
    toast({
      title: "Company removed",
      description: "Company has been removed from the list.",
    });
  };

  return {
    companies,
    addCompany,
    removeCompany,
  };
};