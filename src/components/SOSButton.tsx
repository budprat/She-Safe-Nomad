import React, { useState } from 'react';
import { AlertTriangle, Phone, X, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useCreateSOSAlert } from '@/hooks/useSOSAlerts';
import { useEmergencyContacts } from '@/hooks/useEmergencyContacts';
import { useAuth } from '@/contexts/AuthContext';

interface SOSButtonProps {
  variant?: 'header' | 'floating' | 'inline';
  className?: string;
}

/**
 * Emergency SOS Button Component
 * Triggers emergency alert and notifies emergency contacts
 */
const SOSButton: React.FC<SOSButtonProps> = ({ variant = 'header', className = '' }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [notes, setNotes] = useState('');
  const [alertSent, setAlertSent] = useState(false);

  const { user } = useAuth();
  const createAlert = useCreateSOSAlert();
  const { data: emergencyContacts } = useEmergencyContacts();

  // Countdown timer before sending alert
  React.useEffect(() => {
    if (countdown === null || countdown === 0) return;

    const timer = setTimeout(() => {
      if (countdown > 0) {
        setCountdown(countdown - 1);
      } else {
        handleSendSOS();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSOSClick = () => {
    if (!user) {
      alert('Please sign in to use emergency features');
      return;
    }

    if (!emergencyContacts || emergencyContacts.length === 0) {
      alert('Please add emergency contacts first in your profile settings');
      return;
    }

    setShowConfirmation(true);
  };

  const startCountdown = () => {
    setCountdown(5); // 5 second countdown
  };

  const cancelCountdown = () => {
    setCountdown(null);
    setShowConfirmation(false);
    setNotes('');
  };

  const handleSendSOS = async () => {
    try {
      await createAlert.mutateAsync({
        alert_type: 'emergency',
        notes: notes || undefined,
      });

      setAlertSent(true);
      setCountdown(null);

      // Auto-close after 3 seconds
      setTimeout(() => {
        setShowConfirmation(false);
        setAlertSent(false);
        setNotes('');
      }, 3000);
    } catch (error) {
      console.error('Failed to send SOS:', error);
      setCountdown(null);
    }
  };

  const sendImmediateSOS = () => {
    setCountdown(0); // Trigger immediate send
  };

  // Render different button styles based on variant
  const renderButton = () => {
    const baseClasses = 'group';

    if (variant === 'floating') {
      return (
        <button
          onClick={handleSOSClick}
          className={`fixed bottom-6 right-6 z-50 w-16 h-16 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 pulse-animation ${className}`}
          aria-label="Emergency SOS"
        >
          <AlertTriangle className="h-8 w-8" />
        </button>
      );
    }

    if (variant === 'inline') {
      return (
        <Button
          onClick={handleSOSClick}
          variant="destructive"
          size="lg"
          className={`${baseClasses} ${className}`}
        >
          <AlertTriangle className="h-5 w-5 mr-2" />
          Emergency SOS
        </Button>
      );
    }

    // Header variant (default)
    return (
      <Button
        onClick={handleSOSClick}
        variant="destructive"
        size="sm"
        className={`${baseClasses} ${className}`}
      >
        <AlertTriangle className="h-4 w-4 mr-1" />
        SOS
      </Button>
    );
  };

  return (
    <>
      {renderButton()}

      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center text-red-600">
              <AlertTriangle className="h-6 w-6 mr-2" />
              {alertSent ? 'Alert Sent!' : 'Emergency SOS'}
            </DialogTitle>
            <DialogDescription>
              {alertSent
                ? 'Your emergency contacts have been notified with your location.'
                : countdown !== null
                ? `Sending alert in ${countdown} seconds...`
                : 'Are you in danger? This will notify your emergency contacts.'}
            </DialogDescription>
          </DialogHeader>

          {alertSent ? (
            <div className="flex flex-col items-center justify-center py-6">
              <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
              <p className="text-center text-sm text-gray-600">
                Help is on the way. Stay safe!
              </p>
              {emergencyContacts && (
                <div className="mt-4 text-xs text-gray-500">
                  <p className="font-medium">Contacts notified:</p>
                  <ul className="mt-2 space-y-1">
                    {emergencyContacts.slice(0, 3).map((contact) => (
                      <li key={contact.id}>
                        • {contact.name} ({contact.phone_number})
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {countdown === null ? (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Additional Information (Optional)
                    </label>
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Describe your situation if possible..."
                      className="resize-none"
                      rows={3}
                    />
                  </div>

                  {emergencyContacts && emergencyContacts.length > 0 && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs font-medium text-gray-700 mb-2">
                        These contacts will be notified:
                      </p>
                      <div className="space-y-1">
                        {emergencyContacts.slice(0, 3).map((contact) => (
                          <div key={contact.id} className="flex items-center text-xs text-gray-600">
                            <Phone className="h-3 w-3 mr-2" />
                            {contact.name} - {contact.phone_number}
                          </div>
                        ))}
                        {emergencyContacts.length > 3 && (
                          <p className="text-xs text-gray-500 mt-1">
                            +{emergencyContacts.length - 3} more contacts
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={startCountdown}
                      variant="destructive"
                      size="lg"
                      className="w-full"
                      disabled={createAlert.isPending}
                    >
                      <AlertTriangle className="h-5 w-5 mr-2" />
                      Send Emergency Alert
                    </Button>
                    <Button
                      onClick={() => setShowConfirmation(false)}
                      variant="outline"
                      size="lg"
                      className="w-full"
                    >
                      Cancel
                    </Button>
                  </div>

                  <p className="text-xs text-center text-gray-500">
                    Your current location will be shared with your emergency contacts
                  </p>
                </>
              ) : (
                <div className="flex flex-col items-center py-6">
                  <div className="relative w-24 h-24 mb-4">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-4xl font-bold text-red-600">{countdown}</span>
                    </div>
                    <svg className="w-24 h-24 transform -rotate-90">
                      <circle
                        cx="48"
                        cy="48"
                        r="44"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-gray-200"
                      />
                      <circle
                        cx="48"
                        cy="48"
                        r="44"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray="276.46"
                        strokeDashoffset={276.46 * (countdown / 5)}
                        className="text-red-600 transition-all duration-1000"
                      />
                    </svg>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={sendImmediateSOS}
                      variant="destructive"
                      size="sm"
                    >
                      Send Now
                    </Button>
                    <Button
                      onClick={cancelCountdown}
                      variant="outline"
                      size="sm"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <style>{`
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
            box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.7);
          }
          50% {
            opacity: 0.9;
            box-shadow: 0 0 0 10px rgba(220, 38, 38, 0);
          }
        }
        .pulse-animation {
          animation: pulse-slow 2s infinite;
        }
      `}</style>
    </>
  );
};

export default SOSButton;
