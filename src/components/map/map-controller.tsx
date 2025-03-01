"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { Location } from "../map-types";

interface MapControllerProps {
  selectedLocation: Location | null;
  defaultCenter: [number, number];
  defaultZoom: number;
  isMobile: boolean;
  isVisible: boolean;
}

export const MapController: React.FC<MapControllerProps> = ({
  selectedLocation,
  defaultCenter,
  defaultZoom,
  isMobile,
  isVisible
}) => {
  const map = useMap();
  
  // Handle map invalidation when it becomes visible
  useEffect(() => {
    if (isVisible) {
      // Add a slight delay to ensure DOM updates are complete
      const timer = setTimeout(() => {
        map.invalidateSize();
        
        // If a location is selected, center on it, otherwise use default center
        if (selectedLocation) {
          map.flyTo(
            [selectedLocation.latitude, selectedLocation.longitude], 
            16, 
            { animate: true, duration: 1.5 }
          );
        } else {
          map.flyTo(
            defaultCenter, 
            defaultZoom, 
            { animate: true, duration: 1.5 }
          );
        }
      }, 250);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, map, selectedLocation, defaultCenter, defaultZoom]);

  // Handle selected location changes
  useEffect(() => {
    if (isVisible && selectedLocation) {
      map.flyTo(
        [selectedLocation.latitude, selectedLocation.longitude], 
        16, 
        { animate: true, duration: 1.5 }
      );
    }
  }, [selectedLocation, isVisible, map]);

  return null;
};