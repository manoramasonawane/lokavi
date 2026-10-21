import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { LocalShop } from '../types/shops.js';
import { getGoogleMapsDirectionsUrl } from '../utils/geo.js';

interface ShopMapViewProps {
  shops: LocalShop[];
  selectedShop: LocalShop | null;
  onSelectShop: (shop: LocalShop) => void;
  userCoords?: { lat: number; lng: number };
  userCityName?: string;
  center?: { lat: number; lng: number };
}

export const ShopMapView: React.FC<ShopMapViewProps> = ({
  shops,
  selectedShop,
  onSelectShop,
  userCoords,
  userCityName,
  center,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Default center: userCoords or first shop or central India (Pune: 18.5204, 73.8567)
    const initialLat = center?.lat || userCoords?.lat || (shops[0] ? shops[0].coordinates.lat : 18.5204);
    const initialLng = center?.lng || userCoords?.lng || (shops[0] ? shops[0].coordinates.lng : 73.8567);

    // If map not initialized yet, create it
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: 12,
        zoomControl: true,
        scrollWheelZoom: true,
      });

      // Add OpenStreetMap tiles (free, reliable, no key needed)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;

    if (!map || !markersLayer) return;

    // Clear previous markers
    markersLayer.clearLayers();

    // 1. Add User Location Marker if available
    if (userCoords) {
      const userIcon = L.divIcon({
        className: 'custom-user-marker',
        html: `
          <div style="background-color: #1A3E31; color: white; border-radius: 50%; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.3); border: 2.5px solid white;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <circle cx="12" cy="12" r="3" fill="white"></circle>
            </svg>
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      });

      const userMarker = L.marker([userCoords.lat, userCoords.lng], { icon: userIcon });
      userMarker.bindPopup(`
        <div style="font-family: inherit; font-size: 12px; padding: 4px;">
          <strong style="color: #1A3E31; display: block; font-size: 13px;">📍 You Are Here</strong>
          <span style="color: #6B635B;">${userCityName || 'Active GPS reference'}</span>
        </div>
      `);
      markersLayer.addLayer(userMarker);
    }

    // 2. Add Shop Markers
    const bounds: L.LatLngBounds = L.latLngBounds([]);

    shops.forEach((shop) => {
      bounds.extend([shop.coordinates.lat, shop.coordinates.lng]);

      const isSelected = selectedShop?.id === shop.id;
      const markerColor = isSelected ? '#C85A32' : '#D97706';

      const shopIcon = L.divIcon({
        className: 'custom-shop-marker',
        html: `
          <div style="background-color: ${markerColor}; color: white; border-radius: 12px; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.25); border: 2px solid white; transition: transform 0.2s;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([shop.coordinates.lat, shop.coordinates.lng], { icon: shopIcon });

      const directionsUrl = getGoogleMapsDirectionsUrl(
        `${shop.name}, ${shop.locality}, ${shop.city}`,
        shop.coordinates.lat,
        shop.coordinates.lng,
        userCoords?.lat,
        userCoords?.lng
      );

      const popupHtml = `
        <div style="font-family: inherit; min-width: 200px; padding: 4px; color: #231F1D;">
          <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; color: #C85A32; letter-spacing: 0.5px;">
            ${shop.categoryLabel}
          </div>
          <h4 style="font-size: 13px; font-weight: 700; color: #1A3E31; margin: 2px 0 4px 0; line-height: 1.2;">
            ${shop.name}
          </h4>
          <p style="font-size: 11px; color: #6B635B; margin: 0 0 6px 0;">
            ${shop.address}, ${shop.city}
          </p>
          <div style="display: flex; gap: 6px; margin-top: 6px;">
            <a href="${directionsUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 4px 10px; background-color: #1A3E31; color: white; border-radius: 6px; text-decoration: none; font-size: 11px; font-weight: 600;">
              Directions ↗
            </a>
            ${shop.phone ? `<a href="tel:${shop.phone}" style="display: inline-block; padding: 4px 10px; background-color: #FAF2E6; color: #C85A32; border: 1px solid #E8DFC8; border-radius: 6px; text-decoration: none; font-size: 11px; font-weight: 600;">Call</a>` : ''}
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);
      marker.on('click', () => {
        onSelectShop(shop);
      });

      markersLayer.addLayer(marker);
    });

    // Fit bounds if multiple points exist
    if (userCoords) {
      bounds.extend([userCoords.lat, userCoords.lng]);
    }

    if (shops.length > 0 && bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }

    // Force tile recalculation after layout paints
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

  }, [shops, userCoords, center]);

  // Fly to selected shop if user clicks it in list
  useEffect(() => {
    if (selectedShop && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(
        [selectedShop.coordinates.lat, selectedShop.coordinates.lng],
        16,
        { duration: 1.2 }
      );
    }
  }, [selectedShop]);

  return (
    <div className="relative w-full h-[450px] sm:h-[520px] rounded-2xl overflow-hidden border border-[#E8DFC8] shadow-sm bg-[#FAF7F2]">
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Floating Map Legend */}
      <div className="absolute bottom-3 left-3 z-20 bg-white/95 backdrop-blur-md rounded-xl p-2.5 border border-[#E8DFC8] shadow-md text-xs space-y-1.5 hidden sm:block">
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-full bg-[#1A3E31] border border-white" />
          <span className="font-medium text-[#1A3E31]">Your Location</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-md bg-[#D97706] border border-white" />
          <span className="font-medium text-[#5A524A]">Local Business</span>
        </div>
        <div className="text-[10px] text-[#8C8275] pt-0.5 border-t border-[#F2ECE1]">
          Click pin to preview & navigate
        </div>
      </div>
    </div>
  );
};
