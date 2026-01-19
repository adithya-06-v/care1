-- Create role enum
CREATE TYPE public.app_role AS ENUM ('therapist', 'user');

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles (bypasses RLS, prevents recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Therapists can view all roles"
ON public.user_roles
FOR SELECT
USING (public.has_role(auth.uid(), 'therapist'));

-- Create therapist_patient_assignments table
CREATE TABLE public.therapist_patient_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  therapist_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  patient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  notes TEXT,
  UNIQUE (therapist_id, patient_id)
);

ALTER TABLE public.therapist_patient_assignments ENABLE ROW LEVEL SECURITY;

-- Therapists can view their own assignments
CREATE POLICY "Therapists can view their assignments"
ON public.therapist_patient_assignments
FOR SELECT
USING (public.has_role(auth.uid(), 'therapist') AND therapist_id = auth.uid());

CREATE POLICY "Therapists can create assignments"
ON public.therapist_patient_assignments
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'therapist') AND therapist_id = auth.uid());

CREATE POLICY "Therapists can update their assignments"
ON public.therapist_patient_assignments
FOR UPDATE
USING (public.has_role(auth.uid(), 'therapist') AND therapist_id = auth.uid());

CREATE POLICY "Therapists can delete their assignments"
ON public.therapist_patient_assignments
FOR DELETE
USING (public.has_role(auth.uid(), 'therapist') AND therapist_id = auth.uid());

-- Create custom_exercises table for therapist-assigned exercises
CREATE TABLE public.custom_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  therapist_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  patient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  instruction TEXT NOT NULL,
  content TEXT NOT NULL,
  exercise_type TEXT NOT NULL DEFAULT 'word_repetition',
  difficulty TEXT NOT NULL DEFAULT 'beginner',
  priority INTEGER DEFAULT 1,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.custom_exercises ENABLE ROW LEVEL SECURITY;

-- Therapists can manage custom exercises they created
CREATE POLICY "Therapists can view custom exercises they created"
ON public.custom_exercises
FOR SELECT
USING (public.has_role(auth.uid(), 'therapist') AND therapist_id = auth.uid());

CREATE POLICY "Therapists can create custom exercises"
ON public.custom_exercises
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'therapist') AND therapist_id = auth.uid());

CREATE POLICY "Therapists can update custom exercises they created"
ON public.custom_exercises
FOR UPDATE
USING (public.has_role(auth.uid(), 'therapist') AND therapist_id = auth.uid());

CREATE POLICY "Therapists can delete custom exercises they created"
ON public.custom_exercises
FOR DELETE
USING (public.has_role(auth.uid(), 'therapist') AND therapist_id = auth.uid());

-- Patients can view exercises assigned to them
CREATE POLICY "Patients can view their assigned exercises"
ON public.custom_exercises
FOR SELECT
USING (patient_id = auth.uid());

-- Patients can update completion status of their exercises
CREATE POLICY "Patients can update their exercise completion"
ON public.custom_exercises
FOR UPDATE
USING (patient_id = auth.uid());

-- Allow therapists to view profiles of their assigned patients
CREATE POLICY "Therapists can view assigned patient profiles"
ON public.profiles
FOR SELECT
USING (
  public.has_role(auth.uid(), 'therapist') 
  AND EXISTS (
    SELECT 1 FROM public.therapist_patient_assignments 
    WHERE therapist_id = auth.uid() AND patient_id = profiles.user_id
  )
);

-- Allow therapists to view sessions of their assigned patients
CREATE POLICY "Therapists can view assigned patient sessions"
ON public.sessions
FOR SELECT
USING (
  public.has_role(auth.uid(), 'therapist') 
  AND EXISTS (
    SELECT 1 FROM public.therapist_patient_assignments 
    WHERE therapist_id = auth.uid() AND patient_id = sessions.user_id
  )
);

-- Allow therapists to view exercise results of their assigned patients
CREATE POLICY "Therapists can view assigned patient exercise results"
ON public.exercise_results
FOR SELECT
USING (
  public.has_role(auth.uid(), 'therapist') 
  AND EXISTS (
    SELECT 1 FROM public.therapist_patient_assignments 
    WHERE therapist_id = auth.uid() AND patient_id = exercise_results.user_id
  )
);

-- Create trigger for updated_at on custom_exercises
CREATE TRIGGER update_custom_exercises_updated_at
BEFORE UPDATE ON public.custom_exercises
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster lookups
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_custom_exercises_patient_id ON public.custom_exercises(patient_id);
CREATE INDEX idx_therapist_assignments_therapist ON public.therapist_patient_assignments(therapist_id);
CREATE INDEX idx_therapist_assignments_patient ON public.therapist_patient_assignments(patient_id);