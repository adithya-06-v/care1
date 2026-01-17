-- Create achievements table to track user badges and accomplishments
CREATE TABLE public.achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  achievement_type TEXT NOT NULL,
  achievement_name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

-- RLS policies for achievements
CREATE POLICY "Users can view their own achievements" 
  ON public.achievements 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own achievements" 
  ON public.achievements 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Add index for faster queries
CREATE INDEX idx_achievements_user_id ON public.achievements(user_id);
CREATE INDEX idx_achievements_type ON public.achievements(achievement_type);

-- Add streak tracking fields to profiles
ALTER TABLE public.profiles 
  ADD COLUMN current_streak INTEGER DEFAULT 0,
  ADD COLUMN longest_streak INTEGER DEFAULT 0,
  ADD COLUMN last_session_date DATE;