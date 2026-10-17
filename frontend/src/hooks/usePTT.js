import { useState, useEffect, useRef } from 'react';
import * as Haptics from 'expo-haptics';
import {
  createAudioPlayer,
  setAudioModeAsync,
  requestRecordingPermissionsAsync,
  RecordingPresets,
  AudioModule,
} from 'expo-audio';
import * as FileSystem from 'expo-file-system/legacy';

/**
 * Telsiz ses motoru: bas-konuş kaydı, gelen sesi çalma, roger beep (Expo SDK 57 - expo-audio).
 */
export function usePTT({
  socketRef,
  roomCodeRef,
  usernameRef,
  blockedUsersRef,
  rogerBeepRef,
  activeSpeaker,
  setActiveSpeaker,
}) {
  const [isSpeakingLocally, setIsSpeakingLocally] = useState(false);
  const beepOnRef = useRef(null);
  const beepOffRef = useRef(null);
  const recordingRef = useRef(null);
  const incomingSoundRef = useRef(null);

  // Ses modunu ve roger beep seslerini hazırla
  useEffect(() => {
    (async () => {
      try {
        await setAudioModeAsync({
          playsInSilentMode: true,
          allowsRecording: false,
        });

        const onPlayer = createAudioPlayer(require('../../assets/beep-on.wav'));
        const offPlayer = createAudioPlayer(require('../../assets/beep-off.wav'));

        // Geriye dönük uyumluluk (SettingsTab replayAsync çağırır)
        onPlayer.replayAsync = async () => {
          try {
            onPlayer.seekTo(0);
            onPlayer.play();
          } catch (e) {}
        };
        onPlayer.unloadAsync = async () => {
          try { onPlayer.remove(); } catch (e) {}
        };

        offPlayer.replayAsync = async () => {
          try {
            offPlayer.seekTo(0);
            offPlayer.play();
          } catch (e) {}
        };
        offPlayer.unloadAsync = async () => {
          try { offPlayer.remove(); } catch (e) {}
        };

        beepOnRef.current = onPlayer;
        beepOffRef.current = offPlayer;
      } catch (e) {
        console.log('[PTT INIT] Ses yüklenemedi:', e.message);
      }
    })();

    return () => {
      try { beepOnRef.current?.remove(); } catch (e) {}
      try { beepOffRef.current?.remove(); } catch (e) {}
      try { incomingSoundRef.current?.remove(); } catch (e) {}
      if (recordingRef.current) {
        try { recordingRef.current.stop(); } catch (e) {}
      }
    };
  }, []);

  // Soketten gelen ses klibini çal
  const playIncoming = async (clip) => {
    if (!clip || !clip.audioBase64) return;
    if (clip.sender && blockedUsersRef.current.includes(clip.sender)) {
      console.log('[WS AUDIO INCOMING] Engellenen kullanıcıdan ses geldi, filtrelendi (mute):', clip.sender);
      return;
    }
    console.log('[WS AUDIO INCOMING] Yeni canlı ses klibi geldi! Gönderen:', clip.sender, 'ID:', clip.id);

    try {
      const fileUri = `${FileSystem.cacheDirectory}incoming_voice_${clip.id}.m4a`;
      await FileSystem.writeAsStringAsync(fileUri, clip.audioBase64, {
        encoding: 'base64',
      });

      await setAudioModeAsync({
        allowsRecording: false,
        playsInSilentMode: true,
      });

      if (incomingSoundRef.current) {
        try { incomingSoundRef.current.remove(); } catch (e) {}
        incomingSoundRef.current = null;
      }

      const player = createAudioPlayer(fileUri);
      player.addListener('playbackStatusUpdate', (status) => {
        if (status.didJustFinish) {
          if (rogerBeepRef.current && beepOffRef.current) {
            try {
              beepOffRef.current.seekTo(0);
              beepOffRef.current.play();
            } catch (e) {}
          }
        }
      });

      player.play();
      incomingSoundRef.current = player;
    } catch (e) {
      console.error('[WS AUDIO PLAYBACK ERROR]:', e.message);
    }
  };

  // Çalan sesi anında durdur (kullanıcı engellenince)
  const stopIncoming = async () => {
    if (incomingSoundRef.current) {
      try {
        incomingSoundRef.current.pause();
        incomingSoundRef.current.remove();
        incomingSoundRef.current = null;
      } catch (e) {}
    }
  };

  const handleTalkStart = async () => {
    if (activeSpeaker && !activeSpeaker.isLocal) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    if (rogerBeepRef.current && beepOnRef.current) {
      try {
        beepOnRef.current.seekTo(0);
        beepOnRef.current.play();
      } catch (e) {}
    }
    setIsSpeakingLocally(true);
    setActiveSpeaker({ name: usernameRef.current, isLocal: true });

    if (socketRef.current) {
      socketRef.current.emit('ptt_start', {
        roomName: roomCodeRef.current,
        participantName: usernameRef.current,
      });
    }

    try {
      if (recordingRef.current) {
        try { await recordingRef.current.stop(); } catch (e) {}
        recordingRef.current = null;
      }

      const permission = await requestRecordingPermissionsAsync();
      console.log('[PTT] Mikrofon izin durumu:', permission.status);
      if (permission.status === 'granted') {
        await setAudioModeAsync({
          allowsRecording: true,
          playsInSilentMode: true,
        });

        const recorder = new AudioModule.AudioRecorder(RecordingPresets.LOW_QUALITY);
        await recorder.prepareToRecordAsync();
        recorder.record();
        recordingRef.current = recorder;
        console.log('[PTT] Ses kaydı başlatıldı');
      } else {
        console.warn('[PTT] Mikrofon izni reddedildi!');
      }
    } catch (e) {
      console.warn('[PTT] Ses kayıt başlatma durumu:', e.message);
    }
  };

  const handleTalkEnd = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (rogerBeepRef.current && beepOffRef.current) {
      try {
        beepOffRef.current.seekTo(0);
        beepOffRef.current.play();
      } catch (e) {}
    }
    setIsSpeakingLocally(false);
    setActiveSpeaker(null);

    let audioBase64 = null;
    try {
      if (recordingRef.current) {
        await recordingRef.current.stop();
        const uri = recordingRef.current.uri;
        console.log('[PTT] Kayıt dosyası URI:', uri);
        recordingRef.current = null;

        await setAudioModeAsync({
          allowsRecording: false,
          playsInSilentMode: true,
        });

        if (uri) {
          audioBase64 = await FileSystem.readAsStringAsync(uri, {
            encoding: 'base64',
          });
          console.log('[PTT] Base64 ses boyutu:', audioBase64?.length, 'karakter');
        }
      } else {
        console.warn('[PTT] recordingRef boş — kayıt başlamamış olabilir!');
      }
    } catch (e) {
      console.error('[PTT] Ses kayıt durdurma hatası:', e.message);
    }

    if (audioBase64 && socketRef.current) {
      console.log('[WS PTT END] Socket.io ses yayını başlatılıyor, boyut:', audioBase64.length);
      socketRef.current.emit('audio_broadcast', {
        roomName: roomCodeRef.current,
        sender: usernameRef.current,
        audioBase64,
      });
    }
  };

  return {
    isSpeakingLocally,
    setIsSpeakingLocally,
    beepOffRef,
    playIncoming,
    stopIncoming,
    handleTalkStart,
    handleTalkEnd,
  };
}
