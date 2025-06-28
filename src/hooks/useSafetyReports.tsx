
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface SafetyReport {
  id: string;
  user_id: string;
  location_id: string;
  overall_rating: number;
  harassment_frequency: string | null;
  nighttime_safety: string | null;
  lighting_quality: string | null;
  security_presence: string | null;
  staff_responsiveness: string | null;
  cultural_sensitivity: string | null;
  comments: string | null;
  is_verified: boolean;
  travel_context: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export const useSafetyReports = (locationId?: string) => {
  return useQuery({
    queryKey: ['safety-reports', locationId],
    queryFn: async () => {
      let query = supabase
        .from('safety_reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (locationId) {
        query = query.eq('location_id', locationId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching safety reports:', error);
        throw error;
      }

      return data as SafetyReport[];
    },
  });
};

export const useCreateSafetyReport = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (reportData: Omit<SafetyReport, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      if (!user) throw new Error('User must be authenticated');

      const { data, error } = await supabase
        .from('safety_reports')
        .insert([{
          ...reportData,
          user_id: user.id,
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating safety report:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['safety-reports'] });
    },
  });
};
