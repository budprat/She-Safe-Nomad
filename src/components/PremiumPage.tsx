import React, { useState } from 'react';
import { Check, Crown, Star, Shield, Users, MapPin, AlertTriangle, BarChart, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface PlanType {
  name: string;
  price: { monthly: number; annual: number };
  popular?: boolean;
  description: string;
  features: string[];
  limitations?: string[];
}

const PremiumPage = () => {
  const [selectedPlan, setSelectedPlan] = useState('premium');
  const [billingCycle, setBillingCycle] = useState('monthly');

  const plans: Record<string, PlanType> = {
    basic: {
      name: 'Basic',
      price: { monthly: 0, annual: 0 },
      description: 'Essential safety information for casual travelers',
      features: [
        'Access to basic safety ratings',
        'Community discussions (read-only)',
        'Color-coded safety zones',
        'Mobile app access',
        'Basic search and filtering'
      ],
      limitations: [
        'Limited to 5 location searches per day',
        'No real-time alerts',
        'No travel buddy matching',
        'Basic support only'
      ]
    },
    premium: {
      name: 'Premium',
      price: { monthly: 9.99, annual: 99.99 },
      popular: true,
      description: 'Complete safety intelligence for confident travel',
      features: [
        'Unlimited location searches',
        'Real-time safety alerts',
        'Detailed safety analytics',
        'Travel buddy matching',
        'Full community access',
        'Offline map downloads',
        'Route safety optimization',
        'Cultural sensitivity guides',
        'Priority customer support',
        '24/7 safety hotline access'
      ]
    },
    professional: {
      name: 'Professional',
      price: { monthly: 19.99, annual: 199.99 },
      description: 'Advanced features for frequent travelers and businesses',
      features: [
        'Everything in Premium',
        'Personal safety consultation',
        'Custom risk assessments',
        'Advanced analytics dashboard',
        'API access for businesses',
        'White-label solutions',
        'Dedicated account manager',
        'Custom safety training materials',
        'Enterprise-grade security',
        'Bulk user management'
      ]
    }
  };

  const premiumFeatures = [
    {
      icon: <BarChart className="h-6 w-6 text-emerald-600" />,
      title: 'Detailed Safety Analytics',
      description: 'Get comprehensive safety insights with trend analysis, risk predictions, and personalized recommendations based on your travel patterns.',
      benefits: ['Risk heat maps', 'Trend analysis', 'Predictive insights', 'Personal safety score']
    },
    {
      icon: <AlertTriangle className="h-6 w-6 text-amber-600" />,
      title: 'Real-Time Safety Alerts',
      description: 'Receive instant notifications about safety concerns, incidents, and emergency information relevant to your current location or planned destinations.',
      benefits: ['Push notifications', 'Location-based alerts', 'Emergency contacts', 'Incident reporting']
    },
    {
      icon: <Users className="h-6 w-6 text-blue-600" />,
      title: 'Travel Buddy Matching',
      description: 'Connect with verified female travelers who share your interests and travel plans through our secure matching system.',
      benefits: ['Verified profiles', 'Interest matching', 'Secure messaging', 'Group planning tools']
    },
    {
      icon: <MapPin className="h-6 w-6 text-purple-600" />,
      title: 'Route Optimization',
      description: 'Plan the safest routes to your destinations with our AI-powered route optimization that considers safety ratings and real-time conditions.',
      benefits: ['Safe route planning', 'Alternative paths', 'Transport recommendations', 'Time-based routing']
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Mitchell',
      role: 'Solo Traveler',
      image: 'S',
      content: 'The premium analytics helped me choose the safest neighborhoods in Bangkok. The real-time alerts saved me from walking into an area with recent incidents.',
      rating: 5
    },
    {
      name: 'Emma Rodriguez',
      role: 'Business Traveler',
      image: 'E',
      content: 'Travel buddy matching changed everything. I found amazing local connections in Tokyo and felt so much safer exploring with verified women.',
      rating: 5
    },
    {
      name: 'Lisa Chen',
      role: 'Digital Nomad',
      image: 'L',
      content: 'The route optimization and cultural guides are invaluable. I feel prepared and confident no matter where my work takes me.',
      rating: 5
    }
  ];

  const handleSubscription = (planType: string) => {
    // Placeholder for Stripe integration
    console.log(`Subscribing to ${planType} plan with ${billingCycle} billing`);
    // Would integrate with Stripe checkout here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-4">
            <Crown className="h-8 w-8 text-emerald-600 mr-3" />
            <h1 className="text-4xl font-bold text-slate-900">Premium Safety Intelligence</h1>
          </div>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Unlock advanced safety features, real-time alerts, and comprehensive travel intelligence 
            to explore the world with complete confidence.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center mb-12">
          <div className="bg-white p-1 rounded-lg shadow-sm border">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                billingCycle === 'monthly' 
                  ? 'bg-emerald-600 text-white' 
                  : 'text-slate-600 hover:text-emerald-600'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                billingCycle === 'annual' 
                  ? 'bg-emerald-600 text-white' 
                  : 'text-slate-600 hover:text-emerald-600'
              }`}
            >
              Annual
              <Badge className="ml-2 bg-green-100 text-green-800 text-xs">Save 20%</Badge>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {Object.entries(plans).map(([key, plan]) => (
            <Card 
              key={key}
              className={`relative transition-all duration-200 ${
                selectedPlan === key 
                  ? 'ring-2 ring-emerald-500 shadow-xl scale-105' 
                  : 'hover:shadow-lg'
              } ${plan.popular ? 'border-emerald-500' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-emerald-600 text-white py-1 px-3">
                    Most Popular
                  </Badge>
                </div>
              )}
              <CardHeader>
                <div className="text-center">
                  <CardTitle className={`text-2xl font-bold ${plan.popular ? 'text-emerald-600' : 'text-slate-900'}`}>
                    {plan.name}
                  </CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-slate-900">
                      ${plan.price[billingCycle as keyof typeof plan.price]}
                    </span>
                    <span className="text-slate-600">
                      /{billingCycle === 'annual' ? 'year' : 'month'}
                    </span>
                  </div>
                  <p className="text-slate-600 mt-2">{plan.description}</p>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <Check className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {plan.limitations && (
                    <div className="pt-4 border-t">
                      <h5 className="text-sm font-medium text-slate-500 mb-2">Limitations:</h5>
                      <ul className="space-y-2">
                        {plan.limitations.map((limitation, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <span className="w-2 h-2 bg-slate-400 rounded-full mt-2 flex-shrink-0"></span>
                            <span className="text-xs text-slate-500">{limitation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <Button
                    className={`w-full mt-6 ${
                      plan.popular 
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                    }`}
                    onClick={() => handleSubscription(key)}
                    disabled={key === 'basic'}
                  >
                    {key === 'basic' ? 'Current Plan' : `Choose ${plan.name}`}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Feature Deep Dive */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Why Choose Premium?
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Discover the advanced features that make SafeHer Premium the ultimate 
              travel safety companion for confident women travelers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {premiumFeatures.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900 mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-slate-600 mb-4">
                        {feature.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {feature.benefits.map((benefit, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {benefit}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Trusted by Women Worldwide
            </h2>
            <p className="text-lg text-slate-600">
              See how Premium features are transforming women's travel experiences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-600 mb-6 italic">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-emerald-200 rounded-full flex items-center justify-center mr-4">
                      <span className="text-emerald-700 font-semibold text-lg">
                        {testimonial.image}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">{testimonial.name}</div>
                      <div className="text-sm text-slate-600">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="max-w-3xl mx-auto">
            <Card>
              <CardContent className="p-8 space-y-6">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">
                    Can I cancel my subscription anytime?
                  </h4>
                  <p className="text-slate-600">
                    Yes, you can cancel your subscription at any time. You'll continue to have access 
                    to premium features until the end of your billing period.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">
                    Is my payment information secure?
                  </h4>
                  <p className="text-slate-600">
                    Absolutely. We use Stripe for secure payment processing and never store your 
                    payment information on our servers.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">
                    Do you offer refunds?
                  </h4>
                  <p className="text-slate-600">
                    We offer a 30-day money-back guarantee for all premium subscriptions. 
                    If you're not satisfied, contact us for a full refund.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">
                    Can I upgrade or downgrade my plan?
                  </h4>
                  <p className="text-slate-600">
                    Yes, you can change your plan at any time. Upgrades take effect immediately, 
                    while downgrades take effect at the next billing cycle.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA */}
        <div className="text-center bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Travel with Complete Confidence?
          </h2>
          <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
            Join thousands of women who are exploring the world safely with our premium 
            safety intelligence and community support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-emerald-600 hover:bg-emerald-50 px-8 py-3 text-lg font-semibold"
              onClick={() => handleSubscription('premium')}
            >
              Start Premium Trial
              <Zap className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white text-white hover:bg-white hover:text-emerald-600 px-8 py-3 text-lg"
            >
              Contact Sales
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumPage;
