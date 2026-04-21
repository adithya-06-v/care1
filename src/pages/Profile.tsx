import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ProBadge } from '@/components/ui/pro-badge';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Target, 
  BarChart3,
  Edit3,
  Save,
  X,
  Check,
  LogOut
} from 'lucide-react';

const AGE_GROUPS = [
  { value: 'child', label: 'Child (5–12)' },
  { value: 'teen', label: 'Teen (13–18)' },
  { value: 'adult', label: 'Adult (18+)' },
];



const GOALS = [
  { value: 'pronunciation', label: 'Pronunciation clarity' },
  { value: 'fluency', label: 'Stammering / Fluency' },
  { value: 'vocabulary', label: 'Vocabulary building' },
  { value: 'accent', label: 'Accent improvement' },
  { value: 'confidence', label: 'Slow speech confidence' },
  { value: 'child_development', label: 'Child speech development' },
];

const DIFFICULTIES = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'severe', label: 'Severe' },
];

interface ProfileData {
  full_name: string | null;
  age_group: string | null;
  goals: string[] | null;
  difficulty: string | null;
}

const Profile = () => {
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Edit form state
  const [editAgeGroup, setEditAgeGroup] = useState('');
  const [editGoals, setEditGoals] = useState<string[]>([]);
  const [editDifficulty, setEditDifficulty] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name, age_group, goals, difficulty')
          .eq('user_id', user.id)
          .maybeSingle();

        if (data && !error) {
          setProfile(data);
          setEditAgeGroup(data.age_group || '');
          setEditGoals(data.goals || []);
          setEditDifficulty(data.difficulty || '');
        }
        setLoadingProfile(false);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  const handleGoalToggle = (goal: string) => {
    setEditGoals(prev => 
      prev.includes(goal) 
        ? prev.filter(g => g !== goal)
        : [...prev, goal]
    );
  };

  const handleSave = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          age_group: editAgeGroup,
          goals: editGoals,
          difficulty: editDifficulty,
        })
        .eq('user_id', user.id);

      if (error) throw error;

      setProfile({
        ...profile,
        age_group: editAgeGroup,
        goals: editGoals,
        difficulty: editDifficulty,
      });

      setIsEditing(false);
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been successfully updated.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update profile.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditAgeGroup(profile?.age_group || '');
    setEditGoals(profile?.goals || []);
    setEditDifficulty(profile?.difficulty || '');
    setIsEditing(false);
  };

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: 'Signed Out',
      description: 'You have been successfully logged out.',
    });
    navigate('/');
  };

  const getGoalLabels = (goalValues: string[] | null) => {
    if (!goalValues || goalValues.length === 0) return 'None selected';
    return goalValues
      .map(v => GOALS.find(g => g.value === v)?.label || v)
      .join(', ');
  };

  const getAgeGroupLabel = (value: string | null) => {
    if (!value) return 'Not set';
    return AGE_GROUPS.find(a => a.value === value)?.label || value;
  };

  const getDifficultyLabel = (value: string | null) => {
    if (!value) return 'Not set';
    return DIFFICULTIES.find(d => d.value === value)?.label || value;
  };

  if (loading || loadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) return null;

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
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate('/dashboard')}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        {/* Profile Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Your Profile</h1>
            <p className="text-muted-foreground">
              Manage your therapy preferences and settings
            </p>
          </div>
          {!isEditing && (
            <Button 
              onClick={() => setIsEditing(true)}
              className="shadow-button"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>

        {/* User Info Card */}
        <Card className="bg-card border-border shadow-card mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <User className="w-5 h-5 text-primary" />
              Account Information
            </CardTitle>
            <CardDescription>Your basic account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-foreground font-medium">
                    {profile?.full_name || 'User'}
                  </p>
                  <ProBadge size="sm" />
                </div>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  {user.email}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Therapy Settings Card */}
        <Card className="bg-card border-border shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Target className="w-5 h-5 text-primary" />
              Therapy Settings
            </CardTitle>
            <CardDescription>Your personalized therapy preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isEditing ? (
              <>
                {/* Age Group Edit */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-3 block">
                    Age Group
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {AGE_GROUPS.map((age) => (
                      <button
                        key={age.value}
                        onClick={() => setEditAgeGroup(age.value)}
                        className={`p-3 rounded-xl border-2 transition-all text-sm ${
                          editAgeGroup === age.value
                            ? 'border-primary bg-primary/10 text-foreground'
                            : 'border-border bg-muted/30 text-muted-foreground hover:border-primary/50'
                        }`}
                      >
                        {age.label}
                      </button>
                    ))}
                  </div>
                </div>



                {/* Goals Edit */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-3 block">
                    Therapy Goals
                  </label>
                  <div className="space-y-2">
                    {GOALS.map((goal) => (
                      <button
                        key={goal.value}
                        onClick={() => handleGoalToggle(goal.value)}
                        className={`w-full p-3 rounded-xl border-2 transition-all flex items-center justify-between text-sm ${
                          editGoals.includes(goal.value)
                            ? 'border-primary bg-primary/10'
                            : 'border-border bg-muted/30 hover:border-primary/50'
                        }`}
                      >
                        <span className={editGoals.includes(goal.value) ? 'text-foreground' : 'text-muted-foreground'}>
                          {goal.label}
                        </span>
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                          editGoals.includes(goal.value)
                            ? 'border-primary bg-primary'
                            : 'border-muted-foreground/30'
                        }`}>
                          {editGoals.includes(goal.value) && (
                            <Check className="w-3 h-3 text-primary-foreground" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Difficulty Edit */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-3 block">
                    Difficulty Level
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {DIFFICULTIES.map((diff) => (
                      <button
                        key={diff.value}
                        onClick={() => setEditDifficulty(diff.value)}
                        className={`p-3 rounded-xl border-2 transition-all text-sm ${
                          editDifficulty === diff.value
                            ? 'border-primary bg-primary/10 text-foreground'
                            : 'border-border bg-muted/30 text-muted-foreground hover:border-primary/50'
                        }`}
                      >
                        {diff.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    className="flex-1"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex-1 shadow-button"
                  >
                    {isSaving ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        Saving...
                      </span>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </>
            ) : (
              <>
                {/* Age Group Display */}
                <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Age Group</p>
                    <p className="text-foreground font-medium">
                      {getAgeGroupLabel(profile?.age_group)}
                    </p>
                  </div>
                </div>



                {/* Goals Display */}
                <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Target className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Therapy Goals</p>
                    <p className="text-foreground font-medium">
                      {getGoalLabels(profile?.goals)}
                    </p>
                  </div>
                </div>

                {/* Difficulty Display */}
                <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Difficulty Level</p>
                    <p className="text-foreground font-medium">
                      {getDifficultyLabel(profile?.difficulty)}
                    </p>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Profile;
