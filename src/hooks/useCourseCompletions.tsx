
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';

interface CourseCompletion {
  id: string;
  user_id: string;
  course_id: string;
  course_title: string;
  completed_at: string;
  total_lessons: number;
  duration_taken?: string;
  final_notes?: string;
  created_at: string;
}

export const useCourseCompletions = () => {
  const { user } = useAuth();
  const [completions, setCompletions] = useState<CourseCompletion[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchCompletions = async () => {
    if (!user) {
      console.log('No user found, clearing completions');
      setCompletions([]);
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching course completions for user:', user.id);
      
      const { data, error } = await supabase
        .from('course_completions')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false });

      if (error) {
        console.error('Error fetching completions:', error);
        toast({
          title: "Database Error",
          description: `Failed to fetch completions: ${error.message}`,
          variant: "destructive",
        });
        return;
      }

      console.log('Successfully fetched completions:', data?.length || 0);
      setCompletions(data || []);
    } catch (error) {
      console.error('Error in fetchCompletions:', error);
      toast({
        title: "Error",
        description: "Failed to load course completions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const markCourseCompleted = async (
    courseId: string, 
    courseTitle: string, 
    totalLessons: number, 
    finalNotes?: string
  ) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to mark courses as completed",
        variant: "destructive",
      });
      return { error: 'Not authenticated' };
    }

    if (!courseId || !courseTitle) {
      toast({
        title: "Invalid Data",
        description: "Course ID and title are required",
        variant: "destructive",
      });
      return { error: 'Missing required fields' };
    }

    try {
      console.log('Marking course as completed:', { courseId, courseTitle, totalLessons });
      
      // Check if course is already completed
      const { data: existingCompletion } = await supabase
        .from('course_completions')
        .select('id')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .maybeSingle();

      if (existingCompletion) {
        toast({
          title: "Already Completed",
          description: "This course has already been marked as completed",
          variant: "default",
        });
        return { error: 'Course already completed' };
      }

      const { data, error } = await supabase
        .from('course_completions')
        .insert({
          user_id: user.id,
          course_id: courseId,
          course_title: courseTitle,
          total_lessons: totalLessons || 0,
          final_notes: finalNotes?.trim() || null
        })
        .select()
        .single();

      if (error) {
        console.error('Error marking course completed:', error);
        toast({
          title: "Completion Failed",
          description: `Failed to mark course as completed: ${error.message}`,
          variant: "destructive",
        });
        return { error: error.message };
      }

      console.log('Course marked as completed successfully:', data);
      
      toast({
        title: "🎉 Course Completed!",
        description: `Congratulations on completing "${courseTitle}"!`,
        duration: 5000,
      });

      // Refresh the completions list
      setTimeout(() => {
        fetchCompletions();
      }, 100);

      return { data };
    } catch (error) {
      console.error('Error in markCourseCompleted:', error);
      toast({
        title: "Error",
        description: "Failed to mark course as completed",
        variant: "destructive",
      });
      return { error: 'Failed to mark course as completed' };
    }
  };

  const deleteCompletion = async (completionId: string) => {
    if (!user) return { error: 'Not authenticated' };

    try {
      console.log('Deleting course completion:', completionId);
      
      const { error } = await supabase
        .from('course_completions')
        .delete()
        .eq('id', completionId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting completion:', error);
        return { error: error.message };
      }

      console.log('Course completion deleted successfully');
      fetchCompletions(); // Refresh list
      return { success: true };
    } catch (error) {
      console.error('Error in deleteCompletion:', error);
      return { error: 'Failed to delete completion' };
    }
  };

  useEffect(() => {
    fetchCompletions();
  }, [user]);

  return {
    completions,
    loading,
    markCourseCompleted,
    deleteCompletion,
    refetch: fetchCompletions,
  };
};
