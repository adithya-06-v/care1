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
  Award,
  Star,
  Flame,
  Clock,
  Target,
  Medal,
  Crown,
  Zap,
  Lock
} from 'lucide-react';
import { format } from 'date-fns';

interface Achievement {
  id: string;
  achievement_type: string;
  achievement_name: string;
  description: string | null;
  icon: string | null;
  earned_at: string;
}

interface ProfileStats {
  therapy_sessions_completed: number;
  total_practice_minutes: number;
  current_streak: number;
  longest_streak: number;
}

// Badge definitions
const badgeDefinitions = [
  { 
    type: 'first_session', 
    name: 'First Session', 
    description: 'Complete your first therapy session', 
    icon: '🎯',
    requirement: (stats: ProfileStats) => stats.therapy_sessions_completed >= 1,
    color: 'from-blue-500 to-blue-600'
  },
  { 
    type: 'five_sessions', 
    name: '5 Sessions', 
    description: 'Complete 5 therapy sessions', 
    icon: '⭐',
    requirement: (stats: ProfileStats) => stats.therapy_sessions_completed >= 5,
    color: 'from-yellow-500 to-orange-500'
  },
  { 
    type: 'ten_sessions', 
    name: '10 Sessions', 
    description: 'Complete 10 therapy sessions', 
    icon: '🏆',
    requirement: (stats: ProfileStats) => stats.therapy_sessions_completed >= 10,
    color: 'from-purple-500 to-purple-600'
  },
  { 
    type: 'thirty_minutes', 
    name: '30 Minutes', 
    description: 'Practice for 30 minutes total', 
    icon: '⏱️',
    requirement: (stats: ProfileStats) => stats.total_practice_minutes >= 30,
    color: 'from-green-500 to-green-600'
  },
  { 
    type: 'one_hour', 
    name: 'One Hour', 
    description: 'Practice for 1 hour total', 
    icon: '⌛',
    requirement: (stats: ProfileStats) => stats.total_practice_minutes >= 60,
    color: 'from-teal-500 to-cyan-500'
  },
  { 
    type: 'three_day_streak', 
    name: '3-Day Streak', 
    description: 'Practice 3 days in a row', 
    icon: '🔥',
    requirement: (stats: ProfileStats) => stats.current_streak >= 3 || stats.longest_streak >= 3,
    color: 'from-red-500 to-orange-500'
  },
  { 
    type: 'week_streak', 
    name: 'Week Warrior', 
    description: 'Practice 7 days in a row', 
    icon: '💪',
    requirement: (stats: ProfileStats) => stats.current_streak >= 7 || stats.longest_streak >= 7,
    color: 'from-pink-500 to-rose-500'
  },
  { 
    type: 'dedication', 
    name: 'Dedication', 
    description: 'Complete 25 sessions', 
    icon: '👑',
    requirement: (stats: ProfileStats) => stats.therapy_sessions_completed >= 25,
    color: 'from-amber-500 to-yellow-500'
  },
];

const Achievements = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [earnedAchievements, setEarnedAchievements] = useState<Achievement[]>([]);
  const [profileStats, setProfileStats] = useState<ProfileStats>({
    therapy_sessions_completed: 0,
    total_practice_minutes: 0,
    current_streak: 0,
    longest_streak: 0,
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

      // Fetch profile stats
      const { data: profileData } = await supabase
        .from('profiles')
        .select('therapy_sessions_completed, total_practice_minutes, current_streak, longest_streak')
        .eq('user_id', user.id)
        .maybeSingle();

      if (profileData) {
        setProfileStats({
          therapy_sessions_completed: profileData.therapy_sessions_completed || 0,
          total_practice_minutes: profileData.total_practice_minutes || 0,
          current_streak: profileData.current_streak || 0,
          longest_streak: profileData.longest_streak || 0,
        });

        // Check and award new achievements
        await checkAndAwardAchievements(profileData);
      }

      // Fetch existing achievements
      const { data: achievementsData } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', user.id);

      if (achievementsData) {
        setEarnedAchievements(achievementsData);
      }

      setIsLoading(false);
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  const checkAndAwardAchievements = async (stats: ProfileStats) => {
    if (!user) return;

    // Get existing achievement types
    const { data: existingAchievements } = await supabase
      .from('achievements')
      .select('achievement_type')
      .eq('user_id', user.id);

    const existingTypes = existingAchievements?.map(a => a.achievement_type) || [];

    // Check each badge and award if not already earned
    for (const badge of badgeDefinitions) {
      if (!existingTypes.includes(badge.type) && badge.requirement(stats)) {
        await supabase.from('achievements').insert({
          user_id: user.id,
          achievement_type: badge.type,
          achievement_name: badge.name,
          description: badge.description,
          icon: badge.icon,
        });
      }
    }
  };

  const isEarned = (type: string) => {
    return earnedAchievements.some(a => a.achievement_type === type);
  };

  const getEarnedDate = (type: string) => {
    const achievement = earnedAchievements.find(a => a.achievement_type === type);
    return achievement ? format(new Date(achievement.earned_at), 'MMM d, yyyy') : null;
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const earnedCount = earnedAchievements.length;
  const totalCount = badgeDefinitions.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <span className="text-xl font-bold text-foreground">Achievements</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Streak Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <Card className="bg-gradient-to-r from-primary to-primary/80 border-none shadow-card mb-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                    <Flame className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <p className="text-white/80 text-sm">Current Streak</p>
                    <p className="text-4xl font-bold text-white">
                      {profileStats.current_streak} days
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white/80 text-sm">Longest Streak</p>
                  <p className="text-2xl font-bold text-white">
                    {profileStats.longest_streak} days
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Progress */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-foreground">Badges Earned</h2>
            <span className="text-sm text-muted-foreground">{earnedCount} / {totalCount}</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(earnedCount / totalCount) * 100}%` }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-primary h-2 rounded-full"
            />
          </div>
        </motion.div>

        {/* Badges Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {badgeDefinitions.map((badge, index) => {
            const earned = isEarned(badge.type);
            const earnedDate = getEarnedDate(badge.type);

            return (
              <motion.div
                key={badge.type}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className={`bg-card border-border shadow-card transition-all ${
                  earned ? 'ring-2 ring-primary' : 'opacity-60'
                }`}>
                  <CardContent className="p-4 text-center">
                    <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3 ${
                      earned 
                        ? `bg-gradient-to-br ${badge.color}` 
                        : 'bg-muted'
                    }`}>
                      {earned ? (
                        <span className="text-3xl">{badge.icon}</span>
                      ) : (
                        <Lock className="w-6 h-6 text-muted-foreground" />
                      )}
                    </div>
                    <p className="font-medium text-foreground text-sm mb-1">
                      {badge.name}
                    </p>
                    <p className="text-xs text-muted-foreground mb-2">
                      {badge.description}
                    </p>
                    {earned && earnedDate && (
                      <p className="text-xs text-primary font-medium">
                        Earned {earnedDate}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Stats Summary */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <Card className="bg-card border-border shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-primary" />
                Your Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted/30 rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <Target className="w-4 h-4 text-primary" />
                    <span className="text-sm text-muted-foreground">Sessions</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">
                    {profileStats.therapy_sessions_completed}
                  </p>
                </div>
                <div className="p-4 bg-muted/30 rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="text-sm text-muted-foreground">Practice Time</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">
                    {profileStats.total_practice_minutes} min
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default Achievements;
