import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useRole } from '@/hooks/useRole';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  LogOut, 
  Search, 
  UserPlus,
  ClipboardList,
  TrendingUp,
  AlertCircle,
  Stethoscope,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { PatientList } from '@/components/admin/PatientList';
import { PatientDetail } from '@/components/admin/PatientDetail';

interface AssignedPatient {
  id: string;
  patient_id: string;
  assigned_at: string;
  notes: string | null;
  profile?: {
    full_name: string | null;
    therapy_sessions_completed: number | null;
    current_streak: number | null;
    therapy_mode: string | null;
  };
}

const TherapistAdmin = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const { isTherapist, isLoading: roleLoading } = useRole();
  
  const [patients, setPatients] = useState<AssignedPatient[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPatients: 0,
    activeSessions: 0,
    averageProgress: 0,
  });

  // Role protection is now handled by ProtectedRoute wrapper

  useEffect(() => {
    const fetchPatients = async () => {
      if (!user || !isTherapist) return;
      
      setIsLoading(true);
      try {
        // Fetch assigned patients
        const { data: assignments, error } = await supabase
          .from('therapist_patient_assignments')
          .select('id, patient_id, assigned_at, notes')
          .eq('therapist_id', user.id);

        if (error) throw error;

        if (assignments && assignments.length > 0) {
          // Fetch profiles for each patient
          const patientIds = assignments.map(a => a.patient_id);
          const { data: profiles } = await supabase
            .from('profiles')
            .select('user_id, full_name, therapy_sessions_completed, current_streak, therapy_mode')
            .in('user_id', patientIds);

          const patientsWithProfiles = assignments.map(assignment => ({
            ...assignment,
            profile: profiles?.find(p => p.user_id === assignment.patient_id),
          }));

          setPatients(patientsWithProfiles);
          
          // Calculate stats
          const totalSessions = profiles?.reduce((sum, p) => sum + (p.therapy_sessions_completed || 0), 0) || 0;
          setStats({
            totalPatients: assignments.length,
            activeSessions: totalSessions,
            averageProgress: profiles?.length ? Math.round(totalSessions / profiles.length) : 0,
          });
        } else {
          setPatients([]);
        }
      } catch (error) {
        console.error('Error fetching patients:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch patient data.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (isTherapist) {
      fetchPatients();
    }
  }, [user, isTherapist]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const filteredPatients = patients.filter(p => 
    p.profile?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.patient_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || !isTherapist) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <span className="text-xl font-bold text-foreground">CareVoice</span>
              <Badge variant="secondary" className="ml-2">Therapist</Badge>
            </div>
          </div>
          <Button variant="ghost" onClick={handleSignOut} className="text-muted-foreground hover:text-foreground">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Therapist Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage your patients and track their progress
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-card border-border shadow-card">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.totalPatients}</p>
                <p className="text-xs text-muted-foreground">Total Patients</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-card">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                <ClipboardList className="w-5 h-5 text-accent-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.activeSessions}</p>
                <p className="text-xs text-muted-foreground">Total Sessions</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-card">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.averageProgress}</p>
                <p className="text-xs text-muted-foreground">Avg Sessions/Patient</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Patient List */}
          <div className="lg:col-span-1">
            <Card className="bg-card border-border shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  My Patients
                </CardTitle>
                <div className="relative mt-2">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search patients..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <PatientList
                  patients={filteredPatients}
                  selectedPatientId={selectedPatientId}
                  onSelectPatient={setSelectedPatientId}
                  isLoading={isLoading}
                />
              </CardContent>
            </Card>
          </div>

          {/* Patient Detail */}
          <div className="lg:col-span-2">
            {selectedPatientId ? (
              <PatientDetail 
                patientId={selectedPatientId} 
                therapistId={user.id}
              />
            ) : (
              <Card className="bg-card border-border shadow-card h-full min-h-[400px] flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Select a patient to view their details</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TherapistAdmin;
