import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import {
  User,
  Activity,
  Target,
  AlertCircle,
  Plus,
  TrendingUp,
  Clock,
  Flame,
  BookOpen,
} from 'lucide-react';
import { AssignExerciseDialog } from './AssignExerciseDialog';
import { PatientProgressChart } from './PatientProgressChart';

interface PatientDetailProps {
  patientId: string;
  therapistId: string;
}

interface PatientProfile {
  full_name: string | null;
  therapy_sessions_completed: number | null;
  total_practice_minutes: number | null;
  current_streak: number | null;
  therapy_mode: string | null;
  difficulty: string | null;
  goals: string[] | null;
}

interface SessionData {
  id: string;
  created_at: string;
  duration_minutes: number;
  exercises_completed: number;
  accuracy_score: number | null;
}

interface WeakWord {
  exercise_text: string;
  avg_score: number;
  attempts: number;
}

interface CustomExercise {
  id: string;
  title: string;
  content: string;
  is_completed: boolean;
  created_at: string;
}

export const PatientDetail = ({ patientId, therapistId }: PatientDetailProps) => {
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [weakWords, setWeakWords] = useState<WeakWord[]>([]);
  const [customExercises, setCustomExercises] = useState<CustomExercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAssignDialog, setShowAssignDialog] = useState(false);

  useEffect(() => {
    const fetchPatientData = async () => {
      setIsLoading(true);
      try {
        // Fetch profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('full_name, therapy_sessions_completed, total_practice_minutes, current_streak, therapy_mode, difficulty, goals')
          .eq('user_id', patientId)
          .maybeSingle();

        setProfile(profileData);

        // Fetch sessions
        const { data: sessionsData } = await supabase
          .from('sessions')
          .select('id, created_at, duration_minutes, exercises_completed, accuracy_score')
          .eq('user_id', patientId)
          .order('created_at', { ascending: false })
          .limit(20);

        setSessions(sessionsData || []);

        // Fetch weak words from exercise_results
        const { data: exerciseData } = await supabase
          .from('exercise_results')
          .select('exercise_text, score')
          .eq('user_id', patientId)
          .lt('score', 70);

        if (exerciseData) {
          // Group by exercise_text and calculate averages
          const wordMap = new Map<string, { total: number; count: number }>();
          exerciseData.forEach(result => {
            const text = result.exercise_text.trim();
            const existing = wordMap.get(text) || { total: 0, count: 0 };
            wordMap.set(text, {
              total: existing.total + (Number(result.score) || 0),
              count: existing.count + 1,
            });
          });

          const words: WeakWord[] = [];
          wordMap.forEach((value, key) => {
            words.push({
              exercise_text: key,
              avg_score: Math.round(value.total / value.count),
              attempts: value.count,
            });
          });
          words.sort((a, b) => b.attempts - a.attempts);
          setWeakWords(words.slice(0, 10));
        }

        // Fetch custom exercises
        const { data: customData } = await supabase
          .from('custom_exercises')
          .select('id, title, content, is_completed, created_at')
          .eq('patient_id', patientId)
          .eq('therapist_id', therapistId)
          .order('created_at', { ascending: false });

        setCustomExercises(customData || []);

      } catch (error) {
        console.error('Error fetching patient data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load patient data.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatientData();
  }, [patientId, therapistId]);

  const handleExerciseAssigned = () => {
    // Refresh custom exercises
    supabase
      .from('custom_exercises')
      .select('id, title, content, is_completed, created_at')
      .eq('patient_id', patientId)
      .eq('therapist_id', therapistId)
      .order('created_at', { ascending: false })
      .then(({ data }) => setCustomExercises(data || []));
  };

  if (isLoading) {
    return (
      <Card className="bg-card border-border shadow-card h-full min-h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </Card>
    );
  }

  if (!profile) {
    return (
      <Card className="bg-card border-border shadow-card h-full min-h-[400px] flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Could not load patient data</p>
        </div>
      </Card>
    );
  }

  const avgAccuracy = sessions.length > 0
    ? Math.round(sessions.reduce((sum, s) => sum + (s.accuracy_score || 0), 0) / sessions.length)
    : 0;

  return (
    <div className="space-y-4">
      {/* Patient Header */}
      <Card className="bg-card border-border shadow-card">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">{profile.full_name || 'Unknown'}</h2>
                <div className="flex items-center gap-2 mt-1">
                  {profile.therapy_mode && (
                    <Badge variant="secondary" className="capitalize">
                      {profile.therapy_mode.replace('_', ' ')}
                    </Badge>
                  )}
                  {profile.difficulty && (
                    <Badge variant="outline" className="capitalize">
                      {profile.difficulty}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <Button onClick={() => setShowAssignDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Assign Exercise
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-primary">
                <Activity className="w-4 h-4" />
                <span className="text-2xl font-bold">{profile.therapy_sessions_completed || 0}</span>
              </div>
              <p className="text-xs text-muted-foreground">Sessions</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-accent-foreground">
                <Clock className="w-4 h-4" />
                <span className="text-2xl font-bold">{profile.total_practice_minutes || 0}</span>
              </div>
              <p className="text-xs text-muted-foreground">Minutes</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-orange-500">
                <Flame className="w-4 h-4" />
                <span className="text-2xl font-bold">{profile.current_streak || 0}</span>
              </div>
              <p className="text-xs text-muted-foreground">Day Streak</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-green-500">
                <Target className="w-4 h-4" />
                <span className="text-2xl font-bold">{avgAccuracy}%</span>
              </div>
              <p className="text-xs text-muted-foreground">Avg Accuracy</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="progress" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="weak-words">Weak Words</TabsTrigger>
          <TabsTrigger value="exercises">Assigned</TabsTrigger>
        </TabsList>

        <TabsContent value="progress">
          <Card className="bg-card border-border shadow-card">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Progress Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PatientProgressChart sessions={sessions} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions">
          <Card className="bg-card border-border shadow-card">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Session History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                {sessions.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No sessions yet</p>
                ) : (
                  <div className="space-y-3">
                    {sessions.map((session) => (
                      <div
                        key={session.id}
                        className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-foreground">
                            {new Date(session.created_at).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {session.duration_minutes} min • {session.exercises_completed} exercises
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold ${
                            (session.accuracy_score || 0) >= 80 ? 'text-green-500' :
                            (session.accuracy_score || 0) >= 60 ? 'text-yellow-500' : 'text-red-500'
                          }`}>
                            {session.accuracy_score ? `${Math.round(session.accuracy_score)}%` : '—'}
                          </p>
                          <p className="text-xs text-muted-foreground">Accuracy</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weak-words">
          <Card className="bg-card border-border shadow-card">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-500" />
                Problematic Words
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                {weakWords.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No weak words detected</p>
                ) : (
                  <div className="space-y-3">
                    {weakWords.map((word, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-orange-500/10 rounded-lg border border-orange-500/20"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{word.exercise_text}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Progress value={word.avg_score} className="h-1.5 flex-1 max-w-[100px]" />
                            <span className="text-xs text-muted-foreground">{word.avg_score}%</span>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-orange-600 border-orange-500/30">
                          {word.attempts} attempts
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exercises">
          <Card className="bg-card border-border shadow-card">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Assigned Exercises
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                {customExercises.length === 0 ? (
                  <div className="text-center py-8">
                    <BookOpen className="w-8 h-8 mx-auto mb-2 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground">No custom exercises assigned</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-3"
                      onClick={() => setShowAssignDialog(true)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Assign First Exercise
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {customExercises.map((exercise) => (
                      <div
                        key={exercise.id}
                        className={`p-3 rounded-lg border ${
                          exercise.is_completed 
                            ? 'bg-green-500/10 border-green-500/20' 
                            : 'bg-muted/30 border-border'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-foreground">{exercise.title}</p>
                          <Badge variant={exercise.is_completed ? 'default' : 'outline'}>
                            {exercise.is_completed ? 'Completed' : 'Pending'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{exercise.content}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Assigned {new Date(exercise.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Assign Exercise Dialog */}
      <AssignExerciseDialog
        open={showAssignDialog}
        onOpenChange={setShowAssignDialog}
        patientId={patientId}
        therapistId={therapistId}
        onExerciseAssigned={handleExerciseAssigned}
      />
    </div>
  );
};
