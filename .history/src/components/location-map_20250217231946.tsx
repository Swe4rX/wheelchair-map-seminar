'use client'

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star } from 'lucide-react';
import L from 'leaflet';
import { Location, MapProps } from './map-types';
import { cn } from '@/lib/utils';

// Fix for the marker icon issue in Next.js
const icon = L.icon({
  iconUrl: '/marker-icon.png',
  shadowUrl: '/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Center coordinates for Bad Wildbad, Germany
const CENTER_POSITION: [number, number] = [48.7519, 8.5500];

const LocationMap = ({ className }: MapProps) => {
  const [locations] = useState<Location[]>([
    {
      id: 1,
      position: [48.7519, 8.5500],
      name: "Palais Thermal",
      rating: 4.5,
      description: "Historic thermal bath house",
      imageUrl: "/api/placeholder/300/200"
    },
    {
      id: 2,
      position: [48.7530, 8.5480],
      name: "Sommerbergbahn",
      rating: 4.2,
      description: "Funicular railway with panoramic views",
      imageUrl: "/api/placeholder/300/200"
    }
  ]);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star
          key={i}
          size={16}
          className={`inline ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
        />
      );
    }
    return stars;
  };

  if (!mounted) return null;

  return (
    <Card className={cn("w-full max-w-4xl", className)}>
      <CardHeader>
        <CardTitle>Bad Wildbad Attractions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-96 w-full">
          <MapContainer
            center={CENTER_POSITION}
            zoom={14}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {locations.map((location) => (
              <Marker 
                key={location.id} 
                position={location.position}
                icon={icon}
              >
                <Popup>
                  <div className="max-w-xs">
                    <h3 className="font-bold text-lg mb-2">{location.name}</h3>
                    <img
                      src={location.imageUrl}
                      alt={location.name}
                      className="w-full h-32 object-cover rounded-md mb-2"
                    />
                    <div className="mb-2">
                      {renderStars(location.rating)}
                      <span className="ml-2 text-sm text-gray-600">
                        {location.rating}/5
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{location.description}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationMap;