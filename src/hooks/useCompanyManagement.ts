import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Company {
  id: string;
  name: string;
}

export const useCompanyManagement = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchCompanies();
    }
  }, [user]);

  const fetchCompanies = async () => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('id, name')
        .order('name');

      if (error) {
        console.error('Error fetching companies:', error);
        toast({
          title: "Error fetching companies",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setCompanies(data || []);
    } catch (error) {
      console.error('Error in fetchCompanies:', error);
    }
  };

  const addCompany = async (name: string) => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .insert([{ name, user_id: user?.id }])
        .select()
        .single();

      if (error) {
        console.error('Error adding company:', error);
        toast({
          title: "Error adding company",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setCompanies([...companies, data]);
      toast({
        title: "Company added",
        description: `${name} has been added to the list.`,
      });
    } catch (error) {
      console.error('Error in addCompany:', error);
    }
  };

  const removeCompany = async (id: string) => {
    try {
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error removing company:', error);
        toast({
          title: "Error removing company",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setCompanies(companies.filter(company => company.id !== id));
      toast({
        title: "Company removed",
        description: "Company has been removed from the list.",
      });
    } catch (error) {
      console.error('Error in removeCompany:', error);
    }
  };

  return {
    companies,
    addCompany,
    removeCompany,
  };
};