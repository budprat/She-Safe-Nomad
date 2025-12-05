-- Notification System Migration
-- Adds support for tracking notifications and alert resolution

-- ============================================================================
-- NOTIFICATION LOGS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.notification_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_id UUID REFERENCES public.sos_alerts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL DEFAULT 'sos', -- 'sos', 'safety_alert', 'community'
  contacts_attempted INTEGER DEFAULT 0,
  contacts_notified INTEGER DEFAULT 0,
  results JSONB, -- Detailed results per contact
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE public.notification_logs ENABLE ROW LEVEL SECURITY;

-- Users can view their own notification logs
CREATE POLICY "Users can view own notification logs"
ON public.notification_logs FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Service role can insert logs (from edge functions)
CREATE POLICY "Service role can insert notification logs"
ON public.notification_logs FOR INSERT
TO service_role
WITH CHECK (true);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_notification_logs_alert_id ON public.notification_logs(alert_id);
CREATE INDEX IF NOT EXISTS idx_notification_logs_user_id ON public.notification_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_notification_logs_created_at ON public.notification_logs(created_at DESC);

-- ============================================================================
-- DISCUSSION REPLIES TABLE (if not exists)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.discussion_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  discussion_id UUID NOT NULL REFERENCES public.safety_discussions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_reply_id UUID REFERENCES public.discussion_replies(id) ON DELETE CASCADE,
  is_solution BOOLEAN DEFAULT false,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE public.discussion_replies ENABLE ROW LEVEL SECURITY;

-- Anyone can read replies
CREATE POLICY "Anyone can read discussion replies"
ON public.discussion_replies FOR SELECT
TO public
USING (true);

-- Authenticated users can create replies
CREATE POLICY "Authenticated users can create replies"
ON public.discussion_replies FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can update their own replies (within 1 hour)
CREATE POLICY "Users can update own recent replies"
ON public.discussion_replies FOR UPDATE
TO authenticated
USING (user_id = auth.uid() AND created_at > (NOW() - INTERVAL '1 hour'))
WITH CHECK (user_id = auth.uid());

-- Users can delete their own replies (within 15 minutes)
CREATE POLICY "Users can delete own recent replies"
ON public.discussion_replies FOR DELETE
TO authenticated
USING (user_id = auth.uid() AND created_at > (NOW() - INTERVAL '15 minutes'));

-- Indexes
CREATE INDEX IF NOT EXISTS idx_discussion_replies_discussion_id ON public.discussion_replies(discussion_id);
CREATE INDEX IF NOT EXISTS idx_discussion_replies_user_id ON public.discussion_replies(user_id);
CREATE INDEX IF NOT EXISTS idx_discussion_replies_parent_id ON public.discussion_replies(parent_reply_id);
CREATE INDEX IF NOT EXISTS idx_discussion_replies_created_at ON public.discussion_replies(created_at);

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_discussion_replies_updated_at ON public.discussion_replies;
CREATE TRIGGER update_discussion_replies_updated_at
  BEFORE UPDATE ON public.discussion_replies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- UPDATE SAFETY DISCUSSIONS WITH REPLY COUNT
-- ============================================================================

-- Add reply_count column if not exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'safety_discussions' AND column_name = 'reply_count') THEN
    ALTER TABLE public.safety_discussions ADD COLUMN reply_count INTEGER DEFAULT 0;
  END IF;
END $$;

-- Function to update reply count
CREATE OR REPLACE FUNCTION update_discussion_reply_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.safety_discussions
    SET reply_count = reply_count + 1
    WHERE id = NEW.discussion_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.safety_discussions
    SET reply_count = GREATEST(0, reply_count - 1)
    WHERE id = OLD.discussion_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update reply count
DROP TRIGGER IF EXISTS trigger_update_reply_count ON public.discussion_replies;
CREATE TRIGGER trigger_update_reply_count
  AFTER INSERT OR DELETE ON public.discussion_replies
  FOR EACH ROW
  EXECUTE FUNCTION update_discussion_reply_count();

-- ============================================================================
-- SAFETY ALERTS (Real-time location-based alerts)
-- ============================================================================

-- Add expires_at to safety_alerts if not exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'safety_alerts' AND column_name = 'expires_at') THEN
    ALTER TABLE public.safety_alerts ADD COLUMN expires_at TIMESTAMP WITH TIME ZONE;
  END IF;
END $$;

-- ============================================================================
-- ADMIN ACTIVITY LOG
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.admin_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES auth.users(id),
  action TEXT NOT NULL, -- 'approve', 'reject', 'ban', 'unban', 'edit', 'delete'
  target_type TEXT NOT NULL, -- 'user', 'location', 'report', 'discussion', 'reply'
  target_id UUID NOT NULL,
  details JSONB,
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE public.admin_activity_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view activity log
CREATE POLICY "Admins can view activity log"
ON public.admin_activity_log FOR SELECT
TO authenticated
USING ((SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true);

-- Only admins can insert activity log
CREATE POLICY "Admins can insert activity log"
ON public.admin_activity_log FOR INSERT
TO authenticated
WITH CHECK ((SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_admin_activity_log_admin_id ON public.admin_activity_log(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_activity_log_action ON public.admin_activity_log(action);
CREATE INDEX IF NOT EXISTS idx_admin_activity_log_created_at ON public.admin_activity_log(created_at DESC);

-- ============================================================================
-- SUBSCRIPTION STATUS TABLE (for premium features)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_type TEXT NOT NULL DEFAULT 'free', -- 'free', 'basic', 'premium', 'professional'
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  status TEXT DEFAULT 'active', -- 'active', 'canceled', 'past_due', 'paused'
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can view their own subscription
CREATE POLICY "Users can view own subscription"
ON public.user_subscriptions FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Service role can manage subscriptions (from webhooks)
CREATE POLICY "Service role manages subscriptions"
ON public.user_subscriptions FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_user_subscriptions_updated_at ON public.user_subscriptions;
CREATE TRIGGER update_user_subscriptions_updated_at
  BEFORE UPDATE ON public.user_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Index
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON public.user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON public.user_subscriptions(status);

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE public.notification_logs IS 'Tracks all notification attempts and results';
COMMENT ON TABLE public.discussion_replies IS 'Replies to safety discussions with threading support';
COMMENT ON TABLE public.admin_activity_log IS 'Audit log for admin actions';
COMMENT ON TABLE public.user_subscriptions IS 'User subscription status for premium features';
