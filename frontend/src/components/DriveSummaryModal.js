import React from 'react';
import { Modal, View, Text, TouchableOpacity, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/styles';
import { COLORS } from '../styles/theme';

export function DriveSummaryModal({ summaryData, onClose, onDisable, t }) {
  if (!summaryData) return null;

  const handleShare = async () => {
    try {
      const msg = typeof t === 'function' && t('shareDriveMessage')
        ? t('shareDriveMessage')(summaryData.roomCode, summaryData.distanceKm, summaryData.durationMinutes, summaryData.maxSpeedKmh)
        : `Konvoy tamamlandı! Toplam ${summaryData.distanceKm} km yolu ${summaryData.durationMinutes} dakikada tamamladık. Frekans: #${summaryData.roomCode}`;
      await Share.share({ message: msg });
    } catch (e) {
      console.warn('[DRIVE_SUMMARY] Paylasim hatasi:', e?.message ?? e);
    }
  };

  const handleOptOut = () => {
    if (typeof onDisable === 'function') {
      onDisable(false);
    }
    onClose();
  };

  return (
    <Modal visible={Boolean(summaryData)} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.driveSummaryCard}>
          <View style={styles.driveSummaryHeader}>
            <View style={styles.driveSummaryIconBox}>
              <Ionicons name="speedometer" size={24} color={COLORS.accentCyan} />
            </View>
            <Text style={styles.driveSummaryTitle}>{t('driveSummaryTitle')}</Text>
            <Text style={styles.driveSummarySub}>{t('driveSummarySub')}</Text>
          </View>

          <View style={styles.driveSummaryStatsRow}>
            <View style={styles.driveSummaryStatItem}>
              <Ionicons name="navigate-outline" size={16} color={COLORS.accentCyan} />
              <Text style={styles.driveSummaryStatValue}>{summaryData.distanceKm} km</Text>
              <Text style={styles.driveSummaryStatLabel}>{t('totalDistance')}</Text>
            </View>

            <View style={styles.driveSummaryStatItem}>
              <Ionicons name="timer-outline" size={16} color={COLORS.rxAmberBright} />
              <Text style={styles.driveSummaryStatValue}>{summaryData.durationMinutes} {t('durationUnitShort')}</Text>
              <Text style={styles.driveSummaryStatLabel}>{t('totalDuration')}</Text>
            </View>

            <View style={styles.driveSummaryStatItem}>
              <Ionicons name="flash-outline" size={16} color={COLORS.txGreenBright} />
              <Text style={styles.driveSummaryStatValue}>{summaryData.maxSpeedKmh} {t('speedUnitLower')}</Text>
              <Text style={styles.driveSummaryStatLabel}>{t('maxSpeed')}</Text>
            </View>
          </View>

          <View style={styles.driveSummaryActions}>
            <TouchableOpacity style={styles.driveSummaryShareBtn} onPress={handleShare} activeOpacity={0.85}>
              <Ionicons name="share-social-outline" size={18} color={COLORS.bgPrimary} />
              <Text style={styles.driveSummaryShareText}>{t('shareSummary')}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.driveSummaryCloseBtn} onPress={onClose} activeOpacity={0.85}>
              <Text style={styles.driveSummaryCloseText}>{t('backToLobby')}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.driveSummaryOptOutBtn} onPress={handleOptOut} activeOpacity={0.75}>
              <Ionicons name="eye-off-outline" size={13} color={COLORS.textDim} />
              <Text style={styles.driveSummaryOptOutText}>{t('dontShowAgain')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
