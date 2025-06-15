
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';

interface UserCourse {
  id: string;
  user_id: string;
  title: string;
  description: string;
  course_url?: string;
  instructor?: string;
  duration?: string;
  difficulty: string;
  progress: number;
  total_lessons: number;
  completed_lessons: number;
  start_date: string;
  target_completion_date?: string;
  status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

interface CreateCourseData {
  title: string;
  description: string;
  course_url?: string;
  instructor?: string;
  duration?: string;
  difficulty?: string;
  total_lessons?: number;
  target_completion_date?: string;
  notes?: string;
}

export const useUserCourses = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<UserCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchUserCourses = async () => {
    if (!user) {
      setCourses([]);
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching user courses for user:', user.id);
      const { data, error } = await supabase
        .from('user_courses')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user courses:', error);
        toast({
          title: "Error",
          description: "Failed to fetch your courses",
          variant: "destructive",
        });
        return;
      }

      console.log('Fetched user courses:', data);
      setCourses(data || []);
    } catch (error) {
      console.error('Error in fetchUserCourses:', error);
    } finally {
      setLoading(false);
    }
  };

  const createCourse = async (courseData: CreateCourseData) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create a course",
        variant: "destructive",
      });
      return { error: 'Not authenticated' };
    }

    try {
      console.log('Creating course:', courseData);
      const { data, error } = await supabase
        .from('user_courses')
        .insert({
          user_id: user.id,
          ...courseData,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating course:', error);
        toast({
          title: "Error",
          description: "Failed to create course",
          variant: "destructive",
        });
        return { error: error.message };
      }

      console.log('Course created successfully:', data);
      toast({
        title: "Success!",
        description: "Course added to your learning path",
      });

      // Refresh the courses list
      fetchUserCourses();
      return { data };
    } catch (error) {
      console.error('Error in createCourse:', error);
      return { error: 'Failed to create course' };
    }
  };

  const updateCourseProgress = async (courseId: string, progress: number, completedLessons?: number) => {
    if (!user) return { error: 'Not authenticated' };

    try {
      console.log('Updating course progress:', { courseId, progress, completedLessons });
      const updates: any = { 
        progress,
        updated_at: new Date().toISOString()
      };
      
      if (completedLessons !== undefined) {
        updates.completed_lessons = completedLessons;
      }

      const { data, error } = await supabase
        .from('user_courses')
        .update(updates)
        .eq('id', courseId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating course progress:', error);
        return { error: error.message };
      }

      console.log('Course progress updated:', data);
      fetchUserCourses();
      return { data };
    } catch (error) {
      console.error('Error in updateCourseProgress:', error);
      return { error: 'Failed to update progress' };
    }
  };

  useEffect(() => {
    fetchUserCourses();
  }, [user]);

  return {
    courses,
    loading,
    createCourse,
    updateCourseProgress,
    refetch: fetchUserCourses,
  };
};
