
import React, { useState } from 'react';
import { Search, Filter, MapPin, AlertTriangle, Shield, Users, Star, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const MapPage = () => {
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for demonstration
  const safetyZones = [
    {
      id: 1,
      name: "Old Town District",
      zone: "green",
      rating: 4.5,
      reviews: 234,
      coordinates: { lat: 40.7589, lng: -73.9851 },
      safety: {
        harassment: "low",
        nighttime: "safe",
        lighting: "excellent",
        security: "high",
        staff: "excellent"
      }
    },
    {
      id: 2,
      name: "Central Market Area",
      zone: "yellow",
      rating: 3.2,
      reviews: 156,
      coordinates: { lat: 40.7505, lng: -73.9934 },
      safety: {
        harassment: "medium",
        nighttime: "caution",
        lighting: "good",
        security: "medium",
        staff: "good"
      }
    },
    {
      id: 3,
      name: "Industrial Zone",
      zone: "red",
      rating: 2.1,
      reviews: 89,
      coordinates: { lat: 40.7614, lng: -73.9776 },
      safety: {
        harassment: "high",
        nighttime: "avoid",
        lighting: "poor",
        security: "low",
        staff: "poor"
      }
    }
  ];

  const getZoneColor = (zone: string) => {
    switch (zone) {
      case 'green': return 'bg-emerald-500';
      case 'yellow': return 'bg-amber-500';
      case 'red': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getZoneText = (zone: string) => {
    switch (zone) {
      case 'green': return 'Safe Zone';
      case 'yellow': return 'Caution Zone';
      case 'red': return 'High Risk Zone';
      default: return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-1/3 bg-white shadow-lg overflow-y-auto">
          <div className="p-6 border-b">
            <div className="flex items-center space-x-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Quick Filters */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-emerald-600 border-emerald-200">
                Safe Zones
              </Badge>
              <Badge variant="outline" className="text-amber-600 border-amber-200">
                Caution Areas
              </Badge>
              <Badge variant="outline" className="text-red-600 border-red-200">
                High Risk
              </Badge>
            </div>
          </div>

          {/* Location List */}
          <div className="p-4 space-y-4">
            {safetyZones.map((location) => (
              <Card 
                key={location.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedLocation?.id === location.id ? 'ring-2 ring-emerald-500' : ''
                }`}
                onClick={() => setSelectedLocation(location)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 mb-1">{location.name}</h3>
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${getZoneColor(location.zone)}`}></div>
                        <span className="text-sm text-slate-600">{getZoneText(location.zone)}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{location.rating}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <span>{location.reviews} reviews</span>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Users className="h-3 w-3" />
                        <span>Active</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Navigation className="h-3 w-3" />
                        <span>0.5km</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Map Area */}
        <div className="flex-1 relative">
          {/* Map Placeholder */}
          <div 
            className="w-full h-full bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`,
            }}
          >
            <div className="text-center">
              <MapPin className="h-16 w-16 text-emerald-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-700 mb-2">Interactive Map</h3>
              <p className="text-slate-600 max-w-md">
                Mapbox integration would be implemented here with custom safety zone overlays, 
                real-time data, and interactive markers for detailed safety information.
              </p>
            </div>
          </div>

          {/* Map Controls */}
          <div className="absolute top-4 right-4 space-y-2">
            <Button size="sm" className="bg-white text-slate-700 shadow-lg hover:bg-gray-50">
              <MapPin className="h-4 w-4 mr-2" />
              My Location
            </Button>
            <Button size="sm" className="bg-white text-slate-700 shadow-lg hover:bg-gray-50">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Report Issue
            </Button>
          </div>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4">
            <h4 className="font-semibold text-slate-900 mb-3">Safety Zones</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-emerald-500 rounded-full"></div>
                <span className="text-sm text-slate-700">Safe - Low risk, well-lit, good security</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-amber-500 rounded-full"></div>
                <span className="text-sm text-slate-700">Caution - Moderate risk, be aware</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <span className="text-sm text-slate-700">High Risk - Avoid, especially at night</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Location Details Modal */}
      {selectedLocation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-2xl font-bold text-slate-900 mb-2">
                    {selectedLocation.name}
                  </CardTitle>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className={`w-4 h-4 rounded-full ${getZoneColor(selectedLocation.zone)}`}></div>
                      <span className="font-medium">{getZoneText(selectedLocation.zone)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-5 w-5 text-yellow-400 fill-current" />
                      <span className="font-semibold">{selectedLocation.rating}</span>
                      <span className="text-slate-600">({selectedLocation.reviews} reviews)</span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" onClick={() => setSelectedLocation(null)}>
                  ×
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Safety Metrics */}
              <div>
                <h4 className="font-semibold text-slate-900 mb-4">Safety Assessment</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Harassment Frequency</span>
                      <span className={`text-sm font-medium ${
                        selectedLocation.safety.harassment === 'low' ? 'text-emerald-600' : 
                        selectedLocation.safety.harassment === 'medium' ? 'text-amber-600' : 'text-red-600'
                      }`}>
                        {selectedLocation.safety.harassment}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Nighttime Safety</span>
                      <span className={`text-sm font-medium ${
                        selectedLocation.safety.nighttime === 'safe' ? 'text-emerald-600' : 
                        selectedLocation.safety.nighttime === 'caution' ? 'text-amber-600' : 'text-red-600'
                      }`}>
                        {selectedLocation.safety.nighttime}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Lighting Quality</span>
                      <span className={`text-sm font-medium ${
                        selectedLocation.safety.lighting === 'excellent' ? 'text-emerald-600' : 
                        selectedLocation.safety.lighting === 'good' ? 'text-amber-600' : 'text-red-600'
                      }`}>
                        {selectedLocation.safety.lighting}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Security Presence</span>
                      <span className={`text-sm font-medium ${
                        selectedLocation.safety.security === 'high' ? 'text-emerald-600' : 
                        selectedLocation.safety.security === 'medium' ? 'text-amber-600' : 'text-red-600'
                      }`}>
                        {selectedLocation.safety.security}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Reviews */}
              <div>
                <h4 className="font-semibold text-slate-900 mb-4">Recent Reviews</h4>
                <div className="space-y-4">
                  <div className="border-l-4 border-emerald-500 pl-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <span className="text-sm text-slate-600">Sarah M. • 2 days ago</span>
                    </div>
                    <p className="text-sm text-slate-700">
                      "Felt very safe walking here during the day and evening. Well-lit streets 
                      and plenty of people around. Staff at local shops were helpful and respectful."
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-amber-500 pl-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex">
                        {[...Array(3)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <span className="text-sm text-slate-600">Maria L. • 1 week ago</span>
                    </div>
                    <p className="text-sm text-slate-700">
                      "Okay during daytime but I wouldn't recommend walking alone after dark. 
                      Some areas feel a bit isolated despite being busy during the day."
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                  Get Directions
                </Button>
                <Button variant="outline" className="flex-1">
                  Add Review
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default MapPage;
