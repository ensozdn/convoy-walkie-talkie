import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/styles';
import { COLORS } from '../styles/theme';

export function QuickPttDock({
  roomCode,
  connectionState,
  activeSpeaker,
  isSpeakingLocally,
  handleTalkStart,
  handleTalkEnd,
  t,
}) {
  const isConnected = connectionState === 'connected';
  const someoneElseSpeaking = Boolean(activeSpeaker && !activeSpeaker.isLocal);
  const pttDisabled = !isConnected || someoneElseSpeaking;

  let dotColor = COLORS.accentCyan;
  let statusTitle = t('channelStandby');
  let btnBg = COLORS.dangerRedDark;
  let btnBorder = COLORS.dangerRed;
  let btnLabel = t('pttDefault');

  if (!isConnected) {
    dotColor = COLORS.rxAmber;
    statusTitle = t('pttConnecting');
    btnBg = COLORS.borderDefault;
    btnBorder = COLORS.borderHighlight;
  } else if (isSpeakingLocally) {
    dotColor = COLORS.txGreenBright;
    statusTitle = t('pttSpeaking');
    btnBg = COLORS.txGreen;
    btnBorder = COLORS.txGreenBright;
    btnLabel = t('pttSpeaking');
  } else if (someoneElseSpeaking) {
    dotColor = COLORS.rxAmberBright;
    statusTitle = `${activeSpeaker.name.toUpperCase()} ${t('isSpeaking')}`;
    btnBg = COLORS.borderDefault;
    btnBorder = COLORS.rxAmber;
  }

  return (
    <View style={styles.quickPttDock}>
      <View style={styles.quickPttStatusLeft}>
        <View style={[styles.quickPttIndicatorDot, { backgroundColor: dotColor }]} />
        <View style={{ flex: 1 }}>
          <Text style={styles.quickPttStatusTitle} numberOfLines={1}>
            {statusTitle}
          </Text>
          <Text style={styles.quickPttStatusSub} numberOfLines={1}>
            #{roomCode}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.quickPttActionBtn,
          { backgroundColor: btnBg, borderColor: btnBorder },
          pttDisabled && styles.pttButtonDisabled,
        ]}
        onPressIn={handleTalkStart}
        onPressOut={handleTalkEnd}
        disabled={pttDisabled}
        activeOpacity={0.85}
      >
        <Ionicons
          name={isSpeakingLocally ? 'mic' : someoneElseSpeaking ? 'volume-high' : 'mic-outline'}
          size={16}
          color={COLORS.white}
        />
        <Text style={styles.quickPttActionText}>{btnLabel}</Text>
      </TouchableOpacity>
    </View>
  );
}
