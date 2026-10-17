import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, TextInput } from 'react-native';
import { styles } from '../styles/styles';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from 'expo-clipboard';
import { MiniLangSelector } from '../components/LangSelectors';

export function SettingsTab({ lang, changeLanguage, isEditingName, username, setEditingName, setIsEditingName, editingName, handleSaveName, rogerBeep, setRogerBeep, rogerBeepRef, playBeepOff, t, setIsEulaFromSettings, setShowEulaModal, triggerToast, setShowBlockedUsersModal, blockedUsers, setShowGuide }) {
  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={styles.settingsScrollContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.tabHeaderRow}>
        <View style={styles.tabTitleWrapper}>
          <Ionicons name="settings" size={20} color="#38bdf8" />
          <Text style={styles.tabTitleText}>{lang === 'tr' ? 'Ayarlar' : 'Settings'}</Text>
        </View>
        <MiniLangSelector lang={lang} changeLanguage={changeLanguage} />
      </View>

      <View style={styles.settingsSection}>
        <Text style={styles.settingsSectionLabel}>{lang === 'tr' ? 'PROFİL' : 'PROFILE'}</Text>
        <View style={styles.settingsCard}>
          <View style={styles.settingsRow}>
            <View style={styles.settingsRowLeft}>
              <View style={styles.settingsIconBox}>
                <Ionicons name="person" size={18} color="#38bdf8" />
              </View>
              <View>
                <Text style={styles.settingsRowTitle}>{lang === 'tr' ? 'Sürücü Adı' : 'Driver Name'}</Text>
                {!isEditingName && (
                  <Text style={styles.settingsRowSub}>{username || '—'}</Text>
                )}
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
                <Ionicons name="pencil" size={14} color="#38bdf8" />
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
                placeholderTextColor="#64748b"
                placeholder={lang === 'tr' ? 'Yeni isim gir' : 'Enter new name'}
              />
              <TouchableOpacity style={styles.nameSaveBtn} onPress={handleSaveName} activeOpacity={0.85}>
                <Ionicons name="checkmark" size={18} color="#0f172a" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.nameCancelBtn}
                onPress={() => setIsEditingName(false)}
                activeOpacity={0.85}
              >
                <Ionicons name="close" size={18} color="#64748b" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      <View style={styles.settingsSection}>
        <Text style={styles.settingsSectionLabel}>{lang === 'tr' ? 'SES' : 'AUDIO'}</Text>
        <View style={styles.settingsCard}>
          <View style={styles.settingsRow}>
            <View style={styles.settingsRowLeft}>
              <View style={styles.settingsIconBox}>
                <Ionicons name="radio" size={18} color="#38bdf8" />
              </View>
              <View>
                <Text style={styles.settingsRowTitle}>Roger Beep</Text>
                <Text style={styles.settingsRowSub}>
                  {lang === 'tr' ? 'Telsiz kapanış bipi' : 'Radio end-of-transmission beep'}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={[styles.toggleTrack, rogerBeep && styles.toggleTrackOn]}
              onPress={async () => {
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
              }}
              activeOpacity={0.85}
            >
              <View style={[styles.toggleThumb, rogerBeep && styles.toggleThumbOn]} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Apple UGC: Güvenlik ve Yasal Bölümü */}
      <View style={styles.settingsSection}>
        <Text style={styles.settingsSectionLabel}>{t('safetyLegalSection')}</Text>
        <View style={styles.settingsCard}>
          {/* EULA Row */}
          <TouchableOpacity
            style={styles.settingsRow}
            onPress={() => {
              setIsEulaFromSettings(true);
              setShowEulaModal(true);
            }}
            activeOpacity={0.8}
          >
            <View style={styles.settingsRowLeft}>
              <View style={styles.settingsIconBox}>
                <Ionicons name="document-text" size={18} color="#38bdf8" />
              </View>
              <View>
                <Text style={styles.settingsRowTitle}>{t('termsOfUse')}</Text>
                <Text style={styles.settingsRowSub}>{t('termsOfUseSub')}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#475569" />
          </TouchableOpacity>

          {/* Community Guidelines Row */}
          <TouchableOpacity
            style={[styles.settingsRow, { borderTopWidth: 1, borderTopColor: '#1e293b' }]}
            onPress={() => {
              setIsEulaFromSettings(true);
              setShowEulaModal(true);
            }}
            activeOpacity={0.8}
          >
            <View style={styles.settingsRowLeft}>
              <View style={styles.settingsIconBox}>
                <Ionicons name="shield-checkmark" size={18} color="#22c55e" />
              </View>
              <View>
                <Text style={styles.settingsRowTitle}>{t('communityGuidelines')}</Text>
                <Text style={styles.settingsRowSub}>{t('communityGuidelinesSub')}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#475569" />
          </TouchableOpacity>

          {/* Support & Abuse Reporting Mail */}
          <TouchableOpacity
            style={[styles.settingsRow, { borderTopWidth: 1, borderTopColor: '#1e293b' }]}
            onPress={async () => {
              await Clipboard.setStringAsync('support@tripnoute.com');
              triggerToast(lang === 'tr' ? 'Destek e-postası kopyalandı: support@tripnoute.com' : 'Support email copied: support@tripnoute.com');
            }}
            activeOpacity={0.8}
          >
            <View style={styles.settingsRowLeft}>
              <View style={styles.settingsIconBox}>
                <Ionicons name="mail" size={18} color="#f59e0b" />
              </View>
              <View>
                <Text style={styles.settingsRowTitle}>{t('supportMail')}</Text>
                <Text style={[styles.settingsRowSub, { color: '#38bdf8' }]}>support@tripnoute.com</Text>
              </View>
            </View>
            <Ionicons name="copy-outline" size={16} color="#64748b" />
          </TouchableOpacity>

          {/* Blocked Drivers Management */}
          <TouchableOpacity
            style={[styles.settingsRow, { borderTopWidth: 1, borderTopColor: '#1e293b' }]}
            onPress={() => setShowBlockedUsersModal(true)}
            activeOpacity={0.8}
          >
            <View style={styles.settingsRowLeft}>
              <View style={styles.settingsIconBox}>
                <Ionicons name="ban" size={18} color="#ef4444" />
              </View>
              <View>
                <Text style={styles.settingsRowTitle}>{t('blockedUsersTitle')}</Text>
                <Text style={styles.settingsRowSub}>{t('blockedUsersCount', blockedUsers.length)}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#475569" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.settingsSection}>
        <Text style={styles.settingsSectionLabel}>{lang === 'tr' ? 'YARDIM' : 'HELP'}</Text>
        <View style={styles.settingsCard}>
          <TouchableOpacity
            style={styles.settingsRow}
            onPress={() => setShowGuide(true)}
            activeOpacity={0.8}
          >
            <View style={styles.settingsRowLeft}>
              <View style={styles.settingsIconBox}>
                <Ionicons name="help-circle" size={18} color="#38bdf8" />
              </View>
              <Text style={styles.settingsRowTitle}>{lang === 'tr' ? 'Kullanım Rehberi' : 'How to Use'}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#475569" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.settingsSection}>
        <Text style={styles.settingsSectionLabel}>{lang === 'tr' ? 'UYGULAMA' : 'APP'}</Text>
        <View style={styles.settingsCard}>
          <View style={styles.settingsRow}>
            <View style={styles.settingsRowLeft}>
              <View style={styles.settingsIconBox}>
                <Ionicons name="information-circle" size={18} color="#38bdf8" />
              </View>
              <View>
                <Text style={styles.settingsRowTitle}>Konvoy Telsiz</Text>
                <Text style={styles.settingsRowSub}>v1.0.0 (Build 9) — Professional PTT</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
