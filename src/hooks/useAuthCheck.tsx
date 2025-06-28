
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface UseAuthCheckProps {
  onNavigate: (page: string) => void;
  redirectTo?: string;
}

export const useAuthCheck = ({ onNavigate, redirectTo = 'auth' }: UseAuthCheckProps) => {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      onNavigate(redirectTo);
    }
  }, [user, loading, onNavigate, redirectTo]);

  return { user, loading };
};
