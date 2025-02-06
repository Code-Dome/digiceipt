
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export interface Company {
  id: string;
  name: string;
}

export const useCompanyManagement = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (user) {
      fetchCompanies();
    }
  }, [user, isAuthenticated, navigate]);

  const fetchCompanies = async () => {
    try {
      if (!user) {
        console.error('No authenticated user found');
        return;
      }

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
      if (!user) {
        console.error('No authenticated user found');
        toast({
          title: "Authentication Error",
          description: "You must be logged in to add a company",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from('companies')
        .insert([{ name, user_id: user.id }])
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
      if (!user) {
        console.error('No authenticated user found');
        toast({
          title: "Authentication Error",
          description: "You must be logged in to remove a company",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id); // Ensure we can only delete our own companies

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
