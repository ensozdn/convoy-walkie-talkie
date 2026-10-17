import { useState, useEffect, useRef } from 'react';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system/legacy';

/**
 * Telsiz ses motoru: bas-konuş kaydı, gelen sesi çalma, roger beep.
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
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          allowsRecordingIOS: false,
        });
        const { sound: on } = await Audio.Sound.createAsync(
          require('../../assets/beep-on.wav')
        );
        const { sound: off } = await Audio.Sound.createAsync(
          require('../../assets/beep-off.wav')
        );
        beepOnRef.current = on;
        beepOffRef.current = off;
      } catch (e) {
        console.log('Ses yüklenemedi:', e.message);
      }
    })();
    return () => {
      beepOnRef.current?.unloadAsync();
      beepOffRef.current?.unloadAsync();
      incomingSoundRef.current?.unloadAsync();
      if (recordingRef.current) {
        try { recordingRef.current.stopAndUnloadAsync(); } catch (e) {}
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

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      if (incomingSoundRef.current) {
        try { await incomingSoundRef.current.unloadAsync(); } catch (e) {}
      }

      const { sound } = await Audio.Sound.createAsync(
        { uri: fileUri },
        { shouldPlay: true, volume: 1.0 },
        (playbackStatus) => {
          if (playbackStatus.didJustFinish) {
            if (rogerBeepRef.current) {
              try { beepOffRef.current?.replayAsync(); } catch (e) {}
            }
          }
        }
      );
      incomingSoundRef.current = sound;
    } catch (e) {
      console.error('[WS AUDIO PLAYBACK ERROR]:', e.message);
    }
  };

  // Çalan sesi anında durdur (kullanıcı engellenince)
  const stopIncoming = async () => {
    if (incomingSoundRef.current) {
      try { await incomingSoundRef.current.stopAsync(); } catch (e) {}
    }
  };

  const handleTalkStart = async () => {
    if (activeSpeaker && !activeSpeaker.isLocal) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    if (rogerBeepRef.current) {
      try { await beepOnRef.current?.replayAsync(); } catch (e) {}
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
      // Önceki kayıt nesnesi temizlenmemişse güvenle durdur ve sıfırla
      if (recordingRef.current) {
        try { await recordingRef.current.stopAndUnloadAsync(); } catch (e) {}
        recordingRef.current = null;
      }

      const permission = await Audio.requestPermissionsAsync();
      console.log('[PTT] Mikrofon izin durumu:', permission.status);
      if (permission.status === 'granted') {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
        const { recording } = await Audio.Recording.createAsync(
          Audio.RecordingOptionsPresets.LOW_QUALITY
        );
        recordingRef.current = recording;
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
    if (rogerBeepRef.current) {
      try { await beepOffRef.current?.replayAsync(); } catch (e) {}
    }
    setIsSpeakingLocally(false);
    setActiveSpeaker(null);

    let audioBase64 = null;
    try {
      if (recordingRef.current) {
        await recordingRef.current.stopAndUnloadAsync();
        const uri = recordingRef.current.getURI();
        console.log('[PTT] Kayıt dosyası URI:', uri);
        recordingRef.current = null;
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
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
