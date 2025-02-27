"use client";

import dynamic from "next/dynamic";

const LocationMap = dynamic(() => import("./map/location-map"), {
  ssr: false,
  loading: () => (
    <div className="w-full max-w-4xl h-96 bg-gray-100 animate-pulse rounded-lg" />
  ),
});

const LocationMapWrapper = () => {
  return <LocationMap />;
};

export default LocationMapWrapper;
