"use client";

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Star } from "lucide-react";
import L from "leaflet";

interface Location {
  id: number;
  latitude: number;
  longitude: number;
  imageUrl: string;
  icon: string;
  name: string;
  rating: number;
  description: string;
}

const LocationMap = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch("/api/locations");
        const data: Location[] = await response.json();
        setLocations(data);
      } catch (error) {
        console.error("Error fetching locations:", error);
        setError("Failed to load locations");
      }
    };

    fetchLocations();
  }, []);

  if (error) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        {error}
      </div>
    );
  }

  return (
    <div className="fixed inset-0">
      <MapContainer
        center={[48.7519, 8.55]}
        zoom={14}
        className="h-full w-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        {locations.map((location) => (
          <Marker
            key={location.id}
            position={[location.latitude, location.longitude]}
            icon={L.icon({
              iconUrl: `/markers/${location.icon}.png`,
              iconAnchor: [16, 32],
              popupAnchor: [0, -32],
            })}
            title={location.name} //TODO: fix title
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
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={`inline ${
                        i < location.rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
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
  );
};

export default LocationMap;
