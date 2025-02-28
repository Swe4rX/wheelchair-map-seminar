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

export const LocationSidebar: React.FC<LocationSidebarProps> = ({ 
  locations, 
  selectedLocation, 
  onLocationSelect,
  isLoading = false,
  className = ""
}) => {
  // Rest of component remains the same
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter and sort locations based on search term
  const filteredAndSortedLocations = useMemo(() => {
    if (!searchTerm.trim()) {
      return locations; // Return all locations if no search term
    }
    
    const normalizedSearchTerm = searchTerm.toLowerCase().trim();
    
    return [...locations]
      .map(location => {
        // Calculate relevance score (higher is better match)
        const nameMatch = location.name.toLowerCase().includes(normalizedSearchTerm);
        const descMatch = location.description.toLowerCase().includes(normalizedSearchTerm);
        
        // Name matches are weighted higher than description matches
        let score = 0;
        if (nameMatch) score += 10;
        if (descMatch) score += 5;
        
        // Exact matches get bonus points
        if (location.name.toLowerCase() === normalizedSearchTerm) score += 20;
        
        // Matches at the beginning get more points
        if (location.name.toLowerCase().startsWith(normalizedSearchTerm)) score += 15;
        
        return { location, score };
      })
      .filter(item => item.score > 0) // Only include matches
      .sort((a, b) => b.score - a.score) // Sort by score (highest first)
      .map(item => item.location); // Return just the location objects
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
      
      {filteredAndSortedLocations.length === 0 ? (
        <p className="text-gray-500">
          {locations.length === 0 ? "Keine Orte gefunden" : "Keine Übereinstimmungen gefunden"}
        </p>
      ) : (
        <div className="space-y-4">
          {filteredAndSortedLocations.map((location) => (
            <div 
              key={location.id}
              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                selectedLocation?.id === location.id
                  ? "bg-blue-100 border-blue-300 border"
                  : "bg-gray-50 hover:bg-gray-100"
              }`}
              onClick={() => onLocationSelect(location)}
            >
              <h3 className="font-semibold text-lg">{location.name}</h3>
              <StarRating rating={location.rating} className="my-1" />
              <p className="text-sm text-gray-600 line-clamp-2">{location.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};