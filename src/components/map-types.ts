export interface Image {
  id: string;
  url: string;
  publicId: string;
  assetId: string;
}

export interface Location {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  rating: number;
  images: Image[];
}
