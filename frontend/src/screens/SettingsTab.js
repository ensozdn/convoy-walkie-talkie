import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from 'expo-clipboard';
import { styles } from '../styles/styles';
import { COLORS } from '../styles/theme';
import { MiniLangSelector } from '../components/LangSelectors';

export function SettingsTab({
  lang, changeLanguage, isEditingName, username, setEditingName, setIsEditingName,
  editingName, handleSaveName, rogerBeep, setRogerBeep, rogerBeepRef, playBeepOff,
  t, setIsEulaFromSettings, setShowEulaModal, triggerToast, setShowBlockedUsersModal,
  blockedUsers, setShowGuide,
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
    </ScrollView>
  );
}
