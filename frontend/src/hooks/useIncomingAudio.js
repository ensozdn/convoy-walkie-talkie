import { useEffect, useRef, useCallback } from 'react';
import { createAudioPlayer } from 'expo-audio';
import * as FileSystem from 'expo-file-system/legacy';
import { MAX_QUEUED_CLIPS, MAX_CLIP_PLAYBACK_MS } from '../constants/audio';

const deleteClipFile = async (fileUri) => {
  try {
    await FileSystem.deleteAsync(fileUri, { idempotent: true });
  } catch (e) {
    console.error('[INCOMING_AUDIO] Gecici ses dosyasi silinemedi:', e.message);
  }
};

export function useIncomingAudio({ blockedUsersRef, rogerBeepRef, playBeepOff }) {
  const queueRef = useRef([]);
  const currentRef = useRef(null);
  const watchdogRef = useRef(null);
  const isUnmountedRef = useRef(false);

  const releaseCurrent = () => {
    const current = currentRef.current;
    if (!current) return;
    currentRef.current = null;
    clearTimeout(watchdogRef.current);
    try {
      current.subscription?.remove();
      current.player?.remove();
    } catch (e) {
      console.error('[INCOMING_AUDIO] Oynatici serbest birakilamadi:', e.message);
    }
    deleteClipFile(current.fileUri);
  };

  const finishCurrent = (current, shouldPlayEndBeep) => {
    if (currentRef.current !== current) return;
    releaseCurrent();
    if (queueRef.current.length > 0) {
      playNext();
    } else if (shouldPlayEndBeep && rogerBeepRef.current) {
      playBeepOff();
    }
  };

  const playNext = async () => {
    if (currentRef.current || isUnmountedRef.current) return;
    const clip = queueRef.current.shift();
    if (!clip) return;

    const fileUri = `${FileSystem.cacheDirectory}incoming_voice_${clip.id}.m4a`;
    const current = { clip, fileUri, player: null, subscription: null };
    currentRef.current = current;

    try {
      await FileSystem.writeAsStringAsync(fileUri, clip.audioBase64, { encoding: 'base64' });
      if (currentRef.current !== current) {
        deleteClipFile(fileUri);
        return;
      }

      const player = createAudioPlayer(fileUri);
      current.player = player;
      current.subscription = player.addListener('playbackStatusUpdate', (status) => {
        if (status?.didJustFinish) finishCurrent(current, true);
      });
      watchdogRef.current = setTimeout(() => {
        console.error('[INCOMING_AUDIO] Oynatma zaman asimina ugradi, siradaki klibe geciliyor');
        finishCurrent(current, false);
      }, MAX_CLIP_PLAYBACK_MS);
      player.play();
    } catch (e) {
      console.error('[INCOMING_AUDIO] Klip oynatilamadi:', e.message);
      finishCurrent(current, false);
    }
  };

  const playIncoming = useCallback((clip) => {
    if (!clip?.audioBase64) return;
    if (clip.sender && blockedUsersRef.current.includes(clip.sender)) {
      console.log('[INCOMING_AUDIO] Engellenen kullanicidan gelen ses filtrelendi:', clip.sender);
      return;
    }
    queueRef.current.push(clip);
    if (queueRef.current.length > MAX_QUEUED_CLIPS) queueRef.current.shift();
    playNext();
  }, [blockedUsersRef]);

  const dropIncomingFrom = useCallback((senderName) => {
    queueRef.current = queueRef.current.filter((clip) => clip.sender !== senderName);
    const current = currentRef.current;
    if (current?.clip?.sender === senderName) finishCurrent(current, false);
  }, []);

  const clearIncoming = useCallback(() => {
    queueRef.current = [];
    releaseCurrent();
  }, []);

  useEffect(() => {
    isUnmountedRef.current = false;
    return () => {
      isUnmountedRef.current = true;
      clearIncoming();
    };
  }, [clearIncoming]);

  return { playIncoming, dropIncomingFrom, clearIncoming };
}
