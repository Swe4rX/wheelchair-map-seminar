import React from "react";
import {Location} from "../map-types";
import {StarRating} from "../ui/star-rating";

interface LocationPopupProps {
	location: Location;
}

export const LocationPopup: React.FC<LocationPopupProps> = ({location}) => {
	const thumbnail = location.images && location.images.length > 0
		? location.images[0]
		: null;
	
	return (
		<div className="max-w-xs">
			<h3 className="font-bold text-lg mb-2">{location.name}</h3>
			{thumbnail && (
				<img
					src={thumbnail.url}
					alt={location.name}
					className="w-full h-32 object-cover rounded-md mb-2"
				/>
			)}
			<StarRating rating={location.rating} className="mb-2" />
			<p className="text-sm text-gray-600">{location.description}</p>
		</div>
	);
};
