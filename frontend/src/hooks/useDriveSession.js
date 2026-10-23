import { useState, useEffect, useRef, useMemo } from 'react';
import { calculateDistanceMeters } from '../utils/geo';

export function useDriveSession({ isInRoom, userLocation }) {
  const [sessionDistanceMeters, setSessionDistanceMeters] = useState(0);
  const [sessionDurationMinutes, setSessionDurationMinutes] = useState(1);
  const [maxSpeedKmh, setMaxSpeedKmh] = useState(0);

  const lastCoordsRef = useRef(null);
  const maxSpeedRef = useRef(0);
  const distanceRef = useRef(0);
  const durationRef = useRef(0);

  useEffect(() => {
    if (!isInRoom) {
      lastCoordsRef.current = null;
      setSessionDistanceMeters(0);
      setSessionDurationMinutes(1);
      setMaxSpeedKmh(0);
      maxSpeedRef.current = 0;
      distanceRef.current = 0;
      durationRef.current = 0;
      return undefined;
    }

    const timer = setInterval(() => {
      durationRef.current += 1;
      const nextMinutes = Math.max(1, Math.floor(durationRef.current / 60));
      setSessionDurationMinutes((prev) => (prev === nextMinutes ? prev : nextMinutes));
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [isInRoom]);

  useEffect(() => {
    if (!isInRoom || !userLocation) return;

    const currentSpeed = userLocation.speedKmh || 0;
    if (currentSpeed > maxSpeedRef.current) {
      maxSpeedRef.current = currentSpeed;
      setMaxSpeedKmh(currentSpeed);
    }

    if (!lastCoordsRef.current) {
      lastCoordsRef.current = userLocation;
      return;
    }

    if (currentSpeed >= 3) {
      const dist = calculateDistanceMeters(lastCoordsRef.current, userLocation);
      if (dist !== null && dist >= 6 && dist < 2000) {
        distanceRef.current += dist;
        setSessionDistanceMeters((prev) => prev + dist);
        lastCoordsRef.current = userLocation;
      }
    }
  }, [isInRoom, userLocation]);

  const currentSpeed = userLocation?.speedKmh || 0;
  const distanceKmText = (sessionDistanceMeters / 1000).toFixed(1);

  return useMemo(() => ({
    currentSpeedKmh: currentSpeed,
    sessionDistanceKm: distanceKmText,
    sessionDurationMinutes,
    maxSpeedKmh,
  }), [currentSpeed, distanceKmText, maxSpeedKmh, sessionDurationMinutes]);
}
