
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { SafetyLocation } from '@/hooks/useSafetyLocations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, AlertTriangle } from 'lucide-react';

interface InteractiveMapProps {
  locations: SafetyLocation[];
  selectedLocation: SafetyLocation | null;
  onLocationSelect: (location: SafetyLocation) => void;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({
  locations,
  selectedLocation,
  onLocationSelect
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const envToken = import.meta.env.VITE_MAPBOX_TOKEN;
  const [mapboxToken, setMapboxToken] = useState(envToken || '');
  const [tokenInputVisible, setTokenInputVisible] = useState(!envToken);

  const initializeMap = () => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [0, 20],
      zoom: 2
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add markers for each location
    locations.forEach((location) => {
      const el = document.createElement('div');
      el.className = 'safety-marker';
      el.style.width = '20px';
      el.style.height = '20px';
      el.style.borderRadius = '50%';
      el.style.cursor = 'pointer';
      el.style.border = '2px solid white';
      el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
      
      // Color based on safety zone
      switch (location.safety_zone) {
        case 'green':
          el.style.backgroundColor = '#10b981';
          break;
        case 'yellow':
          el.style.backgroundColor = '#f59e0b';
          break;
        case 'red':
          el.style.backgroundColor = '#ef4444';
          break;
        default:
          el.style.backgroundColor = '#6b7280';
      }

      const marker = new mapboxgl.Marker(el)
        .setLngLat([location.longitude, location.latitude])
        .addTo(map.current!);

      el.addEventListener('click', () => {
        onLocationSelect(location);
      });
    });

    setTokenInputVisible(false);
  };

  useEffect(() => {
    if (mapboxToken && locations.length > 0) {
      initializeMap();
    }

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [mapboxToken, locations]);

  // Center map on selected location
  useEffect(() => {
    if (map.current && selectedLocation) {
      map.current.flyTo({
        center: [selectedLocation.longitude, selectedLocation.latitude],
        zoom: 15
      });
    }
  }, [selectedLocation]);

  if (tokenInputVisible) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
        <div className="text-center p-8 max-w-md">
          <MapPin className="h-16 w-16 text-emerald-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-700 mb-4">Interactive Map</h3>
          <p className="text-slate-600 mb-4">
            Enter your Mapbox public token to display the interactive map with safety locations.
          </p>
          <div className="space-y-3">
            <Input
              type="text"
              placeholder="pk.eyJ1IjoieW91cnVzZXJuYW1lIiwiYSI6..."
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
              className="w-full"
            />
            <Button 
              onClick={initializeMap}
              disabled={!mapboxToken}
              className="w-full bg-emerald-600 hover:bg-emerald-700"
            >
              Load Map
            </Button>
          </div>
          <p className="text-xs text-slate-500 mt-4">
            Get your free token at{' '}
            <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
              mapbox.com
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0 rounded-lg" />
      
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
  );
};

export default InteractiveMap;
