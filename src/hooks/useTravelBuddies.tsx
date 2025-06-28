
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface TravelBuddy {
  id: string;
  user_id: string;
  destination: string;
  travel_dates_start: string;
  travel_dates_end: string;
  travel_type: string | null;
  interests: string[] | null;
  languages: string[] | null;
  age_range: string | null;
  experience_level: string | null;
  contact_preferences: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useTravelBuddies = () => {
  return useQuery({
    queryKey: ['travel-buddies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('travel_buddies')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching travel buddies:', error);
        throw error;
      }

      return data as TravelBuddy[];
    },
  });
};

export const useCreateTravelBuddy = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (buddyData: Omit<TravelBuddy, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      if (!user) throw new Error('User must be authenticated');

      const { data, error } = await supabase
        .from('travel_buddies')
        .insert([{
          ...buddyData,
          user_id: user.id,
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating travel buddy request:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['travel-buddies'] });
    },
  });
};
