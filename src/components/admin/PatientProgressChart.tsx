import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SessionData {
  id: string;
  created_at: string;
  duration_minutes: number;
  exercises_completed: number;
  accuracy_score: number | null;
}

interface PatientProgressChartProps {
  sessions: SessionData[];
}

export const PatientProgressChart = ({ sessions }: PatientProgressChartProps) => {
  if (sessions.length === 0) {
    return (
      <div className="h-[250px] flex items-center justify-center text-muted-foreground">
        No session data available
      </div>
    );
  }

  // Prepare chart data (reverse to show oldest first)
  const chartData = [...sessions]
    .reverse()
    .slice(-10) // Last 10 sessions
    .map((session, index) => ({
      name: new Date(session.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      accuracy: session.accuracy_score || 0,
      exercises: session.exercises_completed,
    }));

  return (
    <div className="h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="name" 
            stroke="hsl(var(--muted-foreground))" 
            fontSize={12}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))" 
            fontSize={12}
            domain={[0, 100]}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
            }}
            labelStyle={{ color: 'hsl(var(--foreground))' }}
          />
          <Line
            type="monotone"
            dataKey="accuracy"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2 }}
            name="Accuracy %"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
