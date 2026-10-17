import { useState, useEffect, useRef } from 'react';
import * as Location from 'expo-location';
import { DEFAULT_REGION } from '../constants/config';

/**
 * Kullanıcı konumunu yönetir: açılışta son bilinen/güncel konumu alır,
 * odadayken canlı izler ve soket üzerinden odaya iletir.
 */
export function useLocation({ isInRoom, socketRef, roomCodeRef, usernameRef }) {
  const [userLocation, setUserLocation] = useState(DEFAULT_REGION);
  const locationSubRef = useRef(null);

  const sendLocationUpdate = (coords) => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('location_update', {
        roomName: roomCodeRef.current,
        participantName: usernameRef.current,
        coords: { latitude: coords.latitude, longitude: coords.longitude },
      });
    }
  };

  // Arka planda konum hazırla (UI bloklanmaz, anında etkileşim sağlanır)
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const lastLoc = await Location.getLastKnownPositionAsync({});
          if (lastLoc) {
            setUserLocation({
              latitude: lastLoc.coords.latitude,
              longitude: lastLoc.coords.longitude,
              latitudeDelta: 0.015,
              longitudeDelta: 0.015,
            });
          }
          const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
          if (loc) {
            setUserLocation({
              latitude: loc.coords.latitude,
              longitude: loc.coords.longitude,
              latitudeDelta: 0.015,
              longitudeDelta: 0.015,
            });
          }
        }
      } catch (err) {
        console.log('Konum alma hatası:', err);
      }
    })();
  }, []);

  useEffect(() => {
    if (isInRoom) {
      (async () => {
        try {
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status === 'granted') {
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
                };
                setUserLocation(newCoords);
                sendLocationUpdate(newCoords);
              }
            );
            locationSubRef.current = sub;
          }
        } catch (e) {
          console.log('GPS İzleme hatası:', e.message);
        }
      })();

      return () => {
        if (locationSubRef.current) {
          locationSubRef.current.remove();
          locationSubRef.current = null;
        }
      };
    }
  }, [isInRoom]);

  return { userLocation, sendLocationUpdate };
}
