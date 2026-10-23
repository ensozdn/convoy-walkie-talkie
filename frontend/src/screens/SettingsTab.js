import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from 'expo-clipboard';
import { styles } from '../styles/styles';
import { COLORS } from '../styles/theme';
import { MiniLangSelector } from '../components/LangSelectors';
import { getVehicleIcon } from '../utils/avatar';
import { ConvoyBanner } from '../components/AdBanners';
import { SettingsLegalSection } from '../components/SettingsLegalSection';

export const SettingsTab = React.memo(function SettingsTab({
  lang, changeLanguage, isEditingName, username, setEditingName, setIsEditingName,
  editingName, handleSaveName, rogerBeep, setRogerBeep, rogerBeepRef, playBeepOff,
  t, setIsEulaFromSettings, setShowEulaModal, triggerToast, setShowBlockedUsersModal,
  blockedUsers, setShowGuide, avatarColor, vehicleType, setShowAvatarModal,
  ads,
}) {
  const handleToggleRogerBeep = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const nextVal = !rogerBeep;
    setRogerBeep(nextVal);
    rogerBeepRef.current = nextVal;
    try {
      await AsyncStorage.setItem('@convoy_roger_beep', JSON.stringify(nextVal));
    } catch (e) {
      console.error('[SETTINGS] Roger beep tercihi kaydedilemedi:', e.message);
    }
    if (nextVal) playBeepOff();
  };

  const handleCopySupportMail = async () => {
    await Clipboard.setStringAsync('support@tripnoute.com');
    triggerToast(t('toastSupportCopied'));
  };

  const openEulaModal = () => {
    setIsEulaFromSettings(true);
    setShowEulaModal(true);
  };

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={styles.settingsScrollContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.tabHeaderRow}>
        <View style={styles.tabTitleWrapper}>
          <Ionicons name="settings" size={20} color={COLORS.accentCyan} />
          <Text style={styles.tabTitleText}>{t('settingsTitle')}</Text>
        </View>
        <MiniLangSelector lang={lang} changeLanguage={changeLanguage} />
      </View>

      <View style={styles.settingsSection}>
        <Text style={styles.settingsSectionLabel}>{t('profileSection')}</Text>
        <View style={styles.settingsCard}>
          <View style={styles.settingsRow}>
            <View style={styles.settingsRowLeft}>
              <View style={styles.settingsIconBox}>
                <Ionicons name="person" size={18} color={COLORS.accentCyan} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.settingsRowTitle}>{t('driverNameLabel')}</Text>
                {!isEditingName && <Text style={styles.settingsRowSub}>{username || '—'}</Text>}
              </View>
            </View>
            {!isEditingName && (
              <TouchableOpacity
                style={styles.settingsEditBtn}
                onPress={() => {
                  setEditingName(username);
                  setIsEditingName(true);
                }}
                activeOpacity={0.8}
              >
                <Ionicons name="pencil" size={14} color={COLORS.accentCyan} />
              </TouchableOpacity>
            )}
          </View>
          {isEditingName && (
            <View style={styles.nameEditRow}>
              <TextInput
                style={styles.nameEditInput}
                value={editingName}
                onChangeText={setEditingName}
                autoFocus
                autoCapitalize="words"
                returnKeyType="done"
                onSubmitEditing={handleSaveName}
                placeholderTextColor={COLORS.textDim}
                placeholder={t('enterNewName')}
              />
              <TouchableOpacity style={styles.nameSaveBtn} onPress={handleSaveName} activeOpacity={0.85}>
                <Ionicons name="checkmark" size={18} color={COLORS.bgPrimary} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.nameCancelBtn}
                onPress={() => setIsEditingName(false)}
                activeOpacity={0.85}
              >
                <Ionicons name="close" size={18} color={COLORS.textMuted} />
              </TouchableOpacity>
            </View>
          )}
          <View style={[styles.settingsRow, { borderTopWidth: 1, borderTopColor: COLORS.borderSubtle, marginTop: 8, paddingTop: 10 }]}>
            <View style={styles.settingsRowLeft}>
              <View style={[styles.settingsIconBox, { backgroundColor: `${avatarColor}22`, borderColor: avatarColor }]}>
                <Ionicons name={getVehicleIcon(vehicleType) || 'car-sport'} size={18} color={avatarColor} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.settingsRowTitle}>{t('avatarModalTitle')}</Text>
                <Text style={styles.settingsRowSub}>{t('avatarModalSub')}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.settingsEditBtn}
              onPress={() => setShowAvatarModal(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="color-palette-outline" size={16} color={avatarColor} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.settingsSection}>
        <Text style={styles.settingsSectionLabel}>{t('audioSection')}</Text>
        <View style={styles.settingsCard}>
          <View style={styles.settingsRow}>
            <View style={styles.settingsRowLeft}>
              <View style={styles.settingsIconBox}>
                <Ionicons name="radio" size={18} color={COLORS.accentCyan} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.settingsRowTitle}>{t('rogerBeepTitle')}</Text>
                <Text style={styles.settingsRowSub}>{t('rogerBeepSub')}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={[styles.toggleTrack, rogerBeep && styles.toggleTrackOn]}
              onPress={handleToggleRogerBeep}
              activeOpacity={0.85}
            >
              <View style={[styles.toggleThumb, rogerBeep && styles.toggleThumbOn]} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <SettingsLegalSection
        t={t}
        openEulaModal={openEulaModal}
        handleCopySupportMail={handleCopySupportMail}
        setShowBlockedUsersModal={setShowBlockedUsersModal}
        blockedUsers={blockedUsers}
      />

      <View style={styles.settingsSection}>
        <Text style={styles.settingsSectionLabel}>{t('helpSection')}</Text>
        <View style={styles.settingsCard}>
          <TouchableOpacity style={styles.settingsRow} onPress={() => setShowGuide(true)} activeOpacity={0.8}>
            <View style={styles.settingsRowLeft}>
              <View style={styles.settingsIconBox}>
                <Ionicons name="help-circle" size={18} color={COLORS.accentCyan} />
              </View>
              <Text style={[styles.settingsRowTitle, { flex: 1 }]}>{t('guideTitle')}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={COLORS.textDim} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.settingsSection}>
        <Text style={styles.settingsSectionLabel}>{t('appSection')}</Text>
        <View style={styles.settingsCard}>
          <View style={styles.settingsRow}>
            <View style={styles.settingsRowLeft}>
              <View style={styles.settingsIconBox}>
                <Ionicons name="information-circle" size={18} color={COLORS.accentCyan} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.settingsRowTitle}>{t('title')}</Text>
                <Text style={styles.settingsRowSub}>{t('appVersionSub')}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.settingsSection}>
        <Text style={styles.settingsSectionLabel}>{t('experienceSection')}</Text>
        <View style={styles.settingsCard}>
          <TouchableOpacity
            style={styles.settingsRow}
            onPress={ads?.showRewardedAd}
            onLongPress={ads?.resetAdFreeForTest}
            activeOpacity={0.8}
            disabled={ads?.isRewardedLoading}
          >
            <View style={styles.settingsRowLeft}>
              <View style={[styles.settingsIconBox, ads?.isAdFree && { backgroundColor: COLORS.txGreenSoft, borderColor: COLORS.txGreenBright }]}>
                <Ionicons name={ads?.isAdFree ? 'shield-checkmark' : 'play-circle-outline'} size={18} color={ads?.isAdFree ? COLORS.txGreenBright : COLORS.accentCyan} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.settingsRowTitle}>{ads?.isAdFree ? t('adFreeActiveBadge') : t('rewardedBtnTitle')}</Text>
                <Text style={styles.settingsRowSub}>{ads?.isAdFree ? t('adFreeRemaining', ads?.adFreeRemainingHours) : t('rewardedBtnSub')}</Text>
              </View>
            </View>
            {ads?.isAdFree ? (
              <View style={styles.adFreePillBadge}><Text style={styles.adFreePillText}>{t('adFreePillActive')}</Text></View>
            ) : ads?.isRewardedLoading ? (
              <ActivityIndicator size="small" color={COLORS.accentCyan} />
            ) : (
              <View style={styles.watchVideoPillBadge}>
                <Ionicons name="play" size={10} color={COLORS.bgPrimary} />
                <Text style={styles.watchVideoPillText}>{t('watchAdPill')}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ConvoyBanner isAdFree={ads?.isAdFree} style={{ marginTop: 4, marginBottom: 24, paddingHorizontal: 16 }} />
    </ScrollView>
  );
});
