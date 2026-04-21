import { useState } from 'react';
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [leaderboard, setLeaderboard] = useState([
    { name: 'Dr. Priya Sharma', xp: 4500, rank: 1, avatar: 'P' },
    { name: 'Dr. Rahul Mehta', xp: 3200, rank: 2, avatar: 'R' },
    { name: 'Dr. Anjali Verma', xp: 2800, rank: 3, avatar: 'A' },
    { name: 'You', xp: 1240, rank: 12, avatar: 'Y', isMe: true },
    { name: 'Dr. Arjun Reddy', xp: 950, rank: 15, avatar: 'A' },
  ]);

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
              <span className="font-bold text-primary">1,240 XP</span>
            </div>
            <div className="bg-orange-500/10 rounded-full px-4 py-1.5 flex items-center gap-2 border border-orange-500/20">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="font-bold text-orange-500">5 Days</span>
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

                {/* Horizontal Canyon Bridge Illustration */}
                <div className="w-full mt-8 relative">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-accent/10 rounded-3xl -z-10" />
                  
                  {/* Canyon Background Elements */}
                  <div className="absolute left-0 bottom-0 w-32 h-32 bg-slate-800/20 rounded-tr-[100px] -z-5" />
                  <div className="absolute right-0 bottom-0 w-32 h-32 bg-slate-800/20 rounded-tl-[100px] -z-5" />
                  
                  {/* The Horizontal Bridge */}
                  <div className="relative h-48 w-full flex items-center justify-center px-12">
                    {/* Bridge Path (Horizontal) */}
                    <div className="w-full h-8 bg-amber-950/20 rounded-full relative flex items-center justify-between px-8">
                      {/* Wooden Planks Pattern */}
                      <div className="absolute inset-0 flex justify-around items-center px-4 overflow-hidden pointer-events-none opacity-40">
                        {Array.from({ length: 20 }).map((_, i) => (
                          <div key={i} className="w-2 h-full bg-amber-900 border-x border-amber-950/50" />
                        ))}
                      </div>

                      {[50, 100, 250].map((xp, i) => (
                        <div key={xp} className="relative z-10 flex flex-col items-center">
                          <div className={`w-6 h-6 rounded-full border-4 border-card shadow-lg ${i === 0 ? 'bg-primary' : 'bg-muted'}`} />
                          <div className="absolute top-8 bg-card border border-border px-3 py-1 rounded-full text-xs font-black text-primary shadow-sm whitespace-nowrap">
                            {xp} XP
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Armored Knight Hero */}
                    <div className="absolute left-[15%] bottom-16 z-20 flex flex-col items-center">
                      <div className="relative">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-600 border-2 border-slate-900 flex items-center justify-center shadow-[0_0_20px_rgba(234,179,8,0.4)]">
                          <User className="w-8 h-8 text-slate-900" />
                          {/* Armor detailing */}
                          <div className="absolute -top-1 -left-1 w-4 h-4 bg-yellow-300 rounded-sm rotate-45 border border-slate-900" />
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-300 rounded-sm -rotate-45 border border-slate-900" />
                        </div>
                      </div>
                      <div className="mt-2 bg-slate-900 text-[10px] text-yellow-400 px-3 py-1 rounded-md font-black uppercase tracking-widest border border-yellow-500/30">
                        Knight Hero
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

      {/* Leaderboard Dialog */}
      <Dialog open={isLeaderboardOpen} onOpenChange={setIsLeaderboardOpen}>
        <DialogContent className="sm:max-w-[425px] bg-card border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl font-bold">
              <Trophy className="w-6 h-6 text-yellow-500" />
              Leaderboard
            </DialogTitle>
            <DialogDescription>
              Compete with our experts and community to climb the ranks!
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-6 space-y-4">
            {leaderboard.map((entry) => (
              <div 
                key={entry.name}
                className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${
                  entry.isMe 
                    ? 'bg-primary/20 border-2 border-primary/30 shadow-[0_0_15px_rgba(var(--primary),0.2)]' 
                    : 'bg-muted/30 border border-border/50 hover:bg-muted/50'
                }`}
              >
                <div className={`w-8 font-black text-lg ${
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
            ))}
          </div>

          <div className="mt-6">
            <Button 
              className="w-full h-12 rounded-xl font-bold"
              onClick={() => setIsLeaderboardOpen(false)}
            >
              Continue Practice
            </Button>
          </div>
        </DialogContent>
      </Dialog>

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
