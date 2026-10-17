import React from 'react';
import { Animated, Text } from 'react-native';
import { styles } from '../styles/styles';
import { Ionicons } from '@expo/vector-icons';

export function Toast({ toastMessage, toastAnim }) {
  if (!toastMessage) return null;
  return (
    <Animated.View style={[styles.toastBanner, { transform: [{ translateY: toastAnim }] }]}>
      <Ionicons name="information-circle-outline" size={20} color="#38bdf8" />
      <Text style={styles.toastBannerText}>{toastMessage}</Text>
    </Animated.View>
  );
}
