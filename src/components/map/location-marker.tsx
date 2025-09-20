import React, { useMemo, useRef, useEffect } from "react";
import { Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { Location } from "../map-types";
import { LocationPopup } from "./location-popup";

interface LocationMarkerProps {
  location: Location;
  onSelect: (location: Location) => void;
  onViewDetails: (location: Location) => void;
  popupOpen?: boolean;
  setPopupOpen?: (open: boolean) => void;
}

const createMarkerIcon = () => {
  return L.icon({
    iconUrl: `/markers/marker-icon.png`,
    iconSize: [25, 41],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

export const LocationMarker: React.FC<LocationMarkerProps> = ({
  location,
  onSelect,
  onViewDetails,
  popupOpen,
  setPopupOpen,
}) => {
  const icon = useMemo(() => createMarkerIcon(), []);
  const markerRef = useRef<L.Marker | null>(null);
  
  const handleViewDetails = (loc: Location) => {
    // Close the popup first
    if (markerRef.current) {
      markerRef.current.closePopup();
    }
    
    // Notify parent with a small delay to ensure popup closes first
    setTimeout(() => onViewDetails(loc), 10);
  };

  // Open/close popup programmatically
  useEffect(() => {
    if (!markerRef.current) return;
    if (popupOpen) {
      markerRef.current.openPopup();
    } else {
      markerRef.current.closePopup();
    }
  }, [popupOpen]);

  return (
    <Marker
      ref={markerRef}
      position={[location.latitude, location.longitude]}
      icon={icon}
      eventHandlers={{
        click: () => {
          onSelect(location);
          if (setPopupOpen) setPopupOpen(true);
        },
      }}
    >
      <Popup
        maxWidth={400}
        minWidth={400}
      >
        <LocationPopup
          location={location}
          onShowDetails={handleViewDetails}
        />
      </Popup>
    </Marker>
  );
};