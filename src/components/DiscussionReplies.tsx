import React, { useState } from 'react';
import {
  MessageSquare,
  Reply,
  CheckCircle,
  MoreVertical,
  Edit2,
  Trash2,
  Loader2,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  useDiscussionReplies,
  useCreateReply,
  useUpdateReply,
  useDeleteReply,
  useMarkAsSolution,
  DiscussionReply,
} from '@/hooks/useDiscussionReplies';
import { useAuth } from '@/contexts/AuthContext';

interface DiscussionRepliesProps {
  discussionId: string;
  discussionOwnerId?: string;
}

const DiscussionReplies: React.FC<DiscussionRepliesProps> = ({
  discussionId,
  discussionOwnerId,
}) => {
  const { user } = useAuth();
  const { data: replies, isLoading } = useDiscussionReplies(discussionId);
  const createReply = useCreateReply();
  const updateReply = useUpdateReply();
  const deleteReply = useDeleteReply();
  const markAsSolution = useMarkAsSolution();

  const [replyContent, setReplyContent] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [editingReply, setEditingReply] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  // Get top-level replies and their children
  const topLevelReplies = replies?.filter((r) => !r.parent_reply_id) || [];
  const getChildReplies = (parentId: string) =>
    replies?.filter((r) => r.parent_reply_id === parentId) || [];

  const handleSubmitReply = () => {
    if (!replyContent.trim()) return;

    createReply.mutate(
      {
        discussion_id: discussionId,
        content: replyContent,
        parent_reply_id: replyingTo || undefined,
      },
      {
        onSuccess: () => {
          setReplyContent('');
          setReplyingTo(null);
        },
      }
    );
  };

  const handleUpdateReply = (replyId: string) => {
    if (!editContent.trim()) return;

    updateReply.mutate(
      {
        id: replyId,
        content: editContent,
        discussionId,
      },
      {
        onSuccess: () => {
          setEditingReply(null);
          setEditContent('');
        },
      }
    );
  };

  const handleDeleteReply = (replyId: string) => {
    if (confirm('Are you sure you want to delete this reply?')) {
      deleteReply.mutate({ id: replyId, discussionId });
    }
  };

  const handleMarkAsSolution = (replyId: string, currentStatus: boolean) => {
    markAsSolution.mutate({
      id: replyId,
      discussionId,
      isSolution: !currentStatus,
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  const canMarkAsSolution = user?.id === discussionOwnerId;

  return (
    <div className="space-y-6">
      {/* Reply count header */}
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-slate-900 flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          {replies?.length || 0} Replies
        </h4>
      </div>

      {/* Reply form */}
      {user ? (
        <div className="space-y-3">
          <Textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder={
              replyingTo ? 'Write your reply...' : 'Join the discussion...'
            }
            rows={3}
            className="resize-none"
          />
          <div className="flex justify-between items-center">
            <div>
              {replyingTo && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setReplyingTo(null)}
                >
                  Cancel reply
                </Button>
              )}
            </div>
            <Button
              onClick={handleSubmitReply}
              disabled={!replyContent.trim() || createReply.isPending}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {createReply.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Reply className="h-4 w-4 mr-2" />
              )}
              Post Reply
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <p className="text-slate-600">
            Please sign in to join the discussion.
          </p>
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
      )}

      {/* Replies list */}
      {!isLoading && topLevelReplies.length === 0 && (
        <div className="text-center py-8">
          <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-slate-600">
            No replies yet. Be the first to share your thoughts!
          </p>
        </div>
      )}

      <div className="space-y-4">
        {topLevelReplies.map((reply) => (
          <ReplyItem
            key={reply.id}
            reply={reply}
            childReplies={getChildReplies(reply.id)}
            discussionId={discussionId}
            currentUserId={user?.id}
            canMarkAsSolution={canMarkAsSolution}
            isEditing={editingReply === reply.id}
            editContent={editContent}
            onReply={() => setReplyingTo(reply.id)}
            onEdit={() => {
              setEditingReply(reply.id);
              setEditContent(reply.content);
            }}
            onCancelEdit={() => {
              setEditingReply(null);
              setEditContent('');
            }}
            onSaveEdit={() => handleUpdateReply(reply.id)}
            onEditContentChange={setEditContent}
            onDelete={() => handleDeleteReply(reply.id)}
            onMarkAsSolution={() =>
              handleMarkAsSolution(reply.id, reply.is_solution)
            }
            formatDate={formatDate}
            isUpdating={updateReply.isPending}
          />
        ))}
      </div>
    </div>
  );
};

interface ReplyItemProps {
  reply: DiscussionReply;
  childReplies: DiscussionReply[];
  discussionId: string;
  currentUserId?: string;
  canMarkAsSolution: boolean;
  isEditing: boolean;
  editContent: string;
  onReply: () => void;
  onEdit: () => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  onEditContentChange: (content: string) => void;
  onDelete: () => void;
  onMarkAsSolution: () => void;
  formatDate: (date: string) => string;
  isUpdating: boolean;
}

const ReplyItem: React.FC<ReplyItemProps> = ({
  reply,
  childReplies,
  discussionId,
  currentUserId,
  canMarkAsSolution,
  isEditing,
  editContent,
  onReply,
  onEdit,
  onCancelEdit,
  onSaveEdit,
  onEditContentChange,
  onDelete,
  onMarkAsSolution,
  formatDate,
  isUpdating,
}) => {
  const isOwner = currentUserId === reply.user_id;
  const authorName =
    reply.author?.full_name || reply.author?.username || 'Anonymous';

  return (
    <div className="space-y-4">
      <div
        className={`bg-white rounded-lg border p-4 ${
          reply.is_solution ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200'
        }`}
      >
        {/* Reply header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-emerald-600" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-medium text-slate-900">{authorName}</span>
                {reply.is_solution && (
                  <Badge className="bg-emerald-100 text-emerald-800 text-xs">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Solution
                  </Badge>
                )}
              </div>
              <span className="text-xs text-slate-500">
                {formatDate(reply.created_at)}
              </span>
            </div>
          </div>

          {/* Actions menu */}
          {(isOwner || canMarkAsSolution) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {isOwner && (
                  <>
                    <DropdownMenuItem onClick={onEdit}>
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={onDelete}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </>
                )}
                {canMarkAsSolution && (
                  <DropdownMenuItem onClick={onMarkAsSolution}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {reply.is_solution ? 'Unmark as solution' : 'Mark as solution'}
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Reply content */}
        {isEditing ? (
          <div className="space-y-3">
            <Textarea
              value={editContent}
              onChange={(e) => onEditContentChange(e.target.value)}
              rows={3}
              className="resize-none"
            />
            <div className="flex justify-end space-x-2">
              <Button variant="outline" size="sm" onClick={onCancelEdit}>
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={onSaveEdit}
                disabled={!editContent.trim() || isUpdating}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {isUpdating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Save'
                )}
              </Button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-slate-700 whitespace-pre-wrap">{reply.content}</p>

            {/* Reply actions */}
            {currentUserId && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <Button variant="ghost" size="sm" onClick={onReply}>
                  <Reply className="h-4 w-4 mr-1" />
                  Reply
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Child replies */}
      {childReplies.length > 0 && (
        <div className="ml-8 space-y-4 border-l-2 border-gray-100 pl-4">
          {childReplies.map((childReply) => (
            <div
              key={childReply.id}
              className="bg-gray-50 rounded-lg border border-gray-200 p-4"
            >
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="h-3 w-3 text-gray-600" />
                </div>
                <span className="font-medium text-sm text-slate-900">
                  {childReply.author?.full_name ||
                    childReply.author?.username ||
                    'Anonymous'}
                </span>
                <span className="text-xs text-slate-500">
                  {formatDate(childReply.created_at)}
                </span>
              </div>
              <p className="text-slate-700 text-sm">{childReply.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DiscussionReplies;
