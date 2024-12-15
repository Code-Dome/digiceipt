import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Receipt } from "@/types/receipt";
import { format } from "date-fns";
import { useTheme } from "@/contexts/ThemeContext";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { mapDatabaseToReceipt } from "@/utils/receiptMapper";
import { DatabaseReceipt } from "@/types/database";
import { useToast } from "./ui/use-toast";

export const WashingStats: React.FC = () => {
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [washTypeData, setWashTypeData] = useState<any[]>([]);
  const { theme } = useTheme();
  const { session } = useAuth();
  const { toast } = useToast();

  // Determine colors based on theme
  const chartColors = {
    bars: theme === 'dark' ? '#9b87f5' : '#8b5cf6',
    grid: theme === 'dark' ? '#2d2d2d' : '#e5e7eb',
    text: theme === 'dark' ? '#e5e7eb' : '#374151',
  };

  useEffect(() => {
    const fetchStats = async () => {
      if (!session?.user?.id) return;

      try {
        const { data, error } = await supabase
          .from('receipts')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error loading receipts:', error);
          toast({
            title: 'Error loading statistics',
            description: error.message,
            variant: 'destructive',
          });
          return;
        }

        const receipts = (data as DatabaseReceipt[]).map(mapDatabaseToReceipt);
        
        // Process monthly data
        const monthlyStats = receipts.reduce((acc: Record<string, number>, receipt) => {
          const date = new Date(receipt.timestamp);
          if (!isNaN(date.getTime())) {
            const monthYear = format(date, 'MMM yyyy');
            acc[monthYear] = (acc[monthYear] || 0) + 1;
          }
          return acc;
        }, {});

        const monthlyChartData = Object.entries(monthlyStats)
          .map(([month, count]) => ({
            month,
            count,
          }))
          .sort((a, b) => {
            const dateA = new Date(a.month);
            const dateB = new Date(b.month);
            return dateA.getTime() - dateB.getTime();
          });

        // Process wash type data
        const washTypeStats = receipts.reduce((acc: Record<string, number>, receipt) => {
          const type = receipt.washType || 'Unknown';
          acc[type] = (acc[type] || 0) + 1;
          return acc;
        }, {});

        const washTypeChartData = Object.entries(washTypeStats)
          .map(([type, count]) => ({
            type: type || 'Unknown',
            count,
          }))
          .sort((a, b) => b.count - a.count);

        setMonthlyData(monthlyChartData);
        setWashTypeData(washTypeChartData);
      } catch (error) {
        console.error('Error processing stats:', error);
        toast({
          title: 'Error processing statistics',
          description: 'Failed to process receipt statistics',
          variant: 'destructive',
        });
      }
    };

    fetchStats();
  }, [session?.user?.id, toast]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border p-2 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-foreground">{`${label}: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="dark:bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Monthly Washing Statistics</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
              <XAxis 
                dataKey="month" 
                stroke={chartColors.text}
                tick={{ fill: chartColors.text }}
              />
              <YAxis 
                stroke={chartColors.text}
                tick={{ fill: chartColors.text }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="count" 
                fill={chartColors.bars}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="dark:bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Wash Types Distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={washTypeData}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
              <XAxis 
                dataKey="type" 
                stroke={chartColors.text}
                tick={{ fill: chartColors.text }}
              />
              <YAxis 
                stroke={chartColors.text}
                tick={{ fill: chartColors.text }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="count" 
                fill={chartColors.bars}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};