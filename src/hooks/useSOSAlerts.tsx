import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface SOSAlert {
  id: string;
  user_id: string;
  latitude: number | null;
  longitude: number | null;
  location_description: string | null;
  alert_type: 'emergency' | 'check_in' | 'suspicious_activity';
  status: 'active' | 'resolved' | 'false_alarm';
  notes: string | null;
  contacts_notified: string[];
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateSOSAlertData {
  latitude?: number;
  longitude?: number;
  location_description?: string;
  alert_type?: 'emergency' | 'check_in' | 'suspicious_activity';
  notes?: string;
}

/**
 * Hook to fetch user's SOS alerts
 */
export function useSOSAlerts() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['sos-alerts', user?.id],
    queryFn: async (): Promise<SOSAlert[]> => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('sos_alerts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching SOS alerts:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!user,
  });
}

/**
 * Hook to create a new SOS alert
 */
export function useCreateSOSAlert() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (alertData: CreateSOSAlertData) => {
      if (!user) throw new Error('Must be authenticated');

      // Get current location if not provided
      let location = {
        latitude: alertData.latitude,
        longitude: alertData.longitude,
      };

      if (!location.latitude || !location.longitude) {
        try {
          const position = await getCurrentLocation();
          location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
        } catch (error) {
          console.error('Could not get location:', error);
        }
      }

      // Create the alert
      const { data: alert, error: alertError } = await supabase
        .from('sos_alerts')
        .insert([
          {
            user_id: user.id,
            latitude: location.latitude,
            longitude: location.longitude,
            location_description: alertData.location_description,
            alert_type: alertData.alert_type || 'emergency',
            notes: alertData.notes,
            status: 'active',
          },
        ])
        .select()
        .single();

      if (alertError) throw alertError;

      // Fetch emergency contacts to notify
      const { data: contacts } = await supabase
        .from('emergency_contacts')
        .select('*')
        .eq('user_id', user.id)
        .eq('notify_on_sos', true);

      if (contacts && contacts.length > 0) {
        // Update alert with notified contacts
        const contactIds = contacts.map(c => c.id);

        await supabase
          .from('sos_alerts')
          .update({ contacts_notified: contactIds })
          .eq('id', alert.id);

        // Trigger notification edge function
        try {
          const { error: notifyError } = await supabase.functions.invoke('send-sos-notifications', {
            body: {
              alert_id: alert.id,
              user_id: user.id,
              latitude: location.latitude,
              longitude: location.longitude,
              alert_type: alertData.alert_type || 'emergency',
              notes: alertData.notes,
              contacts: contacts.map(c => ({
                id: c.id,
                name: c.name,
                phone_number: c.phone_number,
                email: c.email,
              })),
            },
          });

          if (notifyError) {
            console.error('Notification error:', notifyError);
            // Don't throw - alert was still created, just notification failed
          }
        } catch (notifyErr) {
          console.error('Failed to send notifications:', notifyErr);
          // Alert was created successfully, notification is secondary
        }
      }

      return alert;
    },
    onSuccess: (alert) => {
      queryClient.invalidateQueries({ queryKey: ['sos-alerts'] });

      toast({
        title: 'SOS Alert Activated',
        description: 'Emergency contacts have been notified. Stay safe!',
        variant: 'default',
      });

      // In production, this would trigger actual SMS/email notifications
      console.log('SOS Alert created:', alert);
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to send SOS',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to resolve/update SOS alert status
 */
export function useUpdateSOSAlert() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      id,
      status,
      notes,
    }: {
      id: string;
      status: 'active' | 'resolved' | 'false_alarm';
      notes?: string;
    }) => {
      const { data, error } = await supabase
        .from('sos_alerts')
        .update({
          status,
          notes,
          resolved_at: status !== 'active' ? new Date().toISOString() : null,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['sos-alerts'] });

      if (variables.status === 'resolved') {
        toast({
          title: 'Alert resolved',
          description: 'Glad you\'re safe!',
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to update alert',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

/**
 * Helper function to get current geolocation
 */
function getCurrentLocation(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position),
      (error) => reject(error),
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  });
}
