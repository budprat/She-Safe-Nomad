import React, { useState, useEffect } from 'react';
import {
  User,
  Shield,
  MapPin,
  Star,
  CheckCircle,
  AlertTriangle,
  Bell,
  Lock,
  CreditCard,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import EmergencyContactsManager from '@/components/emergency/EmergencyContactsManager';
import { Link } from 'react-router-dom';

interface ProfileData {
  username: string;
  full_name: string;
  bio: string;
  location: string;
  travel_experience_years: number;
  countries_visited: number;
  languages: string[];
  interests: string[];
}

interface VerificationData {
  verification_level: string;
  credibility_score: number;
  safety_reports_count: number;
}

const commonLanguages = [
  'English',
  'Spanish',
  'French',
  'German',
  'Italian',
  'Portuguese',
  'Mandarin',
  'Japanese',
  'Arabic',
  'Hindi',
];
const commonInterests = [
  'Solo Travel',
  'Budget Travel',
  'Luxury Travel',
  'Adventure',
  'Culture',
  'Food',
  'Photography',
  'Nature',
  'History',
  'Nightlife',
];

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const [formData, setFormData] = useState<ProfileData>({
    username: '',
    full_name: '',
    bio: '',
    location: '',
    travel_experience_years: 0,
    countries_visited: 0,
    languages: [],
    interests: [],
  });

  const [verificationData, setVerificationData] = useState<VerificationData>({
    verification_level: 'unverified',
    credibility_score: 0,
    safety_reports_count: 0,
  });

  // Load profile data on mount
  useEffect(() => {
    if (user) {
      loadProfileData();
    }
  }, [user]);

  const loadProfileData = async () => {
    if (!user) return;

    setLoadingProfile(true);
    try {
      // Fetch profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      // Fetch verification data
      const { data: verification } = await supabase
        .from('user_verification')
        .select('*')
        .eq('user_id', user.id)
        .single();

      // Count safety reports
      const { count: reportsCount } = await supabase
        .from('safety_reports')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      if (profile) {
        setFormData({
          username: profile.username || '',
          full_name: profile.full_name || user.user_metadata?.full_name || '',
          bio: profile.bio || '',
          location: profile.location || '',
          travel_experience_years: verification?.travel_experience_years || 0,
          countries_visited: verification?.countries_visited || 0,
          languages: profile.languages || [],
          interests: profile.interests || [],
        });
      }

      if (verification) {
        setVerificationData({
          verification_level: verification.verification_level || 'unverified',
          credibility_score: verification.credibility_score || 0,
          safety_reports_count: reportsCount || 0,
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleInputChange = (field: keyof ProfileData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Update profile
      const { error: profileError } = await supabase.from('profiles').upsert({
        id: user.id,
        username: formData.username,
        full_name: formData.full_name,
        bio: formData.bio,
        location: formData.location,
        languages: formData.languages,
        interests: formData.interests,
        updated_at: new Date().toISOString(),
      });

      if (profileError) throw profileError;

      // Update verification data
      const { error: verificationError } = await supabase
        .from('user_verification')
        .upsert({
          user_id: user.id,
          travel_experience_years: formData.travel_experience_years,
          countries_visited: formData.countries_visited,
          updated_at: new Date().toISOString(),
        });

      if (verificationError) throw verificationError;

      toast({
        title: 'Profile Updated',
        description: 'Your profile has been successfully updated.',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Update Failed',
        description: 'There was an error updating your profile.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getVerificationBadge = () => {
    switch (verificationData.verification_level) {
      case 'verified':
        return (
          <Badge
            variant="outline"
            className="text-emerald-600 border-emerald-200"
          >
            <CheckCircle className="h-3 w-3 mr-1" />
            Verified Traveler
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="outline" className="text-amber-600 border-amber-200">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Verification Pending
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-gray-600 border-gray-200">
            <User className="h-3 w-3 mr-1" />
            Unverified
          </Badge>
        );
    }
  };

  if (loadingProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
          <p className="text-slate-600 mt-1">
            Manage your profile, emergency contacts, and preferences
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="emergency" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              <span className="hidden sm:inline">Emergency</span>
            </TabsTrigger>
            <TabsTrigger
              value="verification"
              className="flex items-center gap-2"
            >
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Verification</span>
            </TabsTrigger>
            <TabsTrigger value="account" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              <span className="hidden sm:inline">Account</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Update your profile details visible to other community members
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={(e) =>
                        handleInputChange('username', e.target.value)
                      }
                      placeholder="Enter username"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) =>
                        handleInputChange('full_name', e.target.value)
                      }
                      placeholder="Enter full name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder="Tell others about yourself and your travel style..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) =>
                        handleInputChange('location', e.target.value)
                      }
                      placeholder="Your current city or country"
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Travel Experience</CardTitle>
                <CardDescription>
                  Share your travel background with the community
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="experience">Years of Travel Experience</Label>
                    <Input
                      id="experience"
                      type="number"
                      value={formData.travel_experience_years}
                      onChange={(e) =>
                        handleInputChange(
                          'travel_experience_years',
                          parseInt(e.target.value) || 0
                        )
                      }
                      min="0"
                      max="50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="countries">Countries Visited</Label>
                    <Input
                      id="countries"
                      type="number"
                      value={formData.countries_visited}
                      onChange={(e) =>
                        handleInputChange(
                          'countries_visited',
                          parseInt(e.target.value) || 0
                        )
                      }
                      min="0"
                      max="195"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Languages Spoken</Label>
                  <div className="flex flex-wrap gap-2">
                    {commonLanguages.map((language) => (
                      <Button
                        key={language}
                        type="button"
                        variant={
                          formData.languages.includes(language)
                            ? 'default'
                            : 'outline'
                        }
                        size="sm"
                        onClick={() => {
                          const updated = formData.languages.includes(language)
                            ? formData.languages.filter((l) => l !== language)
                            : [...formData.languages, language];
                          handleInputChange('languages', updated);
                        }}
                        className="text-xs"
                      >
                        {language}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Travel Interests</Label>
                  <div className="flex flex-wrap gap-2">
                    {commonInterests.map((interest) => (
                      <Button
                        key={interest}
                        type="button"
                        variant={
                          formData.interests.includes(interest)
                            ? 'default'
                            : 'outline'
                        }
                        size="sm"
                        onClick={() => {
                          const updated = formData.interests.includes(interest)
                            ? formData.interests.filter((i) => i !== interest)
                            : [...formData.interests, interest];
                          handleInputChange('interests', updated);
                        }}
                        className="text-xs"
                      >
                        {interest}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    onClick={handleSaveProfile}
                    disabled={loading}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Saving...
                      </>
                    ) : (
                      'Save Profile'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Emergency Contacts Tab */}
          <TabsContent value="emergency">
            <EmergencyContactsManager />
          </TabsContent>

          {/* Verification Tab */}
          <TabsContent value="verification" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-emerald-600" />
                  Verification Status
                </CardTitle>
                <CardDescription>
                  Your current verification level and credibility score
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">
                      Account Status
                    </span>
                    {getVerificationBadge()}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">
                      Credibility Score
                    </span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="font-semibold">
                        {verificationData.credibility_score.toFixed(1)}/5.0
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">
                      Safety Reports Submitted
                    </span>
                    <span className="font-semibold">
                      {verificationData.safety_reports_count}
                    </span>
                  </div>
                </div>

                {verificationData.verification_level === 'unverified' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-900">
                          How to Get Verified
                        </h4>
                        <ul className="text-sm text-blue-700 mt-2 space-y-1 list-disc list-inside">
                          <li>Submit quality safety reports from your travels</li>
                          <li>
                            Engage positively in community discussions
                          </li>
                          <li>
                            Help other travelers with accurate information
                          </li>
                          <li>Maintain a good credibility score</li>
                        </ul>
                        <Link to="/contribute">
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-3 border-blue-300 text-blue-700 hover:bg-blue-100"
                          >
                            Submit a Safety Report
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Account Tab */}
          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>
                  Your account details and subscription status
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input value={user?.email || ''} disabled />
                  <p className="text-xs text-slate-500">
                    Contact support to change your email address
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">
                      Account Created
                    </span>
                    <span className="font-medium">
                      {user?.created_at
                        ? new Date(user.created_at).toLocaleDateString()
                        : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">
                      Subscription
                    </span>
                    <Badge
                      variant="outline"
                      className="text-gray-600 border-gray-200"
                    >
                      Free Plan
                    </Badge>
                  </div>
                </div>

                <div className="pt-2">
                  <Link to="/premium">
                    <Button
                      variant="outline"
                      className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Upgrade to Premium
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-red-600">Danger Zone</CardTitle>
                <CardDescription>
                  Irreversible actions for your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="border-red-300 text-red-600 hover:bg-red-50"
                >
                  Delete Account
                </Button>
                <p className="text-xs text-slate-500 mt-2">
                  This action cannot be undone. All your data will be
                  permanently deleted.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SettingsPage;
