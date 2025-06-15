
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
      console.log('No user found, clearing interests');
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
        .maybeSingle();

      if (error) {
        console.error('Error fetching user interests:', error);
        toast({
          title: "Database Error",
          description: `Failed to fetch interests: ${error.message}`,
          variant: "destructive",
        });
        return;
      }

      console.log('Successfully fetched user interests:', data?.interests?.length || 0);
      setInterests(data?.interests || []);
    } catch (error) {
      console.error('Error in fetchUserInterests:', error);
      toast({
        title: "Error",
        description: "Failed to load user interests",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserInterests = async (newInterests: string[]) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to save interests",
        variant: "destructive",
      });
      return { error: 'Not authenticated' };
    }

    // Clean and validate interests
    const cleanedInterests = newInterests
      .filter(interest => interest && interest.trim())
      .map(interest => interest.trim())
      .filter((interest, index, array) => array.indexOf(interest) === index); // Remove duplicates

    try {
      console.log('Updating user interests:', cleanedInterests);
      
      // Check if user interests record exists
      const { data: existingData } = await supabase
        .from('user_interests')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      let result;
      if (existingData) {
        // Update existing record
        result = await supabase
          .from('user_interests')
          .update({
            interests: cleanedInterests,
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
            interests: cleanedInterests
          })
          .select()
          .single();
      }

      const { data, error } = result;

      if (error) {
        console.error('Error updating user interests:', error);
        toast({
          title: "Update Failed",
          description: `Failed to save interests: ${error.message}`,
          variant: "destructive",
        });
        return { error: error.message };
      }

      console.log('User interests updated successfully:', data);
      setInterests(cleanedInterests);
      
      toast({
        title: "Success!",
        description: `Your interests have been saved (${cleanedInterests.length} items)`,
      });
      
      return { data };
    } catch (error) {
      console.error('Error in updateUserInterests:', error);
      toast({
        title: "Error",
        description: "Failed to update interests",
        variant: "destructive",
      });
      return { error: 'Failed to update interests' };
    }
  };

  const clearUserInterests = async () => {
    return updateUserInterests([]);
  };

  useEffect(() => {
    fetchUserInterests();
  }, [user]);

  return {
    interests,
    loading,
    updateUserInterests,
    clearUserInterests,
    refetch: fetchUserInterests,
  };
};
