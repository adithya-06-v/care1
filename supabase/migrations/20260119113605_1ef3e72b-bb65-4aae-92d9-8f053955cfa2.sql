-- Create exercise_results table to store individual exercise results
CREATE TABLE public.exercise_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  session_id UUID REFERENCES public.sessions(id) ON DELETE CASCADE,
  exercise_text TEXT NOT NULL,
  recognized_text TEXT,
  score NUMERIC,
  feedback TEXT,
  improvement_tip TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.exercise_results ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own exercise results" 
ON public.exercise_results 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own exercise results" 
ON public.exercise_results 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own exercise results" 
ON public.exercise_results 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Add index for faster queries
CREATE INDEX idx_exercise_results_user_id ON public.exercise_results(user_id);
CREATE INDEX idx_exercise_results_session_id ON public.exercise_results(session_id);