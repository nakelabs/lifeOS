
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
}

export const useCourseRecommendations = () => {
  const [recommendations, setRecommendations] = useState<CourseRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchRecommendationsByTopic = async (topic: string) => {
    setLoading(true);
    try {
      console.log('Fetching recommendations for topic:', topic);
      const { data, error } = await supabase
        .from('course_recommendations')
        .select('*')
        .ilike('topic', `%${topic}%`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching recommendations:', error);
        toast({
          title: "Error",
          description: "Failed to fetch course recommendations",
          variant: "destructive",
        });
        return;
      }

      console.log('Fetched recommendations:', data);
      setRecommendations(data || []);
    } catch (error) {
      console.error('Error in fetchRecommendationsByTopic:', error);
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
  };
};
