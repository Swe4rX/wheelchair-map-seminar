import React, { memo } from "react";
import { Location } from "../map-types";
import { StarRating } from "../ui/star-rating";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ImageGallery } from "../ui/image-gallery";

interface DetailSidePanelProps {
  location: Location | null;
  onClose: () => void;
  isOpen: boolean;
}

const InfoSection = ({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) => (
  <div className={cn("mb-6", className)}>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    {children}
  </div>
);

export const DetailSidePanel = memo(({ location, onClose, isOpen }: DetailSidePanelProps) => {
  if (!location) return null;
  
  return (
    <div 
      className={cn(
        "fixed top-0 right-0 h-full bg-white shadow-lg z-[1001] transition-all duration-300 ease-in-out overflow-y-auto",
        isOpen ? "w-full md:w-96 translate-x-0" : "w-0 translate-x-full"
      )}
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

      {/* Only render content if panel is open for performance */}
      {isOpen && (
        <div className="p-6">
          {/* Rating */}
          <InfoSection title="Rating">
            <StarRating rating={location.rating} size={20} className="mb-2" />
          </InfoSection>

          {/* Image Gallery */}
          <InfoSection title="Bilder">
            <ImageGallery images={location.images} locationName={location.name} />
          </InfoSection>

          {/* Description */}
          <InfoSection title="Beschreibung">
            <p className="text-gray-700 whitespace-pre-wrap">{location.description}</p>
          </InfoSection>

          {/* Coordinates */}
          <InfoSection title="Details">
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm text-gray-500">Breitengrad</p>
                <p className="font-medium">{location.latitude}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm text-gray-500">Längengrad</p>
                <p className="font-medium">{location.longitude}</p>
              </div>
            </div>
          </InfoSection>
        </div>
      )}
    </div>
  );
});
DetailSidePanel.displayName = "DetailSidePanel";