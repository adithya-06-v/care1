-- Create table for tracking exercise mastery and difficulty progression
CREATE TABLE public.user_exercise_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  exercise_text TEXT NOT NULL,
  phoneme_pattern TEXT,
  mastery_status TEXT NOT NULL DEFAULT 'learning' CHECK (mastery_status IN ('weak', 'learning', 'mastered')),
  total_attempts INTEGER NOT NULL DEFAULT 0,
  successful_attempts INTEGER NOT NULL DEFAULT 0,
  average_score NUMERIC DEFAULT 0,
  last_practiced_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, exercise_text)
);

-- Create table for user difficulty level tracking
CREATE TABLE public.user_difficulty_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  current_difficulty TEXT NOT NULL DEFAULT 'beginner' CHECK (current_difficulty IN ('beginner', 'moderate', 'severe')),
  avg_session_score NUMERIC DEFAULT 0,
  total_mastered INTEGER DEFAULT 0,
  total_weak INTEGER DEFAULT 0,
  sessions_at_current_level INTEGER DEFAULT 0,
  difficulty_adjusted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_exercise_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_difficulty_progress ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_exercise_progress
CREATE POLICY "Users can view their own exercise progress" 
ON public.user_exercise_progress 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own exercise progress" 
ON public.user_exercise_progress 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own exercise progress" 
ON public.user_exercise_progress 
FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS policies for user_difficulty_progress
CREATE POLICY "Users can view their own difficulty progress" 
ON public.user_difficulty_progress 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own difficulty progress" 
ON public.user_difficulty_progress 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own difficulty progress" 
ON public.user_difficulty_progress 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Add indexes for performance
CREATE INDEX idx_user_exercise_progress_user_id ON public.user_exercise_progress(user_id);
CREATE INDEX idx_user_exercise_progress_mastery ON public.user_exercise_progress(user_id, mastery_status);
CREATE INDEX idx_user_difficulty_progress_user_id ON public.user_difficulty_progress(user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_user_exercise_progress_updated_at
BEFORE UPDATE ON public.user_exercise_progress
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_difficulty_progress_updated_at
BEFORE UPDATE ON public.user_difficulty_progress
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();