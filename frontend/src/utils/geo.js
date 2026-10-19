import { useState, useEffect, useRef } from 'react';

const EARTH_RADIUS_METERS = 6371000;
const OSRM_BASE_URL = 'https://router.project-osrm.org/route/v1/driving';

function toRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

export function isValidCoordinate(coord) {
  return (
    Boolean(coord) &&
    typeof coord.latitude === 'number' &&
    typeof coord.longitude === 'number' &&
    Number.isFinite(coord.latitude) &&
    Number.isFinite(coord.longitude)
  );
}

export function calculateDistanceMeters(coordA, coordB) {
  if (!isValidCoordinate(coordA) || !isValidCoordinate(coordB)) {
    return null;
  }

  const dLat = toRadians(coordB.latitude - coordA.latitude);
  const dLon = toRadians(coordB.longitude - coordA.longitude);
  const lat1 = toRadians(coordA.latitude);
  const lat2 = toRadians(coordB.latitude);

  const haversine =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const centralAngle = 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
  return EARTH_RADIUS_METERS * centralAngle;
}

export function formatMetersValue(meters) {
  if (typeof meters !== 'number' || !Number.isFinite(meters) || meters < 0) return null;
  if (meters < 10) return '< 10 m';
  if (meters < 1000) return `${Math.round(meters)} m`;
  const kilometers = meters / 1000;
  if (kilometers >= 100) return `${Math.round(kilometers)} km`;
  return `${kilometers.toFixed(1)} km`;
}

export function formatDriverDistance(localCoords, remoteCoords, isLocal) {
  if (isLocal) return null;
  const meters = calculateDistanceMeters(localCoords, remoteCoords);
  if (meters === null) return null;
  return formatMetersValue(meters);
}

export function formatDriverSpeed(coords) {
  const speed = coords?.speedKmh;
  if (typeof speed !== 'number' || !Number.isFinite(speed) || speed < 0) {
    return '0 km/h';
  }
  return `${Math.round(speed)} km/h`;
}

export function useDrivingRoute(origin, destination) {
  const [routeState, setRouteState] = useState({ coords: null, isRoad: false, distanceText: null, durationMin: null });
  const lastFetchRef = useRef({ origin: null, destination: null });

  useEffect(() => {
    if (!isValidCoordinate(origin) || !isValidCoordinate(destination)) {
      lastFetchRef.current = { origin: null, destination: null };
      setRouteState({ coords: null, isRoad: false, distanceText: null, durationMin: null });
      return undefined;
    }

    const prev = lastFetchRef.current;
    const destShift = prev.destination ? calculateDistanceMeters(prev.destination, destination) : Infinity;
    const originShift = prev.origin ? calculateDistanceMeters(prev.origin, origin) : Infinity;
    if (destShift !== null && destShift < 15 && originShift !== null && originShift < 180) {
      return undefined;
    }

    lastFetchRef.current = {
      origin: { latitude: origin.latitude, longitude: origin.longitude },
      destination: { latitude: destination.latitude, longitude: destination.longitude },
    };

    const controller = new AbortController();
    const url = `${OSRM_BASE_URL}/${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}?overview=full&geometries=geojson`;

    fetch(url, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`))))
      .then((data) => {
        const route = data?.routes?.[0];
        const rawCoords = route?.geometry?.coordinates;
        if (!Array.isArray(rawCoords) || rawCoords.length < 2) {
          throw new Error('Gecersiz OSRM rota geometrisi');
        }
        const coords = rawCoords.map(([lon, lat]) => ({ latitude: Number(lat), longitude: Number(lon) }));
        const distanceText = formatMetersValue(route.distance);
        const durationMin = typeof route.duration === 'number' ? Math.max(1, Math.round(route.duration / 60)) : null;
        setRouteState({ coords, isRoad: true, distanceText, durationMin });
      })
      .catch((err) => {
        if (err?.name === 'AbortError') return;
        console.warn('[geo] OSRM rota alinamadi, kus ucusu cizgi kullaniliyor:', err?.message || err);
        setRouteState({
          coords: [
            { latitude: origin.latitude, longitude: origin.longitude },
            { latitude: destination.latitude, longitude: destination.longitude },
          ],
          isRoad: false,
          distanceText: formatDriverDistance(origin, destination, false),
          durationMin: null,
        });
      });

    return () => controller.abort();
  }, [origin?.latitude, origin?.longitude, destination?.latitude, destination?.longitude]);

  const fallbackCoords = isValidCoordinate(origin) && isValidCoordinate(destination)
    ? [
        { latitude: origin.latitude, longitude: origin.longitude },
        { latitude: destination.latitude, longitude: destination.longitude },
      ]
    : null;

  return {
    routeCoords: routeState.coords || fallbackCoords,
    isRoadGeometry: routeState.isRoad,
    roadDistanceText: routeState.distanceText,
    roadDurationMin: routeState.durationMin,
  };
}

