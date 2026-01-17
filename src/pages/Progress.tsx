import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ArrowLeft, 
  Trophy, 
  Clock, 
  Target, 
  TrendingUp,
  Calendar,
  BarChart3
} from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { format } from 'date-fns';

interface Session {
  id: string;
  duration_minutes: number;
  exercises_completed: number;
  accuracy_score: number;
  created_at: string;
}

interface Stats {
  totalSessions: number;
  totalMinutes: number;
  averageAccuracy: number;
  currentStreak: number;
}

const Progress = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalSessions: 0,
    totalMinutes: 0,
    averageAccuracy: 0,
    currentStreak: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      // Fetch sessions
      const { data: sessionsData, error: sessionsError } = await supabase
        .from('sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (sessionsData && !sessionsError) {
        setSessions(sessionsData);

        // Calculate stats
        const totalSessions = sessionsData.length;
        const totalMinutes = sessionsData.reduce((sum, s) => sum + (s.duration_minutes || 0), 0);
        const avgAccuracy = totalSessions > 0
          ? sessionsData.reduce((sum, s) => sum + (Number(s.accuracy_score) || 0), 0) / totalSessions
          : 0;

        // Fetch streak from profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('current_streak')
          .eq('user_id', user.id)
          .maybeSingle();

        setStats({
          totalSessions,
          totalMinutes,
          averageAccuracy: Math.round(avgAccuracy),
          currentStreak: profileData?.current_streak || 0,
        });
      }

      setIsLoading(false);
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  const formatPracticeTime = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours} hrs`;
  };

  // Prepare chart data
  const accuracyTrendData = sessions
    .slice(0, 10)
    .reverse()
    .map((session, index) => ({
      session: `#${index + 1}`,
      accuracy: Number(session.accuracy_score) || 0,
    }));

  const weeklyData = sessions.slice(0, 7).map((session) => ({
    day: format(new Date(session.created_at), 'EEE'),
    minutes: session.duration_minutes,
  })).reverse();

  const chartConfig = {
    accuracy: { label: 'Accuracy', color: 'hsl(var(--primary))' },
    minutes: { label: 'Minutes', color: 'hsl(var(--primary))' },
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <span className="text-xl font-bold text-foreground">Your Progress</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-card border-border shadow-card">
              <CardContent className="p-4 text-center">
                <Trophy className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">{stats.totalSessions}</p>
                <p className="text-xs text-muted-foreground">Sessions</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-card border-border shadow-card">
              <CardContent className="p-4 text-center">
                <Clock className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">{formatPracticeTime(stats.totalMinutes)}</p>
                <p className="text-xs text-muted-foreground">Practice Time</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-card border-border shadow-card">
              <CardContent className="p-4 text-center">
                <Target className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">{stats.averageAccuracy}%</p>
                <p className="text-xs text-muted-foreground">Avg Accuracy</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-card border-border shadow-card">
              <CardContent className="p-4 text-center">
                <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">{stats.currentStreak}</p>
                <p className="text-xs text-muted-foreground">Day Streak</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Accuracy Trend Chart */}
        {accuracyTrendData.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="bg-card border-border shadow-card mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Accuracy Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[200px] w-full">
                  <LineChart data={accuracyTrendData}>
                    <XAxis dataKey="session" />
                    <YAxis domain={[0, 100]} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="accuracy"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--primary))' }}
                    />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Practice Time Chart */}
        {weeklyData.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="bg-card border-border shadow-card mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Recent Practice
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[200px] w-full">
                  <BarChart data={weeklyData}>
                    <XAxis dataKey="day" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="minutes" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Session History */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="bg-card border-border shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Session History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {sessions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No sessions yet. Start practicing!</p>
                  <Button 
                    onClick={() => navigate('/dashboard')} 
                    className="mt-4 shadow-button"
                  >
                    Start Session
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {sessions.slice(0, 10).map((session, index) => (
                    <motion.div
                      key={session.id}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex items-center justify-between p-4 bg-muted/30 rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Trophy className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {session.duration_minutes} min session
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(session.created_at), 'MMM d, yyyy • h:mm a')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-bold ${
                          Number(session.accuracy_score) >= 80 
                            ? 'text-green-500' 
                            : Number(session.accuracy_score) >= 60 
                            ? 'text-yellow-500' 
                            : 'text-orange-500'
                        }`}>
                          {Math.round(Number(session.accuracy_score))}%
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {session.exercises_completed} exercises
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default Progress;
