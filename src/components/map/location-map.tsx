
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { MapContainer, TileLayer, ZoomControl } from "react-leaflet";
import { Location } from "../map-types";
import { LocationSidebar } from "../sidebar/location-sidebar";
import { MapController } from "./map-controller";
import { ChevronLeft } from "lucide-react";
import { useResponsiveView } from "@/hooks/useResponsiveView";
import { DetailSidePanel } from "./detail-side-panel";
import { LocationMarker } from "./location-marker";
import useSWR from "swr";

// Map default settings
const DEFAULT_CENTER: [number, number] = [48.7519, 8.55];
const DEFAULT_ZOOM = 14;

// Fetch function for SWR
const fetcher = (url: string) => fetch(url).then((res) => {
  if (!res.ok) throw new Error(`Server responded with ${res.status}`);
  return res.json();
});

const LocationMap: React.FC = () => {
    const { data: locations = [], error } = useSWR<Location[]>("/api/locations/get", fetcher, {
      revalidateOnFocus: false,
      dedupingInterval: 60000 // 1 minute
    });
    const isLoading = !locations && !error;
    
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
    const [detailPanelOpen, setDetailPanelOpen] = useState(false);
    const [detailLocation, setDetailLocation] = useState<Location | null>(null);
    const { isMobile, view, setView } = useResponsiveView();

    // Track map visibility for proper resizing
    const isMapVisible = !isMobile || (isMobile && view === "map");

    const handleLocationSelect = useCallback(
        (location: Location) => {
            setSelectedLocation(location);
            if (isMobile) setView("map");
        },
        [isMobile, setView]
    );

    const handleViewDetails = useCallback((location: Location) => {
        setDetailLocation(location);
        setDetailPanelOpen(true);
    }, []);

    const handleCloseDetails = useCallback(() => {
        setDetailPanelOpen(false);
    }, []);

    const resetSelection = useCallback(() => {
        setSelectedLocation(null);
        if (isMobile) setView("sidebar");
    }, [isMobile, setView]);
    
    // Memoize markers to prevent unnecessary re-renders
    const selectedMarker = useMemo(() => {
      if (!selectedLocation || isLoading) return null;
      
      return (
        <LocationMarker
          key={selectedLocation.id}
          location={selectedLocation}
          onSelect={handleLocationSelect}
          onViewDetails={handleViewDetails}
        />
      );
    }, [selectedLocation, isLoading, handleLocationSelect, handleViewDetails]);    if (error) {
        return (
            <div className="fixed inset-0 flex flex-col items-center justify-center bg-white" role="alert">
                <div className="text-red-500 mb-4">Fehler beim Laden der Standorte. Bitte versuchen Sie es erneut.</div>
                <button
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    onClick={() => window.location.reload()}
                    type="button"
                >
                    Erneut versuchen
                </button>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 flex flex-col md:flex-row">
            {/* Sidebar */}
            <div
                className={`${
                    isMobile ? (view === "sidebar" ? "flex" : "hidden") : "flex w-1/5"
                } md:block h-full`}
                role="complementary"
                aria-label="Liste der barrierefreien Orte"
            >
                <LocationSidebar
                    locations={locations}
                    selectedLocation={selectedLocation}
                    onLocationSelect={handleLocationSelect}
                    isLoading={isLoading}
                    className="w-full"
                />
            </div>

            {/* Map */}
            <div
                className={`${
                    isMobile ? (view === "map" ? "flex" : "hidden") : "flex w-4/5"
                } md:block h-full relative`}
                style={{
                    height: "100%",
                    width: isMobile && view === "map" ? "100%" : "80%",
                }}
                role="application"
                aria-label="Interaktive Karte der barrierefreien Orte in Bad Wildbad"
            >
                {isMobile && view === "map" && (
                    <button
                        onClick={resetSelection}
                        className="absolute top-4 left-4 z-[1000] bg-white p-2 rounded-full shadow-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        aria-label="Zurück zur Ortsliste"
                        type="button"
                    >
                        <ChevronLeft size={24} aria-hidden="true" />
                    </button>
                )}

                <MapContainer
                    key="map-container"
                    center={DEFAULT_CENTER}
                    zoom={DEFAULT_ZOOM}
                    className="h-full w-full"
                    zoomControl={false}
                    attributionControl={true}
                    scrollWheelZoom={true}
                    style={{ height: "100%", width: "100%" }}
                >
                    {!isMobile && <ZoomControl position="topleft" />}
                    <MapController
                        selectedLocation={selectedLocation}
                        defaultCenter={DEFAULT_CENTER}
                        defaultZoom={DEFAULT_ZOOM}
                        isMobile={isMobile}
                        isVisible={isMapVisible}
                    />
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    />
                    {selectedMarker}
                </MapContainer>                {selectedLocation && !isMobile && (
                    <button
                        onClick={resetSelection}
                        className="absolute top-4 right-4 z-[1000] bg-white px-4 py-2 rounded-md shadow-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        type="button"
                        aria-label="Auswahl zurücksetzen"
                    >
                        Auswahl zurücksetzen
                    </button>
                )}

                <DetailSidePanel
                    location={detailLocation}
                    isOpen={detailPanelOpen}
                    onClose={handleCloseDetails}
                />
            </div>
        </div>
    );
};

export default React.memo(LocationMap);
