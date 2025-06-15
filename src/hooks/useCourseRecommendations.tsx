
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface CourseRecommendation {
  id: string;
  topic: string;
  title: string;
  description: string;
  difficulty: string;
  estimated_duration: string;
  skills: string[];
  created_at: string;
}

export const useCourseRecommendations = () => {
  const [recommendations, setRecommendations] = useState<CourseRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchRecommendationsByTopic = async (topic: string) => {
    if (!topic.trim()) {
      console.log('No topic provided for recommendations');
      setRecommendations([]);
      return;
    }

    setLoading(true);
    try {
      console.log('Fetching recommendations for topic:', topic);
      
      const { data, error } = await supabase
        .from('course_recommendations')
        .select('*')
        .ilike('topic', `%${topic.trim()}%`)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Supabase error fetching recommendations:', error);
        toast({
          title: "Database Error",
          description: `Failed to fetch course recommendations: ${error.message}`,
          variant: "destructive",
        });
        setRecommendations([]);
        return;
      }

      console.log('Successfully fetched recommendations:', data?.length || 0);
      setRecommendations(data || []);
      
      if (!data || data.length === 0) {
        toast({
          title: "No Recommendations",
          description: `No course recommendations found for "${topic}"`,
          variant: "default",
        });
      }
    } catch (error) {
      console.error('Unexpected error in fetchRecommendationsByTopic:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while fetching recommendations",
        variant: "destructive",
      });
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllRecommendations = async () => {
    setLoading(true);
    try {
      console.log('Fetching all course recommendations');
      
      const { data, error } = await supabase
        .from('course_recommendations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching all recommendations:', error);
        toast({
          title: "Error",
          description: "Failed to fetch course recommendations",
          variant: "destructive",
        });
        return;
      }

      console.log('Fetched all recommendations:', data?.length || 0);
      setRecommendations(data || []);
    } catch (error) {
      console.error('Error in fetchAllRecommendations:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    recommendations,
    loading,
    fetchRecommendationsByTopic,
    fetchAllRecommendations,
  };
};
