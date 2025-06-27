
import React, { useState } from 'react';
import { Shield, Award, CheckCircle, Star, Users, BarChart, Globe, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const CertificationPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [applicationForm, setApplicationForm] = useState({
    businessName: '',
    businessType: '',
    location: '',
    contactEmail: '',
    contactPhone: '',
    description: '',
    safetyMeasures: '',
    staffTraining: '',
    emergencyProcedures: ''
  });

  const certificationLevels = [
    {
      name: 'SafeHer Verified',
      level: 'basic',
      price: '$299/year',
      badge: 'bg-blue-100 text-blue-800',
      requirements: [
        'Basic safety protocols in place',
        'Staff awareness training completed',
        'Emergency contact procedures established',
        'Minimum 4.0 safety rating from women travelers'
      ],
      benefits: [
        'SafeHer Verified badge on listings',
        'Priority placement in search results',
        'Access to safety feedback dashboard',
        'Basic marketing materials'
      ]
    },
    {
      name: 'SafeHer Certified',
      level: 'premium',
      price: '$599/year',
      badge: 'bg-emerald-100 text-emerald-800',
      popular: true,
      requirements: [
        'Comprehensive safety audit passed',
        'Advanced staff training program completed',
        'Female-specific safety measures implemented',
        'Minimum 4.5 safety rating from women travelers',
        'Cultural sensitivity training for staff'
      ],
      benefits: [
        'Premium SafeHer Certified badge',
        'Featured placement in search results',
        'Detailed analytics and insights',
        'Custom marketing materials',
        'Direct communication with travelers',
        'Safety consultation services'
      ]
    },
    {
      name: 'SafeHer Excellence',
      level: 'premium-plus',
      price: '$999/year',
      badge: 'bg-purple-100 text-purple-800',
      requirements: [
        'All Premium requirements met',
        'Annual third-party safety audit',
        'Leadership in women traveler safety',
        'Minimum 4.8 safety rating',
        'Community engagement initiatives',
        'Innovation in safety practices'
      ],
      benefits: [
        'Exclusive SafeHer Excellence badge',
        'Top placement in all searches',
        'Premium analytics and reporting',
        'Co-marketing opportunities',
        'Industry recognition and awards',
        'Speaking opportunities at events',
        'Custom safety assessment services'
      ]
    }
  ];

  const certifiedBusinesses = [
    {
      name: 'Grand Hotel Barcelona',
      type: 'Hotel',
      location: 'Barcelona, Spain',
      level: 'excellence',
      rating: 4.9,
      reviews: 342,
      highlights: ['24/7 female security staff', 'Women-only floor available', 'Safety escort services']
    },
    {
      name: 'Café Luna',
      type: 'Restaurant',
      location: 'Paris, France',
      level: 'certified',
      rating: 4.7,
      reviews: 156,
      highlights: ['Well-lit seating areas', 'Female-friendly staff training', 'Safe late-night dining']
    },
    {
      name: 'Tokyo Backpackers',
      type: 'Hostel',
      location: 'Tokyo, Japan',
      level: 'verified',
      rating: 4.5,
      reviews: 89,
      highlights: ['Female-only dormitories', 'Secure lockers', '24/7 front desk']
    }
  ];

  const handleInputChange = (field: string, value: string) => {
    setApplicationForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'excellence': return 'bg-purple-100 text-purple-800';
      case 'certified': return 'bg-emerald-100 text-emerald-800';
      case 'verified': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'excellence': return <Award className="h-4 w-4" />;
      case 'certified': return <Shield className="h-4 w-4" />;
      case 'verified': return <CheckCircle className="h-4 w-4" />;
      default: return <CheckCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-emerald-600 mr-3" />
            <h1 className="text-4xl font-bold text-slate-900">SafeHer Business Certification</h1>
          </div>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Join the growing network of women-safety verified establishments. Build trust, 
            attract more female travelers, and demonstrate your commitment to women's safety.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="certification">Certification Levels</TabsTrigger>
            <TabsTrigger value="apply">Apply Now</TabsTrigger>
            <TabsTrigger value="directory">Certified Directory</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-12">
            {/* Benefits Overview */}
            <section>
              <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
                Why Get SafeHer Certified?
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <Card className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Users className="h-8 w-8 text-emerald-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-4">
                      Attract More Female Travelers
                    </h3>
                    <p className="text-slate-600">
                      Certified businesses see an average 40% increase in bookings from female solo travelers.
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Star className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-4">
                      Higher Ratings & Reviews
                    </h3>
                    <p className="text-slate-600">
                      Certified establishments maintain higher safety ratings and receive more positive reviews.
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <BarChart className="h-8 w-8 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-4">
                      Valuable Analytics
                    </h3>
                    <p className="text-slate-600">
                      Get insights into safety perceptions and areas for improvement from real feedback.
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Globe className="h-8 w-8 text-amber-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-4">
                      Global Recognition
                    </h3>
                    <p className="text-slate-600">
                      Join a respected international network of women-safety focused businesses.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Process Overview */}
            <section className="bg-white rounded-2xl p-12">
              <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
                Certification Process
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    1
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-2">Apply Online</h4>
                  <p className="text-sm text-slate-600">Submit your application with business details and current safety measures.</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    2
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-2">Safety Assessment</h4>
                  <p className="text-sm text-slate-600">Our certified assessors review your safety protocols and procedures.</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    3
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-2">Training & Improvement</h4>
                  <p className="text-sm text-slate-600">Complete required training programs and implement recommended improvements.</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    4
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-2">Get Certified</h4>
                  <p className="text-sm text-slate-600">Receive your certification badge and start attracting safety-conscious travelers.</p>
                </div>
              </div>
            </section>

            {/* Stats */}
            <section className="text-center">
              <h2 className="text-3xl font-bold text-slate-900 mb-12">
                Certification Impact
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                  <div className="text-4xl font-bold text-emerald-600 mb-2">500+</div>
                  <div className="text-slate-600">Certified Businesses</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-emerald-600 mb-2">85%</div>
                  <div className="text-slate-600">Customer Satisfaction</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-emerald-600 mb-2">40%</div>
                  <div className="text-slate-600">Booking Increase</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-emerald-600 mb-2">95%</div>
                  <div className="text-slate-600">Renewal Rate</div>
                </div>
              </div>
            </section>
          </TabsContent>

          <TabsContent value="certification" className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Choose Your Certification Level
              </h2>
              <p className="text-lg text-slate-600">
                Select the certification level that best fits your business goals and commitment to women's safety.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {certificationLevels.map((cert, index) => (
                <Card 
                  key={index}
                  className={`relative transition-all duration-200 hover:shadow-xl ${
                    cert.popular ? 'ring-2 ring-emerald-500 scale-105' : ''
                  }`}
                >
                  {cert.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-emerald-600 text-white py-1 px-3">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader>
                    <div className="text-center">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-4 ${cert.badge}`}>
                        {getLevelIcon(cert.level)}
                        <span className="ml-2">{cert.name}</span>
                      </div>
                      <div className="text-3xl font-bold text-slate-900 mb-2">{cert.price}</div>
                      <p className="text-slate-600">per business location</p>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-3">Requirements:</h4>
                      <ul className="space-y-2">
                        {cert.requirements.map((req, idx) => (
                          <li key={idx} className="flex items-start space-x-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                            <span className="text-slate-700">{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-3">Benefits:</h4>
                      <ul className="space-y-2">
                        {cert.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-start space-x-2 text-sm">
                            <Star className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                            <span className="text-slate-700">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <Button 
                      className={`w-full ${
                        cert.popular 
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                      }`}
                      onClick={() => setActiveTab('apply')}
                    >
                      Apply for {cert.name}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="apply" className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-slate-900 text-center">
                  Business Certification Application
                </CardTitle>
                <p className="text-slate-600 text-center">
                  Start your journey to becoming a SafeHer certified business
                </p>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Business Name *
                    </label>
                    <Input
                      value={applicationForm.businessName}
                      onChange={(e) => handleInputChange('businessName', e.target.value)}
                      placeholder="Enter your business name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Business Type *
                    </label>
                    <select 
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={applicationForm.businessType}
                      onChange={(e) => handleInputChange('businessType', e.target.value)}
                    >
                      <option value="">Select business type</option>
                      <option value="hotel">Hotel</option>
                      <option value="hostel">Hostel</option>
                      <option value="restaurant">Restaurant</option>
                      <option value="cafe">Café</option>
                      <option value="tour-operator">Tour Operator</option>
                      <option value="transport">Transportation Service</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Business Location *
                  </label>
                  <Input
                    value={applicationForm.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="City, Country"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Contact Email *
                    </label>
                    <Input
                      type="email"
                      value={applicationForm.contactEmail}
                      onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                      placeholder="business@example.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Contact Phone
                    </label>
                    <Input
                      value={applicationForm.contactPhone}
                      onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Business Description *
                  </label>
                  <Textarea
                    value={applicationForm.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe your business, target customers, and unique features..."
                    rows={3}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Current Safety Measures *
                  </label>
                  <Textarea
                    value={applicationForm.safetyMeasures}
                    onChange={(e) => handleInputChange('safetyMeasures', e.target.value)}
                    placeholder="Detail your current safety protocols, security measures, and women-specific accommodations..."
                    rows={4}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Staff Training Programs
                  </label>
                  <Textarea
                    value={applicationForm.staffTraining}
                    onChange={(e) => handleInputChange('staffTraining', e.target.value)}
                    placeholder="Describe any existing staff training related to customer safety and cultural sensitivity..."
                    rows={3}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Emergency Procedures
                  </label>
                  <Textarea
                    value={applicationForm.emergencyProcedures}
                    onChange={(e) => handleInputChange('emergencyProcedures', e.target.value)}
                    placeholder="Outline your emergency response procedures and safety protocols..."
                    rows={3}
                  />
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">What happens next?</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Our team will review your application within 3-5 business days</li>
                    <li>• We'll schedule a consultation to discuss your certification goals</li>
                    <li>• A safety assessment will be conducted by our certified experts</li>
                    <li>• You'll receive a detailed report with recommendations</li>
                    <li>• Complete any required training and improvements</li>
                    <li>• Receive your SafeHer certification badge and benefits</li>
                  </ul>
                </div>
                
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 text-lg">
                  Submit Application
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="directory" className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                SafeHer Certified Directory
              </h2>
              <p className="text-lg text-slate-600">
                Explore businesses that have earned SafeHer certification for their commitment to women's safety.
              </p>
            </div>

            <div className="space-y-6">
              {certifiedBusinesses.map((business, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-semibold text-slate-900">{business.name}</h3>
                          <Badge className={getLevelBadge(business.level)}>
                            {getLevelIcon(business.level)}
                            <span className="ml-1 capitalize">{business.level}</span>
                          </Badge>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-slate-600 mb-4">
                          <div className="flex items-center space-x-1">
                            <Building className="h-4 w-4" />
                            <span>{business.type}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Globe className="h-4 w-4" />
                            <span>{business.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span>{business.rating} ({business.reviews} reviews)</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {business.highlights.map((highlight, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {highlight}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center">
              <Button variant="outline" size="lg">
                Load More Businesses
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CertificationPage;
