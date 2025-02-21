import { Location } from '@/components/map-types';

export const locations: Location[] = [
	{
		id: 1,
		position: [48.7519, 8.5500],
		name: "Palais Thermal",
		rating: 4.5,
		description: "Historic thermal bath house",
		imageUrl: "/api/placeholder/300/200",
		marker: {
			iconUrl: '/markers/marker-icon.png',  // Put your marker image in public/markers/
			iconSize: [25, 41],              // Width and height of the icon
			iconAnchor: [16, 32],            // Point of the icon that corresponds to marker's location (usually bottom middle)
			popupAnchor: [0, -32],           // Point from which the popup should open relative to the iconAnchor
		}
	},
	{
		id: 2,
		position: [48.7530, 8.5480],
		name: "Sommerbergbahn",
		rating: 4.2,
		description: "Funicular railway with panoramic views",
		imageUrl: "/api/placeholder/300/200",
		marker: {
			iconUrl: '/markers/marker-icon.png',
			iconSize: [25, 41],
			iconAnchor: [16, 32],
			popupAnchor: [0, -32],
		}
	},
	// Add more locations here...
];