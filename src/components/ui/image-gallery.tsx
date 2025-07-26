import React, { memo, useState, useEffect, useCallback } from "react";
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

  const handlePrevious = useCallback(() => 
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : images.length - 1)),
    [images.length]
  );
  
  const handleNext = useCallback(() => 
    setCurrentIndex(prev => (prev < images.length - 1 ? prev + 1 : 0)),
    [images.length]
  );
  
  const toggleFullscreen = useCallback(() => 
    setIsFullscreen(prev => !prev),
    []
  );
  
  if (images.length === 0) return <p className="text-gray-500 italic">No images available</p>;
  
  return (
    <div className="relative">
      {/* Thumbnail view */}
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
      
      {/* Navigation controls - only show if multiple images */}
      {images.length > 1 && (
        <ImageNavigation 
          currentIndex={currentIndex}
          totalImages={images.length}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onSelectIndex={setCurrentIndex}
        />
      )}
      
      {/* Fullscreen Modal */}
      {isFullscreen && (
        <FullscreenView
          images={images}
          locationName={locationName}
          currentIndex={currentIndex}
          onClose={toggleFullscreen}
          onPrevious={handlePrevious}
          onNext={handleNext}
        />
      )}
    </div>
  );
});

const ImageNavigation = memo(({ 
  currentIndex, 
  totalImages, 
  onPrevious, 
  onNext, 
  onSelectIndex 
}: { 
  currentIndex: number;
  totalImages: number;
  onPrevious: () => void;
  onNext: () => void;
  onSelectIndex: (index: number) => void;
}) => (
  <>
    <button 
      onClick={onPrevious}
      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 backdrop-blur-sm rounded-full p-2 shadow-md"
      aria-label="Previous image"
    >
      <ChevronLeft size={20} />
    </button>
    <button 
      onClick={onNext}
      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 backdrop-blur-sm rounded-full p-2 shadow-md"
      aria-label="Next image"
    >
      <ChevronRight size={20} />
    </button>
    <div className="flex justify-center mt-2 space-x-1">
      {Array.from({ length: totalImages }).map((_, idx) => (
        <button
          key={idx}
          onClick={() => onSelectIndex(idx)}
          className={cn(
            "w-2 h-2 rounded-full transition-colors", 
            currentIndex === idx ? "bg-blue-500" : "bg-gray-300"
          )}
          aria-label={`View image ${idx + 1}`}
        />
      ))}
    </div>
  </>
));

const FullscreenView = memo(({
  images,
  locationName,
  currentIndex,
  onClose,
  onPrevious,
  onNext
}: {
  images: Image[];
  locationName: string;
  currentIndex: number;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
}) => (
  <div className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center">
    <button 
      onClick={onClose}
      className="absolute right-4 top-4 bg-white/20 text-white rounded-full p-2 shadow-md z-10 hover:bg-white/40 transition-colors"
      aria-label="Close fullscreen"
    >
      <X size={24} />
    </button>
    
    {/* Full screen image - 100vw/100vh with padding */}
    <div className="w-screen h-screen p-8 flex items-center justify-center">
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
          onClick={onPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 text-white rounded-full p-3 shadow-md hover:bg-white/40 transition-colors"
          aria-label="Previous image"
        >
          <ChevronLeft size={36} />
        </button>
        <button 
          onClick={onNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 text-white rounded-full p-3 shadow-md hover:bg-white/40 transition-colors"
          aria-label="Next image"
        >
          <ChevronRight size={36} />
        </button>
        
        {/* Image counter */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full">
          {currentIndex + 1} / {images.length}
        </div>
      </>
    )}
  </div>
));

ImageGallery.displayName = "ImageGallery";
ImageNavigation.displayName = "ImageNavigation";
FullscreenView.displayName = "FullscreenView";