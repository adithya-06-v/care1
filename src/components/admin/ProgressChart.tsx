import { useEffect, useState } from 'react';
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
} from 'recharts';
import { supabase } from '@/integrations/supabase/client';

export interface ProgressChartProps {
  patientId: string;
}

type ChartPoint = {
  date: string;
  score: number;
};

/** Video session scores over time from completed appointments (therapist dashboard). */
export function ProgressChart({ patientId }: ProgressChartProps) {
  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('appointments')
        .select('created_at, score')
        .eq('user_id', patientId)
        .eq('status', 'completed')
        .order('created_at', { ascending: true });

      if (error) {
        console.error(error);
        if (!cancelled) {
          setChartData([]);
          setLoading(false);
        }
        return;
      }

      const points: ChartPoint[] = (data ?? []).map((item) => ({
        date: new Date(item.created_at).toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
        }),
        score: item.score ?? 0,
      }));

      if (!cancelled) {
        setChartData(points);
        setLoading(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [patientId]);

  if (loading) {
    return (
      <div className="flex h-[280px] items-center justify-center text-sm text-muted-foreground">
        Loading chart…
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="flex h-[280px] flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted/20 px-4 text-center text-muted-foreground">
        <p className="font-medium text-foreground">No video session scores yet</p>
        <p className="max-w-sm text-sm">
          Scores appear after completed therapy calls. End a video session to record progress here.
        </p>
      </div>
    );
  }

  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="scoreFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
            tickLine={false}
            axisLine={{ stroke: 'hsl(var(--border))' }}
          />
          <YAxis
            dataKey="score"
            domain={[0, 100]}
            tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
            tickLine={false}
            axisLine={{ stroke: 'hsl(var(--border))' }}
            width={36}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '10px',
              boxShadow: '0 10px 40px -10px rgb(0 0 0 / 0.2)',
            }}
            labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 600 }}
            formatter={(value: number) => [`${value}`, 'Score']}
          />
          <Area
            type="monotone"
            dataKey="score"
            stroke="none"
            fill="url(#scoreFill)"
            fillOpacity={1}
          />
          <Line
            type="monotone"
            dataKey="score"
            stroke="hsl(var(--primary))"
            strokeWidth={2.5}
            dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
            name="Session score"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
