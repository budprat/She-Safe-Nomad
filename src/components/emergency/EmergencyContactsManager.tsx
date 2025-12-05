import React, { useState } from 'react';
import {
  Phone,
  Mail,
  User,
  Plus,
  Edit2,
  Trash2,
  Star,
  Bell,
  BellOff,
  Loader2,
  AlertTriangle,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  useEmergencyContacts,
  useCreateEmergencyContact,
  useUpdateEmergencyContact,
  useDeleteEmergencyContact,
  EmergencyContact,
  CreateEmergencyContactData,
} from '@/hooks/useEmergencyContacts';

const RELATIONSHIP_OPTIONS = [
  'Parent',
  'Spouse',
  'Sibling',
  'Partner',
  'Friend',
  'Colleague',
  'Other',
];

interface ContactFormData {
  name: string;
  phone_number: string;
  email: string;
  relationship: string;
  is_primary: boolean;
  notify_on_sos: boolean;
}

const initialFormData: ContactFormData = {
  name: '',
  phone_number: '',
  email: '',
  relationship: '',
  is_primary: false,
  notify_on_sos: true,
};

const EmergencyContactsManager: React.FC = () => {
  const { data: contacts, isLoading } = useEmergencyContacts();
  const createContact = useCreateEmergencyContact();
  const updateContact = useUpdateEmergencyContact();
  const deleteContact = useDeleteEmergencyContact();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null);
  const [deletingContact, setDeletingContact] = useState<EmergencyContact | null>(null);
  const [formData, setFormData] = useState<ContactFormData>(initialFormData);

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingContact(null);
  };

  const handleOpenAddDialog = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };

  const handleOpenEditDialog = (contact: EmergencyContact) => {
    setFormData({
      name: contact.name,
      phone_number: contact.phone_number,
      email: contact.email || '',
      relationship: contact.relationship || '',
      is_primary: contact.is_primary,
      notify_on_sos: contact.notify_on_sos,
    });
    setEditingContact(contact);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const contactData: CreateEmergencyContactData = {
      name: formData.name.trim(),
      phone_number: formData.phone_number.trim(),
      email: formData.email.trim() || undefined,
      relationship: formData.relationship || undefined,
      is_primary: formData.is_primary,
      notify_on_sos: formData.notify_on_sos,
    };

    if (editingContact) {
      await updateContact.mutateAsync({
        id: editingContact.id,
        updates: contactData,
      });
      setEditingContact(null);
    } else {
      await createContact.mutateAsync(contactData);
      setIsAddDialogOpen(false);
    }
    resetForm();
  };

  const handleDelete = async () => {
    if (deletingContact) {
      await deleteContact.mutateAsync(deletingContact.id);
      setDeletingContact(null);
    }
  };

  const handleTogglePrimary = async (contact: EmergencyContact) => {
    await updateContact.mutateAsync({
      id: contact.id,
      updates: { is_primary: !contact.is_primary },
    });
  };

  const handleToggleNotify = async (contact: EmergencyContact) => {
    await updateContact.mutateAsync({
      id: contact.id,
      updates: { notify_on_sos: !contact.notify_on_sos },
    });
  };

  const isFormValid = formData.name.trim() && formData.phone_number.trim();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <CardTitle>Emergency Contacts</CardTitle>
                <CardDescription>
                  People who will be notified when you trigger an SOS alert
                </CardDescription>
              </div>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={handleOpenAddDialog}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Contact
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add Emergency Contact</DialogTitle>
                  <DialogDescription>
                    Add someone who should be notified in case of emergency.
                  </DialogDescription>
                </DialogHeader>
                <ContactForm
                  formData={formData}
                  setFormData={setFormData}
                  onSubmit={handleSubmit}
                  isSubmitting={createContact.isPending}
                  isValid={isFormValid}
                  submitLabel="Add Contact"
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      {/* Contacts List */}
      {contacts && contacts.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {contacts.map((contact) => (
            <Card
              key={contact.id}
              className={`relative ${
                contact.is_primary
                  ? 'border-emerald-500 bg-emerald-50/50'
                  : 'border-gray-200'
              }`}
            >
              <CardContent className="pt-6">
                {/* Primary Badge */}
                {contact.is_primary && (
                  <Badge className="absolute top-3 right-3 bg-emerald-100 text-emerald-800">
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    Primary
                  </Badge>
                )}

                {/* Contact Info */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">
                        {contact.name}
                      </h4>
                      {contact.relationship && (
                        <p className="text-sm text-slate-500">
                          {contact.relationship}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Phone className="h-4 w-4" />
                      <span>{contact.phone_number}</span>
                    </div>
                    {contact.email && (
                      <div className="flex items-center gap-2 text-slate-600">
                        <Mail className="h-4 w-4" />
                        <span>{contact.email}</span>
                      </div>
                    )}
                  </div>

                  {/* Notification Status */}
                  <div className="flex items-center gap-2 pt-2">
                    {contact.notify_on_sos ? (
                      <Badge variant="outline" className="text-emerald-600 border-emerald-200">
                        <Bell className="h-3 w-3 mr-1" />
                        SOS Notifications On
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-gray-500 border-gray-200">
                        <BellOff className="h-3 w-3 mr-1" />
                        SOS Notifications Off
                      </Badge>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-3 border-t">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleTogglePrimary(contact)}
                      disabled={updateContact.isPending}
                    >
                      <Star
                        className={`h-4 w-4 mr-1 ${
                          contact.is_primary
                            ? 'fill-yellow-400 text-yellow-400'
                            : ''
                        }`}
                      />
                      {contact.is_primary ? 'Primary' : 'Set Primary'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleNotify(contact)}
                      disabled={updateContact.isPending}
                    >
                      {contact.notify_on_sos ? (
                        <BellOff className="h-4 w-4 mr-1" />
                      ) : (
                        <Bell className="h-4 w-4 mr-1" />
                      )}
                      {contact.notify_on_sos ? 'Mute' : 'Enable'}
                    </Button>
                    <div className="flex-1" />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenEditDialog(contact)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => setDeletingContact(contact)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                No Emergency Contacts
              </h3>
              <p className="text-slate-600 mb-4 max-w-sm mx-auto">
                Add emergency contacts who will be notified via SMS and email
                when you trigger an SOS alert.
              </p>
              <Button
                onClick={handleOpenAddDialog}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Contact
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog
        open={!!editingContact}
        onOpenChange={(open) => !open && setEditingContact(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Emergency Contact</DialogTitle>
            <DialogDescription>
              Update the contact information for {editingContact?.name}.
            </DialogDescription>
          </DialogHeader>
          <ContactForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            isSubmitting={updateContact.isPending}
            isValid={isFormValid}
            submitLabel="Save Changes"
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deletingContact}
        onOpenChange={(open) => !open && setDeletingContact(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Emergency Contact</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {deletingContact?.name} from your
              emergency contacts? They will no longer be notified when you
              trigger an SOS alert.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteContact.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Delete Contact
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <div className="p-2 bg-blue-100 rounded-lg h-fit">
              <Bell className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-blue-900 mb-1">
                How SOS Notifications Work
              </h4>
              <p className="text-sm text-blue-700">
                When you trigger an SOS alert, all contacts with notifications
                enabled will receive an SMS and email with your current location
                and a link to track you in real-time. Make sure phone numbers
                include the country code (e.g., +1 for US).
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface ContactFormProps {
  formData: ContactFormData;
  setFormData: React.Dispatch<React.SetStateAction<ContactFormData>>;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  isValid: boolean;
  submitLabel: string;
}

const ContactForm: React.FC<ContactFormProps> = ({
  formData,
  setFormData,
  onSubmit,
  isSubmitting,
  isValid,
  submitLabel,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name *</Label>
        <Input
          id="name"
          placeholder="Contact name"
          value={formData.name}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, name: e.target.value }))
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone_number">Phone Number *</Label>
        <Input
          id="phone_number"
          type="tel"
          placeholder="+1 555-123-4567"
          value={formData.phone_number}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, phone_number: e.target.value }))
          }
          required
        />
        <p className="text-xs text-slate-500">
          Include country code for international SMS delivery
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="contact@example.com"
          value={formData.email}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, email: e.target.value }))
          }
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="relationship">Relationship</Label>
        <Select
          value={formData.relationship}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, relationship: value }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select relationship" />
          </SelectTrigger>
          <SelectContent>
            {RELATIONSHIP_OPTIONS.map((rel) => (
              <SelectItem key={rel} value={rel}>
                {rel}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between py-2">
        <div className="space-y-0.5">
          <Label htmlFor="is_primary">Primary Contact</Label>
          <p className="text-xs text-slate-500">
            Will be contacted first in emergencies
          </p>
        </div>
        <Switch
          id="is_primary"
          checked={formData.is_primary}
          onCheckedChange={(checked) =>
            setFormData((prev) => ({ ...prev, is_primary: checked }))
          }
        />
      </div>

      <div className="flex items-center justify-between py-2">
        <div className="space-y-0.5">
          <Label htmlFor="notify_on_sos">SOS Notifications</Label>
          <p className="text-xs text-slate-500">
            Receive SMS & email when SOS is triggered
          </p>
        </div>
        <Switch
          id="notify_on_sos"
          checked={formData.notify_on_sos}
          onCheckedChange={(checked) =>
            setFormData((prev) => ({ ...prev, notify_on_sos: checked }))
          }
        />
      </div>

      <DialogFooter>
        <Button
          type="submit"
          disabled={!isValid || isSubmitting}
          className="bg-emerald-600 hover:bg-emerald-700 w-full sm:w-auto"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Plus className="h-4 w-4 mr-2" />
          )}
          {submitLabel}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default EmergencyContactsManager;
