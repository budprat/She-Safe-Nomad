import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface DiscussionReply {
  id: string;
  discussion_id: string;
  user_id: string;
  content: string;
  parent_reply_id: string | null;
  is_solution: boolean;
  likes_count: number;
  created_at: string;
  updated_at: string;
  // Joined data
  author?: {
    username: string | null;
    full_name: string | null;
    avatar_url: string | null;
  };
}

export interface CreateReplyData {
  discussion_id: string;
  content: string;
  parent_reply_id?: string;
}

/**
 * Hook to fetch replies for a discussion
 */
export function useDiscussionReplies(discussionId: string) {
  return useQuery({
    queryKey: ['discussion-replies', discussionId],
    queryFn: async (): Promise<DiscussionReply[]> => {
      const { data, error } = await supabase
        .from('discussion_replies')
        .select(`
          *,
          author:profiles!user_id(username, full_name, avatar_url)
        `)
        .eq('discussion_id', discussionId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching discussion replies:', error);
        throw error;
      }

      return (data || []).map((reply: any) => ({
        ...reply,
        author: reply.author || null,
      }));
    },
    enabled: !!discussionId,
  });
}

/**
 * Hook to create a new reply
 */
export function useCreateReply() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (replyData: CreateReplyData) => {
      if (!user) throw new Error('Must be authenticated to reply');

      const { data, error } = await supabase
        .from('discussion_replies')
        .insert([
          {
            discussion_id: replyData.discussion_id,
            user_id: user.id,
            content: replyData.content,
            parent_reply_id: replyData.parent_reply_id || null,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['discussion-replies', variables.discussion_id],
      });
      queryClient.invalidateQueries({
        queryKey: ['safety-discussions'],
      });
      toast({
        title: 'Reply posted',
        description: 'Your reply has been added to the discussion.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to post reply',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to update a reply
 */
export function useUpdateReply() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      id,
      content,
      discussionId,
    }: {
      id: string;
      content: string;
      discussionId: string;
    }) => {
      if (!user) throw new Error('Must be authenticated');

      const { data, error } = await supabase
        .from('discussion_replies')
        .update({ content })
        .eq('id', id)
        .eq('user_id', user.id) // Ensure user owns the reply
        .select()
        .single();

      if (error) throw error;
      return { ...data, discussionId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['discussion-replies', data.discussionId],
      });
      toast({
        title: 'Reply updated',
        description: 'Your reply has been updated.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to update reply',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to delete a reply
 */
export function useDeleteReply() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      id,
      discussionId,
    }: {
      id: string;
      discussionId: string;
    }) => {
      if (!user) throw new Error('Must be authenticated');

      const { error } = await supabase
        .from('discussion_replies')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id); // Ensure user owns the reply

      if (error) throw error;
      return { id, discussionId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['discussion-replies', data.discussionId],
      });
      queryClient.invalidateQueries({
        queryKey: ['safety-discussions'],
      });
      toast({
        title: 'Reply deleted',
        description: 'Your reply has been removed.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to delete reply',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to mark a reply as solution
 */
export function useMarkAsSolution() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      id,
      discussionId,
      isSolution,
    }: {
      id: string;
      discussionId: string;
      isSolution: boolean;
    }) => {
      const { error } = await supabase
        .from('discussion_replies')
        .update({ is_solution: isSolution })
        .eq('id', id);

      if (error) throw error;
      return { id, discussionId, isSolution };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['discussion-replies', data.discussionId],
      });
      toast({
        title: data.isSolution ? 'Marked as solution' : 'Unmarked as solution',
        description: data.isSolution
          ? 'This reply has been marked as the solution.'
          : 'This reply is no longer marked as the solution.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to update',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}
