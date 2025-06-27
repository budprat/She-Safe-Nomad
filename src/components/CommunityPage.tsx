
import React, { useState } from 'react';
import { MessageSquare, Users, Heart, Share, Search, Filter, MapPin, Calendar, User, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const CommunityPage = () => {
  const [activeTab, setActiveTab] = useState('discussions');

  // Mock data
  const discussions = [
    {
      id: 1,
      title: "Solo travel tips for Southeast Asia",
      author: "Sarah M.",
      location: "Bangkok, Thailand",
      time: "2 hours ago",
      replies: 15,
      likes: 23,
      tags: ["solo-travel", "southeast-asia", "safety-tips"],
      preview: "Just returned from an amazing 3-week solo trip through Thailand, Vietnam, and Cambodia. Here are my top safety tips that really made a difference...",
      verified: true
    },
    {
      id: 2,
      title: "Is downtown Mexico City safe for women at night?",
      author: "Maria L.",
      location: "Mexico City, Mexico",
      time: "5 hours ago",
      replies: 8,
      likes: 12,
      tags: ["mexico-city", "nighttime-safety", "local-advice"],
      preview: "Planning to stay in the historic center area and wondering about safety after dark. Any recent experiences or recommendations?",
      verified: true
    },
    {
      id: 3,
      title: "Found an amazing female-only hostel in Istanbul",
      author: "Fatima K.",
      location: "Istanbul, Turkey",
      time: "1 day ago",
      replies: 22,
      likes: 45,
      tags: ["accommodation", "istanbul", "female-friendly"],
      preview: "This place was a game-changer for my Istanbul experience. Great security, amazing community of female travelers, and perfect location...",
      verified: true
    }
  ];

  const travelBuddies = [
    {
      id: 1,
      name: "Emily R.",
      age: 28,
      location: "Barcelona, Spain",
      dates: "March 15-22, 2024",
      interests: ["museums", "local-food", "walking-tours"],
      experience: "experienced",
      verified: true,
      photo: "E"
    },
    {
      id: 2,
      name: "Lisa P.",
      age: 32,
      location: "Tokyo, Japan",
      dates: "April 5-12, 2024",
      interests: ["culture", "temples", "street-food"],
      experience: "intermediate",
      verified: true,
      photo: "L"
    },
    {
      id: 3,
      name: "Anna K.",
      age: 25,
      location: "Paris, France",
      dates: "May 10-17, 2024",
      interests: ["art", "cafes", "photography"],
      experience: "beginner",
      verified: true,
      photo: "A"
    }
  ];

  const safetyAlerts = [
    {
      id: 1,
      type: "warning",
      location: "Rome, Italy",
      title: "Increased pickpocket activity near Colosseum",
      time: "3 hours ago",
      details: "Multiple reports of organized pickpocket groups targeting tourists. Extra caution advised.",
      severity: "medium"
    },
    {
      id: 2,
      type: "info",
      location: "Prague, Czech Republic",
      title: "New women-only transportation service launched",
      time: "1 day ago",
      details: "Pink Taxi now offers verified female drivers for women traveling alone in Prague.",
      severity: "low"
    }
  ];

  const getExperienceBadge = (level: string) => {
    const colors = {
      beginner: "bg-green-100 text-green-800",
      intermediate: "bg-blue-100 text-blue-800",
      experienced: "bg-purple-100 text-purple-800"
    };
    return colors[level as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'border-red-500 bg-red-50';
      case 'medium': return 'border-amber-500 bg-amber-50';
      default: return 'border-blue-500 bg-blue-50';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Community Hub
          </h1>
          <p className="text-lg text-slate-600">
            Connect with verified female travelers, share experiences, and find travel companions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="discussions" className="flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4" />
                  <span>Discussions</span>
                </TabsTrigger>
                <TabsTrigger value="travel-buddies" className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>Travel Buddies</span>
                </TabsTrigger>
                <TabsTrigger value="safety-tips" className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Safety Tips</span>
                </TabsTrigger>
              </TabsList>

              {/* Search and Filter Bar */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search discussions, destinations, or topics..."
                    className="pl-10"
                  />
                </div>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  New Post
                </Button>
              </div>

              <TabsContent value="discussions" className="space-y-6">
                {discussions.map((discussion) => (
                  <Card key={discussion.id} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-slate-900 mb-2 hover:text-emerald-600">
                            {discussion.title}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-slate-600 mb-3">
                            <div className="flex items-center space-x-1">
                              <User className="h-4 w-4" />
                              <span>{discussion.author}</span>
                              {discussion.verified && (
                                <div className="w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                                  <span className="text-white text-xs">✓</span>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-4 w-4" />
                              <span>{discussion.location}</span>
                            </div>
                            <span>{discussion.time}</span>
                          </div>
                          <p className="text-slate-700 mb-4">{discussion.preview}</p>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {discussion.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm text-slate-600">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <MessageSquare className="h-4 w-4" />
                            <span>{discussion.replies} replies</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Heart className="h-4 w-4" />
                            <span>{discussion.likes} likes</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Share className="h-4 w-4 mr-1" />
                          Share
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="travel-buddies" className="space-y-6">
                {travelBuddies.map((buddy) => (
                  <Card key={buddy.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-16 h-16 bg-emerald-200 rounded-full flex items-center justify-center">
                          <span className="text-emerald-700 font-semibold text-xl">{buddy.photo}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-lg font-semibold text-slate-900">{buddy.name}</h3>
                            <span className="text-slate-600">• {buddy.age} years</span>
                            {buddy.verified && (
                              <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs">✓</span>
                              </div>
                            )}
                            <Badge className={getExperienceBadge(buddy.experience)}>
                              {buddy.experience}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-slate-600 mb-3">
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-4 w-4" />
                              <span>{buddy.location}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>{buddy.dates}</span>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {buddy.interests.map((interest) => (
                              <Badge key={interest} variant="outline" className="text-xs">
                                {interest}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                              Connect
                            </Button>
                            <Button variant="outline" size="sm">
                              View Profile
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="safety-tips" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-slate-900">
                      Essential Safety Guidelines
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-semibold text-slate-900">Before You Travel</h4>
                        <ul className="space-y-2 text-sm text-slate-700">
                          <li>• Research cultural norms and dress codes</li>
                          <li>• Share your itinerary with trusted contacts</li>
                          <li>• Register with embassy if traveling internationally</li>
                          <li>• Download offline maps and translation apps</li>
                          <li>• Pack emergency contact information</li>
                        </ul>
                      </div>
                      <div className="space-y-4">
                        <h4 className="font-semibold text-slate-900">While Traveling</h4>
                        <ul className="space-y-2 text-sm text-slate-700">
                          <li>• Trust your instincts about people and situations</li>
                          <li>• Stay in well-lit, populated areas at night</li>
                          <li>• Keep copies of important documents separately</li>
                          <li>• Use verified transportation services</li>
                          <li>• Stay connected with regular check-ins</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-slate-900">
                      Emergency Resources
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                        <h5 className="font-semibold text-red-800 mb-2">Emergency Services</h5>
                        <p className="text-sm text-red-700">
                          Know local emergency numbers and embassy contacts for your destination.
                        </p>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <h5 className="font-semibold text-blue-800 mb-2">SafeHer Support</h5>
                        <p className="text-sm text-blue-700">
                          24/7 community support and safety hotline for verified members.
                        </p>
                      </div>
                      <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                        <h5 className="font-semibold text-emerald-800 mb-2">Local Networks</h5>
                        <p className="text-sm text-emerald-700">
                          Connect with local women's groups and safety resources in your area.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Safety Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-900 flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  <span>Safety Alerts</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {safetyAlerts.map((alert) => (
                  <div key={alert.id} className={`p-3 rounded-lg border-l-4 ${getSeverityColor(alert.severity)}`}>
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="font-medium text-slate-900 text-sm">{alert.title}</h5>
                      <span className="text-xs text-slate-600">{alert.time}</span>
                    </div>
                    <p className="text-xs text-slate-700 mb-2">{alert.details}</p>
                    <div className="flex items-center space-x-1 text-xs text-slate-600">
                      <MapPin className="h-3 w-3" />
                      <span>{alert.location}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Community Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-900">
                  Community Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Active Members</span>
                  <span className="font-semibold text-emerald-600">25,847</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Countries Covered</span>
                  <span className="font-semibold text-emerald-600">120</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Safety Reports</span>
                  <span className="font-semibold text-emerald-600">50,234</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">This Week</span>
                  <span className="font-semibold text-blue-600">+1,234</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-900">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700" size="sm">
                  Report Safety Issue
                </Button>
                <Button variant="outline" className="w-full" size="sm">
                  Find Travel Buddy
                </Button>
                <Button variant="outline" className="w-full" size="sm">
                  Join Discussion
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
