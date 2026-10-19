import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/styles';
import { COLORS } from '../styles/theme';

export function SettingsLegalSection({
  t, openEulaModal, handleCopySupportMail, setShowBlockedUsersModal, blockedUsers,
}) {
  return (
    <View style={styles.settingsSection}>
      <Text style={styles.settingsSectionLabel}>{t('safetyLegalSection')}</Text>
      <View style={styles.settingsCard}>
        <TouchableOpacity style={styles.settingsRow} onPress={openEulaModal} activeOpacity={0.8}>
          <View style={styles.settingsRowLeft}>
            <View style={styles.settingsIconBox}>
              <Ionicons name="document-text" size={18} color={COLORS.accentCyan} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingsRowTitle}>{t('termsOfUse')}</Text>
              <Text style={styles.settingsRowSub}>{t('termsOfUseSub')}</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={16} color={COLORS.textDim} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.settingsRow, styles.settingsRowDivider]} onPress={openEulaModal} activeOpacity={0.8}>
          <View style={styles.settingsRowLeft}>
            <View style={styles.settingsIconBox}>
              <Ionicons name="shield-checkmark" size={18} color={COLORS.txGreenBright} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingsRowTitle}>{t('communityGuidelines')}</Text>
              <Text style={styles.settingsRowSub}>{t('communityGuidelinesSub')}</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={16} color={COLORS.textDim} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.settingsRow, styles.settingsRowDivider]}
          onPress={handleCopySupportMail}
          activeOpacity={0.8}
        >
          <View style={styles.settingsRowLeft}>
            <View style={styles.settingsIconBox}>
              <Ionicons name="mail" size={18} color={COLORS.rxAmberBright} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingsRowTitle}>{t('supportMail')}</Text>
              <Text style={[styles.settingsRowSub, { color: COLORS.accentCyan }]}>{t('supportMailSub')}</Text>
            </View>
          </View>
          <Ionicons name="copy-outline" size={16} color={COLORS.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.settingsRow, styles.settingsRowDivider]}
          onPress={() => setShowBlockedUsersModal(true)}
          activeOpacity={0.8}
        >
          <View style={styles.settingsRowLeft}>
            <View style={styles.settingsIconBox}>
              <Ionicons name="ban" size={18} color={COLORS.dangerRed} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingsRowTitle}>{t('blockedUsersTitle')}</Text>
              <Text style={styles.settingsRowSub}>{t('blockedUsersCount', blockedUsers.length)}</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={16} color={COLORS.textDim} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
