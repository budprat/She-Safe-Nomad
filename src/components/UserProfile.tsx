
import React, { useState } from 'react';
import { User, Shield, MapPin, Calendar, Star, CheckCircle, AlertTriangle, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface UserProfileProps {
  onClose: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ onClose }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    full_name: user?.user_metadata?.full_name || '',
    bio: '',
    location: '',
    travel_experience_years: 0,
    countries_visited: 0,
    languages: [] as string[],
    interests: [] as string[]
  });

  const [verificationData, setVerificationData] = useState({
    verification_level: 'unverified',
    credibility_score: 0,
    safety_reports_count: 0
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          username: formData.username,
          full_name: formData.full_name,
          bio: formData.bio,
          location: formData.location,
          updated_at: new Date().toISOString()
        });

      if (profileError) throw profileError;

      // Update verification data
      const { error: verificationError } = await supabase
        .from('user_verification')
        .upsert({
          user_id: user.id,
          travel_experience_years: formData.travel_experience_years,
          countries_visited: formData.countries_visited,
          updated_at: new Date().toISOString()
        });

      if (verificationError) throw verificationError;

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update Failed",
        description: "There was an error updating your profile.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getVerificationBadge = () => {
    switch (verificationData.verification_level) {
      case 'verified':
        return <Badge variant="outline" className="text-emerald-600 border-emerald-200">
          <CheckCircle className="h-3 w-3 mr-1" />
          Verified Traveler
        </Badge>;
      case 'pending':
        return <Badge variant="outline" className="text-amber-600 border-amber-200">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Verification Pending
        </Badge>;
      default:
        return <Badge variant="outline" className="text-gray-600 border-gray-200">
          <User className="h-3 w-3 mr-1" />
          Unverified
        </Badge>;
    }
  };

  const commonLanguages = ['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Mandarin', 'Japanese', 'Arabic', 'Hindi'];
  const commonInterests = ['Solo Travel', 'Budget Travel', 'Luxury Travel', 'Adventure', 'Culture', 'Food', 'Photography', 'Nature', 'History', 'Nightlife'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-2xl font-bold text-slate-900 mb-2">
                My Profile
              </CardTitle>
              <div className="flex items-center space-x-2">
                {getVerificationBadge()}
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium">{verificationData.credibility_score.toFixed(1)}</span>
                </div>
              </div>
            </div>
            <Button variant="ghost" onClick={onClose}>
              ×
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">Basic Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Username
                </label>
                <Input
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  placeholder="Enter username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Full Name
                </label>
                <Input
                  value={formData.full_name}
                  onChange={(e) => handleInputChange('full_name', e.target.value)}
                  placeholder="Enter full name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Bio
              </label>
              <Textarea
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder="Tell others about yourself and your travel style..."
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Your current city or country"
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Travel Experience */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">Travel Experience</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Years of Travel Experience
                </label>
                <Input
                  type="number"
                  value={formData.travel_experience_years}
                  onChange={(e) => handleInputChange('travel_experience_years', parseInt(e.target.value) || 0)}
                  min="0"
                  max="50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Countries Visited
                </label>
                <Input
                  type="number"
                  value={formData.countries_visited}
                  onChange={(e) => handleInputChange('countries_visited', parseInt(e.target.value) || 0)}
                  min="0"
                  max="195"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Languages Spoken
              </label>
              <div className="flex flex-wrap gap-2">
                {commonLanguages.map((language) => (
                  <Button
                    key={language}
                    variant={formData.languages.includes(language) ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      const updated = formData.languages.includes(language)
                        ? formData.languages.filter(l => l !== language)
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

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Travel Interests
              </label>
              <div className="flex flex-wrap gap-2">
                {commonInterests.map((interest) => (
                  <Button
                    key={interest}
                    variant={formData.interests.includes(interest) ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      const updated = formData.interests.includes(interest)
                        ? formData.interests.filter(i => i !== interest)
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
          </div>

          {/* Verification Status */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">Verification & Credibility</h3>
            
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Safety Reports Submitted</span>
                <span className="font-semibold">{verificationData.safety_reports_count}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Credibility Score</span>
                <span className="font-semibold">{verificationData.credibility_score.toFixed(1)}/5.0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Account Status</span>
                {getVerificationBadge()}
              </div>
            </div>

            {verificationData.verification_level === 'unverified' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900">Get Verified</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Increase your credibility by submitting quality safety reports and engaging positively with the community. 
                      Verified users' reviews are given higher priority.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex space-x-3 pt-4 border-t">
            <Button 
              onClick={handleSaveProfile}
              disabled={loading}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
            >
              {loading ? 'Saving...' : 'Save Profile'}
            </Button>
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;
