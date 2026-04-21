import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ArrowLeft, 
  Gamepad2, 
  Trophy, 
  Star, 
  Play, 
  Flame,
  Gamepad,
  Music,
  Mic2,
  Lock,
  ChevronRight,
  Target,
  User
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const GAMES = [
  {
    id: 'articulation-quest',
    title: 'Articulation Quest',
    description: 'Help the hero cross the bridge by pronouncing words correctly.',
    icon: Gamepad2,
    color: 'bg-blue-500',
    difficulty: 'Easy',
    points: 100,
    status: 'available'
  },
  {
    id: 'volume-voyage',
    title: 'Volume Voyage',
    description: 'Control your spaceship altitude using your voice volume.',
    icon: Music,
    color: 'bg-purple-500',
    difficulty: 'Medium',
    points: 250,
    status: 'available'
  },
];

const Games = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [leaderboard, setLeaderboard] = useState<{name: string, xp: number, rank: number, avatar: string, isMe?: boolean}[]>([]);
  const [userXP, setUserXP] = useState(0);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, therapy_sessions_completed, total_practice_minutes, user_id, current_streak')
        .order('therapy_sessions_completed', { ascending: false });

      if (data && !error) {
        // Thorough list of names and titles to filter out
        const blacklist = [
          'Arjun Reddy', 'Kavita Nair', 'Anoymous user', 'chaitanya', 'satish', 
          'Priya Sharma', 'Anjali Verma', 'Rahul Mehta', 'Anonymous User'
        ].map(n => n.toLowerCase().trim());

        const filtered = data.filter(profile => {
          const name = (profile.full_name || '').toLowerCase().trim();
          // Filter out anyone with "Dr." title or in the blacklist
          const isTherapist = name.startsWith('dr.') || name.startsWith('dr ') || blacklist.some(b => name.includes(b));
          return !isTherapist;
        });

        const processed = filtered.map((profile, index) => {
          const calculatedXP = (profile.therapy_sessions_completed || 0) * 100 + (profile.total_practice_minutes || 0) * 10;
          return {
            name: profile.full_name || 'Anonymous User',
            xp: calculatedXP,
            rank: index + 1,
            avatar: (profile.full_name || 'A')[0].toUpperCase(),
            isMe: profile.user_id === user?.id
          };
        });
        
        // Sort by XP
        processed.sort((a, b) => b.xp - a.xp);
        // Re-assign ranks
        const ranked = processed.map((p, i) => ({ ...p, rank: i + 1 }));
        
        setLeaderboard(ranked);

        // Find current user's stats
        const currentUser = data.find(p => p.user_id === user?.id);
        if (currentUser) {
          const currentXP = (currentUser.therapy_sessions_completed || 0) * 100 + (currentUser.total_practice_minutes || 0) * 10;
          setUserXP(currentXP);
          setStreak(currentUser.current_streak || 0);
        }
      }
    };

    fetchLeaderboard();
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/dashboard')}
              className="rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <Gamepad2 className="text-primary-foreground w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground leading-none">Speech Games</h1>
              <p className="text-xs text-muted-foreground mt-1 underline decoration-primary/30">Arcade Mode</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 rounded-full px-4 py-1.5 flex items-center gap-2 border border-primary/20">
              <Star className="w-4 h-4 text-primary fill-primary" />
              <span className="font-bold text-primary">{userXP.toLocaleString()} XP</span>
            </div>
            <div className="bg-orange-500/10 rounded-full px-4 py-1.5 flex items-center gap-2 border border-orange-500/20">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="font-bold text-orange-500">{streak} Days</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-10 text-center lg:text-left">
          <h2 className="text-3xl font-bold text-foreground mb-3">Level Up Your Speech! 🚀</h2>
          <p className="text-muted-foreground max-w-2xl">
            Choose a game to practice your speech goals in a fun, interactive way. 
            Earn XP, unlock achievements, and climb the leaderboard!
          </p>
        </div>

        {/* Featured Game */}
        <div className="mb-12">
          <Card className="relative overflow-hidden border-2 border-primary shadow-2xl group transition-all duration-500 hover:scale-[1.01]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-primary/20 transition-all" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full -ml-40 -mb-40 blur-3xl" />
            
            <CardContent className="p-8 md:p-12 relative z-10">
              <div className="flex flex-col gap-12">
                <div className="text-center lg:text-left max-w-2xl">
                  <Badge className="mb-4 bg-primary text-primary-foreground">Daily Featured Game</Badge>
                  <h3 className="text-4xl md:text-5xl font-black text-foreground mb-6">Articulation Quest: Bridge of Echoes</h3>
                  <p className="text-xl text-muted-foreground mb-8">
                    Help the hero cross the bridge by pronouncing words correctly. 
                    Each correct sound builds the path forward!
                  </p>
                  <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                    <Button 
                      size="lg" 
                      className="rounded-full px-10 h-16 text-xl font-bold shadow-button" 
                      onClick={() => navigate('/therapy-session?duration=5&from=games')}
                    >
                      <Play className="w-6 h-6 mr-3 fill-current" />
                      Play Now
                    </Button>
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="rounded-full px-10 h-16 text-xl border-2"
                      onClick={() => setIsLeaderboardOpen(true)}
                    >
                       <Trophy className="w-6 h-6 mr-3" />
                       Leaderboard
                    </Button>
                  </div>
                </div>

                {/* Horizontal Canyon Bridge Illustration - Sized Down */}
                <div className="w-full mt-4 relative">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-accent/10 rounded-2xl -z-10" />
                  
                  {/* Canyon Background Elements */}
                  <div className="absolute left-0 bottom-0 w-24 h-24 bg-slate-800/20 rounded-tr-[80px] -z-5" />
                  <div className="absolute right-0 bottom-0 w-24 h-24 bg-slate-800/20 rounded-tl-[80px] -z-5" />
                  
                  {/* The Horizontal Bridge */}
                  <div className="relative h-32 w-full flex items-center justify-center px-8">
                    {/* Bridge Path (Horizontal) */}
                    <div className="w-full h-6 bg-amber-950/20 rounded-full relative flex items-center justify-between px-6">
                      {/* Wooden Planks Pattern */}
                      <div className="absolute inset-0 flex justify-around items-center px-4 overflow-hidden pointer-events-none opacity-40">
                        {Array.from({ length: 15 }).map((_, i) => (
                          <div key={i} className="w-1.5 h-full bg-amber-900 border-x border-amber-950/50" />
                        ))}
                      </div>

                      {[50, 100, 250].map((xp, i) => (
                        <div key={xp} className="relative z-10 flex flex-col items-center">
                          <div className={`w-4 h-4 rounded-full border-2 border-card shadow-lg ${i === 0 ? 'bg-primary' : 'bg-muted'}`} />
                          <div className="absolute top-6 bg-card border border-border px-2 py-0.5 rounded-full text-[10px] font-black text-primary shadow-sm whitespace-nowrap">
                            {xp} XP
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Armored Knight Hero */}
                    <div className="absolute left-[15%] bottom-10 z-20 flex flex-col items-center">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-600 border-2 border-slate-900 flex items-center justify-center shadow-[0_0_15px_rgba(234,179,8,0.3)]">
                          <User className="w-6 h-6 text-slate-900" />
                        </div>
                      </div>
                      <div className="mt-1 bg-slate-900 text-[8px] text-yellow-400 px-2 py-0.5 rounded-sm font-black uppercase tracking-widest border border-yellow-500/30">
                        Knight
                      </div>
                    </div>
                  </div>

                  <div className="text-center mt-4">
                    <p className="text-xs font-black text-muted-foreground uppercase tracking-[0.3em] opacity-60">Quest Progress: Level 1</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
          {GAMES.map((game) => (
            <Card 
              key={game.id} 
              className={`group hover:-translate-y-2 transition-all duration-300 border-border shadow-card hover:shadow-card-hover overflow-hidden ${
                game.status === 'coming-soon' ? 'opacity-75 grayscale-[0.5]' : ''
              }`}
            >
              <CardContent className="p-0">
                <div className="flex items-stretch flex-col sm:flex-row h-full">
                  <div className={`w-full sm:w-32 shrink-0 ${game.color} flex items-center justify-center p-6 sm:p-0`}>
                    <game.icon className="w-12 h-12 text-white" />
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-xl font-bold text-foreground">{game.title}</h4>
                        {game.status === 'coming-soon' && (
                          <Badge variant="secondary" className="text-[10px]">COMING SOON</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {game.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex gap-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        <span className="flex items-center gap-1">
                           <Target className="w-3 h-3" />
                           {game.difficulty}
                        </span>
                        <span className="flex items-center gap-1">
                           <Star className="w-3 h-3 text-primary" />
                           {game.points} pts
                        </span>
                      </div>
                      <Button 
                        size="sm" 
                        variant={game.status === 'coming-soon' ? "outline" : "ghost"}
                        disabled={game.status === 'coming-soon'}
                        className="rounded-full group-hover:bg-primary group-hover:text-primary-foreground transition-all"
                        onClick={() => navigate('/therapy-session?duration=5')}
                      >
                        {game.status === 'coming-soon' ? (
                          <Lock className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-5 h-5" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      {/* Leaderboard Slide-over */}
      <Sheet open={isLeaderboardOpen} onOpenChange={setIsLeaderboardOpen}>
        <SheetContent className="sm:max-w-[425px] bg-card border-l border-border p-0">
          <SheetHeader className="p-6 border-b border-border">
            <SheetTitle className="flex items-center gap-2 text-2xl font-bold">
              <Trophy className="w-6 h-6 text-yellow-500" />
              Leaderboard
            </SheetTitle>
            <SheetDescription>
              Compete with our experts and community to climb the ranks!
            </SheetDescription>
          </SheetHeader>
          
          <div className="p-4 space-y-4 max-h-[calc(100vh-140px)] overflow-y-auto custom-scrollbar 
            [&::-webkit-scrollbar]:w-1.5
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-thumb]:bg-primary/20
            [&::-webkit-scrollbar-thumb]:rounded-full
            hover:[&::-webkit-scrollbar-thumb]:bg-primary/40">
            {leaderboard.length > 0 ? (
              leaderboard.map((entry) => (
                <div 
                  key={entry.name}
                  className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 border ${
                    entry.isMe 
                      ? 'bg-primary/10 border-primary/40 shadow-[0_0_15px_rgba(var(--primary),0.1)] scale-[1.02] ring-1 ring-primary/20' 
                      : 'bg-muted/30 border-border/50 hover:border-primary/30 hover:bg-muted/50 hover:shadow-md'
                  }`}
                >
                  <div className={`w-10 flex justify-center font-black text-lg ${
                    entry.rank <= 3 ? 'text-yellow-500' : 'text-muted-foreground'
                  }`}>
                    #{entry.rank}
                  </div>
                  
                  <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                    <AvatarFallback className={entry.isMe ? 'bg-primary text-primary-foreground' : 'bg-accent'}>
                      {entry.avatar}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <p className={`font-bold truncate ${entry.isMe ? 'text-primary' : 'text-foreground'}`}>
                      {entry.name}
                    </p>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                      Speech Master
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center gap-1 font-black text-foreground">
                      <Star className="w-3 h-3 text-primary fill-primary" />
                      {entry.xp.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-muted-foreground font-bold uppercase">XP</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                No players found yet. Be the first!
              </div>
            )}
          </div>

          <div className="p-6 mt-auto border-t border-border">
            <Button 
              className="w-full h-12 rounded-xl font-bold"
              onClick={() => setIsLeaderboardOpen(false)}
            >
              Continue Practice
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Footer Nav for Mobile (Optional) */}
      <div className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-md border-t border-border p-4 flex justify-around md:hidden z-50">
         <Button variant="ghost" size="icon" className="text-primary rounded-xl" onClick={() => navigate('/dashboard')}>
           <Gamepad2 className="w-6 h-6" />
         </Button>
         <Button variant="ghost" size="icon" className="text-muted-foreground rounded-xl" onClick={() => navigate('/achievements')}>
           <Trophy className="w-6 h-6" />
         </Button>
         <Button variant="ghost" size="icon" className="text-muted-foreground rounded-xl" onClick={() => navigate('/profile')}>
           <User className="w-6 h-6" />
         </Button>
      </div>
    </div>
  );
};

export default Games;
