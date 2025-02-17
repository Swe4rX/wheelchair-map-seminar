'use client'

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star } from 'lucide-react';
import L from 'leaflet';
import { Location, MapProps } from './map-types';
import { cn } from '@/lib/utils';

const MAP_CONFIG = {
  center: [48.7519, 8.5500] as [number, number],
  zoom: 14,
  markerIcon: L.icon({
    iconUrl: '/marker-icon.png',
    shadowUrl: '/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  })
};

const LOCATIONS: Location[] = [
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
];

const RatingStars = ({ rating }: { rating: number }) => (
  <div className="flex items-center">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={16}
        className={cn(
          "inline",
          i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
        )}
      />
    ))}
    <span className="ml-2 text-sm text-gray-600">{rating}/5</span>
  </div>
);

const LocationCard = ({ location }: { location: Location }) => (
  <div className="max-w-xs">
    <h3 className="font-bold text-lg mb-2">{location.name}</h3>
    <img
      src={location.imageUrl}
      alt={location.name}
      className="w-full h-32 object-cover rounded-md mb-2"
    />
    <div className="mb-2">
      <RatingStars rating={location.rating} />
    </div>
    <p className="text-sm text-gray-600">{location.description}</p>
  </div>
);

export default function LocationMap({ className }: MapProps) {
  return (
    <div className="w-screen h-screen">
      <MapContainer
        center={MAP_CONFIG.center}
        zoom={MAP_CONFIG.zoom}
        className="h-full w-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {LOCATIONS.map((location) => (
          <Marker 
            key={location.id} 
            position={location.position}
            icon={MAP_CONFIG.markerIcon}
          >
            <Popup>
              <LocationCard location={location} />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}