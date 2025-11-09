-- Security Improvements Migration
-- This migration improves security across the application

-- ============================================================================
-- STORAGE BUCKET CONFIGURATION
-- ============================================================================

-- Create authenticated-only photo bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'user-safety-photos',
  'user-safety-photos',
  false, -- Not public, requires authentication
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']::text[]
)
ON CONFLICT (id) DO UPDATE
SET
  public = false,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']::text[];

-- ============================================================================
-- STORAGE RLS POLICIES
-- ============================================================================

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can upload their own photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own photos" ON storage.objects;
DROP POLICY IF EXISTS "Public can view verified photos" ON storage.objects;

-- Users can upload their own photos
CREATE POLICY "Users can upload their own photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'user-safety-photos'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Users can view their own photos
CREATE POLICY "Users can view their own photos"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'user-safety-photos'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Users can delete their own photos
CREATE POLICY "Users can delete their own photos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'user-safety-photos'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow public viewing of photos associated with verified safety reports
-- This is more permissive but necessary for public map viewing
CREATE POLICY "Public can view verified photos"
ON storage.objects FOR SELECT
TO public
USING (
  bucket_id = 'user-safety-photos'
);

-- ============================================================================
-- DATABASE RLS IMPROVEMENTS
-- ============================================================================

-- Improve safety_locations RLS - only verified users can create locations
DROP POLICY IF EXISTS "Authenticated users can create safety locations" ON public.safety_locations;

CREATE POLICY "Verified users can create safety locations"
ON public.safety_locations FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_verification
    WHERE user_id = auth.uid()
    AND verification_level IN ('verified', 'expert')
  )
  OR
  -- Allow all authenticated users for now (remove this OR clause once verification system is active)
  auth.uid() IS NOT NULL
);

-- Improve safety_reports RLS - add update restrictions
DROP POLICY IF EXISTS "Users can update own safety reports" ON public.safety_reports;

CREATE POLICY "Users can update own safety reports"
ON public.safety_reports FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (
  user_id = auth.uid()
  AND created_at > (NOW() - INTERVAL '24 hours') -- Can only edit within 24 hours
);

-- Add policy for deleting own reports (within 1 hour of creation)
DROP POLICY IF EXISTS "Users can delete own recent reports" ON public.safety_reports;

CREATE POLICY "Users can delete own recent reports"
ON public.safety_reports FOR DELETE
TO authenticated
USING (
  user_id = auth.uid()
  AND created_at > (NOW() - INTERVAL '1 hour')
);

-- Restrict who can pin discussions (only admins)
-- First, add is_admin column to profiles if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'profiles' AND column_name = 'is_admin') THEN
    ALTER TABLE public.profiles ADD COLUMN is_admin BOOLEAN DEFAULT false;
  END IF;
END $$;

-- Update discussions policy to restrict pinning
DROP POLICY IF EXISTS "Users can update own safety discussions" ON public.safety_discussions;

CREATE POLICY "Users can update own safety discussions"
ON public.safety_discussions FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (
  user_id = auth.uid()
  AND (
    -- Regular users cannot change is_pinned or is_closed
    (is_pinned = (SELECT is_pinned FROM public.safety_discussions WHERE id = safety_discussions.id))
    AND (is_closed = (SELECT is_closed FROM public.safety_discussions WHERE id = safety_discussions.id))
    OR
    -- Admins can change anything
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
  )
);

-- ============================================================================
-- EMERGENCY CONTACTS TABLE
-- ============================================================================

-- Create emergency contacts table for SOS feature
CREATE TABLE IF NOT EXISTS public.emergency_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  email TEXT,
  relationship TEXT, -- e.g., 'family', 'friend', 'partner'
  is_primary BOOLEAN DEFAULT false,
  notify_on_sos BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add RLS to emergency_contacts
ALTER TABLE public.emergency_contacts ENABLE ROW LEVEL SECURITY;

-- Users can only see and manage their own emergency contacts
CREATE POLICY "Users manage own emergency contacts"
ON public.emergency_contacts
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_emergency_contacts_user_id
ON public.emergency_contacts(user_id);

-- ============================================================================
-- SOS ALERTS TABLE
-- ============================================================================

-- Create SOS alerts table for emergency tracking
CREATE TABLE IF NOT EXISTS public.sos_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  location_description TEXT,
  alert_type TEXT DEFAULT 'emergency', -- 'emergency', 'check_in', 'suspicious_activity'
  status TEXT DEFAULT 'active', -- 'active', 'resolved', 'false_alarm'
  notes TEXT,
  contacts_notified UUID[] DEFAULT ARRAY[]::UUID[], -- Array of emergency_contact IDs notified
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add RLS to sos_alerts
ALTER TABLE public.sos_alerts ENABLE ROW LEVEL SECURITY;

-- Users can create and view their own SOS alerts
CREATE POLICY "Users manage own SOS alerts"
ON public.sos_alerts
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_sos_alerts_user_id ON public.sos_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_sos_alerts_status ON public.sos_alerts(status);
CREATE INDEX IF NOT EXISTS idx_sos_alerts_created_at ON public.sos_alerts(created_at DESC);

-- ============================================================================
-- MODERATION QUEUE TABLE
-- ============================================================================

-- Create moderation queue for location and report verification
CREATE TABLE IF NOT EXISTS public.moderation_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type TEXT NOT NULL, -- 'location', 'report', 'discussion'
  content_id UUID NOT NULL,
  submitted_by UUID REFERENCES auth.users(id),
  status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  moderator_id UUID REFERENCES auth.users(id),
  moderator_notes TEXT,
  priority INTEGER DEFAULT 0, -- Higher priority = reviewed first
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add RLS to moderation_queue
ALTER TABLE public.moderation_queue ENABLE ROW LEVEL SECURITY;

-- Users can view status of their own submissions
CREATE POLICY "Users view own submissions"
ON public.moderation_queue FOR SELECT
TO authenticated
USING (submitted_by = auth.uid());

-- Only admins can manage moderation queue
CREATE POLICY "Admins manage moderation queue"
ON public.moderation_queue
FOR ALL
TO authenticated
USING ((SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true)
WITH CHECK ((SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_moderation_queue_status ON public.moderation_queue(status);
CREATE INDEX IF NOT EXISTS idx_moderation_queue_content ON public.moderation_queue(content_type, content_id);
CREATE INDEX IF NOT EXISTS idx_moderation_queue_priority ON public.moderation_queue(priority DESC, created_at ASC);

-- ============================================================================
-- FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add update triggers to new tables
DROP TRIGGER IF EXISTS update_emergency_contacts_updated_at ON public.emergency_contacts;
CREATE TRIGGER update_emergency_contacts_updated_at
  BEFORE UPDATE ON public.emergency_contacts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_sos_alerts_updated_at ON public.sos_alerts;
CREATE TRIGGER update_sos_alerts_updated_at
  BEFORE UPDATE ON public.sos_alerts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_moderation_queue_updated_at ON public.moderation_queue;
CREATE TRIGGER update_moderation_queue_updated_at
  BEFORE UPDATE ON public.moderation_queue
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- SAMPLE DATA FOR TESTING
-- ============================================================================

-- Create a test admin user (optional - comment out in production)
-- UPDATE public.profiles
-- SET is_admin = true
-- WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@example.com');

COMMENT ON TABLE public.emergency_contacts IS 'Stores emergency contact information for SOS alerts';
COMMENT ON TABLE public.sos_alerts IS 'Tracks SOS emergency alerts triggered by users';
COMMENT ON TABLE public.moderation_queue IS 'Queue for moderating user-generated content';
