export interface MarkerConfig {
  iconUrl: string;
  iconSize: [number, number];
  iconAnchor: [number, number];
  popupAnchor: [number, number];
  shadowUrl?: string;
  shadowSize?: [number, number];
}

export interface Location {
  id: number;
  position: [number, number];
  name: string;
  rating: number;
  description: string;
  imageUrl: string;
  marker: MarkerConfig;  // Add this new field
}

export interface MapProps {
  className?: string;
}