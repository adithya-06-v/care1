import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';

interface DailyScore {
  date: string;
  score: number;
  sessions: number;
}

interface WeeklyChartProps {
  userId: string;
}

export const WeeklyChart = ({ userId }: WeeklyChartProps) => {
  const [data, setData] = useState<DailyScore[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWeeklyData = async () => {
      const today = new Date();
      const weekAgo = subDays(today, 6);

      // Get all sessions from the past week
      const { data: sessions, error } = await supabase
        .from('sessions')
        .select('created_at, accuracy_score')
        .eq('user_id', userId)
        .gte('created_at', startOfDay(weekAgo).toISOString())
        .lte('created_at', endOfDay(today).toISOString())
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching weekly data:', error);
        setIsLoading(false);
        return;
      }

      // Group by date and calculate averages
      const dailyMap = new Map<string, { total: number; count: number }>();
      
      // Initialize all 7 days
      for (let i = 6; i >= 0; i--) {
        const date = format(subDays(today, i), 'yyyy-MM-dd');
        dailyMap.set(date, { total: 0, count: 0 });
      }

      // Aggregate scores
      sessions?.forEach(session => {
        const date = format(new Date(session.created_at), 'yyyy-MM-dd');
        const existing = dailyMap.get(date) || { total: 0, count: 0 };
        dailyMap.set(date, {
          total: existing.total + (Number(session.accuracy_score) || 0),
          count: existing.count + 1,
        });
      });

      // Convert to array
      const chartData: DailyScore[] = [];
      dailyMap.forEach((value, key) => {
        chartData.push({
          date: format(new Date(key), 'EEE'),
          score: value.count > 0 ? Math.round(value.total / value.count) : 0,
          sessions: value.count,
        });
      });

      setData(chartData);
      setIsLoading(false);
    };

    if (userId) {
      fetchWeeklyData();
    }
  }, [userId]);

  if (isLoading) {
    return (
      <Card className="bg-card border-border shadow-card">
        <CardContent className="p-6 flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  const hasData = data.some(d => d.score > 0);

  return (
    <Card className="bg-card border-border shadow-card">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-foreground text-base">
          <TrendingUp className="w-5 h-5 text-primary" />
          Weekly Pronunciation Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        {hasData ? (
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="date" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                domain={[0, 100]} 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
                formatter={(value: number, name: string) => [
                  `${value}%`,
                  name === 'score' ? 'Avg Score' : name,
                ]}
              />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2 }}
                activeDot={{ r: 6, fill: 'hsl(var(--primary))' }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[180px] flex items-center justify-center text-muted-foreground">
            <p>Complete sessions to see your weekly progress</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
