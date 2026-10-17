import { useState, useEffect, useRef, useCallback } from 'react';
import * as Location from 'expo-location';
import { DEFAULT_REGION } from '../constants/config';

function toSpeedKmh(rawSpeedMetersPerSec) {
  if (typeof rawSpeedMetersPerSec !== 'number' || rawSpeedMetersPerSec < 0.6) {
    return 0;
  }
  return Math.round(rawSpeedMetersPerSec * 3.6);
}

export function useLocation({ isInRoom, socketRef, roomCodeRef, usernameRef }) {
  const [userLocation, setUserLocation] = useState(DEFAULT_REGION);
  const locationSubRef = useRef(null);

  const sendLocationUpdate = useCallback((coords) => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('location_update', {
        roomName: roomCodeRef.current,
        participantName: usernameRef.current,
        coords: {
          latitude: coords.latitude,
          longitude: coords.longitude,
          speedKmh: coords.speedKmh ?? 0,
        },
      });
    }
  }, [roomCodeRef, socketRef, usernameRef]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const lastLoc = await Location.getLastKnownPositionAsync({});
          if (mounted && lastLoc) {
            setUserLocation({
              latitude: lastLoc.coords.latitude,
              longitude: lastLoc.coords.longitude,
              latitudeDelta: 0.015,
              longitudeDelta: 0.015,
              speedKmh: toSpeedKmh(lastLoc.coords.speed),
            });
          }
          const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
          if (mounted && loc) {
            setUserLocation({
              latitude: loc.coords.latitude,
              longitude: loc.coords.longitude,
              latitudeDelta: 0.015,
              longitudeDelta: 0.015,
              speedKmh: toSpeedKmh(loc.coords.speed),
            });
          }
        }
      } catch (err) {
        console.warn('[LOCATION] Ilk konum alinamadi:', err?.message ?? err);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isInRoom) return undefined;

    let cancelled = false;
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted' && !cancelled) {
          const sub = await Location.watchPositionAsync(
            {
              accuracy: Location.Accuracy.Balanced,
              timeInterval: 4000,
              distanceInterval: 6,
            },
            (loc) => {
              const newCoords = {
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
                latitudeDelta: 0.015,
                longitudeDelta: 0.015,
                speedKmh: toSpeedKmh(loc.coords.speed),
              };
              setUserLocation(newCoords);
              sendLocationUpdate(newCoords);
            }
          );
          if (cancelled) {
            sub.remove();
          } else {
            locationSubRef.current = sub;
          }
        }
      } catch (e) {
        console.warn('[LOCATION] Canli GPS izleme hatasi:', e.message);
      }
    })();

    return () => {
      cancelled = true;
      if (locationSubRef.current) {
        locationSubRef.current.remove();
        locationSubRef.current = null;
      }
    };
  }, [isInRoom, sendLocationUpdate]);

  return { userLocation, sendLocationUpdate };
}
