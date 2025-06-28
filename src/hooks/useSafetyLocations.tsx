
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface SafetyLocation {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  location_type: string;
  overall_rating: number | null;
  safety_zone: string;
  harassment_frequency: string | null;
  nighttime_safety: string | null;
  lighting_quality: string | null;
  security_presence: string | null;
  staff_responsiveness: string | null;
  cultural_sensitivity: string | null;
  created_at: string;
  updated_at: string;
}

export const useSafetyLocations = () => {
  return useQuery({
    queryKey: ['safety-locations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('safety_locations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching safety locations:', error);
        throw error;
      }

      return data as SafetyLocation[];
    },
  });
};
