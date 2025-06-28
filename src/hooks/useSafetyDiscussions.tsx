
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface SafetyDiscussion {
  id: string;
  user_id: string;
  title: string;
  content: string;
  category: string | null;
  location_reference: string | null;
  is_pinned: boolean;
  is_closed: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export const useSafetyDiscussions = () => {
  return useQuery({
    queryKey: ['safety-discussions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('safety_discussions')
        .select('*')
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching safety discussions:', error);
        throw error;
      }

      return data as SafetyDiscussion[];
    },
  });
};

export const useCreateDiscussion = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (discussionData: Omit<SafetyDiscussion, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'view_count' | 'is_pinned' | 'is_closed'>) => {
      if (!user) throw new Error('User must be authenticated');

      const { data, error } = await supabase
        .from('safety_discussions')
        .insert([{
          ...discussionData,
          user_id: user.id,
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating discussion:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['safety-discussions'] });
    },
  });
};
