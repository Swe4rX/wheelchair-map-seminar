import React, { memo, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Image {
  url: string;
  publicId?: string;
}

interface ImageGalleryProps {
  images: Image[];
  locationName: string;
}

export const ImageGallery = memo(({ images, locationName }: ImageGalleryProps) => {
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