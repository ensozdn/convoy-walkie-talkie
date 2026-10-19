import { useState, useEffect, useRef, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { calculateDistanceMeters } from '../utils/geo';

const STORAGE_KEY_DRIVE_SUMMARY = '@convoy_drive_summary_enabled';

export function useDriveSession({ isInRoom, userLocation, roomCode }) {
  const [sessionDistanceMeters, setSessionDistanceMeters] = useState(0);
  const [sessionDurationSeconds, setSessionDurationSeconds] = useState(0);
  const [maxSpeedKmh, setMaxSpeedKmh] = useState(0);
  const [summaryData, setSummaryData] = useState(null);
  const [isSummaryEnabled, setIsSummaryEnabled] = useState(true);

  const lastCoordsRef = useRef(null);
  const maxSpeedRef = useRef(0);
  const distanceRef = useRef(0);
  const durationRef = useRef(0);
  const isSummaryEnabledRef = useRef(true);

  useEffect(() => {
    let mounted = true;
    AsyncStorage.getItem(STORAGE_KEY_DRIVE_SUMMARY)
      .then((val) => {
        if (!mounted || val === null) return;
        const enabled = val === 'true';
        setIsSummaryEnabled(enabled);
        isSummaryEnabledRef.current = enabled;
      })
      .catch((e) => console.warn('[DRIVE_SESSION] Tercih yukleme hatasi:', e.message));

    return () => {
      mounted = false;
    };
  }, []);

  const setSummaryEnabled = useCallback(async (enabled) => {
    setIsSummaryEnabled(enabled);
    isSummaryEnabledRef.current = enabled;
    try {
      await AsyncStorage.setItem(STORAGE_KEY_DRIVE_SUMMARY, String(enabled));
    } catch (e) {
      console.warn('[DRIVE_SESSION] Tercih kaydetme hatasi:', e.message);
    }
  }, []);

  const toggleSummaryEnabled = useCallback(() => {
    setSummaryEnabled(!isSummaryEnabledRef.current);
  }, [setSummaryEnabled]);

  useEffect(() => {
    if (!isInRoom) {
      lastCoordsRef.current = null;
      setSessionDistanceMeters(0);
      setSessionDurationSeconds(0);
      setMaxSpeedKmh(0);
      maxSpeedRef.current = 0;
      distanceRef.current = 0;
      durationRef.current = 0;
      return undefined;
    }

    const timer = setInterval(() => {
      durationRef.current += 1;
      setSessionDurationSeconds((prev) => prev + 1);
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

  const captureSummary = useCallback(() => {
    if (!isSummaryEnabledRef.current) return;
    if (distanceRef.current < 150 && durationRef.current < 60) return;

    const distKm = (distanceRef.current / 1000).toFixed(1);
    const durMin = Math.max(1, Math.round(durationRef.current / 60));
    setSummaryData({
      roomCode: roomCode || '',
      distanceKm: distKm,
      durationMinutes: durMin,
      maxSpeedKmh: maxSpeedRef.current,
    });
  }, [roomCode]);

  const closeSummary = useCallback(() => {
    setSummaryData(null);
  }, []);

  const currentSpeed = userLocation?.speedKmh || 0;
  const distanceKmText = (sessionDistanceMeters / 1000).toFixed(1);
  const durationMinutes = Math.max(1, Math.floor(sessionDurationSeconds / 60));

  return {
    currentSpeedKmh: currentSpeed,
    sessionDistanceKm: distanceKmText,
    sessionDurationMinutes: durationMinutes,
    maxSpeedKmh,
    summaryData,
    isSummaryEnabled,
    setSummaryEnabled,
    toggleSummaryEnabled,
    captureSummary,
    closeSummary,
  };
}
