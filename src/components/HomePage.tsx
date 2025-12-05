import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { MapPin, Shield, Heart, MessageSquare, Users, Star, AlertTriangle } from 'lucide-react';

const HomePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-6">
            <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800">
              <Shield className="h-4 w-4 mr-2" />
              Trusted by 10,000+ Women Travelers
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Travel Safe, Travel <span className="text-emerald-600">Empowered</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Real-time safety insights, community support, and verified safe spaces worldwide.
            Your trusted companion for confident travel.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!user ? (
              <>
                <Link to="/auth">
                  <Button
                    size="lg"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 w-full sm:w-auto"
                  >
                    Join Our Community
                  </Button>
                </Link>
                <Link to="/map">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 px-8 py-3 w-full sm:w-auto"
                  >
                    <MapPin className="h-5 w-5 mr-2" />
                    Explore Safety Map
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/map">
                  <Button
                    size="lg"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 w-full sm:w-auto"
                  >
                    <MapPin className="h-5 w-5 mr-2" />
                    View Safety Map
                  </Button>
                </Link>
                <Link to="/contribute">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 px-8 py-3 w-full sm:w-auto"
                  >
                    Share Your Experience
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center mb-12">
            <h2 className="text-base text-emerald-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Everything You Need for Safe Travel
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Comprehensive safety tools designed by women, for women.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<MapPin className="h-6 w-6" />}
              title="Real-Time Safety Map"
              description="Navigate with confidence using our color-coded safety zones with up-to-date community reports."
              link="/map"
              linkText="Explore Map"
            />
            <FeatureCard
              icon={<Shield className="h-6 w-6" />}
              title="Verified Safe Spaces"
              description="Discover certified businesses committed to women's safety worldwide."
              link="/certification"
              linkText="View Certifications"
            />
            <FeatureCard
              icon={<Users className="h-6 w-6" />}
              title="Travel Buddy Matching"
              description="Find compatible travel companions and explore together safely."
              link="/community"
              linkText="Find Buddies"
            />
            <FeatureCard
              icon={<AlertTriangle className="h-6 w-6" />}
              title="Emergency SOS"
              description="One-tap emergency alerts that notify your contacts with your location instantly."
              link="/auth"
              linkText="Set Up SOS"
            />
            <FeatureCard
              icon={<MessageSquare className="h-6 w-6" />}
              title="Community Discussions"
              description="Share experiences, ask questions, and get advice from fellow travelers."
              link="/community"
              linkText="Join Discussion"
            />
            <FeatureCard
              icon={<Star className="h-6 w-6" />}
              title="Safety Reports"
              description="Contribute to our database by sharing your safety experiences at locations."
              link="/contribute"
              linkText="Contribute"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-emerald-600 to-teal-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
              Together, We Make Travel Safer
            </h2>
            <p className="mt-4 text-lg text-emerald-100">
              Our growing community is making a real difference every day.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <StatCard number="5,000+" label="Safe Locations" />
            <StatCard number="10,000+" label="Community Members" />
            <StatCard number="25,000+" label="Safety Reports" />
            <StatCard number="24/7" label="Emergency Support" />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center mb-12">
            <h2 className="text-base text-emerald-600 font-semibold tracking-wide uppercase">How It Works</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Get Started in 3 Simple Steps
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard
              number="1"
              title="Create Your Profile"
              description="Sign up and set up your emergency contacts for instant alerts when you need help."
            />
            <StepCard
              number="2"
              title="Explore & Plan"
              description="Use our safety map to research destinations and connect with travel buddies."
            />
            <StepCard
              number="3"
              title="Travel & Contribute"
              description="Travel confidently and help others by sharing your safety experiences."
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">What Our Community Says</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard
              quote="This app gave me the confidence to travel solo through Southeast Asia. The community support is incredible!"
              author="Sarah M."
              location="New York, USA"
            />
            <TestimonialCard
              quote="The SOS feature saved me when I got lost in a foreign city. My emergency contacts were notified instantly."
              author="Maria L."
              location="Barcelona, Spain"
            />
            <TestimonialCard
              quote="Found my travel buddy through this platform and we've been exploring together for 3 months now!"
              author="Priya K."
              location="Mumbai, India"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-emerald-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Ready to Travel with Confidence?
          </h2>
          <p className="mt-4 text-xl text-emerald-100">
            Join thousands of women who travel smarter and safer with She-Safe-Nomad.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={user ? "/map" : "/auth"}>
              <Button
                size="lg"
                className="bg-white text-emerald-600 hover:bg-emerald-50 px-8 py-3 w-full sm:w-auto"
              >
                {user ? "Explore Safety Map" : "Get Started Free"}
              </Button>
            </Link>
            <Link to="/premium">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-emerald-700 px-8 py-3 w-full sm:w-auto"
              >
                View Premium Plans
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-semibold mb-4">Platform</h3>
              <ul className="space-y-2">
                <li><Link to="/map" className="text-gray-400 hover:text-white">Safety Map</Link></li>
                <li><Link to="/community" className="text-gray-400 hover:text-white">Community</Link></li>
                <li><Link to="/contribute" className="text-gray-400 hover:text-white">Contribute</Link></li>
                <li><Link to="/premium" className="text-gray-400 hover:text-white">Premium</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Business</h3>
              <ul className="space-y-2">
                <li><Link to="/certification" className="text-gray-400 hover:text-white">Get Certified</Link></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Partner With Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Advertise</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Safety Tips</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-400">
              &copy; {new Date().getFullYear()} She-Safe-Nomad. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Feature Card Component
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
  linkText: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, link, linkText }) => (
  <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-emerald-100 text-emerald-600 mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600 mb-4">{description}</p>
    <Link to={link} className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center">
      {linkText}
      <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  </div>
);

// Stat Card Component
interface StatCardProps {
  number: string;
  label: string;
}

const StatCard: React.FC<StatCardProps> = ({ number, label }) => (
  <div className="bg-white/10 rounded-lg p-6 text-center">
    <p className="text-4xl font-bold text-white">{number}</p>
    <p className="mt-2 text-emerald-100">{label}</p>
  </div>
);

// Step Card Component
interface StepCardProps {
  number: string;
  title: string;
  description: string;
}

const StepCard: React.FC<StepCardProps> = ({ number, title, description }) => (
  <div className="text-center">
    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-emerald-600 text-white text-2xl font-bold mx-auto mb-4">
      {number}
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

// Testimonial Card Component
interface TestimonialCardProps {
  quote: string;
  author: string;
  location: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ quote, author, location }) => (
  <div className="bg-gray-50 rounded-xl p-6">
    <div className="flex mb-4">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star key={star} className="h-5 w-5 text-yellow-400 fill-current" />
      ))}
    </div>
    <p className="text-gray-700 mb-4 italic">"{quote}"</p>
    <div>
      <p className="font-semibold text-gray-900">{author}</p>
      <p className="text-gray-500 text-sm">{location}</p>
    </div>
  </div>
);

export default HomePage;
