import React from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { PROVIDER_DEFAULT, Marker } from 'react-native-maps';
import { styles } from '../styles/styles';
import { COLORS } from '../styles/theme';
import { formatDriverDistance } from '../utils/geo';
import { PingAlertBanner } from '../components/PingAlertBanner';
import { ConvoyAvatarStrip } from '../components/ConvoyAvatarStrip';

const QUICK_PING_ITEMS = [
  { type: 'break', labelKey: 'pingBreak', icon: 'cafe-outline', color: COLORS.accentCyan },
  { type: 'slow', labelKey: 'pingSlow', icon: 'speedometer-outline', color: COLORS.rxAmberBright },
  { type: 'hazard', labelKey: 'pingHazard', icon: 'warning-outline', color: COLORS.dangerRed },
  { type: 'ok', labelKey: 'pingOk', icon: 'checkmark-circle-outline', color: COLORS.txGreenBright },
];

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

export const RadioTab = React.memo(function RadioTab({
  connectionState, activeSpeaker, t, isSpeakingLocally, isChannelMuted, handleToggleMute,
  roomCode, handleCopyRoomCode, visibleParticipants, confirmLeaveRoom,
  setSelectedUserForAction, setUserActionStep, userLocation, pulseAnim,
  handleTalkStart, handleTalkEnd, activePing, sendQuickPing, waypoint, handleTabPress,
  onOpenAvatarModal, driveSession,
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

      <View style={styles.cockpitTelemetryBar}>
        <View style={styles.cockpitSpeedometer}>
          <Text style={styles.cockpitSpeedValue}>{driveSession?.currentSpeedKmh ?? userLocation?.speedKmh ?? 0}</Text>
          <View style={styles.cockpitSpeedUnitCol}>
            <Text style={styles.cockpitSpeedUnit}>{t('speedUnitUpper')}</Text>
            <Text style={styles.cockpitSpeedLabel}>{t('gpsSpeed')}</Text>
          </View>
        </View>
        <View style={styles.cockpitStatsDivider} />
        <View style={styles.cockpitStatItem}>
          <Ionicons name="navigate-outline" size={13} color={COLORS.accentCyan} />
          <View>
            <Text style={styles.cockpitStatLabel}>{t('tripDistance')}</Text>
            <Text style={styles.cockpitStatValue}>{driveSession?.sessionDistanceKm ?? '0.0'} km</Text>
          </View>
        </View>
        <View style={styles.cockpitStatsDivider} />
        <View style={styles.cockpitStatItem}>
          <Ionicons name="timer-outline" size={13} color={COLORS.rxAmberBright} />
          <View>
            <Text style={styles.cockpitStatLabel}>{t('tripDuration')}</Text>
            <Text style={styles.cockpitStatValue}>{driveSession?.sessionDurationMinutes ?? 1} {t('durationUnitShort')}</Text>
          </View>
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

      <PingAlertBanner activePing={activePing} t={t} />

      <ConvoyAvatarStrip
        visibleParticipants={visibleParticipants}
        activeSpeaker={activeSpeaker}
        t={t}
        setSelectedUserForAction={setSelectedUserForAction}
        setUserActionStep={setUserActionStep}
        handleTabPress={handleTabPress}
        onOpenAvatarModal={onOpenAvatarModal}
      />

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
          initialRegion={userLocation}
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
});



