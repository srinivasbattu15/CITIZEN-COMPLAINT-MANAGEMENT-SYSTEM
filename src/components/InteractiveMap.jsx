import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Search, Navigation, Compass, MapPin, Loader2, Check } from 'lucide-react';

export const InteractiveMap = ({
  center = [28.6139, 77.2090],
  zoom = 13,
  interactive = false,
  onLocationSelect = null,
  complaints = []
}) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [locating, setLocating] = useState(false);
  const [addressResult, setAddressResult] = useState('');

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        zoomControl: false
      }).setView(center, zoom);

      L.control.zoom({ position: 'topright' }).addTo(map);

      // Real World OpenStreetMap Tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear existing markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    if (interactive) {
      const customPin = L.divIcon({
        className: 'custom-map-pin',
        html: `<div class="w-9 h-9 rounded-full bg-rose-600 text-white border-2 border-white shadow-2xl flex items-center justify-center font-bold animate-bounce text-sm">📍</div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 36]
      });

      const marker = L.marker(center, { draggable: true, icon: customPin }).addTo(map);
      markerRef.current = marker;

      // Handle Dragend
      marker.on('dragend', async () => {
        const pos = marker.getLatLng();
        map.panTo(pos);
        await reverseGeocode(pos.lat, pos.lng);
      });

      // Handle Map Click
      map.on('click', async (e) => {
        marker.setLatLng(e.latlng);
        map.panTo(e.latlng);
        await reverseGeocode(e.latlng.lat, e.latlng.lng);
      });
    }

    // Display Complaint Pins (City Overview Mode)
    if (complaints && complaints.length > 0) {
      complaints.forEach((c) => {
        if (c.lat && c.lng) {
          let badgeColor = 'bg-sky-600';
          if (c.status === 'Resolved') badgeColor = 'bg-emerald-600';
          if (c.status === 'In Progress') badgeColor = 'bg-purple-600';
          if (c.priority === 'Emergency') badgeColor = 'bg-rose-600 animate-pulse';

          const icon = L.divIcon({
            className: 'custom-complaint-marker',
            html: `<div class="w-8 h-8 rounded-full ${badgeColor} text-white border-2 border-white shadow-lg flex items-center justify-center text-xs font-bold">●</div>`,
            iconSize: [32, 32],
            iconAnchor: [16, 16]
          });

          const popupHtml = `
            <div class="p-2 min-w-[200px]">
              <div class="text-[10px] font-mono font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200 inline-block mb-1">${c.id}</div>
              <h4 class="font-bold text-sm text-slate-900 leading-snug">${c.title}</h4>
              <div class="text-xs text-slate-600 mt-1 flex items-center"><span className="mr-1">📍</span>${c.location}</div>
              <div class="mt-2 inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full bg-slate-100 text-slate-800 border border-slate-200">${c.status}</div>
            </div>
          `;

          L.marker([c.lat, c.lng], { icon })
            .addTo(map)
            .bindPopup(popupHtml);
        }
      });
    }

  }, [center, zoom, interactive, complaints]);

  // Reverse Geocoding using Nominatim OpenStreetMap API
  const reverseGeocode = async (lat, lng) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      if (res.ok) {
        const data = await res.json();
        const addressName = data.display_name || `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`;
        setAddressResult(addressName);
        if (onLocationSelect) {
          onLocationSelect(lat, lng, addressName);
        }
      } else {
        if (onLocationSelect) onLocationSelect(lat, lng, `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
      }
    } catch (err) {
      if (onLocationSelect) onLocationSelect(lat, lng, `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
    }
  };

  // Real Place Search Handler (Nominatim Search API)
  const handlePlaceSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery.trim())}`);
      if (res.ok) {
        const results = await res.json();
        if (results && results.length > 0) {
          const first = results[0];
          const newLat = parseFloat(first.lat);
          const newLng = parseFloat(first.lon);

          const map = mapInstanceRef.current;
          if (map) {
            map.flyTo([newLat, newLng], 15, { duration: 1.5 });
            if (markerRef.current) {
              markerRef.current.setLatLng([newLat, newLng]);
            }
          }

          setAddressResult(first.display_name);
          if (onLocationSelect) {
            onLocationSelect(newLat, newLng, first.display_name);
          }
        }
      }
    } catch (err) {
      console.error('Real world place search failed:', err);
    } finally {
      setSearching(false);
    }
  };

  // Real GPS Geolocation Handler
  const handleDetectCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;

        const map = mapInstanceRef.current;
        if (map) {
          map.flyTo([userLat, userLng], 16, { duration: 1.5 });
          if (markerRef.current) {
            markerRef.current.setLatLng([userLat, userLng]);
          }
        }

        await reverseGeocode(userLat, userLng);
        setLocating(false);
      },
      (error) => {
        console.error('GPS error:', error);
        alert('Could not detect current GPS location. Please check browser location permissions.');
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="relative w-full h-full min-h-[350px] rounded-2xl overflow-hidden shadow-inner border border-slate-300 group">
      
      {/* Real-World Place Search Bar Overlay (Interactive Mode) */}
      {interactive && (
        <div className="absolute top-3 left-3 right-14 z-[1000] flex flex-col sm:flex-row items-center gap-2">
          <form onSubmit={handlePlaceSearch} className="flex-1 w-full flex items-center bg-white/95 backdrop-blur-md rounded-xl p-1.5 shadow-lg border border-slate-300">
            <Search className="w-4 h-4 text-slate-400 ml-2.5 shrink-0" />
            <input
              type="text"
              placeholder="Search real-world place (e.g. Hyderabad, Anurag University, Connaught Place)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-1.5 text-xs text-slate-900 font-semibold bg-transparent focus:outline-none"
            />
            <button
              type="submit"
              disabled={searching}
              className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-lg shadow shrink-0 flex items-center space-x-1"
            >
              {searching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <span>Search</span>}
            </button>
          </form>

          {/* Detect Current Real GPS Location Button */}
          <button
            type="button"
            onClick={handleDetectCurrentLocation}
            disabled={locating}
            title="Detect My Real Current GPS Location"
            className="w-full sm:w-auto px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg flex items-center justify-center space-x-1.5 shrink-0 backdrop-blur-md transition-transform active:scale-95"
          >
            {locating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Navigation className="w-4 h-4" />
            )}
            <span>Use My GPS</span>
          </button>
        </div>
      )}

      {/* Map Element */}
      <div ref={mapContainerRef} className="w-full h-full min-h-[350px]" />

      {/* Address Tooltip Overlay */}
      {interactive && addressResult && (
        <div className="absolute bottom-3 left-3 right-3 z-[1000] bg-slate-900/90 backdrop-blur-md text-white px-3.5 py-2 rounded-xl text-xs font-medium border border-slate-700 shadow-xl flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-rose-400 shrink-0 animate-bounce" />
          <span className="truncate flex-1 font-semibold">{addressResult}</span>
        </div>
      )}
    </div>
  );
};
