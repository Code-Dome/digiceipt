import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useToast } from "./ui/use-toast";
import { format, parseISO, startOfHour, endOfHour } from "date-fns";

export const TimeStats = () => {
  const [timeData, setTimeData] = useState<any[]>([]);
  const { theme } = useTheme();
  const { session } = useAuth();
  const { toast } = useToast();

  const chartColors = {
    line: theme === 'dark' ? '#9b87f5' : '#8b5cf6',
    grid: theme === 'dark' ? '#2d2d2d' : '#e5e7eb',
    text: theme === 'dark' ? '#e5e7eb' : '#374151',
  };

  useEffect(() => {
    const fetchStats = async () => {
      if (!session?.user?.id) return;

      try {
        const { data, error } = await supabase
          .from('receipts')
          .select('timestamp')
          .order('timestamp', { ascending: true });

        if (error) {
          console.error('Error loading time stats:', error);
          toast({
            title: 'Error loading time statistics',
            description: error.message,
            variant: 'destructive',
          });
          return;
        }

        const timeStats = data.reduce((acc: Record<string, number>, receipt) => {
          const hour = format(parseISO(receipt.timestamp), 'HH:00');
          acc[hour] = (acc[hour] || 0) + 1;
          return acc;
        }, {});

        const chartData = Object.entries(timeStats)
          .map(([hour, count]) => ({
            hour,
            count,
          }))
          .sort((a, b) => a.hour.localeCompare(b.hour));

        setTimeData(chartData);
      } catch (error) {
        console.error('Error processing time stats:', error);
      }
    };

    fetchStats();
  }, [session?.user?.id, toast]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border p-2 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-foreground">
            {`${label}: ${payload[0].value} receipts`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="dark:bg-card">
      <CardHeader>
        <CardTitle className="text-foreground">Receipt Creation Time Distribution</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={timeData}>
            <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
            <XAxis
              dataKey="hour"
              stroke={chartColors.text}
              tick={{ fill: chartColors.text }}
            />
            <YAxis
              stroke={chartColors.text}
              tick={{ fill: chartColors.text }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="count"
              stroke={chartColors.line}
              strokeWidth={2}
              dot={{ fill: chartColors.line }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};