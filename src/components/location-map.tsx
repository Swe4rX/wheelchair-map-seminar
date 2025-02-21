'use client'

import React, {useState, useEffect} from 'react';
import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet';
import {Card, CardContent} from '@/components/ui/card';
import {Star} from 'lucide-react';
import L from 'leaflet';
import {Location, MapProps} from './map-types';
import {cn} from '@/lib/utils';
import {locations as locationData} from '@/config/location';

// Center coordinates for Bad Wildbad, Germany
const CENTER_POSITION: [number, number] = [48.7519, 8.5500];

const LocationMap = ({className}: MapProps) => {
	const [locations] = useState<Location[]>(locationData);
	
	const [mounted, setMounted] = useState(false);
	
	useEffect(() => {
		setMounted(true);
	}, []);
	
	const createIcon = (markerConfig: Location['marker']) => {
		return L.icon(markerConfig);
	};
	
	const renderStars = (rating: number) => {
		const stars = [];
		for (let i = 0; i < 5; i++) {
			stars.push(
				<Star
					key={i}
					size={16}
					className={`inline ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
				/>
			);
		}
		return stars;
	};
	
	if (!mounted) return null;
	
	return (
		<Card className={cn("w-full max-w-4xl", className)}>
			<CardContent>
				<div className="h-96 w-full">
					<MapContainer
						center={CENTER_POSITION}
						zoom={14}
						style={{height: '100%', width: '100%'}}
					>
						<TileLayer
							url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
							attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
						/>
						{locations.map((location) => (
							<Marker
								key={location.id}
								position={location.position}
								icon={createIcon(location.marker)}
							>
								<Popup>
									<div className="max-w-xs">
										<h3 className="font-bold text-lg mb-2">{location.name}</h3>
										<img
											src={location.imageUrl}
											alt={location.name}
											className="w-full h-32 object-cover rounded-md mb-2"
										/>
										<div className="mb-2">
											{renderStars(location.rating)}
											<span className="ml-2 text-sm text-gray-600">
                        {location.rating}/5
                      </span>
										</div>
										<p className="text-sm text-gray-600">{location.description}</p>
									</div>
								</Popup>
							</Marker>
						))}
					</MapContainer>
				</div>
			</CardContent>
		</Card>
	);
};

export default LocationMap;