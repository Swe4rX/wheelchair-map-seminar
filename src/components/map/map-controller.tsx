"use client";

import React, { useEffect } from "react";
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
    if (selectedLocation) {
      map.flyTo([selectedLocation.latitude, selectedLocation.longitude], 16, {
        animate: true,
        duration: 1.5,
      });
    } else {
      // Reset to default view if no location is selected
      map.flyTo(defaultCenter, defaultZoom, { animate: true });
    }
  }, [selectedLocation, map, defaultCenter, defaultZoom]);

  return null;
};
