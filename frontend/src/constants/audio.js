import { AudioQuality, IOSOutputFormat, RecordingPresets } from 'expo-audio';

export const IDLE_AUDIO_MODE = {
  playsInSilentMode: true,
  allowsRecording: false,
};

export const RECORDING_AUDIO_MODE = {
  playsInSilentMode: true,
  allowsRecording: true,
};

// Android ve iOS ayni AAC/m4a formatini uretmeli; LOW_QUALITY preset'i Android'de iOS'in calamadigi 3gp/AMR uretir.
export const VOICE_RECORDING_OPTIONS = {
  extension: '.m4a',
  sampleRate: 16000,
  numberOfChannels: 1,
  bitRate: 24000,
  android: {
    outputFormat: 'mpeg4',
    audioEncoder: 'aac',
  },
  ios: {
    outputFormat: IOSOutputFormat.MPEG4AAC,
    audioQuality: AudioQuality.MEDIUM,
  },
  web: {
    mimeType: 'audio/webm',
    bitsPerSecond: 24000,
  },
};

export const FALLBACK_RECORDING_OPTIONS = RecordingPresets.HIGH_QUALITY;

export const MAX_QUEUED_CLIPS = 5;
export const MAX_CLIP_PLAYBACK_MS = 35000;
