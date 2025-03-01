"use client";

import React, { useState, useMemo } from "react";
import { Location } from "../map-types";
import { StarRating } from "../ui/star-rating";
import { Search } from "lucide-react";

interface LocationSidebarProps {
  locations: Location[];
  selectedLocation: Location | null;
  onLocationSelect: (location: Location) => void;
  isLoading?: boolean;
  className?: string;
}

const LocationCard = ({ 
  location, 
  isSelected, 
  onClick 
}: { 
  location: Location; 
  isSelected: boolean; 
  onClick: () => void;
}) => (
  <div 
    className={`p-3 rounded-lg cursor-pointer transition-colors ${
      isSelected
        ? "bg-blue-100 border-blue-300 border"
        : "bg-gray-50 hover:bg-gray-100"
    }`}
    onClick={onClick}
  >
    <h3 className="font-semibold text-lg">{location.name}</h3>
    <StarRating rating={location.rating} className="my-1" />
    <p className="text-sm text-gray-600 line-clamp-2">{location.description}</p>
  </div>
);

export const LocationSidebar: React.FC<LocationSidebarProps> = ({ 
  locations, 
  selectedLocation, 
  onLocationSelect,
  isLoading = false,
  className = ""
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter and sort locations based on search term
  const filteredLocations = useMemo(() => {
    if (!searchTerm.trim()) return locations;
    
    const normalizedTerm = searchTerm.toLowerCase().trim();
    
    return [...locations]
      .map(location => {
        // Calculate relevance score
        const nameMatch = location.name.toLowerCase().includes(normalizedTerm);
        const descMatch = location.description.toLowerCase().includes(normalizedTerm);
        
        let score = 0;
        if (nameMatch) score += 10;
        if (descMatch) score += 5;
        if (location.name.toLowerCase() === normalizedTerm) score += 20;
        if (location.name.toLowerCase().startsWith(normalizedTerm)) score += 15;
        
        return { location, score };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(item => item.location);
  }, [locations, searchTerm]);

  if (isLoading) {
    return (
      <div className={`h-full overflow-y-auto bg-white p-4 border-r border-gray-200 ${className}`}>
        <h2 className="text-xl font-bold mb-4">Einträge</h2>
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-full overflow-y-auto bg-white p-4 border-r border-gray-200 ${className}`}>
      <h2 className="text-xl font-bold mb-4">Einträge</h2>
      
      {/* Search Bar */}
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Einträge durchsuchen..."
          className="w-full p-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
      </div>
      
      {filteredLocations.length === 0 ? (
        <p className="text-gray-500">
          {locations.length === 0 ? "Keine Orte gefunden" : "Keine Übereinstimmungen gefunden"}
        </p>
      ) : (
        <div className="space-y-4">
          {filteredLocations.map((location) => (
            <LocationCard 
              key={location.id}
              location={location}
              isSelected={selectedLocation?.id === location.id}
              onClick={() => onLocationSelect(location)}
            />
          ))}
        </div>
      )}
    </div>
  );
};