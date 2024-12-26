import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useToast } from "./ui/use-toast";

export const CompanyStats = () => {
  const [companyData, setCompanyData] = useState<any[]>([]);
  const { theme } = useTheme();
  const { session } = useAuth();
  const { toast } = useToast();

  const COLORS = ['#8b5cf6', '#6366f1', '#ec4899', '#14b8a6', '#f59e0b'];

  useEffect(() => {
    const fetchStats = async () => {
      if (!session?.user?.id) return;

      try {
        const { data, error } = await supabase
          .from('receipts')
          .select('company_name')
          .not('company_name', 'is', null);

        if (error) {
          console.error('Error loading company stats:', error);
          toast({
            title: 'Error loading company statistics',
            description: error.message,
            variant: 'destructive',
          });
          return;
        }

        const companyStats = data.reduce((acc: Record<string, number>, receipt) => {
          const company = receipt.company_name || 'Unknown';
          acc[company] = (acc[company] || 0) + 1;
          return acc;
        }, {});

        const chartData = Object.entries(companyStats)
          .map(([name, value]) => ({
            name,
            value,
          }))
          .sort((a, b) => b.value - a.value);

        setCompanyData(chartData);
      } catch (error) {
        console.error('Error processing company stats:', error);
      }
    };

    fetchStats();
  }, [session?.user?.id, toast]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border p-2 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-foreground">
            {`${payload[0].name}: ${payload[0].value} receipts`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="dark:bg-card">
      <CardHeader>
        <CardTitle className="text-foreground">Company Distribution</CardTitle>
      </CardHeader>
      <CardContent className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={companyData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={150}
              fill="#8b5cf6"
              label
            >
              {companyData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};