
import React, { useState } from 'react';
import { MapPin, Camera, Star, AlertTriangle, Clock, Shield, Users, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';

const ContributePage = () => {
  const [formData, setFormData] = useState({
    location: '',
    establishmentType: '',
    overallRating: [4],
    harassmentLevel: [2],
    nighttimeSafety: [3],
    lightingQuality: [4],
    securityPresence: [3],
    staffResponsiveness: [4],
    culturalSensitivity: [4],
    experience: '',
    recommendations: '',
    wouldReturn: true
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getRatingLabel = (value: number, type: string) => {
    const labels = {
      overall: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'],
      harassment: ['Very High', 'High', 'Moderate', 'Low', 'Very Low'],
      nighttime: ['Very Unsafe', 'Unsafe', 'Neutral', 'Safe', 'Very Safe'],
      lighting: ['Very Poor', 'Poor', 'Fair', 'Good', 'Excellent'],
      security: ['None', 'Very Low', 'Low', 'Good', 'Excellent'],
      staff: ['Very Poor', 'Poor', 'Fair', 'Good', 'Excellent'],
      cultural: ['Very Poor', 'Poor', 'Fair', 'Good', 'Excellent']
    };
    return labels[type as keyof typeof labels]?.[value - 1] || 'Unknown';
  };

  const getRatingColor = (value: number) => {
    if (value <= 2) return 'text-red-600';
    if (value <= 3) return 'text-amber-600';
    return 'text-emerald-600';
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Location Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Location/Establishment Name *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="e.g., Central Market, Hotel Barcelona, Old Town Area"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Type of Place
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {['Hotel', 'Restaurant', 'Neighborhood', 'Transport Hub', 'Tourist Site', 'Shopping Area', 'Nightlife', 'Other'].map((type) => (
                      <Button
                        key={type}
                        variant={formData.establishmentType === type ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleInputChange('establishmentType', type)}
                        className="text-xs"
                      >
                        {type}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Safety Assessment</h3>
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-slate-700">Overall Safety Rating</label>
                    <span className={`text-sm font-semibold ${getRatingColor(formData.overallRating[0])}`}>
                      {getRatingLabel(formData.overallRating[0], 'overall')}
                    </span>
                  </div>
                  <Slider
                    value={formData.overallRating}
                    onValueChange={(value) => handleInputChange('overallRating', value)}
                    max={5}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-slate-700">Harassment Frequency</label>
                    <span className={`text-sm font-semibold ${getRatingColor(6 - formData.harassmentLevel[0])}`}>
                      {getRatingLabel(formData.harassmentLevel[0], 'harassment')}
                    </span>
                  </div>
                  <Slider
                    value={formData.harassmentLevel}
                    onValueChange={(value) => handleInputChange('harassmentLevel', value)}
                    max={5}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-slate-700">Nighttime Safety</label>
                    <span className={`text-sm font-semibold ${getRatingColor(formData.nighttimeSafety[0])}`}>
                      {getRatingLabel(formData.nighttimeSafety[0], 'nighttime')}
                    </span>
                  </div>
                  <Slider
                    value={formData.nighttimeSafety}
                    onValueChange={(value) => handleInputChange('nighttimeSafety', value)}
                    max={5}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-slate-700">Lighting Quality</label>
                    <span className={`text-sm font-semibold ${getRatingColor(formData.lightingQuality[0])}`}>
                      {getRatingLabel(formData.lightingQuality[0], 'lighting')}
                    </span>
                  </div>
                  <Slider
                    value={formData.lightingQuality}
                    onValueChange={(value) => handleInputChange('lightingQuality', value)}
                    max={5}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Additional Details</h3>
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-slate-700">Security Presence</label>
                    <span className={`text-sm font-semibold ${getRatingColor(formData.securityPresence[0])}`}>
                      {getRatingLabel(formData.securityPresence[0], 'security')}
                    </span>
                  </div>
                  <Slider
                    value={formData.securityPresence}
                    onValueChange={(value) => handleInputChange('securityPresence', value)}
                    max={5}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-slate-700">Staff Responsiveness</label>
                    <span className={`text-sm font-semibold ${getRatingColor(formData.staffResponsiveness[0])}`}>
                      {getRatingLabel(formData.staffResponsiveness[0], 'staff')}
                    </span>
                  </div>
                  <Slider
                    value={formData.staffResponsiveness}
                    onValueChange={(value) => handleInputChange('staffResponsiveness', value)}
                    max={5}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-slate-700">Cultural Sensitivity</label>
                    <span className={`text-sm font-semibold ${getRatingColor(formData.culturalSensitivity[0])}`}>
                      {getRatingLabel(formData.culturalSensitivity[0], 'cultural')}
                    </span>
                  </div>
                  <Slider
                    value={formData.culturalSensitivity}
                    onValueChange={(value) => handleInputChange('culturalSensitivity', value)}
                    max={5}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Your Experience</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Tell us about your experience
                  </label>
                  <Textarea
                    placeholder="Share details about your visit - what made you feel safe or unsafe? Any specific incidents or positive interactions?"
                    value={formData.experience}
                    onChange={(e) => handleInputChange('experience', e.target.value)}
                    rows={4}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Recommendations for other women
                  </label>
                  <Textarea
                    placeholder="What advice would you give to other female travelers visiting this place?"
                    value={formData.recommendations}
                    onChange={(e) => handleInputChange('recommendations', e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="wouldReturn"
                    checked={formData.wouldReturn}
                    onChange={(e) => handleInputChange('wouldReturn', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="wouldReturn" className="text-sm text-slate-700">
                    I would return to this place or recommend it to other women
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Share Your Safety Experience
          </h1>
          <p className="text-lg text-slate-600">
            Help other women travel safely by sharing your honest experience and safety insights
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold text-slate-900">
                    Safety Review Form
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-slate-600">Step {currentStep} of {totalSteps}</span>
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {renderStepContent()}
                
                <div className="flex justify-between pt-6 mt-6 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                    disabled={currentStep === 1}
                  >
                    Previous
                  </Button>
                  {currentStep < totalSteps ? (
                    <Button
                      onClick={() => setCurrentStep(Math.min(totalSteps, currentStep + 1))}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      Next Step
                    </Button>
                  ) : (
                    <Button className="bg-emerald-600 hover:bg-emerald-700">
                      Submit Review
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Guidelines */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-900 flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-emerald-600" />
                  <span>Review Guidelines</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm">
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">Be honest and specific about your experience</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">Focus on safety-relevant details</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">Avoid personal information or names</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">Include cultural context when relevant</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Impact Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-900">
                  Your Impact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600">50,234</div>
                  <div className="text-sm text-slate-600">Women helped this month</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">98%</div>
                  <div className="text-sm text-slate-600">Find our reviews helpful</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">15 min</div>
                  <div className="text-sm text-slate-600">Average time to complete</div>
                </div>
              </CardContent>
            </Card>

            {/* Verification */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-900 flex items-center space-x-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  <span>Verification Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    <span className="text-sm text-slate-700">Email verified</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    <span className="text-sm text-slate-700">Profile complete</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
                    <span className="text-sm text-slate-500">Travel verification pending</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-2">
                    Verified reviews have higher visibility and credibility in our community.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Privacy */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-900">
                  Privacy & Safety
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-xs text-slate-600">
                  <p>• Your personal information remains private</p>
                  <p>• Reviews are anonymous to the public</p>
                  <p>• You can edit or delete your reviews anytime</p>
                  <p>• All submissions are moderated for quality</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContributePage;
