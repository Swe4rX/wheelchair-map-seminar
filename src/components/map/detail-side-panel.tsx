import React, { memo, useState } from "react";
import { Location } from "../map-types";
import { StarRating } from "../ui/star-rating";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface DetailSidePanelProps {
  location: Location | null;
  onClose: () => void;
  isOpen: boolean;
}

// Image carousel/gallery component
const ImageGallery = memo(({ images, locationName }: { images: Location["images"]; locationName: string }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  if (images.length === 0) return <p className="text-gray-500 italic">No images available</p>;
  
  const handlePrevious = () => setCurrentIndex(prev => (prev > 0 ? prev - 1 : images.length - 1));
  const handleNext = () => setCurrentIndex(prev => (prev < images.length - 1 ? prev + 1 : 0));
  const toggleFullscreen = () => setIsFullscreen(prev => !prev);
  
  return (
    <div className="relative">
      <div className="relative aspect-video rounded-md overflow-hidden bg-gray-100">
        <img
          src={images[currentIndex].url}
          alt={`${locationName} - Image ${currentIndex + 1}`}
          className="w-full h-full object-cover transition-opacity duration-300 cursor-pointer"
          loading="lazy"
          onClick={toggleFullscreen}
        />
        <button 
          onClick={toggleFullscreen}
          className="absolute right-2 bottom-2 bg-white/70 backdrop-blur-sm rounded-full p-1.5 shadow-md"
          aria-label="View fullscreen"
        >
          <Maximize2 size={16} />
        </button>
      </div>
      
      {images.length > 1 && (
        <>
          <button 
            onClick={handlePrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 backdrop-blur-sm rounded-full p-2 shadow-md"
            aria-label="Previous image"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 backdrop-blur-sm rounded-full p-2 shadow-md"
            aria-label="Next image"
          >
            <ChevronRight size={20} />
          </button>
          <div className="flex justify-center mt-2 space-x-1">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={cn(
                  "w-2 h-2 rounded-full transition-colors", 
                  currentIndex === idx ? "bg-blue-500" : "bg-gray-300"
                )}
                aria-label={`View image ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
      
      {/* Fullscreen Image Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black/90 z-[1100] flex flex-col items-center justify-center">
          <div className="relative w-full h-full max-w-7xl max-h-[90vh] p-4 md:p-8">
            {/* Close button */}
            <button 
              onClick={toggleFullscreen}
              className="absolute right-4 top-4 bg-white/20 text-white rounded-full p-2 shadow-md z-10 hover:bg-white/40 transition-colors"
              aria-label="Close fullscreen"
            >
              <X size={24} />
            </button>
            
            {/* Image container */}
            <div className="w-full h-full flex items-center justify-center">
              <img
                src={images[currentIndex].url}
                alt={`${locationName} - Image ${currentIndex + 1}`}
                className="max-w-full max-h-full object-contain"
              />
            </div>
            
            {/* Navigation buttons */}
            {images.length > 1 && (
              <>
                <button 
                  onClick={handlePrevious}
                  className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/20 text-white rounded-full p-3 shadow-md hover:bg-white/40 transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={30} />
                </button>
                <button 
                  onClick={handleNext}
                  className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/20 text-white rounded-full p-3 shadow-md hover:bg-white/40 transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight size={30} />
                </button>
                
                {/* Image counter */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full">
                  {currentIndex + 1} / {images.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
});
ImageGallery.displayName = "ImageGallery";

// InfoSection component to standardize section formatting
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