
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
        return;
      }

      console.log('Fetched completions:', data);
      setCompletions(data || []);
    } catch (error) {
      console.error('Error in fetchCompletions:', error);
    } finally {
      setLoading(false);
    }
  };

  const markCourseCompleted = async (courseId: string, courseTitle: string, totalLessons: number, finalNotes?: string) => {
    if (!user) return { error: 'Not authenticated' };

    try {
      console.log('Marking course as completed:', { courseId, courseTitle });
      const { data, error } = await supabase
        .from('course_completions')
        .insert({
          user_id: user.id,
          course_id: courseId,
          course_title: courseTitle,
          total_lessons: totalLessons,
          final_notes: finalNotes
        })
        .select()
        .single();

      if (error) {
        console.error('Error marking course completed:', error);
        toast({
          title: "Error",
          description: "Failed to mark course as completed",
          variant: "destructive",
        });
        return { error: error.message };
      }

      console.log('Course marked as completed:', data);
      fetchCompletions(); // Refresh the list
      return { data };
    } catch (error) {
      console.error('Error in markCourseCompleted:', error);
      return { error: 'Failed to mark course as completed' };
    }
  };

  useEffect(() => {
    fetchCompletions();
  }, [user]);

  return {
    completions,
    loading,
    markCourseCompleted,
    refetch: fetchCompletions,
  };
};
