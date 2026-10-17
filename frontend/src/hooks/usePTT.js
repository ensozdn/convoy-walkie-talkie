import { useState, useEffect, useRef, useCallback } from 'react';
import * as Haptics from 'expo-haptics';
import { setAudioModeAsync } from 'expo-audio';
import { IDLE_AUDIO_MODE } from '../constants/audio';
import { useBeeps } from './useBeeps';
import { useIncomingAudio } from './useIncomingAudio';
import { useVoiceRecorder } from './useVoiceRecorder';

export function usePTT({
  isInRoom,
  socketRef,
  roomCodeRef,
  usernameRef,
  blockedUsersRef,
  rogerBeepRef,
  activeSpeaker,
  setActiveSpeaker,
}) {
  const [isSpeakingLocally, setIsSpeakingLocally] = useState(false);
  const [isChannelMuted, setIsChannelMuted] = useState(false);
  const isChannelMutedRef = useRef(false);
  const isHeldRef = useRef(false);
  const { playBeepOn, playBeepOff } = useBeeps();
  const { playIncoming: playIncomingRaw, dropIncomingFrom, clearIncoming } = useIncomingAudio({
    blockedUsersRef,
    rogerBeepRef,
    playBeepOff,
  });
  const voiceRecorder = useVoiceRecorder();

  useEffect(() => {
    setAudioModeAsync(IDLE_AUDIO_MODE).catch((e) => {
      console.error('[PTT] Bosta ses modu ayarlanamadi:', e.message);
    });
  }, []);

  useEffect(() => {
    if (!isInRoom) {
      isChannelMutedRef.current = false;
      setIsChannelMuted(false);
      return undefined;
    }
    voiceRecorder.arm().catch((e) => {
      console.error('[PTT] Mikrofon oturumu hazirlanamadi:', e.message);
    });
    return () => {
      clearIncoming();
      voiceRecorder.release();
    };
  }, [isInRoom]);

  const playIncoming = useCallback((clip) => {
    if (isChannelMutedRef.current) return;
    playIncomingRaw(clip);
  }, [playIncomingRaw]);

  const toggleChannelMute = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const nextMuted = !isChannelMutedRef.current;
    isChannelMutedRef.current = nextMuted;
    setIsChannelMuted(nextMuted);
    if (nextMuted) {
      clearIncoming();
    }
    return nextMuted;
  }, [clearIncoming]);

  const emitToRoom = (eventName, extraPayload = {}) => {
    socketRef.current?.emit(eventName, {
      roomName: roomCodeRef.current,
      ...extraPayload,
    });
  };

  const handleTalkStart = async () => {
    if (activeSpeaker && !activeSpeaker.isLocal) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    if (isChannelMutedRef.current) {
      isChannelMutedRef.current = false;
      setIsChannelMuted(false);
    }
    isHeldRef.current = true;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    if (rogerBeepRef.current) playBeepOn();
    setIsSpeakingLocally(true);
    setActiveSpeaker({ name: usernameRef.current, isLocal: true });
    emitToRoom('ptt_start', { participantName: usernameRef.current });

    try {
      const isRecording = await voiceRecorder.start(() => isHeldRef.current);
      if (!isRecording) console.warn('[PTT] Kayit baslamadi: mikrofon hazir degil veya tus erken birakildi');
    } catch (e) {
      console.error('[PTT] Kayit baslatilamadi:', e.message);
    }
  };

  const handleTalkEnd = async () => {
    if (!isHeldRef.current) return;
    isHeldRef.current = false;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsSpeakingLocally(false);
    setActiveSpeaker(null);

    const recordingUri = await voiceRecorder.stop();
    if (rogerBeepRef.current) playBeepOff();
    const audioBase64 = recordingUri ? await voiceRecorder.readAndDiscard(recordingUri) : null;

    if (audioBase64) {
      emitToRoom('audio_broadcast', { sender: usernameRef.current, audioBase64 });
    } else {
      emitToRoom('ptt_stop', { participantName: usernameRef.current });
    }
    voiceRecorder.rearm();
  };

  return {
    isSpeakingLocally,
    setIsSpeakingLocally,
    isChannelMuted,
    toggleChannelMute,
    playBeepOff,
    playIncoming,
    dropIncomingFrom,
    handleTalkStart,
    handleTalkEnd,
  };
}
