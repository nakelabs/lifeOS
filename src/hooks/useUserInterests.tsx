
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';

interface UserInterests {
  id: string;
  user_id: string;
  interests: string[];
  created_at: string;
  updated_at: string;
}

export const useUserInterests = () => {
  const { user } = useAuth();
  const [interests, setInterests] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchUserInterests = async () => {
    if (!user) {
      setInterests([]);
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching user interests for user:', user.id);
      const { data, error } = await supabase
        .from('user_interests')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user interests:', error);
        return;
      }

      console.log('Fetched user interests:', data);
      setInterests(data?.interests || []);
    } catch (error) {
      console.error('Error in fetchUserInterests:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserInterests = async (newInterests: string[]) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to save interests",
        variant: "destructive",
      });
      return { error: 'Not authenticated' };
    }

    try {
      console.log('Updating user interests:', newInterests);
      
      // First, try to update existing record
      const { data: existingData } = await supabase
        .from('user_interests')
        .select('id')
        .eq('user_id', user.id)
        .single();

      let result;
      if (existingData) {
        // Update existing record
        result = await supabase
          .from('user_interests')
          .update({
            interests: newInterests,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id)
          .select()
          .single();
      } else {
        // Insert new record
        result = await supabase
          .from('user_interests')
          .insert({
            user_id: user.id,
            interests: newInterests
          })
          .select()
          .single();
      }

      const { data, error } = result;

      if (error) {
        console.error('Error updating user interests:', error);
        toast({
          title: "Error",
          description: "Failed to save interests",
          variant: "destructive",
        });
        return { error: error.message };
      }

      console.log('User interests updated:', data);
      setInterests(newInterests);
      toast({
        title: "Success!",
        description: "Your interests have been saved",
      });
      return { data };
    } catch (error) {
      console.error('Error in updateUserInterests:', error);
      return { error: 'Failed to update interests' };
    }
  };

  useEffect(() => {
    fetchUserInterests();
  }, [user]);

  return {
    interests,
    loading,
    updateUserInterests,
    refetch: fetchUserInterests,
  };
};
