'use client'

import React from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Star } from 'lucide-react'
import L from 'leaflet'
import { locations } from '@/config/location'

const LocationMap = () => {
  return (
    <div className="fixed inset-0">
      <MapContainer
        center={[48.7519, 8.5500]}
        zoom={14}
        className="h-full w-full"
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        {locations.map((location) => (
          <Marker
            key={location.id}
            position={location.position}
            icon={L.icon(location.marker)}
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
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={`inline ${
                        i < location.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">{location.rating}/5</span>
                </div>
                <p className="text-sm text-gray-600">{location.description}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}

export default LocationMap