"use client";

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import { Location } from "../map-types";
import { LocationSidebar } from "../sidebar/location-sidebar";
import { MapController } from "./map-controller";
import { LocationMarker } from "./location-marker";
import { ChevronLeft } from "lucide-react"; // Import icon for back button

// Map default settings
const DEFAULT_CENTER: [number, number] = [48.7519, 8.55];
const DEFAULT_ZOOM = 14;

const LocationMap: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [view, setView] = useState<"sidebar" | "map">("sidebar"); // New state for controlling mobile view
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Check if device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  useEffect(() => {
    const fetchLocations = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/locations/get");

        if (!response.ok) {
          throw new Error(`Server responded with ${response.status}`);
        }

        const data: Location[] = await response.json();
        setLocations(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching locations:", err);
        setError("Failed to load locations. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocations();
  }, []);

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
    if (isMobile) {
      setView("map");
    }
  };

  const resetSelection = () => {
    setSelectedLocation(null);
    if (isMobile) {
      setView("sidebar");
    }
  };

  if (error) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-white">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex flex-col md:flex-row">
      {/* Location List Sidebar */}
      <div className={`${isMobile ? (view === "sidebar" ? "flex" : "hidden") : "flex w-1/5"} md:block h-full`}>
        <LocationSidebar
          locations={locations}
          selectedLocation={selectedLocation}
          onLocationSelect={handleLocationSelect}
          isLoading={isLoading}
          className="w-full"
        />
      </div>

      {/* Map */}
      <div className={`${isMobile ? (view === "map" ? "flex" : "hidden") : "flex w-4/5"} md:block h-full`}>
        {isMobile && view === "map" && (
          <button
            onClick={resetSelection}
            className="absolute top-4 left-4 z-[1000] bg-white p-2 rounded-full shadow-md"
          >
            <ChevronLeft size={24} />
          </button>
        )}
        
        <MapContainer
          center={DEFAULT_CENTER}
          zoom={DEFAULT_ZOOM}
          className="h-full w-full"
          zoomControl={false}
        >
          <MapController
            selectedLocation={selectedLocation}
            defaultCenter={DEFAULT_CENTER}
            defaultZoom={DEFAULT_ZOOM}
          />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          {/* Only render marker for selected location */}
          {!isLoading && selectedLocation && (
            <LocationMarker
              key={selectedLocation.id}
              location={selectedLocation}
              onSelect={handleLocationSelect}
            />
          )}
        </MapContainer>

        {selectedLocation && !isMobile && (
          <button
            onClick={resetSelection}
            className="absolute top-4 right-4 z-[1000] bg-white px-4 py-2 rounded-md shadow-md"
          >
            Auswahl zurücksetzen
          </button>
        )}
      </div>
    </div>
  );
};

export default LocationMap;