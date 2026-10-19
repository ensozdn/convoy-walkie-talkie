import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { PROVIDER_DEFAULT, Marker } from 'react-native-maps';
import { styles } from '../styles/styles';
import { COLORS } from '../styles/theme';
import { formatDriverDistance, formatDriverSpeed } from '../utils/geo';

const QUICK_PING_ITEMS = [
  { type: 'break', labelKey: 'pingBreak', icon: 'cafe-outline', color: COLORS.accentCyan },
  { type: 'slow', labelKey: 'pingSlow', icon: 'speedometer-outline', color: COLORS.rxAmberBright },
  { type: 'hazard', labelKey: 'pingHazard', icon: 'warning-outline', color: COLORS.dangerRed },
  { type: 'ok', labelKey: 'pingOk', icon: 'checkmark-circle-outline', color: COLORS.txGreenBright },
];

const PING_ALERT_KEYS = {
  break: 'pingAlertBreak',
  slow: 'pingAlertSlow',
  hazard: 'pingAlertHazard',
  ok: 'pingAlertOk',
};

const SIGNAL_BAR_HEIGHTS = [7, 13, 18, 11, 15];

function resolveRadioVisualState({ connectionState, activeSpeaker, isSpeakingLocally, isChannelMuted, t }) {
  const someoneElseSpeaking = Boolean(activeSpeaker && !activeSpeaker.isLocal);
  if (connectionState === 'reconnecting') {
    return {
      pttBgColor: COLORS.rxAmber, pttBorderColor: COLORS.rxAmberBright, pttRingColor: COLORS.rxAmber,
      pttText: t('pttConnecting'), pttHint: t('pttHoldHint'),
      monitorBorderColor: COLORS.rxAmber, monitorBadgeBg: COLORS.rxAmberSoft,
      monitorBadgeColor: COLORS.rxAmberBright, monitorPrimaryText: t('pttConnecting'), monitorIcon: 'sync-outline',
    };
  }
  if (connectionState === 'disconnected') {
    return {
      pttBgColor: COLORS.borderDefault, pttBorderColor: COLORS.borderHighlight, pttRingColor: COLORS.borderDefault,
      pttText: t('pttDisconnected'), pttHint: t('pttHoldHint'),
      monitorBorderColor: COLORS.borderDefault, monitorBadgeBg: COLORS.accentCyanSoft,
      monitorBadgeColor: COLORS.accentCyan, monitorPrimaryText: t('pttDisconnected'), monitorIcon: 'radio-outline',
    };
  }
  if (isSpeakingLocally) {
    return {
      pttBgColor: COLORS.txGreen, pttBorderColor: COLORS.txGreenBright, pttRingColor: COLORS.txGreenBright,
      pttText: t('pttSpeaking'), pttHint: t('pttTransmittingHint'),
      monitorBorderColor: COLORS.txGreenBright, monitorBadgeBg: COLORS.txGreenSoft,
      monitorBadgeColor: COLORS.txGreenBright, monitorPrimaryText: t('channelTransmitting'), monitorIcon: 'mic',
    };
  }
  if (isChannelMuted) {
    return {
      pttBgColor: COLORS.dangerRedDark, pttBorderColor: COLORS.dangerRed, pttRingColor: COLORS.dangerRed,
      pttText: t('pttDefault'), pttHint: t('pttHoldHint'),
      monitorBorderColor: COLORS.rxAmber, monitorBadgeBg: COLORS.rxAmberSoft,
      monitorBadgeColor: COLORS.rxAmberBright, monitorPrimaryText: t('channelMuted'), monitorIcon: 'volume-mute',
    };
  }
  if (someoneElseSpeaking) {
    const label = `${activeSpeaker.name.toUpperCase()} ${t('isSpeaking')}`;
    return {
      pttBgColor: COLORS.borderDefault, pttBorderColor: COLORS.rxAmber, pttRingColor: COLORS.rxAmber,
      pttText: label, pttHint: t('pttBusyHint'),
      monitorBorderColor: COLORS.rxAmber, monitorBadgeBg: COLORS.rxAmberSoft,
      monitorBadgeColor: COLORS.rxAmberBright, monitorPrimaryText: label, monitorIcon: 'volume-high',
    };
  }
  return {
    pttBgColor: COLORS.dangerRedDark, pttBorderColor: COLORS.dangerRed, pttRingColor: COLORS.dangerRed,
    pttText: t('pttDefault'), pttHint: t('pttHoldHint'),
    monitorBorderColor: COLORS.borderDefault, monitorBadgeBg: COLORS.accentCyanSoft,
    monitorBadgeColor: COLORS.accentCyan, monitorPrimaryText: t('channelStandby'), monitorIcon: 'radio-outline',
  };
}

export function RadioTab({
  connectionState, activeSpeaker, t, isSpeakingLocally, isChannelMuted, handleToggleMute,
  roomCode, handleCopyRoomCode, visibleParticipants, confirmLeaveRoom,
  setSelectedUserForAction, setUserActionStep, userLocation, pulseAnim,
  handleTalkStart, handleTalkEnd, activePing, sendQuickPing, waypoint, handleTabPress,
}) {
  const isConnected = connectionState === 'connected';
  const someoneElseSpeaking = Boolean(activeSpeaker && !activeSpeaker.isLocal);
  const pttDisabled = !isConnected || someoneElseSpeaking;
  const speakerParticipant = someoneElseSpeaking
    ? visibleParticipants.find((p) => p.name === activeSpeaker.name)
    : null;
  const speakerDistance = speakerParticipant
    ? formatDriverDistance(userLocation, speakerParticipant.coords, false)
    : null;
  const waypointDistance = waypoint ? formatDriverDistance(userLocation, waypoint, false) : null;

  const ui = resolveRadioVisualState({ connectionState, activeSpeaker, isSpeakingLocally, isChannelMuted, t });
  const signalDotColor = isConnected
    ? COLORS.txGreenBright
    : connectionState === 'reconnecting'
      ? COLORS.rxAmberBright
      : COLORS.dangerRed;
  const isAudioActive = Boolean(isSpeakingLocally || someoneElseSpeaking);

  return (
    <View style={styles.radioCockpitContainer}>
      <View style={styles.hudHeaderCard}>
        <View style={styles.hudHeaderLeft}>
          <TouchableOpacity style={styles.hudChannelCodeBtn} onPress={handleCopyRoomCode} activeOpacity={0.8}>
            <View style={[styles.hudSignalDot, { backgroundColor: signalDotColor }]} />
            <Text style={styles.hudRoomCodeText}>#{roomCode}</Text>
            <Ionicons name="copy-outline" size={12} color={COLORS.textMuted} />
          </TouchableOpacity>
        </View>

        <View style={styles.hudHeaderRight}>
          <TouchableOpacity
            style={[styles.hudMuteBtn, isChannelMuted && styles.hudMuteBtnActive]}
            onPress={handleToggleMute}
            activeOpacity={0.8}
          >
            <Ionicons
              name={isChannelMuted ? 'volume-mute' : 'volume-high-outline'}
              size={16}
              color={isChannelMuted ? COLORS.rxAmberBright : COLORS.accentCyan}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.leaveButton} onPress={confirmLeaveRoom} activeOpacity={0.8}>
            <Ionicons name="power" size={13} color={COLORS.dangerRed} />
            <Text style={styles.leaveButtonText}>{t('leave')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.channelMonitorCard, { borderColor: ui.monitorBorderColor }]}>
        <View style={styles.channelMainRow}>
          <View style={styles.channelMainLeft}>
            <View style={[styles.channelWaveBadge, { backgroundColor: ui.monitorBadgeBg }]}>
              <Ionicons name={ui.monitorIcon} size={20} color={ui.monitorBadgeColor} />
            </View>
            <Text style={[styles.channelPrimaryText, { color: ui.monitorBadgeColor }]} numberOfLines={1}>
              {ui.monitorPrimaryText}
            </Text>
          </View>
          <View style={styles.channelRightRow}>
            {speakerDistance && (
              <View style={styles.channelDistanceBadge}>
                <Text style={styles.channelDistanceBadgeText}>{speakerDistance}</Text>
              </View>
            )}
            <View style={styles.channelBarsRow}>
              {SIGNAL_BAR_HEIGHTS.map((h, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.channelBar,
                    {
                      height: isAudioActive ? h : 5 + (idx % 2) * 3,
                      backgroundColor: isAudioActive ? ui.monitorBadgeColor : COLORS.borderHighlight,
                    },
                  ]}
                />
              ))}
            </View>
          </View>
        </View>
      </View>

      {activePing && (
        <View style={styles.pingAlertBanner}>
          <Ionicons name="radio" size={16} color={COLORS.rxAmberBright} />
          <Text style={styles.pingAlertText} numberOfLines={1}>
            {activePing.sender.toUpperCase()} — {t(PING_ALERT_KEYS[activePing.pingType] || 'pingAlertOk')}
          </Text>
        </View>
      )}

      <View style={styles.convoyStripSection}>
        <View style={styles.sectionMicroHeader}>
          <Text style={styles.sectionMicroTitle}>{t('convoyStripTitle')}</Text>
          <Text style={styles.sectionMicroTitle}>{t('people', visibleParticipants.length)}</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.convoyStripScroll}>
          {visibleParticipants.map((p) => {
            const isSpeaking = Boolean(activeSpeaker && activeSpeaker.name === p.name);
            const distanceLabel = formatDriverDistance(userLocation, p.coords, p.isLocal);
            const speedLabel = formatDriverSpeed(p.coords);
            const subLabel = p.isLocal
              ? speedLabel ? `${t('you')} • ${speedLabel}` : t('you')
              : [distanceLabel, speedLabel].filter(Boolean).join(' • ') || t('connected');
            return (
              <TouchableOpacity
                key={p.id}
                style={[styles.participantChip, isSpeaking && styles.participantChipSpeaking]}
                onPress={() => {
                  if (!p.isLocal) {
                    setSelectedUserForAction(p);
                    setUserActionStep('menu');
                  }
                }}
                activeOpacity={p.isLocal ? 1 : 0.75}
              >
                <View style={[styles.avatarBadge, isSpeaking && styles.avatarBadgeSpeaking]}>
                  {isSpeaking ? (
                    <Ionicons name="volume-high" size={14} color={COLORS.white} />
                  ) : (
                    <Text style={styles.avatarBadgeText}>{p.name.charAt(0).toUpperCase()}</Text>
                  )}
                </View>
                <View style={styles.chipMetaCol}>
                  <View style={styles.chipNameRow}>
                    <Text style={styles.chipText} numberOfLines={1}>{p.name}</Text>
                    {p.isLeader && (
                      <View style={styles.leaderMiniBadge}>
                        <Text style={styles.leaderMiniBadgeText}>{t('leader')}</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.chipDistanceText}>{subLabel}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <View style={styles.radioMiniMapCard}>
        <View style={styles.radioMiniMapHeader}>
          <View style={styles.radioMiniMapHeaderLeft}>
            <Ionicons name={waypoint ? 'flag' : 'navigate-circle-outline'} size={13} color={waypoint ? COLORS.rxAmberBright : COLORS.accentCyan} />
            <Text style={[styles.radioMiniMapTitle, waypoint && { color: COLORS.rxAmberBright }]} numberOfLines={1}>
              {waypoint ? `${t('waypointTitle')}${waypointDistance ? ` • ${waypointDistance}` : ''}` : t('miniMapTitle')}
            </Text>
          </View>
          <TouchableOpacity style={styles.radioMiniMapExpandBtn} onPress={() => handleTabPress && handleTabPress('map')} activeOpacity={0.8}>
            <Text style={styles.radioMiniMapExpandText}>{t('openFullMap')}</Text>
            <Ionicons name="expand-outline" size={11} color={COLORS.accentCyan} />
          </TouchableOpacity>
        </View>
        <MapView
          style={styles.radioMiniMapView}
          provider={PROVIDER_DEFAULT}
          region={userLocation}
          showsUserLocation={true}
          showsMyLocationButton={false}
          pitchEnabled={false}
          rotateEnabled={false}
        >
          {visibleParticipants.map((p) => (
            <Marker key={p.id} coordinate={p.coords || userLocation} title={p.name} />
          ))}
          {waypoint && (
            <Marker coordinate={{ latitude: waypoint.latitude, longitude: waypoint.longitude }} title={t('waypointTitle')} pinColor={COLORS.rxAmber} />
          )}
        </MapView>
      </View>

      <View style={styles.quickPingRow}>
        {QUICK_PING_ITEMS.map((item) => (
          <TouchableOpacity key={item.type} style={styles.quickPingBtn} onPress={() => sendQuickPing(item.type)} activeOpacity={0.8}>
            <Ionicons name={item.icon} size={15} color={item.color} />
            <Text style={styles.quickPingBtnText}>{t(item.labelKey)}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.pttContainer}>
        <View style={styles.pttOuterChassis}>
          {activeSpeaker && (
            <Animated.View style={[styles.pulseRing, { borderColor: ui.pttRingColor, transform: [{ scale: pulseAnim }] }]} />
          )}
          <TouchableOpacity
            style={[
              styles.pttButton,
              { backgroundColor: ui.pttBgColor, borderColor: ui.pttBorderColor },
              pttDisabled && styles.pttButtonDisabled,
            ]}
            onPressIn={handleTalkStart}
            onPressOut={handleTalkEnd}
            disabled={pttDisabled}
            activeOpacity={0.85}
          >
            <Ionicons name={isSpeakingLocally ? 'mic' : someoneElseSpeaking ? 'volume-high' : 'mic-outline'} size={32} color={COLORS.white} />
            <Text style={styles.pttText}>{ui.pttText}</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.pttSubHint}>{ui.pttHint}</Text>
      </View>
    </View>
  );
}



