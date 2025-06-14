
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface HealthGoals {
  id: string;
  user_id: string;
  water_goal: number;
  sleep_goal: number;
  exercise_goal: number;
  heart_rate_target: number;
  created_at: string;
  updated_at: string;
}

export const useHealthGoals = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState<HealthGoals | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchGoals();
    } else {
      setGoals(null);
      setLoading(false);
    }
  }, [user]);

  const fetchGoals = async () => {
    if (!user) return;

    try {
      console.log('Fetching health goals for user:', user.id);
      const { data, error } = await supabase
        .from('health_goals')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching health goals:', error);
        return;
      }

      console.log('Fetched health goals:', data);
      setGoals(data);
    } catch (error) {
      console.error('Error fetching health goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateGoals = async (updates: Partial<HealthGoals>) => {
    if (!user) {
      console.error('No user found for goals update');
      return { error: 'No user found' };
    }

    try {
      console.log('Updating health goals with:', updates);

      let result;
      if (goals) {
        // Update existing goals
        result = await supabase
          .from('health_goals')
          .update({
            ...updates,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id)
          .select()
          .single();
      } else {
        // Create new goals
        const goalData = {
          user_id: user.id,
          water_goal: updates.water_goal || 8,
          sleep_goal: updates.sleep_goal || 8.0,
          exercise_goal: updates.exercise_goal || 30,
          heart_rate_target: updates.heart_rate_target || 72
        };

        result = await supabase
          .from('health_goals')
          .insert(goalData)
          .select()
          .single();
      }

      const { data, error } = result;

      if (error) {
        console.error('Error updating health goals:', error);
        return { error: error.message };
      }

      console.log('Health goals updated successfully:', data);
      setGoals(data);
      return { data };
    } catch (error) {
      console.error('Error in updateGoals:', error);
      return { error: 'Failed to update health goals' };
    }
  };

  const getDefaultGoals = () => ({
    water_goal: 8,
    sleep_goal: 8.0,
    exercise_goal: 30,
    heart_rate_target: 72
  });

  return {
    goals: goals || getDefaultGoals(),
    loading,
    updateGoals,
    refetch: fetchGoals
  };
};
