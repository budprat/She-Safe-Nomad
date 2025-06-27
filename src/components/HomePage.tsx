
import React from 'react';
import { Shield, MapPin, Users, Star, ArrowRight, CheckCircle, Globe, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

const HomePage = ({ onNavigate }: HomePageProps) => {
  return (
    <div className="bg-gradient-to-br from-emerald-50 via-white to-teal-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Travel Safely,
              <span className="text-emerald-600"> Travel Confidently</span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              The first community-driven platform where verified female travelers share real safety insights 
              to help women explore the world with confidence and peace of mind.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 text-lg"
                onClick={() => onNavigate('map')}
              >
                Explore Safety Map
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 px-8 py-3 text-lg"
                onClick={() => onNavigate('community')}
              >
                Join Community
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center mb-20">
            <div>
              <div className="text-3xl font-bold text-emerald-600 mb-2">50K+</div>
              <div className="text-slate-600">Verified Reviews</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-emerald-600 mb-2">120</div>
              <div className="text-slate-600">Countries Covered</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-emerald-600 mb-2">25K+</div>
              <div className="text-slate-600">Female Travelers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-emerald-600 mb-2">95%</div>
              <div className="text-slate-600">Safety Accuracy</div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Safety Intelligence That Matters
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Get the real insights you need from women who've been there, with verification 
              systems that ensure accuracy and reliability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MapPin className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">
                  Color-Coded Safety Zones
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Instantly understand safety levels with our intuitive green, yellow, and red 
                  zone system based on real experiences from verified travelers.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">
                  Verified Community
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Connect with verified female travelers, find travel buddies, and access 
                  safety discussions from women who understand your concerns.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">
                  Real-Time Safety Alerts
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Stay informed with immediate notifications about safety concerns, 
                  cultural considerations, and emergency information in your area.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Safety Categories */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Comprehensive Safety Insights
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              We evaluate what matters most to women travelers, from harassment frequency 
              to cultural sensitivity and nighttime safety.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-3 h-3 bg-emerald-500 rounded-full mr-3"></div>
                <h4 className="font-semibold text-slate-900">Harassment Frequency</h4>
              </div>
              <p className="text-sm text-slate-600">
                Real reports on street harassment, catcalling, and unwanted attention levels.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                <h4 className="font-semibold text-slate-900">Nighttime Safety</h4>
              </div>
              <p className="text-sm text-slate-600">
                Walking safety assessments for evening hours and late-night activities.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                <h4 className="font-semibold text-slate-900">Cultural Sensitivity</h4>
              </div>
              <p className="text-sm text-slate-600">
                Local customs, dress codes, and cultural considerations for female travelers.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-3 h-3 bg-orange-500 rounded-full mr-3"></div>
                <h4 className="font-semibold text-slate-900">Staff Responsiveness</h4>
              </div>
              <p className="text-sm text-slate-600">
                Hotel and restaurant staff helpfulness and safety support for women.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Trusted by Women Worldwide
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-slate-600 mb-6">
                  "SafeHer completely changed how I travel solo. The safety insights from other women 
                  helped me navigate Bangkok with confidence and avoid areas I would have stumbled into."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-emerald-200 rounded-full flex items-center justify-center mr-3">
                    <span className="text-emerald-700 font-semibold">M</span>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">Maria S.</div>
                    <div className="text-sm text-slate-600">Solo Traveler, Thailand</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-slate-600 mb-6">
                  "The travel buddy feature connected me with amazing women in Morocco. We explored 
                  together and I felt so much safer having local insights from verified travelers."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center mr-3">
                    <span className="text-blue-700 font-semibold">A</span>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">Aisha K.</div>
                    <div className="text-sm text-slate-600">Business Traveler, Morocco</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-slate-600 mb-6">
                  "As a frequent business traveler, the real-time safety alerts and professional 
                  recommendations have been invaluable. I feel prepared for every destination."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center mr-3">
                    <span className="text-purple-700 font-semibold">L</span>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">Lisa R.</div>
                    <div className="text-sm text-slate-600">Premium Member, Global</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-emerald-600 to-teal-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Travel with Confidence?
          </h2>
          <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
            Join thousands of women who are exploring the world safely with community-driven 
            safety intelligence and verified travel insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-emerald-600 hover:bg-emerald-50 px-8 py-3 text-lg font-semibold"
              onClick={() => onNavigate('map')}
            >
              Start Exploring
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white text-white hover:bg-white hover:text-emerald-600 px-8 py-3 text-lg"
              onClick={() => onNavigate('premium')}
            >
              View Premium Features
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
