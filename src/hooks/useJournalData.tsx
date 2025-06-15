
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface JournalEntry {
  id: string;
  title: string | null;
  content: string;
  mood: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export const useJournalData = () => {
  const { user } = useAuth();
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchJournalEntries();
    } else {
      setJournalEntries([]);
      setLoading(false);
    }
  }, [user]);

  const fetchJournalEntries = async () => {
    if (!user) return;

    try {
      console.log('Fetching journal entries for user:', user.id);
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching journal entries:', error);
        return;
      }

      console.log('Fetched journal entries:', data);
      setJournalEntries(data || []);
    } catch (error) {
      console.error('Error fetching journal entries:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    journalEntries,
    loading,
    refetch: fetchJournalEntries
  };
};
