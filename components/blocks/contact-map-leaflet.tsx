"use client";

import L from "leaflet";
import { useEffect, useRef } from "react";

/* ---------- Leaflet CSS (loaded once via CDN) ---------- */
const LEAFLET_CSS_ID = "leaflet-css";
const LEAFLET_CSS_HREF = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";

function useLeafletCSS() {
    useEffect(() => {
        if (document.getElementById(LEAFLET_CSS_ID)) return;
        const link = document.createElement("link");
        link.id = LEAFLET_CSS_ID;
        link.rel = "stylesheet";
        link.href = LEAFLET_CSS_HREF;
        link.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
        link.crossOrigin = "";
        document.head.appendChild(link);
    }, []);
}

/* ---------- Fix default marker icons for bundlers ---------- */
// Leaflet's default icon paths break with Webpack/Turbopack; point to CDN copies.
const DefaultIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

/* ---------- Exported map component ---------- */
interface LeafletMapProps {
    lat: number;
    lng: number;
    zoom: number;
    address: string;
}

export function LeafletMap({ lat, lng, zoom, address }: LeafletMapProps) {
    useLeafletCSS();
    const containerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<L.Map | null>(null);
    const markerRef = useRef<L.Marker | null>(null);

    // Initialize Leaflet once, then update view/marker on prop changes.
    useEffect(() => {
        if (!containerRef.current) return;

        if (!mapRef.current) {
            const map = L.map(containerRef.current, {
                center: [lat, lng],
                zoom,
                scrollWheelZoom: false,
            });

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution:
                    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            }).addTo(map);

            const marker = L.marker([lat, lng]).addTo(map);
            marker.bindPopup(address);

            mapRef.current = map;
            markerRef.current = marker;
            return;
        }

        mapRef.current.setView([lat, lng], zoom);
        if (markerRef.current) {
            markerRef.current.setLatLng([lat, lng]);
            markerRef.current.setPopupContent(address);
        }
    }, [lat, lng, zoom, address]);

    useEffect(() => {
        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
            markerRef.current = null;
        };
    }, []);

    return <div ref={containerRef} className="w-full aspect-[16/9] rounded-lg z-0" />;
}
