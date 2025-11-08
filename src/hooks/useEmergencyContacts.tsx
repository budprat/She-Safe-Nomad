import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface EmergencyContact {
  id: string;
  user_id: string;
  name: string;
  phone_number: string;
  email?: string;
  relationship?: string;
  is_primary: boolean;
  notify_on_sos: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateEmergencyContactData {
  name: string;
  phone_number: string;
  email?: string;
  relationship?: string;
  is_primary?: boolean;
  notify_on_sos?: boolean;
}

/**
 * Hook to fetch and manage emergency contacts
 */
export function useEmergencyContacts() {
  const { user } = useAuth();
  const { toast } = useToast();

  return useQuery({
    queryKey: ['emergency-contacts', user?.id],
    queryFn: async (): Promise<EmergencyContact[]> => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('emergency_contacts')
        .select('*')
        .eq('user_id', user.id)
        .order('is_primary', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching emergency contacts:', error);
        toast({
          title: 'Error loading contacts',
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      }

      return data || [];
    },
    enabled: !!user,
  });
}

/**
 * Hook to create a new emergency contact
 */
export function useCreateEmergencyContact() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (contactData: CreateEmergencyContactData) => {
      if (!user) throw new Error('Must be authenticated');

      const { data, error } = await supabase
        .from('emergency_contacts')
        .insert([
          {
            user_id: user.id,
            ...contactData,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emergency-contacts'] });
      toast({
        title: 'Contact added',
        description: 'Emergency contact has been saved successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to add contact',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to update an emergency contact
 */
export function useUpdateEmergencyContact() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<CreateEmergencyContactData>;
    }) => {
      const { data, error } = await supabase
        .from('emergency_contacts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emergency-contacts'] });
      toast({
        title: 'Contact updated',
        description: 'Emergency contact has been updated successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to update contact',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to delete an emergency contact
 */
export function useDeleteEmergencyContact() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('emergency_contacts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emergency-contacts'] });
      toast({
        title: 'Contact deleted',
        description: 'Emergency contact has been removed.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to delete contact',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}
