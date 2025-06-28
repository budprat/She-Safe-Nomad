
-- Create tables for women's travel safety platform

-- Safety locations table to store location-specific safety information
CREATE TABLE public.safety_locations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  location_type TEXT NOT NULL CHECK (location_type IN ('hotel', 'restaurant', 'neighborhood', 'transport', 'attraction')),
  overall_rating DECIMAL(3, 2) CHECK (overall_rating >= 1 AND overall_rating <= 5),
  safety_zone TEXT NOT NULL DEFAULT 'yellow' CHECK (safety_zone IN ('green', 'yellow', 'red')),
  harassment_frequency TEXT CHECK (harassment_frequency IN ('low', 'medium', 'high')),
  nighttime_safety TEXT CHECK (nighttime_safety IN ('safe', 'caution', 'avoid')),
  lighting_quality TEXT CHECK (lighting_quality IN ('excellent', 'good', 'poor')),
  security_presence TEXT CHECK (security_presence IN ('high', 'medium', 'low', 'none')),
  staff_responsiveness TEXT CHECK (staff_responsiveness IN ('excellent', 'good', 'fair', 'poor')),
  cultural_sensitivity TEXT CHECK (cultural_sensitivity IN ('high', 'medium', 'low')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Safety reports table for user-submitted safety information
CREATE TABLE public.safety_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  location_id UUID REFERENCES public.safety_locations(id) NOT NULL,
  overall_rating INTEGER NOT NULL CHECK (overall_rating >= 1 AND overall_rating <= 5),
  harassment_frequency TEXT CHECK (harassment_frequency IN ('low', 'medium', 'high')),
  nighttime_safety TEXT CHECK (nighttime_safety IN ('safe', 'caution', 'avoid')),
  lighting_quality TEXT CHECK (lighting_quality IN ('excellent', 'good', 'poor')),
  security_presence TEXT CHECK (security_presence IN ('high', 'medium', 'low', 'none')),
  staff_responsiveness TEXT CHECK (staff_responsiveness IN ('excellent', 'good', 'fair', 'poor')),
  cultural_sensitivity TEXT CHECK (cultural_sensitivity IN ('high', 'medium', 'low')),
  comments TEXT,
  is_verified BOOLEAN DEFAULT false,
  travel_context JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Safety alerts table for real-time safety notifications
CREATE TABLE public.safety_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  location_id UUID REFERENCES public.safety_locations(id) NOT NULL,
  created_by UUID REFERENCES auth.users NOT NULL,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('harassment', 'theft', 'scam', 'general', 'emergency')),
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  verified_by UUID REFERENCES auth.users,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Travel buddies table for connecting travelers
CREATE TABLE public.travel_buddies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  destination TEXT NOT NULL,
  travel_dates_start DATE NOT NULL,
  travel_dates_end DATE NOT NULL,
  travel_type TEXT CHECK (travel_type IN ('leisure', 'business', 'solo', 'group')),
  interests TEXT[],
  languages TEXT[],
  age_range TEXT CHECK (age_range IN ('18-25', '26-35', '36-45', '46-55', '55+')),
  experience_level TEXT CHECK (experience_level IN ('beginner', 'intermediate', 'experienced')),
  contact_preferences JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Safety discussions table for community forums
CREATE TABLE public.safety_discussions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT CHECK (category IN ('general', 'destination', 'transportation', 'accommodation', 'cultural', 'emergency')),
  location_reference TEXT,
  is_pinned BOOLEAN DEFAULT false,
  is_closed BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Discussion replies table
CREATE TABLE public.discussion_replies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  discussion_id UUID REFERENCES public.safety_discussions(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users NOT NULL,
  content TEXT NOT NULL,
  parent_reply_id UUID REFERENCES public.discussion_replies(id),
  is_solution BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User verification table for credibility system
CREATE TABLE public.user_verification (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL UNIQUE,
  verification_level TEXT NOT NULL DEFAULT 'unverified' CHECK (verification_level IN ('unverified', 'basic', 'verified', 'expert')),
  verification_documents JSONB DEFAULT '{}',
  travel_experience_years INTEGER,
  countries_visited INTEGER DEFAULT 0,
  safety_reports_count INTEGER DEFAULT 0,
  credibility_score DECIMAL(3, 2) DEFAULT 0.0,
  verified_by UUID REFERENCES auth.users,
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Business certifications table for establishments
CREATE TABLE public.business_certifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  location_id UUID REFERENCES public.safety_locations(id) NOT NULL,
  business_name TEXT NOT NULL,
  business_email TEXT NOT NULL,
  certification_level TEXT NOT NULL CHECK (certification_level IN ('bronze', 'silver', 'gold', 'platinum')),
  certification_features JSONB DEFAULT '{}',
  contact_person TEXT,
  contact_phone TEXT,
  application_status TEXT NOT NULL DEFAULT 'pending' CHECK (application_status IN ('pending', 'under_review', 'approved', 'rejected')),
  certified_by UUID REFERENCES auth.users,
  certification_expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.safety_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.safety_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.safety_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.travel_buddies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.safety_discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discussion_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_verification ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_certifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for safety_locations (public read, authenticated write)
CREATE POLICY "Anyone can view safety locations" 
  ON public.safety_locations 
  FOR SELECT 
  TO PUBLIC 
  USING (true);

CREATE POLICY "Authenticated users can create safety locations" 
  ON public.safety_locations 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

-- RLS Policies for safety_reports (users can view all, create their own, update their own)
CREATE POLICY "Anyone can view safety reports" 
  ON public.safety_reports 
  FOR SELECT 
  TO PUBLIC 
  USING (true);

CREATE POLICY "Users can create their own safety reports" 
  ON public.safety_reports 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own safety reports" 
  ON public.safety_reports 
  FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = user_id);

-- RLS Policies for safety_alerts (public read, authenticated write)
CREATE POLICY "Anyone can view active safety alerts" 
  ON public.safety_alerts 
  FOR SELECT 
  TO PUBLIC 
  USING (is_active = true);

CREATE POLICY "Authenticated users can create safety alerts" 
  ON public.safety_alerts 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = created_by);

-- RLS Policies for travel_buddies (users can view active, manage their own)
CREATE POLICY "Anyone can view active travel buddy requests" 
  ON public.travel_buddies 
  FOR SELECT 
  TO PUBLIC 
  USING (is_active = true);

CREATE POLICY "Users can manage their own travel buddy requests" 
  ON public.travel_buddies 
  FOR ALL 
  TO authenticated 
  USING (auth.uid() = user_id);

-- RLS Policies for safety_discussions (public read, authenticated write)
CREATE POLICY "Anyone can view safety discussions" 
  ON public.safety_discussions 
  FOR SELECT 
  TO PUBLIC 
  USING (true);

CREATE POLICY "Authenticated users can create discussions" 
  ON public.safety_discussions 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own discussions" 
  ON public.safety_discussions 
  FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = user_id);

-- RLS Policies for discussion_replies (public read, authenticated write)
CREATE POLICY "Anyone can view discussion replies" 
  ON public.discussion_replies 
  FOR SELECT 
  TO PUBLIC 
  USING (true);

CREATE POLICY "Authenticated users can create replies" 
  ON public.discussion_replies 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own replies" 
  ON public.discussion_replies 
  FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = user_id);

-- RLS Policies for user_verification (users can view their own)
CREATE POLICY "Users can view their own verification status" 
  ON public.user_verification 
  FOR SELECT 
  TO authenticated 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own verification request" 
  ON public.user_verification 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for business_certifications (public read approved, businesses manage their own)
CREATE POLICY "Anyone can view approved business certifications" 
  ON public.business_certifications 
  FOR SELECT 
  TO PUBLIC 
  USING (application_status = 'approved');

CREATE POLICY "Authenticated users can create certification applications" 
  ON public.business_certifications 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

-- Create updated_at triggers for all tables
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER update_safety_locations_updated_at BEFORE UPDATE ON public.safety_locations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_safety_reports_updated_at BEFORE UPDATE ON public.safety_reports FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_safety_alerts_updated_at BEFORE UPDATE ON public.safety_alerts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_travel_buddies_updated_at BEFORE UPDATE ON public.travel_buddies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_safety_discussions_updated_at BEFORE UPDATE ON public.safety_discussions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_discussion_replies_updated_at BEFORE UPDATE ON public.discussion_replies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_verification_updated_at BEFORE UPDATE ON public.user_verification FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_business_certifications_updated_at BEFORE UPDATE ON public.business_certifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample safety locations
INSERT INTO public.safety_locations (name, address, latitude, longitude, location_type, overall_rating, safety_zone, harassment_frequency, nighttime_safety, lighting_quality, security_presence, staff_responsiveness, cultural_sensitivity) VALUES
('Grand Plaza Hotel', '123 Main Street, Downtown', 40.7128, -74.0060, 'hotel', 4.5, 'green', 'low', 'safe', 'excellent', 'high', 'excellent', 'high'),
('Café Luna', '456 Park Avenue, Midtown', 40.7589, -73.9851, 'restaurant', 4.2, 'green', 'low', 'safe', 'good', 'medium', 'good', 'high'),
('Downtown District', 'Downtown Area', 40.7074, -74.0113, 'neighborhood', 3.8, 'yellow', 'medium', 'caution', 'good', 'medium', 'good', 'medium'),
('Metro Station Plaza', 'Central Station', 40.7527, -73.9772, 'transport', 3.2, 'yellow', 'medium', 'caution', 'poor', 'low', 'fair', 'medium'),
('Old Town Quarter', 'Historic District', 40.6892, -74.0445, 'neighborhood', 2.8, 'red', 'high', 'avoid', 'poor', 'none', 'poor', 'low');
