-- Create profiles table for user data
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  username TEXT UNIQUE,
  full_name TEXT,
  bio TEXT,
  location TEXT,
  avatar_url TEXT,
  travel_experience TEXT,
  languages TEXT[],
  interests TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_verification table
CREATE TABLE IF NOT EXISTS public.user_verification (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE UNIQUE NOT NULL,
  verification_level TEXT DEFAULT 'unverified',
  credibility_score INTEGER DEFAULT 0,
  documents_submitted BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create safety_locations table
CREATE TABLE IF NOT EXISTS public.safety_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  location_type TEXT NOT NULL,
  overall_rating DECIMAL(3, 2),
  safety_zone TEXT NOT NULL,
  harassment_frequency TEXT,
  nighttime_safety TEXT,
  lighting_quality TEXT,
  security_presence TEXT,
  staff_responsiveness TEXT,
  cultural_sensitivity TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create safety_discussions table
CREATE TABLE IF NOT EXISTS public.safety_discussions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT,
  location_reference TEXT,
  is_pinned BOOLEAN DEFAULT FALSE,
  is_closed BOOLEAN DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create safety_reports table
CREATE TABLE IF NOT EXISTS public.safety_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  location_id UUID REFERENCES public.safety_locations ON DELETE CASCADE NOT NULL,
  overall_rating INTEGER NOT NULL CHECK (overall_rating >= 1 AND overall_rating <= 5),
  harassment_frequency TEXT,
  nighttime_safety TEXT,
  lighting_quality TEXT,
  security_presence TEXT,
  staff_responsiveness TEXT,
  cultural_sensitivity TEXT,
  comments TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  travel_context JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create travel_buddies table
CREATE TABLE IF NOT EXISTS public.travel_buddies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  destination TEXT NOT NULL,
  travel_dates_start DATE NOT NULL,
  travel_dates_end DATE NOT NULL,
  travel_type TEXT,
  interests TEXT[],
  languages TEXT[],
  age_range TEXT,
  experience_level TEXT,
  contact_preferences JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_verification ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.safety_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.safety_discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.safety_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.travel_buddies ENABLE ROW LEVEL SECURITY;

-- Policies for profiles table
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Policies for user_verification table
CREATE POLICY "Users can view their own verification"
  ON public.user_verification FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own verification"
  ON public.user_verification FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own verification"
  ON public.user_verification FOR UPDATE
  USING (auth.uid() = user_id);

-- Policies for safety_locations table
CREATE POLICY "Safety locations are viewable by everyone"
  ON public.safety_locations FOR SELECT
  USING (true);

-- Policies for safety_discussions table
CREATE POLICY "Discussions are viewable by everyone"
  ON public.safety_discussions FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create discussions"
  ON public.safety_discussions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own discussions"
  ON public.safety_discussions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own discussions"
  ON public.safety_discussions FOR DELETE
  USING (auth.uid() = user_id);

-- Policies for safety_reports table
CREATE POLICY "Reports are viewable by everyone"
  ON public.safety_reports FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create reports"
  ON public.safety_reports FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reports"
  ON public.safety_reports FOR UPDATE
  USING (auth.uid() = user_id);

-- Policies for travel_buddies table
CREATE POLICY "Active travel buddy requests are viewable by everyone"
  ON public.travel_buddies FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated users can create travel buddy requests"
  ON public.travel_buddies FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own travel buddy requests"
  ON public.travel_buddies FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own travel buddy requests"
  ON public.travel_buddies FOR DELETE
  USING (auth.uid() = user_id);

-- Create function for updating updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER set_updated_at_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_user_verification
  BEFORE UPDATE ON public.user_verification
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_safety_locations
  BEFORE UPDATE ON public.safety_locations
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_safety_discussions
  BEFORE UPDATE ON public.safety_discussions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_safety_reports
  BEFORE UPDATE ON public.safety_reports
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_travel_buddies
  BEFORE UPDATE ON public.travel_buddies
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create trigger to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();