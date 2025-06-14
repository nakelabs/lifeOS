
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Profile {
  id: string;
  name: string;
  age?: string;
  region?: string;
  language: string;
  assistant_tone: string;
  focus_areas: string[];
  goals?: string;
}

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      console.log('Fetching profile for user:', user.id);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      console.log('Fetched profile:', data);
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) {
      console.error('No user found for profile update');
      return { error: 'No user found' };
    }

    try {
      console.log('Updating profile with:', updates);
      console.log('User ID:', user.id);

      // First check if profile exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      console.log('Existing profile:', existingProfile);

      let result;
      if (existingProfile) {
        // Update existing profile
        result = await supabase
          .from('profiles')
          .update(updates)
          .eq('id', user.id)
          .select()
          .single();
      } else {
        // Insert new profile - ensure name is provided
        const profileData = {
          id: user.id,
          name: updates.name || 'User',
          age: updates.age,
          region: updates.region,
          language: updates.language || 'english',
          assistant_tone: updates.assistant_tone || 'friendly',
          focus_areas: updates.focus_areas || [],
          goals: updates.goals
        };

        result = await supabase
          .from('profiles')
          .insert(profileData)
          .select()
          .single();
      }

      const { data, error } = result;

      if (error) {
        console.error('Error updating profile:', error);
        return { error: error.message };
      }

      console.log('Profile updated successfully:', data);
      setProfile(data);
      return { data };
    } catch (error) {
      console.error('Error in updateProfile:', error);
      return { error: 'Failed to update profile' };
    }
  };

  return {
    profile,
    loading,
    updateProfile,
    refetch: fetchProfile
  };
};
