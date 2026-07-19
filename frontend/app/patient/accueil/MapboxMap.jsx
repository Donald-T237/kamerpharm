'use client';

import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

const accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export default function MapboxMap({ pharmacies, userLocation, selectedPharmacy, onSelectPharmacy }) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (!userLocation || !mapContainerRef.current) return;
    if (!accessToken) {
      console.error('Mapbox token manquant : définissez NEXT_PUBLIC_MAPBOX_TOKEN.');
      return;
    }

    mapboxgl.accessToken = accessToken;

    if (!mapRef.current) {
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [userLocation.lng, userLocation.lat],
        zoom: 12
      });

      mapRef.current = map;
      map.addControl(new mapboxgl.NavigationControl(), 'top-right');

      const userMarker = new mapboxgl.Marker({ color: '#1d9157' })
        .setLngLat([userLocation.lng, userLocation.lat])
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setText('votre position'))
        .addTo(map);

      map.on('load', () => {
        updateMarkers(map, pharmacies, selectedPharmacy, onSelectPharmacy, markersRef);
        if (selectedPharmacy) {
          drawRoute(map, userLocation, selectedPharmacy);
        }
      });
    }

    return () => {
      if (mapRef.current) {
        // Ne pas supprimer le mapRef entier, sinon React pourrait perdre l'instance
      }
    };
  }, [userLocation]);

  useEffect(() => {
    if (!mapRef.current || !mapRef.current.loaded()) return;
    updateMarkers(mapRef.current, pharmacies, selectedPharmacy, onSelectPharmacy, markersRef);
  }, [pharmacies, selectedPharmacy, onSelectPharmacy]);

  useEffect(() => {
    if (!mapRef.current || !userLocation) return;
    if (selectedPharmacy) {
      drawRoute(mapRef.current, userLocation, selectedPharmacy);
    } else {
      fitMapToBounds(mapRef.current, pharmacies, userLocation);
    }
  }, [selectedPharmacy, pharmacies, userLocation]);

  return (
    <div className="h-full rounded-3xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm">
      <div ref={mapContainerRef} className="h-full w-full" />
    </div>
  );
}

function updateMarkers(map, pharmacies, selectedPharmacy, onSelectPharmacy, markersRef) {
  markersRef.current.forEach((marker) => marker.remove());
  markersRef.current = [];

  pharmacies.forEach((pharmacy) => {
    const coords = pharmacy.location?.coordinates;
    if (!coords || coords.length !== 2) return;

    const [lng, lat] = coords;
    const markerElement = document.createElement('button');
    markerElement.type = 'button';
    markerElement.className = 'rounded-full border border-white shadow-lg';
    markerElement.style.width = '18px';
    markerElement.style.height = '18px';
    markerElement.style.backgroundColor = pharmacy.isOpen ? '#16a34a' : '#dc2626';
    markerElement.style.cursor = 'pointer';

    const marker = new mapboxgl.Marker({ element: markerElement, anchor: 'center' })
      .setLngLat([lng, lat])
      .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`<strong>${pharmacy.name}</strong><br/>${pharmacy.displayStatus || 'Statut inconnu'}<br/>${pharmacy.distance || ''}`))
      .addTo(map);

    markerElement.addEventListener('click', () => {
      onSelectPharmacy(pharmacy);
    });

    markersRef.current.push(marker);
  });

  fitMapToBounds(map, pharmacies, map.getCenter());
}

function fitMapToBounds(map, pharmacies, userLocation) {
  if (!pharmacies?.length) {
    if (userLocation) {
      map.flyTo({ center: [userLocation.lng, userLocation.lat], zoom: 12 });
    }
    return;
  }

  const bounds = new mapboxgl.LngLatBounds();
  pharmacies.forEach((pharmacy) => {
    const coords = pharmacy.location?.coordinates;
    if (coords?.length === 2) {
      bounds.extend(coords);
    }
  });

  if (userLocation) {
    bounds.extend([userLocation.lng, userLocation.lat]);
  }

  if (!bounds.isEmpty()) {
    map.fitBounds(bounds, { padding: 80, maxZoom: 14, duration: 1200 });
  }
}

async function drawRoute(map, userLocation, selectedPharmacy) {
  if (!selectedPharmacy || !userLocation) return;

  const destination = selectedPharmacy.location?.coordinates;
  if (!destination || destination.length !== 2) return;

  const originString = `${userLocation.lng},${userLocation.lat}`;
  const destinationString = `${destination[0]},${destination[1]}`;
  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${originString};${destinationString}?geometries=geojson&overview=full&annotations=duration,distance&access_token=${accessToken}`;

  try {
    const response = await fetch(url);
    const directionData = await response.json();
    const route = directionData.routes?.[0]?.geometry;

    if (!route) return;

    const routeFeature = {
      type: 'Feature',
      geometry: route
    };

    if (map.getSource('route')) {
      map.getSource('route').setData(routeFeature);
    } else {
      map.addSource('route', {
        type: 'geojson',
        data: routeFeature
      });

      map.addLayer({
        id: 'route-line',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#134e4a',
          'line-width': 5,
          'line-opacity': 0.9
        }
      });
    }

    const bounds = new mapboxgl.LngLatBounds();
    bounds.extend([userLocation.lng, userLocation.lat]);
    bounds.extend(destination);
    map.fitBounds(bounds, { padding: 100, maxZoom: 14, duration: 1200 });
  } catch (error) {
    console.error('Erreur de tracé d itinéraire Mapbox :', error);
  }
}
