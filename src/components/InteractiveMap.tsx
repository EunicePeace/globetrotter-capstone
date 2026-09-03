import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  MapPin, 
  Bookmark, 
  Navigation, 
  WifiOff, 
  Compass, 
  Check, 
  Clock, 
  DollarSign, 
  Layers,
  Sparkles
} from 'lucide-react';
import { Site } from '../types';

interface InteractiveMapProps {
  sites: Site[];
  pinnedSiteIds: string[];
  onTogglePin: (siteId: string) => void;
  onSelectSite: (site: Site) => void;
  isOffline: boolean;
  currency: 'XAF' | 'USD';
}

const STARTING_HUBS = [
  { id: 'post-office', name: 'Place Ananass / Post Office (Centre-Ville)', coords: { lat: 3.8670, lng: 11.5210 } },
  { id: 'ict-u', name: 'The ICT University Campus (Messassi)', coords: { lat: 3.9350, lng: 11.5310 } },
  { id: 'mvan', name: 'Mvan VIP Bus Station (South Hub)', coords: { lat: 3.8320, lng: 11.5180 } },
  { id: 'bastos', name: 'Carrefour Bastos (Diplomatic Area)', coords: { lat: 3.8910, lng: 11.5150 } }
];

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  sites,
  pinnedSiteIds,
  onTogglePin,
  onSelectSite,
  isOffline,
  currency
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const routeLineRef = useRef<L.Polyline | null>(null);

  const [selectedHub, setSelectedHub] = useState(STARTING_HUBS[0]);
  const [activeSiteForRoute, setActiveSiteForRoute] = useState<Site | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [onlyPinned, setOnlyPinned] = useState(false);

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Centered at Yaoundé
      const map = L.map(mapContainerRef.current, {
        center: [3.8667, 11.5167],
        zoom: 13,
        zoomControl: true
      });

      // OpenStreetMap tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | GlobeTrotter Yaoundé',
        maxZoom: 19
      }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Markers & Polylines when sites, pinnedSiteIds, or filter changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();

    // Filter sites to display
    const displayedSites = sites.filter((site) => {
      const matchesCat = filterCategory === 'All' || site.category === filterCategory;
      const matchesPinned = !onlyPinned || pinnedSiteIds.includes(site.id);
      return matchesCat && matchesPinned;
    });

    // Add Starting Hub Marker
    const hubIcon = L.divIcon({
      className: 'custom-hub-marker',
      html: `<div style="background-color: #10b981; color: white; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 3px solid white; shadow: 0 4px 6px rgba(0,0,0,0.3);">📍</div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });

    L.marker([selectedHub.coords.lat, selectedHub.coords.lng], { icon: hubIcon })
      .bindPopup(`<b>Start Hub: ${selectedHub.name}</b>`)
      .addTo(markersLayer);

    // Add Site Markers
    displayedSites.forEach((site) => {
      const isPinned = pinnedSiteIds.includes(site.id);
      const markerColor = isPinned ? '#f59e0b' : '#3b82f6';

      const iconHtml = `<div style="background-color: ${markerColor}; color: white; border-radius: 12px; padding: 4px 8px; font-size: 11px; font-weight: bold; border: 2px solid white; white-space: nowrap; box-shadow: 0 4px 10px rgba(0,0,0,0.3); display: flex; align-items: center; gap: 4px;">
        ${isPinned ? '📌' : '📍'} ${site.name.substring(0, 18)}${site.name.length > 18 ? '...' : ''}
      </div>`;

      const customIcon = L.divIcon({
        className: 'custom-site-marker',
        html: iconHtml,
        iconSize: [120, 24],
        iconAnchor: [60, 12]
      });

      const marker = L.marker([site.coordinates.lat, site.coordinates.lng], { icon: customIcon });

      const price = currency === 'XAF'
        ? `${site.priceEstimateXAF.toLocaleString()} FCFA`
        : `$${site.priceEstimateUSD.toFixed(2)}`;

      const popupContent = document.createElement('div');
      popupContent.className = 'p-1 font-sans text-xs space-y-2';
      popupContent.innerHTML = `
        <div style="font-weight: bold; font-size: 14px; color: #0f172a;">${site.name}</div>
        <div style="font-size: 11px; color: #64748b; italic;">${site.frenchName}</div>
        <div style="font-size: 11px; color: #047857; font-weight: 600;">📍 ${site.quarter} • ${price}</div>
        <p style="font-size: 11px; color: #334155; max-width: 200px; line-clamp: 2;">${site.description.substring(0, 100)}...</p>
      `;

      // Popup Action Buttons inside Leaflet
      const btnContainer = document.createElement('div');
      btnContainer.className = 'flex gap-2 pt-1';

      const detailBtn = document.createElement('button');
      detailBtn.className = 'px-2 py-1 bg-emerald-600 text-white rounded font-bold text-[10px]';
      detailBtn.innerText = 'View Backstory';
      detailBtn.onclick = () => onSelectSite(site);

      const routeBtn = document.createElement('button');
      routeBtn.className = 'px-2 py-1 bg-amber-500 text-slate-950 rounded font-bold text-[10px]';
      routeBtn.innerText = 'Draw Route';
      routeBtn.onclick = () => setActiveSiteForRoute(site);

      btnContainer.appendChild(detailBtn);
      btnContainer.appendChild(routeBtn);
      popupContent.appendChild(btnContainer);

      marker.bindPopup(popupContent);
      markersLayer.addLayer(marker);
    });

    // Draw route line if active site selected for route
    if (routeLineRef.current) {
      map.removeLayer(routeLineRef.current);
      routeLineRef.current = null;
    }

    if (activeSiteForRoute) {
      const latlngs: [number, number][] = [
        [selectedHub.coords.lat, selectedHub.coords.lng],
        [activeSiteForRoute.coordinates.lat, activeSiteForRoute.coordinates.lng]
      ];

      const polyline = L.polyline(latlngs, {
        color: '#10b981',
        weight: 4,
        dashArray: '8, 8',
        opacity: 0.9
      }).addTo(map);

      routeLineRef.current = polyline;
      map.fitBounds(polyline.getBounds(), { padding: [50, 50] });
    }
  }, [sites, pinnedSiteIds, selectedHub, activeSiteForRoute, filterCategory, onlyPinned, currency, onSelectSite]);

  return (
    <div className="space-y-4">
      {/* Map Control Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Starting Hub Selector */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-blue-700 flex items-center gap-1">
              <Navigation className="w-4 h-4 text-blue-600" /> Start Hub:
            </span>
            <select
              value={selectedHub.id}
              onChange={(e) => {
                const hub = STARTING_HUBS.find((h) => h.id === e.target.value);
                if (hub) setSelectedHub(hub);
              }}
              className="bg-slate-50 text-slate-800 rounded-md px-2.5 py-1.5 border border-slate-200 text-xs focus:outline-none"
            >
              {STARTING_HUBS.map((h) => (
                <option key={h.id} value={h.id}>{h.name}</option>
              ))}
            </select>
          </div>

          {/* Offline Mode Indicator */}
          {isOffline && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold">
              <WifiOff className="w-3.5 h-3.5 text-amber-600" />
              <span>Offline Map Cache Active (IndexedDB)</span>
            </div>
          )}

          {/* Filter Pinned Locations Only */}
          <button
            onClick={() => setOnlyPinned(!onlyPinned)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md font-semibold text-xs transition-colors border ${
              onlyPinned
                ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 fill-current" />
            <span>Pinned Only ({pinnedSiteIds.length})</span>
          </button>
        </div>

        {/* Selected Route Info Bar */}
        {activeSiteForRoute && (
          <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600 animate-spin" />
              <span className="text-slate-700">
                Route from <strong className="text-slate-900">{selectedHub.name.split('(')[0]}</strong> to <strong className="text-blue-700">{activeSiteForRoute.name}</strong>
              </span>
            </div>
            <div className="flex items-center gap-3 font-semibold">
              <span className="text-amber-800">⏳ ~{activeSiteForRoute.estimatedTimeMinutes} mins</span>
              <span className="text-emerald-700">💵 {activeSiteForRoute.priceEstimateXAF.toLocaleString()} FCFA</span>
              <button
                onClick={() => setActiveSiteForRoute(null)}
                className="text-slate-500 hover:text-slate-800 underline ml-2"
              >
                Clear Route
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Map Container */}
      <div className="relative rounded-xl overflow-hidden border border-slate-200 shadow-xs bg-slate-100 h-[520px] z-10">
        <div ref={mapContainerRef} className="w-full h-full" />
      </div>

      {/* Pinned Quick Locations Drawer */}
      {pinnedSiteIds.length > 0 && (
        <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-2.5 shadow-xs">
          <h4 className="text-xs font-bold text-amber-700 flex items-center gap-1.5">
            <Bookmark className="w-4 h-4 fill-amber-500 text-amber-500" />
            Your Pinned Navigation Favorites ({pinnedSiteIds.length})
          </h4>
          <div className="flex items-center gap-2.5 overflow-x-auto pb-1 no-scrollbar">
            {sites.filter((s) => pinnedSiteIds.includes(s.id)).map((s) => (
              <div
                key={s.id}
                onClick={() => onSelectSite(s)}
                className="shrink-0 w-56 bg-slate-50 p-2.5 rounded-lg border border-slate-200 hover:border-blue-500 cursor-pointer transition-all space-y-1 shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 line-clamp-1">{s.name}</span>
                  <span className="text-[10px] text-amber-700 font-bold">{s.quarter}</span>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-1">{s.routeDirections}</p>
                <div className="flex items-center justify-between text-[10px] text-blue-700 font-semibold pt-1 border-t border-slate-200">
                  <span>⏱ {s.estimatedTimeMinutes}m away</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveSiteForRoute(s);
                    }}
                    className="text-amber-700 hover:underline font-bold"
                  >
                    Draw Path →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
