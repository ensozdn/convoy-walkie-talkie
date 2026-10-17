import { useEffect, useRef } from 'react';
import { createAudioPlayer } from 'expo-audio';

const BEEP_ON_SOURCE = require('../../assets/beep-on.wav');
const BEEP_OFF_SOURCE = require('../../assets/beep-off.wav');

const replayFromStart = async (player, label) => {
  if (!player) return;
  try {
    await player.seekTo(0);
    player.play();
  } catch (e) {
    console.error(`[BEEPS] ${label} calinamadi:`, e.message);
  }
};

export function useBeeps() {
  const beepOnRef = useRef(null);
  const beepOffRef = useRef(null);

  useEffect(() => {
    try {
      beepOnRef.current = createAudioPlayer(BEEP_ON_SOURCE);
      beepOffRef.current = createAudioPlayer(BEEP_OFF_SOURCE);
    } catch (e) {
      console.error('[BEEPS] Bip sesleri yuklenemedi:', e.message);
    }

    return () => {
      [beepOnRef, beepOffRef].forEach((playerRef) => {
        try {
          playerRef.current?.remove();
        } catch (e) {
          console.error('[BEEPS] Bip oynaticisi serbest birakilamadi:', e.message);
        }
        playerRef.current = null;
      });
    };
  }, []);

  const playBeepOn = () => replayFromStart(beepOnRef.current, 'Baslangic bipi');
  const playBeepOff = () => replayFromStart(beepOffRef.current, 'Bitis bipi');

  return { playBeepOn, playBeepOff };
}
