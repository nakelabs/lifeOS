
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
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching streak:', error);
        return;
      }

      console.log('Fetched streak:', data);
      setStreak(data || null);
    } catch (error) {
      console.error('Error in fetchStreak:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateActivity = async () => {
    if (!user) return { error: 'Not authenticated' };

    try {
      console.log('Updating user activity streak');
      const { error } = await supabase.rpc('update_user_streak', {
        p_user_id: user.id
      });

      if (error) {
        console.error('Error updating streak:', error);
        return { error: error.message };
      }

      console.log('Activity streak updated successfully');
      await fetchStreak(); // Refresh streak data
      return { success: true };
    } catch (error) {
      console.error('Error in updateActivity:', error);
      return { error: 'Failed to update activity' };
    }
  };

  const showStreakCelebration = (streakNumber: number) => {
    if (streakNumber > 1) {
      toast({
        title: `🔥 ${streakNumber} Day Streak!`,
        description: `Amazing! You're on fire with ${streakNumber} consecutive days of learning!`,
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
