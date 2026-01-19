
-- Add pro_popup_seen column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN pro_popup_seen BOOLEAN NOT NULL DEFAULT false;
