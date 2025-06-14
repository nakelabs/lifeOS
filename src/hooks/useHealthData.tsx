
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface HealthData {
  id: string;
  type: string;
  value: number | null;
  unit: string | null;
  notes: string | null;
  recorded_at: string | null;
  created_at: string | null;
}

export const useHealthData = () => {
  const { user } = useAuth();
  const [healthData, setHealthData] = useState<HealthData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchHealthData();
    } else {
      setHealthData([]);
      setLoading(false);
    }
  }, [user]);

  const fetchHealthData = async () => {
    if (!user) return;

    try {
      console.log('Fetching health data for user:', user.id);
      const { data, error } = await supabase
        .from('health_data')
        .select('*')
        .eq('user_id', user.id)
        .order('recorded_at', { ascending: false });

      if (error) {
        console.error('Error fetching health data:', error);
        return;
      }

      console.log('Fetched health data:', data);
      setHealthData(data || []);
    } catch (error) {
      console.error('Error fetching health data:', error);
    } finally {
      setLoading(false);
    }
  };

  const addHealthData = async (type: string, value: number, unit?: string, notes?: string) => {
    if (!user) {
      console.error('No user found for health data entry');
      return { error: 'No user found' };
    }

    try {
      console.log('Adding health data:', { type, value, unit, notes });
      
      const healthEntry = {
        user_id: user.id,
        type,
        value,
        unit: unit || null,
        notes: notes || null,
        recorded_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('health_data')
        .insert(healthEntry)
        .select()
        .single();

      if (error) {
        console.error('Error adding health data:', error);
        return { error: error.message };
      }

      console.log('Health data added successfully:', data);
      
      // Refresh the data
      await fetchHealthData();
      
      return { data };
    } catch (error) {
      console.error('Error in addHealthData:', error);
      return { error: 'Failed to add health data' };
    }
  };

  const getTodaysData = (type: string) => {
    const today = new Date().toDateString();
    return healthData.filter(entry => 
      entry.type === type && 
      entry.recorded_at && 
      new Date(entry.recorded_at).toDateString() === today
    );
  };

  const getTotalForToday = (type: string) => {
    const todaysEntries = getTodaysData(type);
    return todaysEntries.reduce((total, entry) => total + (entry.value || 0), 0);
  };

  return {
    healthData,
    loading,
    addHealthData,
    getTodaysData,
    getTotalForToday,
    refetch: fetchHealthData
  };
};
