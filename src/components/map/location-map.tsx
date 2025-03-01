"use client";

import React, {useEffect, useState, useCallback} from "react";
import {MapContainer, TileLayer, ZoomControl} from "react-leaflet";
import {Location} from "../map-types";
import {LocationSidebar} from "../sidebar/location-sidebar";
import {MapController} from "./map-controller";
import {LocationMarker} from "./location-marker";
import {ChevronLeft} from "lucide-react";
import {useResponsiveView} from "@/hooks/useResponsiveView";

// Map default settings
const DEFAULT_CENTER: [number, number] = [48.7519, 8.55];
const DEFAULT_ZOOM = 14;

const LocationMap: React.FC = () => {
	const [locations, setLocations] = useState<Location[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
	const {isMobile, view, setView} = useResponsiveView();
	
	// Track map visibility for proper resizing
	const isMapVisible = !isMobile || (isMobile && view === "map");
	
	// Fetch locations data
	useEffect(() => {
		const fetchLocations = async () => {
			try {
				setIsLoading(true);
				const response = await fetch("/api/locations/get");
				
				if (!response.ok) {
					throw new Error(`Server responded with ${response.status}`);
				}
				
				const data: Location[] = await response.json();
				setLocations(data);
				setError(null);
			}
			catch (err) {
				console.error("Error fetching locations:", err);
				setError("Failed to load locations. Please try again later.");
			}
			finally {
				setIsLoading(false);
			}
		};
		
		fetchLocations();
	}, []);
	
	const handleLocationSelect = useCallback(
		(location: Location) => {
			setSelectedLocation(location);
			if (isMobile) setView("map");
		},
		[isMobile, setView]
	);
	
	const resetSelection = useCallback(() => {
		setSelectedLocation(null);
		if (isMobile) setView("sidebar");
	}, [isMobile, setView]);
	
	if (error) {
		return (
			<div className="fixed inset-0 flex flex-col items-center justify-center bg-white">
				<div className="text-red-500 mb-4">{error}</div>
				<button
					className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
					onClick={() => window.location.reload()}
				>
					Try Again
				</button>
			</div>
		);
	}
	
	return (
		<div className="fixed inset-0 flex flex-col md:flex-row">
			{/* Sidebar - hidden on mobile when viewing map */}
			<div
				className={`${
					isMobile ? (view === "sidebar" ? "flex" : "hidden") : "flex w-1/5"
				} md:block h-full`}
			>
				<LocationSidebar
					locations={locations}
					selectedLocation={selectedLocation}
					onLocationSelect={handleLocationSelect}
					isLoading={isLoading}
					className="w-full"
				/>
			</div>
			
			{/* Map - hidden on mobile when viewing sidebar */}
			<div
				className={`${
					isMobile ? (view === "map" ? "flex" : "hidden") : "flex w-4/5"
				} md:block h-full relative`}
				style={{
					height: "100%",
					width: isMobile && view === "map" ? "100%" : "80%",
				}}
			>
				{/* Back button - only on mobile when map is shown */}
				{isMobile && view === "map" && (
					<button
						onClick={resetSelection}
						className="absolute top-4 left-4 z-[1000] bg-white p-2 rounded-full shadow-md"
						aria-label="Back to location list"
					>
						<ChevronLeft size={24} />
					</button>
				)}
				
				<MapContainer
					center={DEFAULT_CENTER}
					zoom={DEFAULT_ZOOM}
					className="h-full w-full"
					zoomControl={false}
					attributionControl={true}
					scrollWheelZoom={true}
					doubleClickZoom={true}
					touchZoom={true}
					dragging={true}
					style={{height: "100%", width: "100%"}}
				>
					{/* Only add ZoomControl component on desktop */}
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
					{/* Only render marker for selected location */}
					{!isLoading && selectedLocation && (
						<LocationMarker
							key={selectedLocation.id}
							location={selectedLocation}
							onSelect={handleLocationSelect}
						/>
					)}
				</MapContainer>
				
				{/* Reset selection button - only shown on desktop when a location is selected */}
				{selectedLocation && !isMobile && (
					<button
						onClick={resetSelection}
						className="absolute top-4 right-4 z-[1000] bg-white px-4 py-2 rounded-md shadow-md"
					>
						Auswahl zurücksetzen
					</button>
				)}
			</div>
		</div>
	);
};

export default LocationMap;
