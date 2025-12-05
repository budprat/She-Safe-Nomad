import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Eye,
  Clock,
  MapPin,
  MessageSquare,
  FileText,
  AlertTriangle,
  Loader2,
  Filter,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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

interface ModerationItem {
  id: string;
  content_type: string;
  content_id: string;
  submitted_by: string;
  status: string;
  priority: number;
  created_at: string;
}

const ModerationQueue: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedItem, setSelectedItem] = useState<ModerationItem | null>(null);
  const [moderatorNotes, setModeratorNotes] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [showReviewDialog, setShowReviewDialog] = useState(false);

  // Fetch moderation queue
  const { data: queue, isLoading } = useQuery({
    queryKey: ['moderation-queue', filterType],
    queryFn: async () => {
      let query = supabase
        .from('moderation_queue')
        .select('*')
        .eq('status', 'pending')
        .order('priority', { ascending: false })
        .order('created_at', { ascending: true });

      if (filterType !== 'all') {
        query = query.eq('content_type', filterType);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as ModerationItem[];
    },
  });

  // Moderation action mutation
  const moderateMutation = useMutation({
    mutationFn: async ({
      id,
      status,
      notes,
    }: {
      id: string;
      status: 'approved' | 'rejected';
      notes?: string;
    }) => {
      const { error } = await supabase
        .from('moderation_queue')
        .update({
          status,
          moderator_id: user?.id,
          moderator_notes: notes,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;

      // Log admin activity
      await supabase.from('admin_activity_log').insert([
        {
          admin_id: user?.id,
          action: status === 'approved' ? 'approve' : 'reject',
          target_type: selectedItem?.content_type || 'unknown',
          target_id: selectedItem?.content_id || id,
          details: { notes, moderation_queue_id: id },
        },
      ]);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['moderation-queue'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      toast({
        title: variables.status === 'approved' ? 'Content Approved' : 'Content Rejected',
        description: 'The moderation decision has been recorded.',
      });
      setShowReviewDialog(false);
      setSelectedItem(null);
      setModeratorNotes('');
    },
    onError: (error: any) => {
      toast({
        title: 'Action Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'location':
        return <MapPin className="h-4 w-4" />;
      case 'report':
        return <FileText className="h-4 w-4" />;
      case 'discussion':
        return <MessageSquare className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getPriorityBadge = (priority: number) => {
    if (priority >= 3) {
      return <Badge variant="destructive">High Priority</Badge>;
    } else if (priority >= 1) {
      return <Badge variant="default">Normal</Badge>;
    }
    return <Badge variant="secondary">Low</Badge>;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)} days ago`;
    return date.toLocaleDateString();
  };

  const handleReview = (item: ModerationItem) => {
    setSelectedItem(item);
    setShowReviewDialog(true);
  };

  const handleApprove = () => {
    if (!selectedItem) return;
    moderateMutation.mutate({
      id: selectedItem.id,
      status: 'approved',
      notes: moderatorNotes,
    });
  };

  const handleReject = () => {
    if (!selectedItem) return;
    moderateMutation.mutate({
      id: selectedItem.id,
      status: 'rejected',
      notes: moderatorNotes,
    });
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
              <h1 className="text-3xl font-bold text-slate-900">Moderation Queue</h1>
              <p className="text-lg text-slate-600">
                Review and approve user-submitted content
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="location">Locations</SelectItem>
                  <SelectItem value="report">Reports</SelectItem>
                  <SelectItem value="discussion">Discussions</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Queue */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          </div>
        ) : queue?.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <CheckCircle className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Queue is Empty
              </h3>
              <p className="text-slate-600">
                All content has been reviewed. Great work!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {queue?.map((item) => (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        {getContentTypeIcon(item.content_type)}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-slate-900 capitalize">
                            {item.content_type} Submission
                          </h3>
                          {getPriorityBadge(item.priority)}
                        </div>
                        <p className="text-sm text-slate-600">
                          ID: {item.content_id.slice(0, 8)}... |
                          Submitted {formatDate(item.created_at)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReview(item)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Review
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-700"
                        onClick={() => {
                          setSelectedItem(item);
                          handleApprove();
                        }}
                        disabled={moderateMutation.isPending}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setSelectedItem(item);
                          handleReject();
                        }}
                        disabled={moderateMutation.isPending}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Review Dialog */}
        <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Review Content</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-slate-600 mb-2">
                  <strong>Type:</strong> {selectedItem?.content_type}
                </p>
                <p className="text-sm text-slate-600 mb-2">
                  <strong>Content ID:</strong> {selectedItem?.content_id}
                </p>
                <p className="text-sm text-slate-600">
                  <strong>Submitted:</strong>{' '}
                  {selectedItem && formatDate(selectedItem.created_at)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Moderator Notes (Optional)
                </label>
                <Textarea
                  value={moderatorNotes}
                  onChange={(e) => setModeratorNotes(e.target.value)}
                  placeholder="Add notes about your decision..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter className="flex space-x-2">
              <Button variant="outline" onClick={() => setShowReviewDialog(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={moderateMutation.isPending}
              >
                {moderateMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <XCircle className="h-4 w-4 mr-2" />
                )}
                Reject
              </Button>
              <Button
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={handleApprove}
                disabled={moderateMutation.isPending}
              >
                {moderateMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <CheckCircle className="h-4 w-4 mr-2" />
                )}
                Approve
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ModerationQueue;
