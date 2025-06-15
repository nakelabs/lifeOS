
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
      console.log('No user found, clearing courses');
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
          title: "Database Error",
          description: `Failed to fetch your courses: ${error.message}`,
          variant: "destructive",
        });
        return;
      }

      console.log('Successfully fetched user courses:', data?.length || 0);
      setCourses(data || []);
    } catch (error) {
      console.error('Error in fetchUserCourses:', error);
      toast({
        title: "Error",
        description: "Failed to load your courses",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createCourse = async (courseData: CreateCourseData) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to create a course",
        variant: "destructive",
      });
      return { error: 'Not authenticated' };
    }

    if (!courseData.title?.trim() || !courseData.description?.trim()) {
      toast({
        title: "Invalid Data",
        description: "Course title and description are required",
        variant: "destructive",
      });
      return { error: 'Missing required fields' };
    }

    try {
      console.log('Creating course:', courseData);
      
      const { data, error } = await supabase
        .from('user_courses')
        .insert({
          user_id: user.id,
          title: courseData.title.trim(),
          description: courseData.description.trim(),
          course_url: courseData.course_url?.trim() || null,
          instructor: courseData.instructor?.trim() || null,
          duration: courseData.duration?.trim() || null,
          difficulty: courseData.difficulty || 'Beginner',
          total_lessons: courseData.total_lessons || 0,
          target_completion_date: courseData.target_completion_date || null,
          notes: courseData.notes?.trim() || null,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating course:', error);
        toast({
          title: "Creation Failed",
          description: `Failed to create course: ${error.message}`,
          variant: "destructive",
        });
        return { error: error.message };
      }

      console.log('Course created successfully:', data);
      
      toast({
        title: "Success!",
        description: `Course "${courseData.title}" added to your learning path`,
      });

      // Refresh the courses list
      setTimeout(() => {
        fetchUserCourses();
      }, 100);
      
      return { data };
    } catch (error) {
      console.error('Error in createCourse:', error);
      toast({
        title: "Error",
        description: "Failed to create course",
        variant: "destructive",
      });
      return { error: 'Failed to create course' };
    }
  };

  const updateCourseProgress = async (courseId: string, progress: number, completedLessons?: number) => {
    if (!user) return { error: 'Not authenticated' };

    if (!courseId || progress < 0 || progress > 100) {
      return { error: 'Invalid course data' };
    }

    try {
      console.log('Updating course progress:', { courseId, progress, completedLessons });
      
      const updates: any = { 
        progress: Math.max(0, Math.min(100, progress)),
        updated_at: new Date().toISOString()
      };
      
      if (completedLessons !== undefined && completedLessons >= 0) {
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
        toast({
          title: "Update Failed",
          description: `Failed to update progress: ${error.message}`,
          variant: "destructive",
        });
        return { error: error.message };
      }

      console.log('Course progress updated successfully:', data);
      
      // Refresh courses list
      setTimeout(() => {
        fetchUserCourses();
      }, 100);
      
      return { data };
    } catch (error) {
      console.error('Error in updateCourseProgress:', error);
      return { error: 'Failed to update progress' };
    }
  };

  const deleteCourse = async (courseId: string) => {
    if (!user) return { error: 'Not authenticated' };

    try {
      console.log('Deleting course:', courseId);
      
      const { error } = await supabase
        .from('user_courses')
        .delete()
        .eq('id', courseId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting course:', error);
        return { error: error.message };
      }

      console.log('Course deleted successfully');
      fetchUserCourses(); // Refresh list
      return { success: true };
    } catch (error) {
      console.error('Error in deleteCourse:', error);
      return { error: 'Failed to delete course' };
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
    deleteCourse,
    refetch: fetchUserCourses,
  };
};
