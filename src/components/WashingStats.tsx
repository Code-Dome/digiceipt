import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Receipt } from "@/types/receipt";
import { format, parse } from "date-fns";

export const WashingStats: React.FC = () => {
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [washTypeData, setWashTypeData] = useState<any[]>([]);

  useEffect(() => {
    const receipts: Receipt[] = JSON.parse(localStorage.getItem("receipts") || "[]");
    
    // Process monthly data
    const monthlyStats = receipts.reduce((acc: Record<string, number>, receipt) => {
      try {
        // Parse the date from dd/MM/yyyy format
        const [day, month, year] = receipt.timestamp.split('/');
        const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        
        if (!isNaN(date.getTime())) {
          const monthYear = format(date, 'MMM yyyy');
          acc[monthYear] = (acc[monthYear] || 0) + 1;
        }
      } catch (error) {
        console.error('Error processing date:', receipt.timestamp);
      }
      return acc;
    }, {});

    const monthlyChartData = Object.entries(monthlyStats)
      .map(([month, count]) => ({
        month,
        count,
      }))
      .sort((a, b) => {
        const parseMonth = (str: string) => parse(str, 'MMM yyyy', new Date());
        return parseMonth(a.month).getTime() - parseMonth(b.month).getTime();
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
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Monthly Washing Statistics</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Wash Types Distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={washTypeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};