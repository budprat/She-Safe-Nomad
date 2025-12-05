import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft,
  Search,
  Shield,
  ShieldCheck,
  ShieldX,
  User,
  Mail,
  Calendar,
  MoreVertical,
  Loader2,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  id: string;
  username: string | null;
  full_name: string | null;
  bio: string | null;
  location: string | null;
  is_admin: boolean;
  created_at: string;
  verification?: {
    verification_level: string;
    credibility_score: number;
  };
}

const UserManagement: React.FC = () => {
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [showVerifyDialog, setShowVerifyDialog] = useState(false);
  const [newVerificationLevel, setNewVerificationLevel] = useState('');

  // Fetch users with their verification status
  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users', searchQuery],
    queryFn: async () => {
      let query = supabase
        .from('profiles')
        .select(`
          *,
          verification:user_verification(verification_level, credibility_score)
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (searchQuery) {
        query = query.or(`username.ilike.%${searchQuery}%,full_name.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;
      if (error) throw error;

      return data.map((user: any) => ({
        ...user,
        verification: user.verification?.[0] || null,
      })) as UserProfile[];
    },
  });

  // Update user verification
  const updateVerificationMutation = useMutation({
    mutationFn: async ({
      userId,
      level,
    }: {
      userId: string;
      level: string;
    }) => {
      const { error } = await supabase
        .from('user_verification')
        .upsert({
          user_id: userId,
          verification_level: level,
          verified_at: level !== 'unverified' ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      // Log admin activity
      await supabase.from('admin_activity_log').insert([
        {
          admin_id: currentUser?.id,
          action: 'edit',
          target_type: 'user',
          target_id: userId,
          details: { new_verification_level: level },
        },
      ]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({
        title: 'User Updated',
        description: 'Verification level has been updated.',
      });
      setShowVerifyDialog(false);
      setSelectedUser(null);
    },
    onError: (error: any) => {
      toast({
        title: 'Update Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Toggle admin status
  const toggleAdminMutation = useMutation({
    mutationFn: async ({
      userId,
      isAdmin,
    }: {
      userId: string;
      isAdmin: boolean;
    }) => {
      const { error } = await supabase
        .from('profiles')
        .update({ is_admin: isAdmin })
        .eq('id', userId);

      if (error) throw error;

      // Log admin activity
      await supabase.from('admin_activity_log').insert([
        {
          admin_id: currentUser?.id,
          action: isAdmin ? 'edit' : 'edit',
          target_type: 'user',
          target_id: userId,
          details: { admin_status: isAdmin },
        },
      ]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({
        title: 'Admin Status Updated',
        description: 'User admin privileges have been updated.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Update Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const getVerificationBadge = (level: string | undefined) => {
    switch (level) {
      case 'expert':
        return (
          <Badge className="bg-purple-100 text-purple-800">
            <ShieldCheck className="h-3 w-3 mr-1" />
            Expert
          </Badge>
        );
      case 'verified':
        return (
          <Badge className="bg-emerald-100 text-emerald-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        );
      case 'basic':
        return (
          <Badge className="bg-blue-100 text-blue-800">
            <User className="h-3 w-3 mr-1" />
            Basic
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Unverified
          </Badge>
        );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleVerifyUser = (user: UserProfile) => {
    setSelectedUser(user);
    setNewVerificationLevel(user.verification?.verification_level || 'unverified');
    setShowVerifyDialog(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/admin"
            className="text-emerald-600 hover:text-emerald-700 flex items-center mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">User Management</h1>
              <p className="text-lg text-slate-600">
                Manage user accounts and verification status
              </p>
            </div>
          </div>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by username or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Users List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          </div>
        ) : users?.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                No Users Found
              </h3>
              <p className="text-slate-600">
                {searchQuery ? 'Try a different search term' : 'No users registered yet'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {users?.map((user) => (
              <Card key={user.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                        <span className="text-emerald-700 font-semibold text-lg">
                          {(user.full_name || user.username || 'U').charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-slate-900">
                            {user.full_name || user.username || 'Anonymous User'}
                          </h3>
                          {user.is_admin && (
                            <Badge className="bg-red-100 text-red-800">
                              <Shield className="h-3 w-3 mr-1" />
                              Admin
                            </Badge>
                          )}
                          {getVerificationBadge(user.verification?.verification_level)}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-slate-600 mt-1">
                          {user.username && (
                            <span>@{user.username}</span>
                          )}
                          <span className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            Joined {formatDate(user.created_at)}
                          </span>
                          {user.location && (
                            <span className="flex items-center">
                              <Mail className="h-3 w-3 mr-1" />
                              {user.location}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleVerifyUser(user)}
                      >
                        <ShieldCheck className="h-4 w-4 mr-2" />
                        Verify
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleVerifyUser(user)}>
                            <ShieldCheck className="h-4 w-4 mr-2" />
                            Change Verification
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {user.id !== currentUser?.id && (
                            <DropdownMenuItem
                              onClick={() =>
                                toggleAdminMutation.mutate({
                                  userId: user.id,
                                  isAdmin: !user.is_admin,
                                })
                              }
                            >
                              {user.is_admin ? (
                                <>
                                  <ShieldX className="h-4 w-4 mr-2" />
                                  Remove Admin
                                </>
                              ) : (
                                <>
                                  <Shield className="h-4 w-4 mr-2" />
                                  Make Admin
                                </>
                              )}
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Verification Dialog */}
        <Dialog open={showVerifyDialog} onOpenChange={setShowVerifyDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Update Verification Status</DialogTitle>
              <DialogDescription>
                Change the verification level for{' '}
                {selectedUser?.full_name || selectedUser?.username || 'this user'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Select
                value={newVerificationLevel}
                onValueChange={setNewVerificationLevel}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select verification level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unverified">Unverified</SelectItem>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="expert">Expert</SelectItem>
                </SelectContent>
              </Select>
              <div className="text-sm text-slate-600">
                <p className="font-medium mb-2">Verification Levels:</p>
                <ul className="space-y-1">
                  <li>- <strong>Unverified:</strong> New user, no verification</li>
                  <li>- <strong>Basic:</strong> Email verified</li>
                  <li>- <strong>Verified:</strong> Identity confirmed</li>
                  <li>- <strong>Expert:</strong> Trusted contributor</li>
                </ul>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowVerifyDialog(false)}>
                Cancel
              </Button>
              <Button
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={() =>
                  selectedUser &&
                  updateVerificationMutation.mutate({
                    userId: selectedUser.id,
                    level: newVerificationLevel,
                  })
                }
                disabled={updateVerificationMutation.isPending}
              >
                {updateVerificationMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <CheckCircle className="h-4 w-4 mr-2" />
                )}
                Update
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default UserManagement;
