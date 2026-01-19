import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Eye, EyeOff, Mail, Lock, User, Stethoscope } from 'lucide-react';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';

const emailSchema = z.string().email('Please enter a valid email address');
const passwordSchema = z.string().min(6, 'Password must be at least 6 characters');
const nameSchema = z.string().min(2, 'Name must be at least 2 characters');

const Auth = () => {
  const [searchParams] = useSearchParams();
  const isTherapistMode = searchParams.get('mode') === 'therapist';
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; fullName?: string }>({});
  
  const { signIn, signUp, signInWithGoogle, user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserStatusAndRedirect = async () => {
      if (!loading && user) {
        // Fetch all roles for the user from Supabase
        const { data: roles, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);

        if (error) {
          console.error('Error fetching roles:', error);
        }

        const hasTherapistRole = roles?.some(r => r.role === 'therapist');

        if (hasTherapistRole) {
          // Therapist always goes to therapist dashboard
          navigate('/therapist', { replace: true });
          return;
        }

        // Regular user - check onboarding status
        const { data: profile } = await supabase
          .from('profiles')
          .select('onboarding_completed')
          .eq('user_id', user.id)
          .maybeSingle();

        if (profile?.onboarding_completed) {
          navigate('/dashboard', { replace: true });
        } else {
          navigate('/onboarding', { replace: true });
        }
      }
    };

    checkUserStatusAndRedirect();
  }, [user, loading, navigate]);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string; fullName?: string } = {};
    
    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      newErrors.email = emailResult.error.errors[0].message;
    }
    
    const passwordResult = passwordSchema.safeParse(password);
    if (!passwordResult.success) {
      newErrors.password = passwordResult.error.errors[0].message;
    }
    
    if (!isLogin) {
      const nameResult = nameSchema.safeParse(fullName);
      if (!nameResult.success) {
        newErrors.fullName = nameResult.error.errors[0].message;
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          toast({
            title: 'Login Failed',
            description: error.message.includes('Invalid login credentials') 
              ? 'Invalid email or password. Please try again.'
              : error.message,
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Welcome back!',
            description: 'You have successfully logged in.',
          });
          // Redirect handled by useEffect after checking onboarding
        }
      } else {
        const { error } = await signUp(email, password, fullName);
        if (error) {
          toast({
            title: error.message.includes('User already registered') ? 'Account Exists' : 'Signup Failed',
            description: error.message.includes('User already registered')
              ? 'An account with this email already exists. Please login instead.'
              : error.message,
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Account Created!',
            description: 'Welcome to CareVoice! Let\'s set up your profile...',
          });
          // Redirect to onboarding handled by useEffect
        }
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        toast({
          title: 'Google Sign-in Failed',
          description: error.message,
          variant: 'destructive',
        });
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setEmail('');
    setPassword('');
    setFullName('');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[hsl(174,45%,8%)]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[hsl(174,73%,50%)]"></div>
      </div>
    );
  }

  const panelVariants = {
    active: {
      x: '0%',
      opacity: 1,
      filter: 'blur(0px)',
      transition: {
        duration: 0.7,
        ease: 'easeInOut',
        when: 'beforeChildren',
        staggerChildren: 0.08,
      },
    },
    left: {
      x: '-110%',
      opacity: 0,
      filter: 'blur(10px)',
      transition: { duration: 0.45, ease: 'easeInOut' },
    },
    right: {
      x: '110%',
      opacity: 0,
      filter: 'blur(10px)',
      transition: { duration: 0.45, ease: 'easeInOut' },
    },
  } as const;

  const itemVariants = {
    active: { y: 0, opacity: 1, transition: { duration: 0.35, ease: 'easeOut' } },
    left: { y: 12, opacity: 0, transition: { duration: 0.2 } },
    right: { y: 12, opacity: 0, transition: { duration: 0.2 } },
  } as const;

  return (
    <div className="min-h-screen bg-[hsl(174,45%,8%)] flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Main auth wrapper */}
      <div 
        className="relative w-full max-w-[800px] min-h-[550px] md:h-[500px] border-2 border-[hsl(174,73%,40%)] overflow-hidden bg-[hsl(174,45%,8%)]"
        style={{ boxShadow: '0 0 25px hsl(174,73%,40%)', zIndex: 10 }}
      >
        {/* Animated background shapes - INSIDE the container */}
        <motion.div
          className="absolute right-0 top-[-5px] h-[600px] w-[850px] hidden md:block pointer-events-none"
          style={{
            background: 'linear-gradient(45deg, hsl(174,45%,8%), hsl(174,73%,40%))',
            transformOrigin: 'bottom right',
            zIndex: 1,
          }}
          animate={{
            rotate: isLogin ? 10 : 0,
            skewY: isLogin ? 40 : 0,
          }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute left-[250px] top-full h-[700px] w-[850px] hidden md:block pointer-events-none"
          style={{
            background: 'hsl(174,45%,8%)',
            borderTop: '3px solid hsl(174,73%,40%)',
            transformOrigin: 'bottom left',
            zIndex: 2,
          }}
          animate={{
            rotate: isLogin ? 0 : -11,
            skewY: isLogin ? 0 : -41,
          }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
        />

        {/* Desktop Layout */}
        <div className="hidden md:block h-full relative" style={{ zIndex: 5 }}>
          {/* Sign In Panel (slides INSIDE the container) */}
          <motion.div
            variants={panelVariants}
            initial={false}
            animate={isLogin ? 'active' : 'left'}
            className="absolute top-0 left-0 w-1/2 h-full flex flex-col justify-center px-10"
            style={{ pointerEvents: isLogin ? 'auto' : 'none' }}
          >
            <motion.h2 variants={itemVariants} className="text-3xl font-bold text-white text-center mb-6">
              Login
            </motion.h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div variants={itemVariants} className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 bg-transparent border-b-2 border-white/50 focus:border-[hsl(174,73%,50%)] text-white outline-none transition-colors peer pr-8"
                  placeholder=" "
                  required
                />
                <label className="absolute left-0 top-3 text-white/70 transition-all peer-focus:-top-4 peer-focus:text-sm peer-focus:text-[hsl(174,73%,50%)] peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-sm peer-[:not(:placeholder-shown)]:text-[hsl(174,73%,50%)]">
                  Email
                </label>
                <Mail className="absolute right-0 top-3 w-5 h-5 text-white/50" />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
              </motion.div>

              <motion.div variants={itemVariants} className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 bg-transparent border-b-2 border-white/50 focus:border-[hsl(174,73%,50%)] text-white outline-none transition-colors peer pr-8"
                  placeholder=" "
                  required
                />
                <label className="absolute left-0 top-3 text-white/70 transition-all peer-focus:-top-4 peer-focus:text-sm peer-focus:text-[hsl(174,73%,50%)] peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-sm peer-[:not(:placeholder-shown)]:text-[hsl(174,73%,50%)]">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-3 text-white/50 hover:text-[hsl(174,73%,50%)]"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
                {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
              </motion.div>

              <motion.button
                variants={itemVariants}
                type="submit"
                disabled={isLoading}
                className="w-full h-11 rounded-full border-2 border-[hsl(174,73%,40%)] bg-transparent text-white font-semibold relative overflow-hidden group transition-all hover:text-white disabled:opacity-50"
              >
                <span className="absolute inset-0 bg-gradient-to-b from-[hsl(174,45%,8%)] via-[hsl(174,73%,40%)] to-[hsl(174,45%,8%)] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                <span className="relative z-10">{isLoading ? 'Signing In...' : 'Login'}</span>
              </motion.button>

              {/* Divider */}
              <motion.div variants={itemVariants} className="flex items-center gap-4 my-4">
                <div className="flex-1 h-px bg-white/20" />
                <span className="text-white/50 text-sm">or</span>
                <div className="flex-1 h-px bg-white/20" />
              </motion.div>

              {/* Google Sign In Button */}
              <motion.button
                variants={itemVariants}
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full h-11 rounded-full border-2 border-white/30 bg-white/5 text-white font-semibold flex items-center justify-center gap-3 hover:bg-white/10 transition-all disabled:opacity-50"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign in with Google
              </motion.button>

              <motion.div variants={itemVariants} className="text-center text-sm text-white/70 mt-4">
                Don't have an account?{' '}
                <button type="button" onClick={switchMode} className="text-[hsl(174,73%,50%)] font-semibold hover:underline">
                  Sign Up
                </button>
              </motion.div>
            </form>
          </motion.div>

          {/* Sign Up Panel (slides INSIDE the container) */}
          <motion.div
            variants={panelVariants}
            initial={false}
            animate={isLogin ? 'right' : 'active'}
            className="absolute top-0 right-0 w-1/2 h-full flex flex-col justify-center px-10"
            style={{ pointerEvents: !isLogin ? 'auto' : 'none' }}
          >
            <motion.h2 variants={itemVariants} className="text-3xl font-bold text-white text-center mb-6">
              Register
            </motion.h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <motion.div variants={itemVariants} className="relative">
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full h-12 bg-transparent border-b-2 border-white/50 focus:border-[hsl(174,73%,50%)] text-white outline-none transition-colors peer pr-8"
                  placeholder=" "
                  required
                />
                <label className="absolute left-0 top-3 text-white/70 transition-all peer-focus:-top-4 peer-focus:text-sm peer-focus:text-[hsl(174,73%,50%)] peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-sm peer-[:not(:placeholder-shown)]:text-[hsl(174,73%,50%)]">
                  Full Name
                </label>
                <User className="absolute right-0 top-3 w-5 h-5 text-white/50" />
                {errors.fullName && <p className="text-red-400 text-xs mt-1">{errors.fullName}</p>}
              </motion.div>

              <motion.div variants={itemVariants} className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 bg-transparent border-b-2 border-white/50 focus:border-[hsl(174,73%,50%)] text-white outline-none transition-colors peer pr-8"
                  placeholder=" "
                  required
                />
                <label className="absolute left-0 top-3 text-white/70 transition-all peer-focus:-top-4 peer-focus:text-sm peer-focus:text-[hsl(174,73%,50%)] peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-sm peer-[:not(:placeholder-shown)]:text-[hsl(174,73%,50%)]">
                  Email
                </label>
                <Mail className="absolute right-0 top-3 w-5 h-5 text-white/50" />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
              </motion.div>

              <motion.div variants={itemVariants} className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 bg-transparent border-b-2 border-white/50 focus:border-[hsl(174,73%,50%)] text-white outline-none transition-colors peer pr-8"
                  placeholder=" "
                  required
                />
                <label className="absolute left-0 top-3 text-white/70 transition-all peer-focus:-top-4 peer-focus:text-sm peer-focus:text-[hsl(174,73%,50%)] peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-sm peer-[:not(:placeholder-shown)]:text-[hsl(174,73%,50%)]">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-3 text-white/50 hover:text-[hsl(174,73%,50%)]"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
                {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
              </motion.div>

              <motion.button
                variants={itemVariants}
                type="submit"
                disabled={isLoading}
                className="w-full h-11 rounded-full border-2 border-[hsl(174,73%,40%)] bg-transparent text-white font-semibold relative overflow-hidden group transition-all hover:text-white disabled:opacity-50"
              >
                <span className="absolute inset-0 bg-gradient-to-b from-[hsl(174,45%,8%)] via-[hsl(174,73%,40%)] to-[hsl(174,45%,8%)] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                <span className="relative z-10">{isLoading ? 'Creating Account...' : 'Register'}</span>
              </motion.button>

              {/* Divider */}
              <motion.div variants={itemVariants} className="flex items-center gap-4 my-3">
                <div className="flex-1 h-px bg-white/20" />
                <span className="text-white/50 text-sm">or</span>
                <div className="flex-1 h-px bg-white/20" />
              </motion.div>

              {/* Google Sign Up Button */}
              <motion.button
                variants={itemVariants}
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full h-11 rounded-full border-2 border-white/30 bg-white/5 text-white font-semibold flex items-center justify-center gap-3 hover:bg-white/10 transition-all disabled:opacity-50"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign up with Google
              </motion.button>

              <motion.div variants={itemVariants} className="text-center text-sm text-white/70 mt-3">
                Already have an account?{' '}
                <button type="button" onClick={switchMode} className="text-[hsl(174,73%,50%)] font-semibold hover:underline">
                  Sign In
                </button>
              </motion.div>
            </form>
          </motion.div>

          {/* Welcome sections (slide INSIDE the container) */}
          <motion.div
            variants={panelVariants}
            initial={false}
            animate={isLogin ? 'active' : 'right'}
            className="absolute right-0 top-0 w-1/2 h-full flex flex-col justify-center text-right px-10 pr-20 pointer-events-none"
          >
            <motion.h2 variants={itemVariants} className="text-4xl font-bold text-white uppercase leading-tight">
              Welcome<br />Back!
            </motion.h2>
          </motion.div>

          <motion.div
            variants={panelVariants}
            initial={false}
            animate={isLogin ? 'left' : 'active'}
            className="absolute left-0 top-0 w-1/2 h-full flex flex-col justify-center text-left px-10 pl-10 pointer-events-none"
          >
            <motion.h2 variants={itemVariants} className="text-4xl font-bold text-white uppercase leading-tight">
              Welcome!
            </motion.h2>
          </motion.div>
        </div>


        {/* Mobile Layout */}
        <div className="md:hidden p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? 'mobile-signin' : 'mobile-signup'}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-2xl font-bold text-white text-center mb-6">
                {isLogin ? 'Login' : 'Register'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                {!isLogin && (
                  <div className="relative">
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full h-12 bg-transparent border-b-2 border-white/50 focus:border-[hsl(174,73%,50%)] text-white outline-none transition-colors peer pr-8"
                      placeholder=" "
                      required
                    />
                    <label className="absolute left-0 top-3 text-white/70 text-sm transition-all peer-focus:-top-4 peer-focus:text-xs peer-focus:text-[hsl(174,73%,50%)] peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-[hsl(174,73%,50%)]">
                      Full Name
                    </label>
                    <User className="absolute right-0 top-3 w-5 h-5 text-white/50" />
                    {errors.fullName && <p className="text-red-400 text-xs mt-1">{errors.fullName}</p>}
                  </div>
                )}

                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-12 bg-transparent border-b-2 border-white/50 focus:border-[hsl(174,73%,50%)] text-white outline-none transition-colors peer pr-8"
                    placeholder=" "
                    required
                  />
                  <label className="absolute left-0 top-3 text-white/70 text-sm transition-all peer-focus:-top-4 peer-focus:text-xs peer-focus:text-[hsl(174,73%,50%)] peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-[hsl(174,73%,50%)]">
                    Email
                  </label>
                  <Mail className="absolute right-0 top-3 w-5 h-5 text-white/50" />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-12 bg-transparent border-b-2 border-white/50 focus:border-[hsl(174,73%,50%)] text-white outline-none transition-colors peer pr-8"
                    placeholder=" "
                    required
                  />
                  <label className="absolute left-0 top-3 text-white/70 text-sm transition-all peer-focus:-top-4 peer-focus:text-xs peer-focus:text-[hsl(174,73%,50%)] peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-[hsl(174,73%,50%)]">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-3 text-white/50 hover:text-[hsl(174,73%,50%)]"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                  {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 rounded-full border-2 border-[hsl(174,73%,40%)] bg-transparent text-white font-semibold relative overflow-hidden group transition-all hover:text-white disabled:opacity-50"
                >
                  <span className="absolute inset-0 bg-gradient-to-b from-[hsl(174,45%,8%)] via-[hsl(174,73%,40%)] to-[hsl(174,45%,8%)] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                  <span className="relative z-10">
                    {isLoading ? (isLogin ? 'Signing In...' : 'Creating Account...') : (isLogin ? 'Login' : 'Register')}
                  </span>
                </button>

                {/* Divider */}
                <div className="flex items-center gap-4 my-4">
                  <div className="flex-1 h-px bg-white/20" />
                  <span className="text-white/50 text-sm">or</span>
                  <div className="flex-1 h-px bg-white/20" />
                </div>

                {/* Google Button */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="w-full h-11 rounded-full border-2 border-white/30 bg-white/5 text-white font-semibold flex items-center justify-center gap-3 hover:bg-white/10 transition-all disabled:opacity-50"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  {isLogin ? 'Sign in with Google' : 'Sign up with Google'}
                </button>

                <div className="text-center text-sm text-white/70 mt-4">
                  {isLogin ? "Don't have an account? " : 'Already have an account? '}
                  <button type="button" onClick={switchMode} className="text-[hsl(174,73%,50%)] font-semibold hover:underline">
                    {isLogin ? 'Sign Up' : 'Sign In'}
                  </button>
                </div>
              </form>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-sm text-white/50 z-10">
        <p>🔒 Your data is secure and encrypted</p>
      </div>
    </div>
  );
};

export default Auth;