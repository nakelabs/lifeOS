
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface UserCourse {
  id: string;
  title: string;
  description: string;
  status: string | null;
  progress: number | null;
  completed_lessons: number | null;
  total_lessons: number | null;
  difficulty: string | null;
  duration: string | null;
  instructor: string | null;
  start_date: string | null;
  target_completion_date: string | null;
  created_at: string;
}

interface CourseCompletion {
  id: string;
  course_title: string;
  completed_at: string;
  duration_taken: string | null;
  total_lessons: number | null;
  final_notes: string | null;
}

export const useLearningData = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<UserCourse[]>([]);
  const [completions, setCompletions] = useState<CourseCompletion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchLearningData();
    } else {
      setCourses([]);
      setCompletions([]);
      setLoading(false);
    }
  }, [user]);

  const fetchLearningData = async () => {
    if (!user) return;

    try {
      console.log('Fetching learning data for user:', user.id);
      
      // Fetch user courses
      const { data: coursesData, error: coursesError } = await supabase
        .from('user_courses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (coursesError) {
        console.error('Error fetching courses:', coursesError);
      } else {
        setCourses(coursesData || []);
      }

      // Fetch course completions
      const { data: completionsData, error: completionsError } = await supabase
        .from('course_completions')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false });

      if (completionsError) {
        console.error('Error fetching completions:', completionsError);
      } else {
        setCompletions(completionsData || []);
      }

    } catch (error) {
      console.error('Error fetching learning data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActiveCourses = () => {
    return courses.filter(course => course.status === 'active');
  };

  const getCompletedCourses = () => {
    return courses.filter(course => course.status === 'completed');
  };

  const getTotalProgress = () => {
    if (courses.length === 0) return 0;
    const totalProgress = courses.reduce((sum, course) => sum + (course.progress || 0), 0);
    return Math.round(totalProgress / courses.length);
  };

  return {
    courses,
    completions,
    loading,
    getActiveCourses,
    getCompletedCourses,
    getTotalProgress,
    refetch: fetchLearningData
  };
};
