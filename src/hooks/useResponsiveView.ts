import { useState, useEffect } from 'react';

/**
 * Custom hook for responsive view management
 * Tracks device type and handles view state for mobile/desktop layouts
 * 
 * @returns {Object} Object containing isMobile state, current view, and setView function
 */
export const useResponsiveView = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [view, setView] = useState<"sidebar" | "map">("sidebar");

  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
    
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  return { isMobile, view, setView };
};