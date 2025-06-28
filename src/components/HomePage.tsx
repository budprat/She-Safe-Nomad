import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Travel Safe, Travel Smart
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Empowering women with real-time safety insights, community support, and verified safe spaces worldwide.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!user ? (
              <>
                <Button
                  size="lg"
                  onClick={() => onNavigate('auth')}
                  className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-3"
                >
                  Join Our Community
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => onNavigate('map')}
                  className="border-pink-600 text-pink-600 hover:bg-pink-50 px-8 py-3"
                >
                  Explore Safety Map
                </Button>
              </>
            ) : (
              <>
                <Button
                  size="lg"
                  onClick={() => onNavigate('map')}
                  className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-3"
                >
                  View Safety Map
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => onNavigate('contribute')}
                  className="border-pink-600 text-pink-600 hover:bg-pink-50 px-8 py-3"
                >
                  Share Your Experience
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-pink-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Why Choose Safe Travels?
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Discover the key features that make Safe Travels the ultimate companion for women's safety.
            </p>
          </div>

          <div className="mt-10">
            <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-pink-500 text-white">
                    {/* Heroicon name: outline/globe-alt */}
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9" />
                    </svg>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Real-Time Safety Map</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Navigate with confidence using our real-time safety map, providing up-to-date information on safe zones and potential hazards.
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-pink-500 text-white">
                    {/* Heroicon name: outline/shield-check */}
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Verified Safe Spaces</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Discover and support businesses committed to women's safety. Our certification program ensures verified safe spaces worldwide.
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-pink-500 text-white">
                    {/* Heroicon name: outline/heart */}
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Community Support</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Connect with a supportive community of women. Share experiences, offer advice, and find strength in unity.
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-pink-500 text-white">
                    {/* Heroicon name: outline/chat-alt2 */}
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                    </svg>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Share Your Experience</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Contribute to our safety database by sharing your experiences and insights. Help us create a safer world for women.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-pink-500 to-purple-500 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <h2 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
              Together, We Make a Difference
            </h2>
            <div className="mt-4 md:mt-0">
              <a href="#" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-pink-100 bg-white hover:bg-pink-100 hover:text-pink-600">
                Learn More
              </a>
            </div>
          </div>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <p className="text-5xl font-bold text-pink-600">5,000+</p>
              <p className="mt-2 text-lg text-gray-600">Verified Safe Spaces</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <p className="text-5xl font-bold text-pink-600">10,000+</p>
              <p className="mt-2 text-lg text-gray-600">Community Members</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <p className="text-5xl font-bold text-pink-600">24/7</p>
              <p className="mt-2 text-lg text-gray-600">Real-Time Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Ready to Get Started?
          </h2>
          <p className="mt-4 text-xl text-gray-500">
            Join Safe Travels today and become part of a community dedicated to women's safety.
          </p>
          <Button
            size="lg"
            onClick={() => onNavigate('auth')}
            className="mt-8 bg-pink-600 hover:bg-pink-700 text-white px-8 py-3"
          >
            Sign Up Now
          </Button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
