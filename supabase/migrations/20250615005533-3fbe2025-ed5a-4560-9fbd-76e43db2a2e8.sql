
-- Create table for course recommendations based on user interests
CREATE TABLE public.course_recommendations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  topic TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  estimated_duration TEXT NOT NULL,
  skills TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for user courses (courses they've added to track)
CREATE TABLE public.user_courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  course_url TEXT,
  instructor TEXT,
  duration TEXT,
  difficulty TEXT DEFAULT 'Beginner',
  progress INTEGER DEFAULT 0,
  total_lessons INTEGER DEFAULT 0,
  completed_lessons INTEGER DEFAULT 0,
  start_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  target_completion_date TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'active',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for user interests
CREATE TABLE public.user_interests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  interests TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.course_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_interests ENABLE ROW LEVEL SECURITY;

-- RLS policies for course_recommendations (public read access)
CREATE POLICY "Anyone can view course recommendations" 
  ON public.course_recommendations 
  FOR SELECT 
  USING (true);

-- RLS policies for user_courses
CREATE POLICY "Users can view their own courses" 
  ON public.user_courses 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own courses" 
  ON public.user_courses 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own courses" 
  ON public.user_courses 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own courses" 
  ON public.user_courses 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- RLS policies for user_interests
CREATE POLICY "Users can view their own interests" 
  ON public.user_interests 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own interests" 
  ON public.user_interests 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own interests" 
  ON public.user_interests 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Insert some sample course recommendations
INSERT INTO public.course_recommendations (topic, title, description, difficulty, estimated_duration, skills) VALUES
('programming', 'Complete Python Bootcamp', 'Learn Python from basics to advanced concepts including web development, data science, and automation', 'Beginner', '12 weeks', ARRAY['Python', 'Web Development', 'Data Analysis']),
('programming', 'JavaScript Mastery Course', 'Master modern JavaScript, ES6+, DOM manipulation, and async programming', 'Intermediate', '8 weeks', ARRAY['JavaScript', 'ES6', 'DOM', 'Async Programming']),
('design', 'UI/UX Design Complete Course', 'Learn user interface and user experience design from scratch with real projects', 'Beginner', '10 weeks', ARRAY['UI Design', 'UX Research', 'Figma', 'Prototyping']),
('design', 'Advanced Graphic Design', 'Master Adobe Creative Suite and advanced design principles', 'Advanced', '6 weeks', ARRAY['Photoshop', 'Illustrator', 'Design Theory']),
('business', 'Digital Marketing Fundamentals', 'Complete guide to online marketing, SEO, social media, and analytics', 'Beginner', '8 weeks', ARRAY['SEO', 'Social Media', 'Analytics', 'Content Marketing']),
('business', 'Project Management Professional', 'Learn Agile, Scrum, and traditional project management methodologies', 'Intermediate', '10 weeks', ARRAY['Agile', 'Scrum', 'Leadership', 'Planning']),
('data-science', 'Data Science with Python', 'Complete data science course covering statistics, machine learning, and visualization', 'Intermediate', '16 weeks', ARRAY['Python', 'Statistics', 'Machine Learning', 'Data Visualization']),
('data-science', 'SQL for Data Analysis', 'Master SQL for data analysis and database management', 'Beginner', '6 weeks', ARRAY['SQL', 'Database Design', 'Data Analysis']);
