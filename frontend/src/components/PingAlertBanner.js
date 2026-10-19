import React, { useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/styles';
import { COLORS } from '../styles/theme';

const PING_CONFIG = {
  break: {
    icon: 'cafe',
    color: COLORS.accentCyan,
    bg: COLORS.accentCyanSoft,
    textKey: 'pingAlertBreak',
  },
  slow: {
    icon: 'speedometer',
    color: COLORS.rxAmberBright,
    bg: COLORS.rxAmberSoft,
    textKey: 'pingAlertSlow',
  },
  hazard: {
    icon: 'warning',
    color: COLORS.dangerRed,
    bg: COLORS.dangerRedSoft,
    textKey: 'pingAlertHazard',
  },
  ok: {
    icon: 'checkmark-circle',
    color: COLORS.txGreenBright,
    bg: COLORS.txGreenSoft,
    textKey: 'pingAlertOk',
  },
};

export const PingAlertBanner = React.memo(function PingAlertBanner({ activePing, t }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (activePing) {
      Animated.spring(anim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 80,
        friction: 9,
      }).start();
    } else {
      Animated.timing(anim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [activePing, anim]);

  if (!activePing) return null;

  const cfg = PING_CONFIG[activePing.pingType] || PING_CONFIG.ok;

  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [-16, 0],
  });

  return (
    <Animated.View
      style={[
        styles.pingFloatingAlert,
        {
          borderColor: cfg.color,
          opacity: anim,
          transform: [{ translateY }],
        },
      ]}
    >
      <View style={[styles.pingAlertIconBox, { backgroundColor: cfg.bg }]}>
        <Ionicons name={cfg.icon} size={20} color={cfg.color} />
      </View>
      <View style={styles.pingAlertContent}>
        <View style={styles.pingAlertSenderRow}>
          <View style={styles.pingAlertSenderBadge}>
            <Text style={styles.pingAlertSenderText} numberOfLines={1}>
              {activePing.sender.toUpperCase()}
            </Text>
          </View>
        </View>
        <Text style={[styles.pingAlertMessage, { color: cfg.color }]} numberOfLines={2}>
          {t(cfg.textKey)}
        </Text>
      </View>
    </Animated.View>
  );
});
