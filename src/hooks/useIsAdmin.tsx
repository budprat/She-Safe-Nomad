import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook to check if the current user has admin privileges
 */
export function useIsAdmin() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['is-admin', user?.id],
    queryFn: async (): Promise<boolean> => {
      if (!user) return false;

      const { data, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error checking admin status:', error);
        return false;
      }

      return data?.is_admin || false;
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}

/**
 * Hook to get admin-only statistics
 */
export function useAdminStats() {
  const { data: isAdmin } = useIsAdmin();

  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [
        { count: pendingModeration },
        { count: totalUsers },
        { count: activeAlerts },
        { count: totalReports },
      ] = await Promise.all([
        supabase.from('moderation_queue').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('sos_alerts').select('*', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('safety_reports').select('*', { count: 'exact', head: true }),
      ]);

      return {
        pendingModeration: pendingModeration || 0,
        totalUsers: totalUsers || 0,
        activeAlerts: activeAlerts || 0,
        totalReports: totalReports || 0,
      };
    },
    enabled: !!isAdmin,
    refetchInterval: 30000, // Refresh every 30 seconds
  });
}
