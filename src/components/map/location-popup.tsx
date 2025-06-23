// location-popup.tsx
import React from "react";
import { Location } from "../map-types";
import { StarRating } from "../ui/star-rating";

interface LocationPopupProps {
    location: Location;
    onShowDetails: (location: Location) => void;
}

export const LocationPopup: React.FC<LocationPopupProps> = ({
    location,
    onShowDetails
}) => {
    const thumbnail = location.images && location.images.length > 0
        ? location.images[0]
        : null;

    const handleButtonClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onShowDetails(location);
    };

    return (
        <div className="w-full">
            <h3 className="font-bold text-lg mb-2">{location.name}</h3>
            {thumbnail && (
                <img
                    src={thumbnail.url}
                    alt={location.name}
                    className="w-full h-64 object-cover rounded-md mb-2"
                />
            )}
            <StarRating rating={location.rating} className="mb-2" />
            <p className="text-sm text-gray-600 mb-3 line-clamp-3">{location.description}</p>
            
            <button
                onClick={handleButtonClick}
                className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
            >
                Bilder & Details ansehen
            </button>
        </div>
    );
};
