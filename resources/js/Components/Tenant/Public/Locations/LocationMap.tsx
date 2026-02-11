import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface LocationMapProps {
    latitude: number;
    longitude: number;
}

export default function LocationMap({ latitude, longitude }: LocationMapProps) {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<L.Map | null>(null);

    useEffect(() => {
        if (!mapContainerRef.current) return;

        // Initialize map if not already present
        if (!mapInstance.current) {
            mapInstance.current = L.map(mapContainerRef.current, {
                center: [latitude, longitude],
                zoom: 15,
                zoomControl: false,
                dragging: false,
                scrollWheelZoom: false,
                doubleClickZoom: false,
                touchZoom: false,
                attributionControl: false
            });

            L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            }).addTo(mapInstance.current);

            L.marker([latitude, longitude]).addTo(mapInstance.current);
        } else {
            // Update view if props change
            mapInstance.current.setView([latitude, longitude], 15);

            // Clear existing layers/markers (simplified for now as we recreate map usually per component/key if list changes, but good practice)
            mapInstance.current.eachLayer((layer) => {
                if (layer instanceof L.Marker) {
                    mapInstance.current?.removeLayer(layer);
                }
            });
            L.marker([latitude, longitude]).addTo(mapInstance.current);
        }

        // Cleanup on unmount
        // Note: Intentional decision NOT to destroy map on re-renders, only on unmount which React handles via ref check
        return () => {
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
            }
        };
    }, [latitude, longitude]);

    return (
        <div ref={mapContainerRef} className="w-full h-full z-0 pointer-events-none grayscale-[20%]" />
    );
}
