"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { Location } from "../map-types";

interface MapControllerProps {
  selectedLocation: Location | null;
  defaultCenter: [number, number];
  defaultZoom: number;
}

export const MapController: React.FC<MapControllerProps> = ({
  selectedLocation,
  defaultCenter,
  defaultZoom,
}) => {
  const map = useMap();
  
  useEffect(() => {
    const flyOptions = { animate: true, duration: 1.5 };
    
    if (selectedLocation) {
      map.flyTo(
        [selectedLocation.latitude, selectedLocation.longitude], 
        16, 
        flyOptions
      );
    } else {
      map.flyTo(defaultCenter, defaultZoom, flyOptions);
    }
  }, [selectedLocation, map, defaultCenter, defaultZoom]);

  return null;
};