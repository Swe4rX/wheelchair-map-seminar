import React from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { Location } from "../map-types";
import { LocationPopup } from "./location-popup";

interface LocationMarkerProps {
  location: Location;
  onSelect: (location: Location) => void;
}

// Default icon name for all markers
const DEFAULT_ICON_NAME = "default-icon";

const createMarkerIcon = () => {
  return L.icon({
    iconUrl: `/markers/${DEFAULT_ICON_NAME}.png`,
    iconSize: [25, 41],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

export const LocationMarker: React.FC<LocationMarkerProps> = ({
  location,
  onSelect,
}) => {
  
  const icon = React.useMemo(
    () => createMarkerIcon(),
    [] 
  );

  return (
    <Marker
      position={[location.latitude, location.longitude]}
      icon={icon}
      eventHandlers={{
        click: () => onSelect(location),
      }}
    >
      <Popup>
        <LocationPopup location={location} />
      </Popup>
    </Marker>
  );
};