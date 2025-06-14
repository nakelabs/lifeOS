
-- Create a table for user health goals
CREATE TABLE public.health_goals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  water_goal INTEGER DEFAULT 8,
  sleep_goal NUMERIC DEFAULT 8.0,
  exercise_goal INTEGER DEFAULT 30,
  heart_rate_target INTEGER DEFAULT 72,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.health_goals ENABLE ROW LEVEL SECURITY;

-- Create policies for health goals
CREATE POLICY "Users can view their own health goals" 
  ON public.health_goals 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own health goals" 
  ON public.health_goals 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own health goals" 
  ON public.health_goals 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own health goals" 
  ON public.health_goals 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create a function to automatically create default goals for new users
CREATE OR REPLACE FUNCTION public.create_default_health_goals()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.health_goals (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create default goals when a user signs up
CREATE TRIGGER on_auth_user_created_health_goals
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.create_default_health_goals();
