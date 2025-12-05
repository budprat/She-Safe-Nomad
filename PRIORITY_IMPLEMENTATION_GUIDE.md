# Priority Implementation Guide

This document provides actionable implementation details for the most critical enhancements identified in the architecture analysis.

---

## Critical Bug Fix

### Bug: Geolocation Typo in useSOSAlerts.tsx

**File:** `src/hooks/useSOSAlerts.tsx`
**Line:** 76
**Severity:** CRITICAL

```typescript
// CURRENT (BUG):
if (!location.latitude || !longitude) {

// SHOULD BE:
if (!location.latitude || !location.longitude) {
```

**Impact:** SOS alerts may fail to capture user location when coordinates aren't explicitly provided.

---

## Priority 1: SOS Notification System

### Overview
The SOS button stores alerts in the database but does not actually notify anyone. This is the most critical gap in the application.

### Implementation Plan

#### Step 1: Create Supabase Edge Function for Notifications

```sql
-- Create the edge function trigger
CREATE OR REPLACE FUNCTION notify_emergency_contacts()
RETURNS TRIGGER AS $$
BEGIN
  -- Call edge function to send notifications
  PERFORM net.http_post(
    url := 'https://your-project.supabase.co/functions/v1/send-sos-notifications',
    body := json_build_object(
      'alert_id', NEW.id,
      'user_id', NEW.user_id,
      'latitude', NEW.latitude,
      'longitude', NEW.longitude,
      'alert_type', NEW.alert_type,
      'notes', NEW.notes
    )::text,
    headers := '{"Content-Type": "application/json"}'::jsonb
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach trigger
CREATE TRIGGER on_sos_alert_created
AFTER INSERT ON sos_alerts
FOR EACH ROW
EXECUTE FUNCTION notify_emergency_contacts();
```

#### Step 2: Edge Function Implementation (Deno)

Create `supabase/functions/send-sos-notifications/index.ts`:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const TWILIO_ACCOUNT_SID = Deno.env.get('TWILIO_ACCOUNT_SID')
const TWILIO_AUTH_TOKEN = Deno.env.get('TWILIO_AUTH_TOKEN')
const TWILIO_PHONE_NUMBER = Deno.env.get('TWILIO_PHONE_NUMBER')
const SENDGRID_API_KEY = Deno.env.get('SENDGRID_API_KEY')

serve(async (req) => {
  const { alert_id, user_id, latitude, longitude, alert_type, notes } = await req.json()

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  // Get emergency contacts
  const { data: contacts } = await supabase
    .from('emergency_contacts')
    .select('*')
    .eq('user_id', user_id)
    .eq('notify_on_sos', true)

  // Get user info
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user_id)
    .single()

  const userName = profile?.full_name || 'A She-Safe-Nomad user'
  const mapLink = `https://www.google.com/maps?q=${latitude},${longitude}`

  const notifiedIds: string[] = []

  for (const contact of contacts || []) {
    // Send SMS via Twilio
    if (contact.phone_number) {
      await sendSMS(
        contact.phone_number,
        `EMERGENCY ALERT: ${userName} has triggered an SOS alert. ` +
        `Location: ${mapLink}. ${notes ? `Note: ${notes}` : ''}`
      )
    }

    // Send Email via SendGrid
    if (contact.email) {
      await sendEmail(
        contact.email,
        `EMERGENCY: ${userName} needs help`,
        buildEmailBody(userName, mapLink, notes, latitude, longitude)
      )
    }

    notifiedIds.push(contact.id)
  }

  // Update alert with notified contacts
  await supabase
    .from('sos_alerts')
    .update({ contacts_notified: notifiedIds })
    .eq('id', alert_id)

  return new Response(JSON.stringify({ success: true, notified: notifiedIds.length }))
})

async function sendSMS(to: string, body: string) {
  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        To: to,
        From: TWILIO_PHONE_NUMBER!,
        Body: body,
      }),
    }
  )
  return response.json()
}

async function sendEmail(to: string, subject: string, html: string) {
  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SENDGRID_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: to }] }],
      from: { email: 'alerts@shesafenomad.com', name: 'She-Safe-Nomad' },
      subject,
      content: [{ type: 'text/html', value: html }],
    }),
  })
  return response.ok
}

function buildEmailBody(userName: string, mapLink: string, notes: string | null, lat: number, lng: number): string {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #dc2626; color: white; padding: 20px; text-align: center;">
        <h1>EMERGENCY SOS ALERT</h1>
      </div>
      <div style="padding: 20px; background: #f9fafb;">
        <p><strong>${userName}</strong> has triggered an emergency alert on She-Safe-Nomad.</p>
        ${notes ? `<p><strong>Message:</strong> ${notes}</p>` : ''}
        <p><strong>Location:</strong> ${lat}, ${lng}</p>
        <a href="${mapLink}" style="display: inline-block; background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 20px 0;">
          View Location on Map
        </a>
        <p style="color: #6b7280; font-size: 14px;">
          Please try to contact them immediately or alert local authorities if needed.
        </p>
      </div>
    </div>
  `
}
```

#### Step 3: Required Environment Variables

Add to Supabase project secrets:
```
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=+1234567890
SENDGRID_API_KEY=your_sendgrid_key
```

---

## Priority 2: URL-Based Routing

### Current Problem
The app uses state-based navigation instead of proper URL routing, breaking:
- Browser back/forward buttons
- Direct linking to pages
- SEO capabilities
- Sharing specific pages

### Implementation

#### Update `src/App.tsx`:

```typescript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import HomePage from '@/components/HomePage';
import MapPage from '@/components/MapPage';
import CommunityPage from '@/components/CommunityPage';
import ContributePage from '@/components/ContributePage';
import PremiumPage from '@/components/PremiumPage';
import CertificationPage from '@/components/CertificationPage';
import AuthPage from '@/components/auth/AuthPage';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/premium" element={<PremiumPage />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/community" element={<CommunityPage />} />
                <Route path="/contribute" element={<ContributePage />} />
                <Route path="/certification" element={<CertificationPage />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
```

#### Create `src/components/Layout.tsx`:

```typescript
import { Outlet } from 'react-router-dom';
import Header from './Header';

const Layout = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Outlet />
    </div>
  );
};

export default Layout;
```

#### Create `src/components/ProtectedRoute.tsx`:

```typescript
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
```

#### Update Header navigation:

```typescript
import { Link, useLocation } from 'react-router-dom';

// Replace onClick handlers with Link components
<Link to="/map">Map</Link>
<Link to="/community">Community</Link>
// etc.
```

---

## Priority 3: Discussion Reply System

### Database (Already Exists)
The `discussion_replies` table exists in migrations.

### Create Hook: `src/hooks/useDiscussionReplies.tsx`

```typescript
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
  created_at: string;
  updated_at: string;
}

export function useDiscussionReplies(discussionId: string) {
  return useQuery({
    queryKey: ['discussion-replies', discussionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('discussion_replies')
        .select('*')
        .eq('discussion_id', discussionId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data as DiscussionReply[];
    },
    enabled: !!discussionId,
  });
}

export function useCreateReply() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      discussionId,
      content,
      parentReplyId
    }: {
      discussionId: string;
      content: string;
      parentReplyId?: string
    }) => {
      if (!user) throw new Error('Must be authenticated');

      const { data, error } = await supabase
        .from('discussion_replies')
        .insert([{
          discussion_id: discussionId,
          user_id: user.id,
          content,
          parent_reply_id: parentReplyId || null,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['discussion-replies', variables.discussionId]
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
```

### Create Reply Component

```typescript
// src/components/DiscussionReplies.tsx
import React, { useState } from 'react';
import { MessageSquare, Reply, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useDiscussionReplies, useCreateReply } from '@/hooks/useDiscussionReplies';
import { useAuth } from '@/contexts/AuthContext';

interface DiscussionRepliesProps {
  discussionId: string;
}

const DiscussionReplies: React.FC<DiscussionRepliesProps> = ({ discussionId }) => {
  const { user } = useAuth();
  const { data: replies, isLoading } = useDiscussionReplies(discussionId);
  const createReply = useCreateReply();
  const [replyContent, setReplyContent] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const handleSubmitReply = () => {
    if (!replyContent.trim()) return;

    createReply.mutate({
      discussionId,
      content: replyContent,
      parentReplyId: replyingTo || undefined,
    }, {
      onSuccess: () => {
        setReplyContent('');
        setReplyingTo(null);
      },
    });
  };

  const topLevelReplies = replies?.filter(r => !r.parent_reply_id) || [];
  const getChildReplies = (parentId: string) =>
    replies?.filter(r => r.parent_reply_id === parentId) || [];

  return (
    <div className="space-y-4">
      <h4 className="font-semibold flex items-center gap-2">
        <MessageSquare className="h-4 w-4" />
        {replies?.length || 0} Replies
      </h4>

      {user && (
        <div className="space-y-2">
          <Textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Write a reply..."
            rows={3}
          />
          <div className="flex justify-end gap-2">
            {replyingTo && (
              <Button variant="ghost" onClick={() => setReplyingTo(null)}>
                Cancel Reply
              </Button>
            )}
            <Button
              onClick={handleSubmitReply}
              disabled={!replyContent.trim() || createReply.isPending}
            >
              {createReply.isPending ? 'Posting...' : 'Post Reply'}
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {topLevelReplies.map((reply) => (
          <ReplyItem
            key={reply.id}
            reply={reply}
            childReplies={getChildReplies(reply.id)}
            onReply={() => setReplyingTo(reply.id)}
          />
        ))}
      </div>
    </div>
  );
};
```

---

## Priority 4: Admin Moderation Panel

### Route Setup

Add admin routes to `App.tsx`:

```typescript
import AdminLayout from '@/components/admin/AdminLayout';
import ModerationQueue from '@/components/admin/ModerationQueue';
import AdminDashboard from '@/components/admin/AdminDashboard';

// In Routes:
<Route path="/admin" element={<AdminLayout />}>
  <Route index element={<AdminDashboard />} />
  <Route path="moderation" element={<ModerationQueue />} />
  <Route path="users" element={<UserManagement />} />
  <Route path="reports" element={<ReportAnalytics />} />
</Route>
```

### Admin Authorization Hook

```typescript
// src/hooks/useIsAdmin.tsx
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export function useIsAdmin() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['is-admin', user?.id],
    queryFn: async () => {
      if (!user) return false;

      const { data, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data?.is_admin || false;
    },
    enabled: !!user,
  });
}
```

### Moderation Queue Component

```typescript
// src/components/admin/ModerationQueue.tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';

export default function ModerationQueue() {
  const queryClient = useQueryClient();

  const { data: queue, isLoading } = useQuery({
    queryKey: ['moderation-queue'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('moderation_queue')
        .select('*')
        .eq('status', 'pending')
        .order('priority', { ascending: false })
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const moderateMutation = useMutation({
    mutationFn: async ({
      id,
      status,
      notes
    }: {
      id: string;
      status: 'approved' | 'rejected';
      notes?: string
    }) => {
      const { error } = await supabase
        .from('moderation_queue')
        .update({
          status,
          moderator_notes: notes,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['moderation-queue'] });
    },
  });

  // Component JSX...
}
```

---

## Priority 5: Payment Integration (Stripe)

### Install Dependencies

```bash
npm install @stripe/stripe-js @stripe/react-stripe-js
```

### Environment Variables

```
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_SECRET_KEY=sk_live_xxx (server-side only)
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

### Stripe Checkout Hook

```typescript
// src/hooks/useStripeCheckout.tsx
import { loadStripe } from '@stripe/stripe-js';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export function useStripeCheckout() {
  const { user } = useAuth();

  const createCheckoutSession = async (priceId: string) => {
    if (!user) throw new Error('Must be authenticated');

    // Call edge function to create checkout session
    const { data, error } = await supabase.functions.invoke('create-checkout-session', {
      body: { priceId, userId: user.id },
    });

    if (error) throw error;

    const stripe = await stripePromise;
    await stripe?.redirectToCheckout({ sessionId: data.sessionId });
  };

  return { createCheckoutSession };
}
```

### Edge Function for Checkout

```typescript
// supabase/functions/create-checkout-session/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from 'https://esm.sh/stripe@12.0.0'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2023-10-16',
})

serve(async (req) => {
  const { priceId, userId } = await req.json()

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${req.headers.get('origin')}/premium?success=true`,
    cancel_url: `${req.headers.get('origin')}/premium?canceled=true`,
    client_reference_id: userId,
    metadata: { userId },
  })

  return new Response(JSON.stringify({ sessionId: session.id }))
})
```

---

## Implementation Checklist

### Week 1
- [ ] Fix geolocation bug in useSOSAlerts.tsx
- [ ] Set up Twilio account and get credentials
- [ ] Set up SendGrid account and get API key
- [ ] Create SOS notification edge function
- [ ] Test SOS notification flow end-to-end

### Week 2
- [ ] Refactor to URL-based routing
- [ ] Create Layout and ProtectedRoute components
- [ ] Update Header with Link components
- [ ] Test navigation and deep linking

### Week 3
- [ ] Implement discussion replies hook
- [ ] Create DiscussionReplies component
- [ ] Add reply UI to CommunityPage
- [ ] Test threaded discussions

### Week 4
- [ ] Create admin authorization system
- [ ] Build ModerationQueue component
- [ ] Implement approve/reject functionality
- [ ] Add admin dashboard metrics

### Month 2
- [ ] Set up Stripe account
- [ ] Implement checkout flow
- [ ] Create webhook handlers
- [ ] Test subscription lifecycle

---

## Resources

### Service Providers
- **SMS:** [Twilio](https://www.twilio.com/) - ~$0.0075/SMS
- **Email:** [SendGrid](https://sendgrid.com/) - Free tier: 100 emails/day
- **Payments:** [Stripe](https://stripe.com/) - 2.9% + $0.30/transaction

### Supabase Documentation
- [Edge Functions](https://supabase.com/docs/guides/functions)
- [Database Webhooks](https://supabase.com/docs/guides/database/webhooks)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

### React Router
- [React Router v6 Docs](https://reactrouter.com/en/main)
