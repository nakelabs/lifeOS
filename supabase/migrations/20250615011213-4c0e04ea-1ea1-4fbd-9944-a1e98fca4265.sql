
-- Create table for course completions
CREATE TABLE public.course_completions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  course_id UUID REFERENCES public.user_courses NOT NULL,
  course_title TEXT NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  total_lessons INTEGER DEFAULT 0,
  duration_taken TEXT,
  final_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for user activity streaks
CREATE TABLE public.user_streaks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE DEFAULT CURRENT_DATE,
  streak_start_date DATE DEFAULT CURRENT_DATE,
  total_active_days INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.course_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_streaks ENABLE ROW LEVEL SECURITY;

-- RLS policies for course_completions
CREATE POLICY "Users can view their own completions" 
  ON public.course_completions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own completions" 
  ON public.course_completions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- RLS policies for user_streaks
CREATE POLICY "Users can view their own streaks" 
  ON public.user_streaks 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own streaks" 
  ON public.user_streaks 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own streaks" 
  ON public.user_streaks 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Function to update user streak
CREATE OR REPLACE FUNCTION update_user_streak(p_user_id UUID)
RETURNS VOID AS $$
DECLARE
  current_date_val DATE := CURRENT_DATE;
  last_activity DATE;
  current_streak_val INTEGER;
  longest_streak_val INTEGER;
BEGIN
  -- Get or create streak record
  INSERT INTO public.user_streaks (user_id, last_activity_date, current_streak, longest_streak, total_active_days)
  VALUES (p_user_id, current_date_val, 1, 1, 1)
  ON CONFLICT (user_id) DO NOTHING;

  -- Get current streak data
  SELECT last_activity_date, current_streak, longest_streak 
  INTO last_activity, current_streak_val, longest_streak_val
  FROM public.user_streaks 
  WHERE user_id = p_user_id;

  -- If activity is today, do nothing
  IF last_activity = current_date_val THEN
    RETURN;
  END IF;

  -- If activity was yesterday, increment streak
  IF last_activity = current_date_val - INTERVAL '1 day' THEN
    current_streak_val := current_streak_val + 1;
  -- If activity was more than 1 day ago, reset streak
  ELSIF last_activity < current_date_val - INTERVAL '1 day' THEN
    current_streak_val := 1;
  END IF;

  -- Update longest streak if current is higher
  IF current_streak_val > longest_streak_val THEN
    longest_streak_val := current_streak_val;
  END IF;

  -- Update the record
  UPDATE public.user_streaks 
  SET 
    current_streak = current_streak_val,
    longest_streak = longest_streak_val,
    last_activity_date = current_date_val,
    total_active_days = total_active_days + 1,
    updated_at = now()
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- Add unique constraint for user_streaks
ALTER TABLE public.user_streaks ADD CONSTRAINT user_streaks_user_id_unique UNIQUE (user_id);
