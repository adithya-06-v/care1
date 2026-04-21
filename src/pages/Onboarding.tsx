import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { 
  ArrowRight, 
  Check, 
  Sparkles, 
  User, 
  Globe, 
  Target, 
  BarChart3,
  PartyPopper
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const STEPS = [
  { id: 'welcome', icon: Sparkles, title: 'Welcome' },
  { id: 'age', icon: User, title: 'Age Group' },
  { id: 'goals', icon: Target, title: 'Goals' },
  { id: 'difficulty', icon: BarChart3, title: 'Difficulty' },
  { id: 'complete', icon: PartyPopper, title: 'Complete' },
];

const AGE_GROUPS = [
  { value: 'child', label: 'Child', sublabel: '5–12 years', emoji: '🧒' },
  { value: 'teen', label: 'Teen', sublabel: '13–18 years', emoji: '🧑‍🎓' },
  { value: 'adult', label: 'Adult', sublabel: '18+ years', emoji: '🧑' },
];



const GOALS = [
  { value: 'pronunciation', label: 'Pronunciation clarity', icon: '🎯' },
  { value: 'fluency', label: 'Stammering / Fluency', icon: '🌊' },
  { value: 'vocabulary', label: 'Vocabulary building', icon: '📚' },
  { value: 'accent', label: 'Accent improvement', icon: '🎭' },
  { value: 'confidence', label: 'Slow speech confidence', icon: '💪' },
  { value: 'child_development', label: 'Child speech development', icon: '👶' },
];

const DIFFICULTIES = [
  { value: 'beginner', label: 'Beginner', sublabel: 'Just starting', color: 'bg-green-500/20 border-green-500/50' },
  { value: 'moderate', label: 'Moderate', sublabel: 'Some challenges', color: 'bg-yellow-500/20 border-yellow-500/50' },
  { value: 'severe', label: 'Severe', sublabel: 'Significant issues', color: 'bg-red-500/20 border-red-500/50' },
];

const Onboarding = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);

  // Form state
  const [ageGroup, setAgeGroup] = useState('');
  const [goals, setGoals] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState('');

  // Check if user already completed onboarding
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!loading && user) {
        const { data } = await supabase
          .from('profiles')
          .select('onboarding_completed')
          .eq('user_id', user.id)
          .maybeSingle();

        if (data?.onboarding_completed) {
          navigate('/dashboard');
        } else {
          setCheckingOnboarding(false);
        }
      } else if (!loading && !user) {
        navigate('/auth');
      }
    };

    checkOnboardingStatus();
  }, [user, loading, navigate]);

  const handleGoalToggle = (goal: string) => {
    setGoals(prev => 
      prev.includes(goal) 
        ? prev.filter(g => g !== goal)
        : [...prev, goal]
    );
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return true; // Welcome
      case 1: return ageGroup !== '';
      case 2: return goals.length > 0;
      case 3: return difficulty !== '';
      case 4: return true; // Complete
      default: return false;
    }
  };

  const handleNext = async () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Submit to database
      await handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          age_group: ageGroup,
          goals: goals,
          difficulty: difficulty,
          onboarding_completed: true,
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: 'Welcome to CareVoice! 🎉',
        description: 'Your personalized therapy plan is ready.',
      });

      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save your preferences.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || checkingOnboarding) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[hsl(174,45%,8%)]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[hsl(174,73%,50%)]"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  return (
    <div className="min-h-screen bg-[hsl(174,45%,8%)] flex flex-col items-center justify-center p-4 md:p-8">
      {/* Progress Indicator */}
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((step, index) => (
          <div
            key={step.id}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index <= currentStep
                ? 'bg-[hsl(174,73%,50%)] scale-100'
                : 'bg-white/20 scale-75'
            }`}
          />
        ))}
      </div>

      {/* Main Card */}
      <div 
        className="relative w-full max-w-lg bg-[hsl(174,40%,12%)] border border-[hsl(174,73%,40%)/30] rounded-2xl overflow-hidden"
        style={{ boxShadow: '0 0 40px hsl(174,73%,30%,0.2)' }}
      >
        <AnimatePresence mode="wait" custom={1}>
          <motion.div
            key={currentStep}
            custom={1}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="p-8 md:p-10"
          >
            {/* Step 0: Welcome */}
            {currentStep === 0 && (
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-[hsl(174,73%,40%)/20] flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-10 h-10 text-[hsl(174,73%,50%)]" />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Let's personalize your speech journey
                </h1>
                <p className="text-white/60 mb-8">
                  Answer a few quick questions so we can tailor therapy for you.
                </p>
              </div>
            )}

            {/* Step 1: Age Group */}
            {currentStep === 1 && (
              <div>
                <h2 className="text-2xl font-bold text-white text-center mb-2">
                  Who is this therapy for?
                </h2>
                <p className="text-white/50 text-center mb-8">Select your age group</p>
                <div className="space-y-3">
                  {AGE_GROUPS.map((age) => (
                    <button
                      key={age.value}
                      onClick={() => setAgeGroup(age.value)}
                      className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${
                        ageGroup === age.value
                          ? 'border-[hsl(174,73%,50%)] bg-[hsl(174,73%,40%)/10]'
                          : 'border-white/10 bg-white/5 hover:border-white/30'
                      }`}
                    >
                      <span className="text-3xl">{age.emoji}</span>
                      <div className="text-left">
                        <p className="text-white font-semibold">{age.label}</p>
                        <p className="text-white/50 text-sm">{age.sublabel}</p>
                      </div>
                      {ageGroup === age.value && (
                        <Check className="w-5 h-5 text-[hsl(174,73%,50%)] ml-auto" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}



            {/* Step 2: Goals */}
            {currentStep === 2 && (
              <div>
                <h2 className="text-2xl font-bold text-white text-center mb-2">
                  What would you like help with?
                </h2>
                <p className="text-white/50 text-center mb-6">Select all that apply</p>
                <div className="space-y-2">
                  {GOALS.map((goal) => (
                    <button
                      key={goal.value}
                      onClick={() => handleGoalToggle(goal.value)}
                      className={`w-full p-3 rounded-xl border-2 transition-all flex items-center gap-3 ${
                        goals.includes(goal.value)
                          ? 'border-[hsl(174,73%,50%)] bg-[hsl(174,73%,40%)/10]'
                          : 'border-white/10 bg-white/5 hover:border-white/30'
                      }`}
                    >
                      <span className="text-xl">{goal.icon}</span>
                      <span className="text-white font-medium text-left flex-1">{goal.label}</span>
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                        goals.includes(goal.value)
                          ? 'border-[hsl(174,73%,50%)] bg-[hsl(174,73%,50%)]'
                          : 'border-white/30'
                      }`}>
                        {goals.includes(goal.value) && (
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Difficulty */}
            {currentStep === 3 && (
              <div>
                <h2 className="text-2xl font-bold text-white text-center mb-2">
                  How would you rate the speech difficulty?
                </h2>
                <p className="text-white/50 text-center mb-8">This helps us customize exercise intensity</p>
                <div className="space-y-3">
                  {DIFFICULTIES.map((diff) => (
                    <button
                      key={diff.value}
                      onClick={() => setDifficulty(diff.value)}
                      className={`w-full p-4 rounded-xl border-2 transition-all flex items-center justify-between ${
                        difficulty === diff.value
                          ? `border-[hsl(174,73%,50%)] ${diff.color}`
                          : 'border-white/10 bg-white/5 hover:border-white/30'
                      }`}
                    >
                      <div className="text-left">
                        <p className="text-white font-semibold">{diff.label}</p>
                        <p className="text-white/50 text-sm">{diff.sublabel}</p>
                      </div>
                      {difficulty === diff.value && (
                        <Check className="w-5 h-5 text-[hsl(174,73%,50%)]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Complete */}
            {currentStep === 4 && (
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-[hsl(174,73%,40%)/20] flex items-center justify-center mx-auto mb-6">
                  <PartyPopper className="w-10 h-10 text-[hsl(174,73%,50%)]" />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Your therapy plan is ready 🎉
                </h1>
                <p className="text-white/60 mb-4">
                  We've customized your CareVoice experience based on your preferences.
                </p>
                <div className="bg-white/5 rounded-xl p-4 mb-6 text-left">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-[hsl(174,73%,50%)]" />
                    <span className="text-white/70 text-sm">Age Group:</span>
                    <span className="text-white font-medium text-sm capitalize">{ageGroup}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-[hsl(174,73%,50%)]" />
                    <span className="text-white/70 text-sm">Goals:</span>
                    <span className="text-white font-medium text-sm">{goals.length} selected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-[hsl(174,73%,50%)]" />
                    <span className="text-white/70 text-sm">Difficulty:</span>
                    <span className="text-white font-medium text-sm capitalize">{difficulty}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Button */}
            <Button
              onClick={handleNext}
              disabled={!canProceed() || isSubmitting}
              className="w-full h-12 rounded-full mt-6 bg-[hsl(174,73%,40%)] hover:bg-[hsl(174,73%,35%)] text-white font-semibold transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </span>
              ) : currentStep === 4 ? (
                <span className="flex items-center gap-2">
                  Go to Dashboard
                  <ArrowRight className="w-5 h-5" />
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Continue
                  <ArrowRight className="w-5 h-5" />
                </span>
              )}
            </Button>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Step Label */}
      <p className="text-white/40 text-sm mt-6">
        Step {currentStep + 1} of {STEPS.length}
      </p>
    </div>
  );
};

export default Onboarding;
