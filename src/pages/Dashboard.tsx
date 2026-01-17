import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { 
  LogOut, 
  Mic, 
  BarChart3, 
  Globe, 
  Play, 
  Trophy,
  Clock,
  Target
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Profile {
  full_name: string | null;
  preferred_language: string;
  therapy_sessions_completed: number;
}

const Dashboard = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  useEffect(() => {
    const checkAuth = async () => {
      if (!loading && !user) {
        navigate('/auth');
      } else if (!loading && user) {
        // Check if user has completed onboarding
        const { data } = await supabase
          .from('profiles')
          .select('onboarding_completed')
          .eq('user_id', user.id)
          .maybeSingle();

        if (!data?.onboarding_completed) {
          navigate('/onboarding');
        }
      }
    };

    checkAuth();
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name, preferred_language, therapy_sessions_completed')
          .eq('user_id', user.id)
          .single();
        
        if (data && !error) {
          setProfile(data);
          setSelectedLanguage(data.preferred_language || 'English');
        }
      }
    };

    if (user) {
      setTimeout(() => fetchProfile(), 0);
    }
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: 'Signed Out',
      description: 'You have been successfully logged out.',
    });
    navigate('/');
  };

  const handleStartSession = () => {
    toast({
      title: 'Starting Session',
      description: `Beginning ${selectedLanguage} speech therapy session...`,
    });
    // Placeholder for actual therapy session
  };

  const languages = ['English', 'Spanish', 'French', 'German', 'Mandarin', 'Hindi'];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) return null;

  const firstName = profile?.full_name?.split(' ')[0] || user.email?.split('@')[0] || 'User';

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold">CV</span>
            </div>
            <span className="text-xl font-bold text-foreground">CareVoice</span>
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
            Welcome back, {firstName}! 👋
          </h1>
          <p className="text-muted-foreground">
            Ready to continue your speech therapy journey?
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-card border-border shadow-card">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {profile?.therapy_sessions_completed || 0}
                </p>
                <p className="text-sm text-muted-foreground">Sessions Completed</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-card">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-accent-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">12 hrs</p>
                <p className="text-sm text-muted-foreground">Practice Time</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-card">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-secondary/50 flex items-center justify-center">
                <Target className="w-6 h-6 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">85%</p>
                <p className="text-sm text-muted-foreground">Accuracy Score</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Language Selection */}
          <Card className="bg-card border-border shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Globe className="w-5 h-5 text-primary" />
                Select Language
              </CardTitle>
              <CardDescription>Choose your therapy language</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {languages.map((lang) => (
                  <Button
                    key={lang}
                    variant={selectedLanguage === lang ? 'default' : 'outline'}
                    className={`rounded-xl transition-all ${
                      selectedLanguage === lang 
                        ? 'shadow-button' 
                        : 'hover:bg-muted'
                    }`}
                    onClick={() => setSelectedLanguage(lang)}
                  >
                    {lang}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Start Session */}
          <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Mic className="w-5 h-5 text-primary" />
                Start Therapy Session
              </CardTitle>
              <CardDescription>Begin AI-powered voice exercises</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground text-sm">
                Start a personalized speech therapy session with real-time AI feedback 
                and pronunciation analysis in <strong>{selectedLanguage}</strong>.
              </p>
              <Button 
                size="lg" 
                className="w-full rounded-pill shadow-button hover:shadow-card-hover transition-all"
                onClick={handleStartSession}
              >
                <Play className="w-5 h-5 mr-2" />
                Start Session
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-card border-border shadow-card hover:shadow-card-hover transition-all cursor-pointer group">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 transition-colors">
                  <Mic className="w-6 h-6 text-primary" />
                </div>
                <p className="font-medium text-foreground">Pronunciation</p>
                <p className="text-xs text-muted-foreground mt-1">Practice words</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border shadow-card hover:shadow-card-hover transition-all cursor-pointer group">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-accent/20 transition-colors">
                  <BarChart3 className="w-6 h-6 text-accent-foreground" />
                </div>
                <p className="font-medium text-foreground">Progress</p>
                <p className="text-xs text-muted-foreground mt-1">View reports</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border shadow-card hover:shadow-card-hover transition-all cursor-pointer group">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-secondary/30 flex items-center justify-center mx-auto mb-3 group-hover:bg-secondary/50 transition-colors">
                  <Trophy className="w-6 h-6 text-secondary-foreground" />
                </div>
                <p className="font-medium text-foreground">Achievements</p>
                <p className="text-xs text-muted-foreground mt-1">View badges</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border shadow-card hover:shadow-card-hover transition-all cursor-pointer group">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3 group-hover:bg-muted/80 transition-colors">
                  <Globe className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="font-medium text-foreground">Languages</p>
                <p className="text-xs text-muted-foreground mt-1">Add more</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
