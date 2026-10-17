import { useRef } from 'react';
import { useAudioRecorder, requestRecordingPermissionsAsync, setAudioModeAsync } from 'expo-audio';
import * as FileSystem from 'expo-file-system/legacy';
import {
  VOICE_RECORDING_OPTIONS,
  FALLBACK_RECORDING_OPTIONS,
  RECORDING_AUDIO_MODE,
  IDLE_AUDIO_MODE,
} from '../constants/audio';

export function useVoiceRecorder() {
  const recorder = useAudioRecorder(VOICE_RECORDING_OPTIONS);
  const isSessionReadyRef = useRef(false);
  const isArmedRef = useRef(false);
  const isRecordingRef = useRef(false);
  const armingRef = useRef(null);

  const prepareRecorder = async () => {
    try {
      await recorder.prepareToRecordAsync(VOICE_RECORDING_OPTIONS);
    } catch (e) {
      console.error('[VOICE_RECORDER] Konusma ayari hazirlanamadi, yedek ayara geciliyor:', e.message);
      await recorder.prepareToRecordAsync(FALLBACK_RECORDING_OPTIONS);
    }
  };

  const prepareSession = async () => {
    if (isSessionReadyRef.current) return true;
    const permission = await requestRecordingPermissionsAsync();
    if (permission.status !== 'granted') {
      console.warn('[VOICE_RECORDER] Mikrofon izni verilmedi');
      return false;
    }
    await setAudioModeAsync(RECORDING_AUDIO_MODE);
    isSessionReadyRef.current = true;
    return true;
  };

  const arm = () => {
    if (isArmedRef.current) return Promise.resolve(true);
    if (!armingRef.current) {
      armingRef.current = (async () => {
        if (!(await prepareSession())) return false;
        await prepareRecorder();
        isArmedRef.current = true;
        return true;
      })().finally(() => {
        armingRef.current = null;
      });
    }
    return armingRef.current;
  };

  const rearm = () => {
    arm().catch((e) => console.error('[VOICE_RECORDER] Kayit yeniden hazirlanamadi:', e.message));
  };

  const start = async (shouldRecord) => {
    if (!(await arm()) || !shouldRecord()) return false;
    recorder.record();
    isRecordingRef.current = true;
    return true;
  };

  const stop = async () => {
    if (!isRecordingRef.current) return null;
    isRecordingRef.current = false;
    isArmedRef.current = false;
    try {
      await recorder.stop();
      return recorder.uri;
    } catch (e) {
      console.error('[VOICE_RECORDER] Kayit durdurulamadi:', e.message);
      return null;
    }
  };

  const readAndDiscard = async (uri) => {
    try {
      return await FileSystem.readAsStringAsync(uri, { encoding: 'base64' });
    } catch (e) {
      console.error('[VOICE_RECORDER] Kayit dosyasi okunamadi:', e.message);
      return null;
    } finally {
      FileSystem.deleteAsync(uri, { idempotent: true }).catch((e) => {
        console.error('[VOICE_RECORDER] Kayit dosyasi silinemedi:', e.message);
      });
    }
  };

  const release = async () => {
    isArmedRef.current = false;
    isSessionReadyRef.current = false;
    try {
      if (isRecordingRef.current) {
        isRecordingRef.current = false;
        await recorder.stop();
      }
      await setAudioModeAsync(IDLE_AUDIO_MODE);
    } catch (e) {
      console.error('[VOICE_RECORDER] Kayit oturumu kapatilamadi:', e.message);
    }
  };

  return { arm, rearm, start, stop, readAndDiscard, release };
}
