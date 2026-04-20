import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useRole } from '@/hooks/useRole';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Users,
  LogOut,
  Search,
  ClipboardList,
  TrendingUp,
  Stethoscope,
  UserRound,
  History,
  User,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { PatientDetail } from '@/components/admin/PatientDetail';
import type { Database } from '@/integrations/supabase/types';

type AppointmentRow = Database['public']['Tables']['appointments']['Row'];

type BookingRequestRow = AppointmentRow & {
  patientName: string | null;
  patientEmail: string | null;
};

type TherapistSessionRow = AppointmentRow & {
  patientName: string | null;
  patientEmail: string | null;
};

function formatDurationSeconds(seconds: number | null | undefined): string {
  if (seconds == null || seconds <= 0) return '—';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

function bookingInitials(name: string | null | undefined, userId: string) {
  const n = name?.trim();
  if (n) {
    const parts = n.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0]![0]!}${parts[parts.length - 1]![0]!}`.toUpperCase();
    }
    return n.slice(0, 2).toUpperCase();
  }
  return userId.replace(/-/g, '').slice(0, 2).toUpperCase();
}

/** Grouped patient row from appointments + profiles (see fetchPatients) */
type ProfileSnippet = {
  id: string;
  full_name: string | null;
  email: string | null;
};

type TherapistPatient = {
  user_id: string;
  profiles: ProfileSnippet | null;
  session_count: number;
};

const TherapistAdmin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading: authLoading, signOut } = useAuth();
  const { isTherapist, isLoading: roleLoading } = useRole();
  
  const [patients, setPatients] = useState<TherapistPatient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<TherapistPatient | null>(null);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalSessions: 0,
    avgSessions: 0,
  });
  const [requests, setRequests] = useState<BookingRequestRow[]>([]);
  const [activeSession, setActiveSession] = useState<AppointmentRow | null>(null);
  const [mySessions, setMySessions] = useState<TherapistSessionRow[]>([]);
  const [sessionNotesOpen, setSessionNotesOpen] = useState(false);
  const [sessionNotesRoomId, setSessionNotesRoomId] = useState<string | null>(null);
  const [sessionNotesText, setSessionNotesText] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

  // Role protection is now handled by ProtectedRoute wrapper

  const fetchStats = useCallback(async () => {
    if (!user) return;

    const { data: sessions, error } = await supabase
      .from('appointments')
      .select('user_id')
      .eq('therapist_id', user.id)
      .eq('status', 'completed');

    if (error) {
      console.error('fetchStats:', error);
      return;
    }

    const list = sessions ?? [];
    const uniquePatients = new Set(list.map((s) => s.user_id));
    const totalSessions = list.length;
    const totalPatients = uniquePatients.size;

    setStats({
      totalPatients,
      totalSessions,
      avgSessions:
        totalPatients > 0
          ? Math.round((totalSessions / totalPatients) * 10) / 10
          : 0,
    });
  }, [user]);

  const fetchMySessions = useCallback(async () => {
    if (!user?.id || !isTherapist) return;

    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('therapist_id', user.id)
      .eq('status', 'completed')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('fetchMySessions:', error);
      return;
    }

    const rows = data ?? [];
    const userIds = [...new Set(rows.map((r) => r.user_id))];
    if (userIds.length === 0) {
      setMySessions([]);
      return;
    }

    const { data: profiles, error: profErr } = await supabase
      .from('profiles')
      .select('user_id, full_name, email')
      .in('user_id', userIds);

    if (profErr) {
      console.error('PROFILE FETCH ERROR:', profErr.message);
    }

    const profileByUserId = new Map(
      (profiles ?? []).map((p) => [p.user_id, p] as const),
    );

    setMySessions(
      rows.map((r) => {
        const p = profileByUserId.get(r.user_id);
        return {
          ...r,
          patientName: p?.full_name ?? null,
          patientEmail: p?.email ?? null,
        };
      }),
    );
  }, [user?.id, isTherapist]);

  const fetchStatsRef = useRef(fetchStats);
  fetchStatsRef.current = fetchStats;

  const fetchMySessionsRef = useRef(fetchMySessions);
  fetchMySessionsRef.current = fetchMySessions;

  const fetchPatients = useCallback(async () => {
    if (!user || !isTherapist) return;

    setIsLoading(true);
    try {
      const applySelection = (list: TherapistPatient[]) => {
        setPatients(list);
        setSelectedPatient((prev) => {
          if (!prev) return null;
          return list.find((x) => x.user_id === prev.user_id) ?? prev;
        });
      };

      const { data, error } = await supabase
        .from('appointments')
        .select(
          `
          id,
          user_id,
          created_at,
          status,
          profiles:profiles!appointments_user_id_fkey (
            id,
            full_name,
            email
          )
        `,
        )
        .eq('therapist_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('PROFILE FETCH ERROR:', error.message);
        return;
      }

      console.log('APPOINTMENTS DATA:', data);

      type Row = {
        user_id: string;
        status: string;
        profiles: ProfileSnippet | ProfileSnippet[] | null;
      };

      const rawRows = (data ?? []) as Row[];
      const rows = rawRows.filter(
        (r) => r.status === 'accepted' || r.status === 'completed',
      );

      if (rows.length === 0) {
        setPatients([]);
        setSelectedPatient(null);
        return;
      }

      function normalizeProfile(
        raw: ProfileSnippet | ProfileSnippet[] | null | undefined,
      ): ProfileSnippet | null {
        if (raw == null) return null;
        const one = Array.isArray(raw) ? raw[0] : raw;
        if (!one || typeof one !== 'object') return null;
        return {
          id: String(one.id),
          full_name: one.full_name ?? null,
          email: one.email ?? null,
        };
      }

      const patientsMap = new Map<string, TherapistPatient>();
      for (const item of rows) {
        const uid = item.user_id;
        const prof = normalizeProfile(item.profiles);
        const existing = patientsMap.get(uid);
        if (!existing) {
          patientsMap.set(uid, {
            user_id: uid,
            profiles: prof,
            session_count: 1,
          });
        } else {
          existing.session_count += 1;
          if (!existing.profiles && prof) {
            existing.profiles = prof;
          }
        }
      }

      applySelection([...patientsMap.values()]);
    } catch (error) {
      console.error('PROFILE FETCH ERROR:', error instanceof Error ? error.message : error);
    } finally {
      setIsLoading(false);
    }
  }, [user, isTherapist]);

  const fetchPatientsRef = useRef(fetchPatients);
  fetchPatientsRef.current = fetchPatients;

  useEffect(() => {
    if (user) {
      void fetchStats();
    }
  }, [user, fetchStats]);

  useEffect(() => {
    if (user && isTherapist) {
      void fetchMySessions();
    }
  }, [user, isTherapist, fetchMySessions]);

  useEffect(() => {
    const state = location.state as { openSessionNotes?: boolean; roomId?: string } | null;
    if (state?.openSessionNotes && state?.roomId) {
      setSessionNotesRoomId(state.roomId);
      setSessionNotesText('');
      setSessionNotesOpen(true);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, location.pathname, navigate]);

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`therapist-stats-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'appointments',
        },
        () => {
          void fetchStatsRef.current();
          void fetchMySessionsRef.current();
          void fetchPatientsRef.current();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  useEffect(() => {
    if (user && isTherapist) {
      void fetchPatients();
    }
  }, [user, isTherapist, fetchPatients]);

  useEffect(() => {
    const fetchBookingRequests = async () => {
      if (!user?.id || !isTherapist) return;

      console.log('THERAPIST LOGGED IN ID:', user?.id);

      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('therapist_id', user.id)
        .eq('status', 'pending');

      if (error) {
        console.error('fetchBookingRequests error:', error);
        return;
      }

      data?.forEach((row) => {
        if (row.therapist_id !== user?.id) {
          console.warn('THERAPIST ID MISMATCH — booking will not appear', row);
        }
      });

      console.log('BOOKING REQUESTS (pending, therapist dashboard):', data);
      const rows = data ?? [];
      const userIds = [...new Set(rows.map((r) => r.user_id))];

      if (userIds.length === 0) {
        setRequests([]);
        return;
      }

      const { data: profiles, error: profErr } = await supabase
        .from('profiles')
        .select('user_id, full_name, email')
        .in('user_id', userIds);

      if (profErr) {
        console.error('PROFILE FETCH ERROR:', profErr.message);
      }

      const profileByUserId = new Map(
        (profiles ?? []).map((p) => [p.user_id, p] as const),
      );

      setRequests(
        rows.map((r) => {
          const p = profileByUserId.get(r.user_id);
          return {
            ...r,
            patientName: p?.full_name?.trim() ?? null,
            patientEmail: p?.email?.trim() ?? null,
          };
        }),
      );
    };

    fetchBookingRequests();
  }, [user, isTherapist]);

  useEffect(() => {
    const fetchActiveSession = async () => {
      if (!user?.id || !isTherapist) return;

      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('therapist_id', user.id)
        .eq('status', 'accepted')
        .not('room_id', 'is', null)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('fetchActiveSession:', error);
        return;
      }

      setActiveSession(data ?? null);
    };

    fetchActiveSession();
  }, [user?.id, isTherapist]);

  const handleEndActiveSession = async () => {
    if (!activeSession) return;

    const { error } = await supabase
      .from('appointments')
      .update({ status: 'completed' })
      .eq('id', activeSession.id);

    if (error) {
      toast({
        title: 'Could not end session',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }

    setActiveSession(null);
    window.location.reload();
  };

  const handleAppointmentStatus = async (
    appointmentId: string,
    status: 'accepted' | 'rejected',
  ) => {
    if (!user?.id) return;

    if (status === 'accepted') {
      const { data: activeSession, error: activeErr } = await supabase
        .from('appointments')
        .select('id')
        .eq('therapist_id', user.id)
        .eq('status', 'accepted')
        .not('room_id', 'is', null)
        .limit(1)
        .maybeSingle();

      if (activeErr) {
        console.error('active session check:', activeErr);
        toast({
          title: 'Could not verify sessions',
          description: activeErr.message,
          variant: 'destructive',
        });
        return;
      }

      if (activeSession) {
        toast({
          title: 'Active video session',
          description:
            'Finish or leave the current video call before accepting another booking.',
          variant: 'destructive',
        });
        return;
      }

      const roomId = crypto.randomUUID();

      const { error } = await supabase
        .from('appointments')
        .update({ status: 'accepted', room_id: roomId })
        .eq('id', appointmentId)
        .eq('therapist_id', user.id);

      if (error) {
        toast({
          title: 'Update failed',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }

      setRequests((prev) => prev.filter((r) => r.id !== appointmentId));
      void fetchStats();
      toast({ title: 'Request accepted — starting video call' });
      navigate(`/video-call/${roomId}`);
      return;
    }

    const { error } = await supabase
      .from('appointments')
      .update({ status: 'rejected' })
      .eq('id', appointmentId)
      .eq('therapist_id', user.id);

    if (error) {
      toast({
        title: 'Update failed',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }

    setRequests((prev) => prev.filter((r) => r.id !== appointmentId));
    void fetchStats();
    toast({ title: 'Request rejected' });
  };

  const handleSaveSessionNotes = async () => {
    if (!sessionNotesRoomId) return;
    setSavingNotes(true);
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ notes: sessionNotesText })
        .eq('room_id', sessionNotesRoomId);

      if (error) throw error;

      toast({ title: 'Session notes saved' });
      setSessionNotesOpen(false);
      setSessionNotesRoomId(null);
      void fetchMySessions();
      void fetchStats();
    } catch (e) {
      toast({
        title: 'Could not save notes',
        description: e instanceof Error ? e.message : 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setSavingNotes(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const searchLower = search.trim().toLowerCase();
  const filteredPatients = patients.filter((p) => {
    if (!searchLower) return true;
    const name = p.profiles?.full_name?.toLowerCase() ?? '';
    const email = p.profiles?.email?.toLowerCase() ?? '';
    return name.includes(searchLower) || email.includes(searchLower);
  });
  const searchNoMatch =
    patients.length > 0 && filteredPatients.length === 0 && search.trim().length > 0;

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || !isTherapist) return null;

  console.log('FINAL REQUESTS STATE:', requests);

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
                <p className="text-2xl font-bold text-foreground">{stats.totalSessions}</p>
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
                <p className="text-2xl font-bold text-foreground">{stats.avgSessions}</p>
                <p className="text-xs text-muted-foreground">Avg Sessions/Patient</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {activeSession && activeSession.room_id && (
          <Card className="mb-6 border-2 border-green-500 shadow-card">
            <CardContent className="p-5 flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
              <div>
                <h3 className="font-semibold text-green-600">Active Session</h3>
                <p className="text-sm text-muted-foreground">
                  Room ID: {activeSession.room_id}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  onClick={() => navigate(`/video-call/${activeSession.room_id}`)}
                >
                  Join Call
                </Button>
                <Button type="button" variant="destructive" onClick={() => void handleEndActiveSession()}>
                  End Call
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Completed sessions (history) */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <History className="w-5 h-5 text-primary" />
            My Sessions
          </h2>
          {mySessions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No completed sessions yet.</p>
          ) : (
            <Card className="border-border shadow-card">
              <CardContent className="p-0">
                <ul className="divide-y divide-border">
                  {mySessions.map((s) => (
                    <li key={s.id} className="px-4 py-3 text-sm">
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="font-medium text-foreground">
                            {s.patientName?.trim() ||
                              s.patientEmail?.trim() ||
                              'Unknown Patient'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(s.created_at).toLocaleString()}
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground shrink-0">
                          Duration: {formatDurationSeconds(s.duration)}
                        </p>
                      </div>
                      {s.notes?.trim() ? (
                        <p className="mt-2 text-muted-foreground whitespace-pre-wrap">{s.notes}</p>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Booking Requests */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">Booking Requests</h2>
          {requests.length === 0 ? (
            <p className="text-sm text-muted-foreground">No pending booking requests.</p>
          ) : (
            <ul className="list-none space-y-4 p-0 m-0">
              {requests.map((req, index) => (
                <motion.li
                  key={req.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: index * 0.05 }}
                >
                  <Card className="rounded-2xl border border-border shadow-md transition-all hover:shadow-lg">
                    <CardContent className="space-y-4 p-6">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex min-w-0 flex-1 gap-4">
                          <div
                            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary"
                            aria-hidden
                          >
                            {bookingInitials(req.patientName, req.user_id)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div>
                                <h3 className="text-lg font-semibold text-foreground">
                                  New Booking Request
                                </h3>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(req.created_at).toLocaleString()}
                                </p>
                              </div>
                              <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800 dark:bg-yellow-950/50 dark:text-yellow-400">
                                Pending
                              </span>
                            </div>
                            <div className="mt-3 grid grid-cols-1 gap-3 text-sm">
                              <div>
                                <span className="text-muted-foreground">Patient</span>
                                <p className="truncate font-medium text-foreground">
                                  {req.patientName?.trim() ||
                                    req.patientEmail?.trim() ||
                                    'Unknown Patient'}
                                </p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">User ID</span>
                                <p className="break-all font-mono text-xs text-foreground/90">
                                  {req.user_id}
                                </p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Request ID</span>
                                <p className="break-all font-mono text-xs text-foreground/90">
                                  {req.id}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 border-t border-border/60 pt-4 sm:flex-row sm:items-center sm:justify-end">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="order-3 border-border sm:order-1 sm:mr-auto"
                          onClick={() => {
                            setSelectedPatient({
                              user_id: req.user_id,
                              profiles: {
                                id: req.user_id,
                                full_name: req.patientName,
                                email: req.patientEmail,
                              },
                              session_count: 0,
                            });
                            document.getElementById('therapist-patients-panel')?.scrollIntoView({
                              behavior: 'smooth',
                              block: 'start',
                            });
                          }}
                        >
                          <UserRound className="mr-2 h-4 w-4" />
                          View patient
                        </Button>
                        <div className="flex justify-end gap-3 sm:order-2">
                          <Button
                            type="button"
                            variant="outline"
                            className="border-destructive/60 text-destructive hover:bg-destructive/10 dark:hover:bg-destructive/20"
                            onClick={() => handleAppointmentStatus(req.id, 'rejected')}
                          >
                            Reject
                          </Button>
                          <Button
                            type="button"
                            className="bg-green-600 text-white hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700"
                            onClick={() => handleAppointmentStatus(req.id, 'accepted')}
                          >
                            Accept
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.li>
              ))}
            </ul>
          )}
        </div>

        {/* My Patients — cards, search, session counts, detail */}
        <section id="therapist-patients-panel" className="space-y-6">
          <Card className="border-border bg-card shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-xl text-foreground">
                <Users className="h-6 w-6 text-primary" />
                My Patients
              </CardTitle>
              <CardDescription>
                Patients with accepted or completed bookings. Session count includes both statuses.
              </CardDescription>
              <div className="relative pt-2">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search patients..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-12 w-full rounded-full border border-border bg-background pl-11 pr-4 text-sm shadow-sm transition-[box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  aria-label="Search patients by name or email"
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center py-14">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                </div>
              ) : patients.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground">
                  <div className="mb-3 text-5xl" aria-hidden>
                    👥
                  </div>
                  <p className="text-lg font-medium text-foreground">No patients yet</p>
                  <p className="mt-1 text-sm">
                    Patients will appear after you accept bookings
                  </p>
                </div>
              ) : (
                <>
                  {searchNoMatch ? (
                    <div className="rounded-xl border border-dashed border-border py-10 text-center text-muted-foreground">
                      <p className="font-medium text-foreground">No patients found</p>
                      <p className="mt-1 text-sm">Try a different name or email</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {filteredPatients.map((p) => {
                        const selected = selectedPatient?.user_id === p.user_id;
                        const initials = bookingInitials(
                          p.profiles?.full_name,
                          p.user_id,
                        );
                        return (
                          <motion.button
                            key={p.user_id}
                            type="button"
                            layout
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`rounded-xl border bg-card p-4 text-left shadow-md transition-all hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                              selected
                                ? 'border-primary ring-2 ring-primary/30'
                                : 'border-border'
                            }`}
                            onClick={() => setSelectedPatient(p)}
                          >
                            <div className="flex items-start gap-3">
                              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold text-muted-foreground">
                                {initials.slice(0, 2)}
                              </div>
                              <div className="min-w-0 flex-1">
                                <h3 className="truncate font-semibold text-foreground">
                                  {p.profiles?.full_name?.trim() ||
                                    p.profiles?.email?.trim() ||
                                    'Unknown Patient'}
                                </h3>
                                <p className="truncate text-sm text-muted-foreground">
                                  {p.profiles?.email?.trim() || '—'}
                                </p>
                              </div>
                            </div>
                            <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                              <ClipboardList className="h-4 w-4 shrink-0 text-primary" />
                              <span>
                                <span className="font-medium text-foreground">
                                  {p.session_count}
                                </span>{' '}
                                {p.session_count === 1 ? 'session' : 'sessions'}
                              </span>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {selectedPatient && (
            <div className="space-y-4">
              <Card className="border-border bg-card shadow-card">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <User className="h-7 w-7 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-foreground">
                          {selectedPatient.profiles?.full_name?.trim() ||
                            selectedPatient.profiles?.email?.trim() ||
                            'Unknown Patient'}
                        </h2>
                        <p className="text-muted-foreground">
                          {selectedPatient.profiles?.email?.trim() || 'No email on file'}
                        </p>
                        <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                          <ClipboardList className="h-4 w-4 text-primary" />
                          <span>
                            Appointments (accepted + completed):{' '}
                            <span className="font-semibold text-foreground">
                              {selectedPatient.session_count}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button
                      type="button"
                      className="shrink-0 bg-green-600 text-white hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700"
                      onClick={() =>
                        document
                          .getElementById('patient-full-detail')
                          ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                      }
                    >
                      View full history
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div id="patient-full-detail" className="scroll-mt-6">
                <PatientDetail
                  patientId={selectedPatient.user_id}
                  therapistId={user.id}
                />
              </div>
            </div>
          )}

          {!selectedPatient && !isLoading && patients.length > 0 && (
            <Card className="border-dashed border-border bg-muted/20 shadow-none">
              <CardContent className="flex min-h-[200px] flex-col items-center justify-center gap-2 py-10 text-center text-muted-foreground">
                <Users className="h-12 w-12 opacity-40" />
                <p className="font-medium text-foreground">Select a patient</p>
                <p className="max-w-sm text-sm">
                  Click a card above to open the summary and full progress below.
                </p>
              </CardContent>
            </Card>
          )}
        </section>
      </main>

      <Dialog
        open={sessionNotesOpen}
        onOpenChange={(open) => {
          setSessionNotesOpen(open);
          if (!open) setSessionNotesRoomId(null);
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Session Notes</DialogTitle>
            <DialogDescription>
              Notes are saved to this appointment and visible to the patient in their session history.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Enter session notes..."
            value={sessionNotesText}
            onChange={(e) => setSessionNotesText(e.target.value)}
            className="min-h-[120px]"
          />
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setSessionNotesOpen(false);
                setSessionNotesRoomId(null);
              }}
            >
              Skip
            </Button>
            <Button type="button" onClick={() => void handleSaveSessionNotes()} disabled={savingNotes}>
              {savingNotes ? 'Saving…' : 'Save notes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TherapistAdmin;
