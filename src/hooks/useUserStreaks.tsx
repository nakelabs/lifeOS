
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';

interface UserStreak {
  id: string;
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_activity_date: string;
  streak_start_date: string;
  total_active_days: number;
  created_at: string;
  updated_at: string;
}

export const useUserStreaks = () => {
  const { user } = useAuth();
  const [streak, setStreak] = useState<UserStreak | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchStreak = async () => {
    if (!user) {
      console.log('No user found, clearing streak data');
      setStreak(null);
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching user streak for user:', user.id);
      
      const { data, error } = await supabase
        .from('user_streaks')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching streak:', error);
        toast({
          title: "Database Error",
          description: `Failed to fetch streak data: ${error.message}`,
          variant: "destructive",
        });
        return;
      }

      console.log('Fetched streak:', data);
      setStreak(data || null);
    } catch (error) {
      console.error('Error in fetchStreak:', error);
      toast({
        title: "Error",
        description: "Failed to load streak information",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateActivity = async () => {
    if (!user) {
      console.log('No user authenticated for activity update');
      return { error: 'Not authenticated' };
    }

    try {
      console.log('Updating user activity streak for user:', user.id);
      
      const { error } = await supabase.rpc('update_user_streak', {
        p_user_id: user.id
      });

      if (error) {
        console.error('RPC error updating streak:', error);
        toast({
          title: "Update Failed",
          description: `Failed to update streak: ${error.message}`,
          variant: "destructive",
        });
        return { error: error.message };
      }

      console.log('Activity streak updated successfully');
      
      // Refresh streak data after update
      setTimeout(() => {
        fetchStreak();
      }, 100);
      
      return { success: true };
    } catch (error) {
      console.error('Error in updateActivity:', error);
      toast({
        title: "Error",
        description: "Failed to update activity streak",
        variant: "destructive",
      });
      return { error: 'Failed to update activity' };
    }
  };

  const showStreakCelebration = (streakNumber: number) => {
    if (streakNumber > 1) {
      const emoji = streakNumber >= 7 ? '🔥🔥🔥' : streakNumber >= 3 ? '🔥🔥' : '🔥';
      toast({
        title: `${emoji} ${streakNumber} Day Streak!`,
        description: `Amazing! You're on fire with ${streakNumber} consecutive days of learning!`,
        duration: 5000,
      });
    }
  };

  useEffect(() => {
    fetchStreak();
  }, [user]);

  return {
    streak,
    loading,
    updateActivity,
    showStreakCelebration,
    refetch: fetchStreak,
  };
};
