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
    className={`p-3 rounded-lg cursor-pointer transition-colors focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 ${
      isSelected
        ? "bg-blue-100 border-blue-300 border"
        : "bg-gray-50 hover:bg-gray-100"
    }`}
    role="button"
    tabIndex={0}
    onClick={onClick}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick();
      }
    }}
    aria-label={`${location.name}, Bewertung: ${location.rating} von 5 Sternen, ${location.description}`}
    aria-pressed={isSelected}
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
      <aside className={`h-full overflow-y-auto bg-white p-4 border-r border-gray-200 ${className}`}>
        <h2 className="text-xl font-bold mb-4">Barrierefreie Orte</h2>
        <div className="flex items-center justify-center h-32" role="status" aria-label="Orte werden geladen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" aria-hidden="true"></div>
          <span className="sr-only">Orte werden geladen...</span>
        </div>
      </aside>
    );
  }

  return (
    <aside className={`h-full overflow-y-auto bg-white p-4 border-r border-gray-200 ${className}`}>
      <h2 className="text-xl font-bold mb-4">Barrierefreie Orte</h2>
      
      {/* Search Bar */}
      <div className="relative mb-4">
        <label htmlFor="location-search" className="sr-only">
          Orte durchsuchen
        </label>
        <input
          id="location-search"
          type="text"
          placeholder="Orte durchsuchen..."
          className="w-full p-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-describedby="search-help"
        />
        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} aria-hidden="true" />
        <div id="search-help" className="sr-only">
          Geben Sie Suchbegriffe ein, um die Liste der barrierefreien Orte zu filtern
        </div>
      </div>
        {filteredLocations.length === 0 ? (
        <p className="text-gray-500" role="status">
          {locations.length === 0 ? "Keine Orte gefunden" : "Keine Übereinstimmungen gefunden"}
        </p>
      ) : (
        <nav role="navigation" aria-label="Liste der barrierefreien Orte">
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
        </nav>
      )}
    </aside>
  );
};