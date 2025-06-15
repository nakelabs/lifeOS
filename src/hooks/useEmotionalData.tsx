
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface MoodEntry {
  id: string;
  user_id: string;
  mood: string;
  notes: string | null;
  date: string;
  created_at: string;
}

export const useEmotionalData = () => {
  const { user } = useAuth();
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchMoodEntries();
    } else {
      setMoodEntries([]);
      setLoading(false);
    }
  }, [user]);

  const fetchMoodEntries = async () => {
    if (!user) return;

    try {
      console.log('Fetching mood entries for user:', user.id);
      const { data, error } = await supabase
        .from('mood_entries' as any)
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(30); // Last 30 entries

      if (error) {
        console.error('Error fetching mood entries:', error);
        return;
      }

      console.log('Fetched mood entries:', data);
      setMoodEntries(data as unknown as MoodEntry[] || []);
    } catch (error) {
      console.error('Error fetching mood entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveMoodEntry = async (mood: string, notes?: string) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Check if entry for today already exists
      const { data: existingEntry } = await supabase
        .from('mood_entries' as any)
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .single();

      let result;
      if (existingEntry && !('error' in existingEntry)) {
        // Update existing entry
        result = await supabase
          .from('mood_entries' as any)
          .update({ mood, notes: notes || null })
          .eq('id', (existingEntry as any).id)
          .select()
          .single();
      } else {
        // Create new entry
        result = await supabase
          .from('mood_entries' as any)
          .insert({
            user_id: user.id,
            mood,
            notes: notes || null,
            date: today
          })
          .select()
          .single();
      }

      const { data, error } = result;

      if (error) {
        console.error('Error saving mood entry:', error);
        return { error: error.message };
      }

      console.log('Mood entry saved:', data);
      fetchMoodEntries(); // Refresh the list
      return { data };
    } catch (error) {
      console.error('Error in saveMoodEntry:', error);
      return { error: 'Failed to save mood entry' };
    }
  };

  const getTodaysMood = () => {
    const today = new Date().toISOString().split('T')[0];
    return moodEntries.find(entry => entry.date === today);
  };

  const getMoodStreak = () => {
    if (moodEntries.length === 0) return 0;
    
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];
      
      const hasEntry = moodEntries.some(entry => entry.date === dateStr);
      if (hasEntry) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  return {
    moodEntries,
    loading,
    saveMoodEntry,
    getTodaysMood,
    getMoodStreak,
    refetch: fetchMoodEntries
  };
};
