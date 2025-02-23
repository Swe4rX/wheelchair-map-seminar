export interface Location {
  id: number;
  position: [number, number];
  name: string;
  rating: number;
  description: string;
  imageUrl: string;
}

export interface MapProps {
  className?: string;
}
