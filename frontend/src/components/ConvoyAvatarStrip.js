import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/styles';
import { COLORS } from '../styles/theme';
import { resolveAvatarColors, getVehicleIcon } from '../utils/avatar';

export const ConvoyAvatarStrip = React.memo(function ConvoyAvatarStrip({
  visibleParticipants,
  activeSpeaker,
  t,
  setSelectedUserForAction,
  setUserActionStep,
  handleTabPress,
  onOpenAvatarModal,
}) {
  return (
    <View style={styles.convoyStripSection}>
      <View style={styles.sectionMicroHeader}>
        <Text style={styles.sectionMicroTitle}>{t('convoyStripTitle')}</Text>
        <TouchableOpacity
          style={styles.sectionMicroActionBtn}
          onPress={() => handleTabPress && handleTabPress('drivers')}
          activeOpacity={0.7}
        >
          <Text style={styles.sectionMicroActionText}>
            {t('people', visibleParticipants.length)}
          </Text>
          <Ionicons name="chevron-forward" size={11} color={COLORS.accentCyan} />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.convoyAvatarScroll}
      >
        {visibleParticipants.map((p) => {
          const isSpeaking = Boolean(activeSpeaker && activeSpeaker.name === p.name);
          const palette = resolveAvatarColors(p.avatarColor, p.name);
          const vehicleIcon = getVehicleIcon(p.vehicleType);
          const initial = p.name ? p.name.charAt(0).toUpperCase() : '?';

          return (
            <TouchableOpacity
              key={p.id || p.name}
              style={styles.avatarItemCol}
              onPress={() => {
                if (!p.isLocal) {
                  setSelectedUserForAction(p);
                  setUserActionStep('menu');
                } else if (onOpenAvatarModal) {
                  onOpenAvatarModal();
                } else if (handleTabPress) {
                  handleTabPress('drivers');
                }
              }}
              activeOpacity={0.75}
            >
              <View
                style={[
                  styles.avatarCircleWrapper,
                  {
                    backgroundColor: palette.bg,
                    borderColor: isSpeaking
                      ? COLORS.txGreenBright
                      : p.avatarColor
                        ? p.avatarColor
                        : p.isLeader
                          ? COLORS.rxAmberBright
                          : palette.border,
                  },
                  isSpeaking && styles.avatarCircleSpeaking,
                ]}
              >
                {isSpeaking ? (
                  <Ionicons name="volume-high" size={18} color={COLORS.txGreenBright} />
                ) : vehicleIcon ? (
                  <Ionicons name={vehicleIcon} size={18} color={palette.border} />
                ) : (
                  <Text style={[styles.avatarCircleText, { color: palette.text }]}>
                    {initial}
                  </Text>
                )}

                {p.isLeader && (
                  <View style={styles.avatarLeaderCrownBadge}>
                    <Ionicons name="star" size={8} color={COLORS.bgPrimary} />
                  </View>
                )}
                {isSpeaking && !p.isLeader && (
                  <View style={styles.avatarSpeakingMicBadge}>
                    <Ionicons name="mic" size={8} color={COLORS.white} />
                  </View>
                )}
              </View>

              <Text
                style={[
                  styles.avatarNameText,
                  p.isLocal && styles.avatarNameTextLocal,
                  isSpeaking && styles.avatarNameTextSpeaking,
                ]}
                numberOfLines={1}
              >
                {p.isLocal ? t('you') : p.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
});
