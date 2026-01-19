-- Create table for sentence performance tracking
CREATE TABLE public.sentence_performance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  session_id UUID REFERENCES public.sessions(id),
  sentence_text TEXT NOT NULL,
  recognized_text TEXT,
  accuracy_score NUMERIC DEFAULT 0,
  word_count INTEGER NOT NULL DEFAULT 0,
  correct_words INTEGER NOT NULL DEFAULT 0,
  skipped_words TEXT[] DEFAULT '{}',
  incorrect_words TEXT[] DEFAULT '{}',
  needs_word_drill BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.sentence_performance ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own sentence performance" 
ON public.sentence_performance 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own sentence performance" 
ON public.sentence_performance 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sentence performance" 
ON public.sentence_performance 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_sentence_performance_user_id ON public.sentence_performance(user_id);
CREATE INDEX idx_sentence_performance_session_id ON public.sentence_performance(session_id);
CREATE INDEX idx_sentence_performance_needs_drill ON public.sentence_performance(user_id, needs_word_drill) WHERE needs_word_drill = true;