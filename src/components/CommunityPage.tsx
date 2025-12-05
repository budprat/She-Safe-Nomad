import React, { useState } from 'react';
import { MessageSquare, Users, Heart, Share, Search, Filter, MapPin, Calendar, User, AlertTriangle, Loader2, ArrowLeft, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useSafetyDiscussions, SafetyDiscussion } from '@/hooks/useSafetyDiscussions';
import { useTravelBuddies } from '@/hooks/useTravelBuddies';
import DiscussionReplies from '@/components/DiscussionReplies';

const CommunityPage = () => {
  const [activeTab, setActiveTab] = useState('discussions');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDiscussion, setSelectedDiscussion] = useState<SafetyDiscussion | null>(null);

  const { data: discussions, isLoading: discussionsLoading } = useSafetyDiscussions();
  const { data: travelBuddies, isLoading: buddiesLoading } = useTravelBuddies();

  const filteredDiscussions = discussions?.filter(discussion =>
    discussion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    discussion.content.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const filteredBuddies = travelBuddies?.filter(buddy =>
    buddy.destination.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const getExperienceBadge = (level: string | null) => {
    const colors = {
      beginner: "bg-green-100 text-green-800",
      intermediate: "bg-blue-100 text-blue-800",
      experienced: "bg-purple-100 text-purple-800"
    };
    return colors[level as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)} days ago`;
    return date.toLocaleDateString();
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
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
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
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
                {discussionsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
                  </div>
                ) : filteredDiscussions.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-slate-600">No discussions found. Start the conversation!</p>
                  </div>
                ) : (
                  filteredDiscussions.map((discussion) => (
                    <Card
                      key={discussion.id}
                      className="hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => setSelectedDiscussion(discussion)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              {discussion.is_pinned && (
                                <Badge variant="outline" className="text-emerald-600 border-emerald-200">
                                  Pinned
                                </Badge>
                              )}
                              {discussion.is_closed && (
                                <Badge variant="outline" className="text-red-600 border-red-200">
                                  Closed
                                </Badge>
                              )}
                              {discussion.category && (
                                <Badge variant="secondary" className="text-xs capitalize">
                                  {discussion.category}
                                </Badge>
                              )}
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-2 hover:text-emerald-600">
                              {discussion.title}
                            </h3>
                            <div className="flex items-center space-x-4 text-sm text-slate-600 mb-3">
                              <div className="flex items-center space-x-1">
                                <User className="h-4 w-4" />
                                <span>Anonymous User</span>
                              </div>
                              {discussion.location_reference && (
                                <div className="flex items-center space-x-1">
                                  <MapPin className="h-4 w-4" />
                                  <span>{discussion.location_reference}</span>
                                </div>
                              )}
                              <span>{formatDate(discussion.created_at)}</span>
                            </div>
                            <p className="text-slate-700 mb-4 line-clamp-3">{discussion.content}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm text-slate-600">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <MessageSquare className="h-4 w-4" />
                              <span>{discussion.reply_count || 0} replies</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Heart className="h-4 w-4" />
                              <span>0 likes</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <span>{discussion.view_count} views</span>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                            <Share className="h-4 w-4 mr-1" />
                            Share
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>

              <TabsContent value="travel-buddies" className="space-y-6">
                {buddiesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
                  </div>
                ) : filteredBuddies.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-slate-600">No travel buddies found. Post your own request!</p>
                  </div>
                ) : (
                  filteredBuddies.map((buddy) => (
                    <Card key={buddy.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="w-16 h-16 bg-emerald-200 rounded-full flex items-center justify-center">
                            <span className="text-emerald-700 font-semibold text-xl">
                              {buddy.destination.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="text-lg font-semibold text-slate-900">Anonymous Traveler</h3>
                              {buddy.age_range && (
                                <span className="text-slate-600">• {buddy.age_range}</span>
                              )}
                              <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs">✓</span>
                              </div>
                              {buddy.experience_level && (
                                <Badge className={getExperienceBadge(buddy.experience_level)}>
                                  {buddy.experience_level}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-slate-600 mb-3">
                              <div className="flex items-center space-x-1">
                                <MapPin className="h-4 w-4" />
                                <span>{buddy.destination}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4" />
                                <span>{formatDateRange(buddy.travel_dates_start, buddy.travel_dates_end)}</span>
                              </div>
                            </div>
                            {buddy.interests && buddy.interests.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-4">
                                {buddy.interests.map((interest) => (
                                  <Badge key={interest} variant="outline" className="text-xs">
                                    {interest}
                                  </Badge>
                                ))}
                              </div>
                            )}
                            {buddy.languages && buddy.languages.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-4">
                                <span className="text-sm text-slate-600">Languages:</span>
                                {buddy.languages.map((language) => (
                                  <Badge key={language} variant="secondary" className="text-xs">
                                    {language}
                                  </Badge>
                                ))}
                              </div>
                            )}
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
                  ))
                )}
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
            {/* Community Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-900">
                  Community Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Active Discussions</span>
                  <span className="font-semibold text-emerald-600">{discussions?.length || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Travel Buddies</span>
                  <span className="font-semibold text-emerald-600">{travelBuddies?.length || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Safety Reports</span>
                  <span className="font-semibold text-emerald-600">234</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">This Week</span>
                  <span className="font-semibold text-blue-600">+12</span>
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

      {/* Discussion Detail Dialog */}
      <Dialog
        open={!!selectedDiscussion}
        onOpenChange={(open) => !open && setSelectedDiscussion(null)}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedDiscussion && (
            <>
              <DialogHeader>
                <div className="flex items-center space-x-2 mb-2">
                  {selectedDiscussion.is_pinned && (
                    <Badge variant="outline" className="text-emerald-600 border-emerald-200">
                      Pinned
                    </Badge>
                  )}
                  {selectedDiscussion.is_closed && (
                    <Badge variant="outline" className="text-red-600 border-red-200">
                      Closed
                    </Badge>
                  )}
                  {selectedDiscussion.category && (
                    <Badge variant="secondary" className="text-xs capitalize">
                      {selectedDiscussion.category}
                    </Badge>
                  )}
                </div>
                <DialogTitle className="text-xl font-bold text-slate-900 pr-8">
                  {selectedDiscussion.title}
                </DialogTitle>
                <div className="flex items-center space-x-4 text-sm text-slate-600 mt-2">
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>Anonymous User</span>
                  </div>
                  {selectedDiscussion.location_reference && (
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{selectedDiscussion.location_reference}</span>
                    </div>
                  )}
                  <span>{formatDate(selectedDiscussion.created_at)}</span>
                </div>
              </DialogHeader>

              {/* Discussion Content */}
              <div className="py-4 border-b">
                <p className="text-slate-700 whitespace-pre-wrap">
                  {selectedDiscussion.content}
                </p>
                <div className="flex items-center space-x-4 mt-4 text-sm text-slate-600">
                  <div className="flex items-center space-x-1">
                    <Heart className="h-4 w-4" />
                    <span>0 likes</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>{selectedDiscussion.view_count} views</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Share className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                </div>
              </div>

              {/* Replies Section */}
              <div className="pt-4">
                <DiscussionReplies
                  discussionId={selectedDiscussion.id}
                  discussionOwnerId={selectedDiscussion.user_id}
                />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CommunityPage;
