import React from "react";
import { Location } from "../map-types";
import { StarRating } from "../ui/star-rating";
import { X } from "lucide-react";

interface DetailSidePanelProps {
  location: Location | null;
  onClose: () => void;
  isOpen: boolean;
}

export const DetailSidePanel: React.FC<DetailSidePanelProps> = ({
  location,
  onClose,
  isOpen
}) => {
  if (!location) return null;
  
  return (
    <div 
      className={`fixed top-0 right-0 h-full bg-white shadow-lg z-[1001] transition-all duration-300 ease-in-out overflow-y-auto
      ${isOpen ? 'w-full md:w-96 translate-x-0' : 'w-0 translate-x-full'}`}
    >
      <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
        <h2 className="text-xl font-bold truncate">{location.name}</h2>
        <button
          onClick={onClose}
          className="rounded-full p-2 hover:bg-gray-100 transition-colors"
          aria-label="Close"
        >
          <X size={24} />
        </button>
      </div>

      <div className="p-6">
        {/* Rating */}
        <div className="mb-6">
          <StarRating rating={location.rating} size={20} className="mb-2" />
        </div>

        {/* Image Gallery */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Images</h3>
          <div className="grid grid-cols-1 gap-4">
            {location.images.map((image, index) => (
              <div key={image.id}>
                <img
                  src={image.url}
                  alt={`${location.name} - Image ${index + 1}`}
                  className="w-full object-cover rounded-md"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Description</h3>
          <p className="text-gray-700 whitespace-pre-wrap">{location.description}</p>
        </div>

        {/* Coordinates */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Location Details</h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm text-gray-500">Latitude</p>
              <p className="font-medium">{location.latitude}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm text-gray-500">Longitude</p>
              <p className="font-medium">{location.longitude}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};