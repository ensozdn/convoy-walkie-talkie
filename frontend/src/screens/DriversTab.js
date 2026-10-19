import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/styles';
import { COLORS } from '../styles/theme';
import { formatDriverDistance, formatDriverSpeed } from '../utils/geo';
import { resolveAvatarColors, getVehicleIcon } from '../utils/avatar';
import { QuickPttDock } from '../components/QuickPttDock';

export const DriversTab = React.memo(function DriversTab({
  t,
  roomCode,
  connectionState,
  isSpeakingLocally,
  handleTalkStart,
  handleTalkEnd,
  userLocation,
  visibleParticipants,
  activeSpeaker,
  handleTabPress,
  mapRef,
  setSelectedUserForAction,
  setUserActionStep,
}) {
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.fullScreenTabContainer}>
        <View style={styles.tabHeaderRow}>
          <View style={styles.tabTitleWrapper}>
            <Ionicons name="people" size={20} color={COLORS.accentCyan} />
            <Text style={styles.tabTitleText}>{t('tabDrivers')}</Text>
          </View>
          <View style={styles.driverCountBadge}>
            <Ionicons name="radio" size={12} color={COLORS.accentCyan} />
            <Text style={styles.driverCountText}>{t('people', visibleParticipants.length)}</Text>
          </View>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          bounces={false}
          contentContainerStyle={{ paddingBottom: 8 }}
        >
          {visibleParticipants.length === 0 ? (
            <View style={styles.emptyDriversContainer}>
              <Ionicons name="people-outline" size={48} color={COLORS.borderDefault} />
              <Text style={styles.emptyDriversText}>{t('emptyDrivers')}</Text>
            </View>
          ) : (
            visibleParticipants.map((p) => {
              const isSpeaking = Boolean(activeSpeaker && activeSpeaker.name === p.name);
              const distanceLabel = formatDriverDistance(userLocation, p.coords, p.isLocal);
              const speedLabel = formatDriverSpeed(p.coords);
              const telemetryLabel = [distanceLabel, speedLabel].filter(Boolean).join(' • ');
              return (
                <TouchableOpacity
                  key={p.id}
                  style={[styles.driverCard, isSpeaking && styles.driverCardSpeaking]}
                  onPress={() => {
                    if (p.coords) {
                      handleTabPress('map');
                      setTimeout(() => {
                        mapRef.current?.animateToRegion(
                          {
                            latitude: p.coords.latitude,
                            longitude: p.coords.longitude,
                            latitudeDelta: 0.005,
                            longitudeDelta: 0.005,
                          },
                          600
                        );
                      }, 300);
                    }
                  }}
                  activeOpacity={p.coords ? 0.75 : 1}
                >
                  {(() => {
                    const palette = resolveAvatarColors(p.avatarColor, p.name);
                    const vehicleIcon = getVehicleIcon(p.vehicleType);
                    return (
                      <View style={[styles.driverAvatarLarge, { backgroundColor: palette.bg, borderColor: isSpeaking ? COLORS.txGreenBright : palette.border }, isSpeaking && styles.driverAvatarLargeSpeaking]}>
                        {isSpeaking ? (
                          <Ionicons name="volume-high" size={22} color={COLORS.white} />
                        ) : vehicleIcon ? (
                          <Ionicons name={vehicleIcon} size={22} color={palette.border} />
                        ) : (
                          <Text style={[styles.driverAvatarText, { color: palette.text }]}>{p.name.charAt(0).toUpperCase()}</Text>
                        )}
                      </View>
                    );
                  })()}

                  <View style={styles.driverInfo}>
                    <View style={styles.driverNameRow}>
                      <Text style={[styles.driverNameText, isSpeaking && styles.driverNameTextSpeaking]}>
                        {p.name}
                      </Text>
                      {p.isLeader && (
                        <View style={styles.leaderBadge}>
                          <Ionicons name="star" size={9} color={COLORS.rxAmberBright} />
                          <Text style={styles.leaderBadgeText}>{t('leader')}</Text>
                        </View>
                      )}
                      {p.isLocal && (
                        <View style={styles.youBadge}>
                          <Text style={styles.youBadgeText}>{t('you')}</Text>
                        </View>
                      )}
                    </View>

                    <View style={styles.driverStatusRow}>
                      <View style={[styles.driverStatusDot, isSpeaking && styles.driverStatusDotSpeaking]} />
                      <Text style={[styles.driverStatusText, isSpeaking && styles.driverStatusTextSpeaking]}>
                        {isSpeaking ? t('speakingStatus') : t('listeningStatus')}
                      </Text>
                    </View>
                  </View>

                  {telemetryLabel ? (
                    <View style={styles.driverDistancePill}>
                      <Ionicons name="navigate-outline" size={12} color={COLORS.accentCyan} />
                      <Text style={styles.driverDistanceText}>{telemetryLabel}</Text>
                    </View>
                  ) : null}

                  {!p.isLocal && (
                    <TouchableOpacity
                      style={styles.driverMoreBtn}
                      onPress={(e) => {
                        e.stopPropagation();
                        setSelectedUserForAction(p);
                        setUserActionStep('menu');
                      }}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="ellipsis-vertical" size={16} color={COLORS.textMuted} />
                    </TouchableOpacity>
                  )}
                </TouchableOpacity>
              );
            })
          )}
        </ScrollView>
      </View>

      <QuickPttDock
        roomCode={roomCode}
        connectionState={connectionState}
        activeSpeaker={activeSpeaker}
        isSpeakingLocally={isSpeakingLocally}
        handleTalkStart={handleTalkStart}
        handleTalkEnd={handleTalkEnd}
        t={t}
      />
    </View>
  );
});

