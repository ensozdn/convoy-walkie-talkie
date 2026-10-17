import React from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/styles';
export { UserActionModal, BlockedUsersModal } from './UserModerationModals';

export function GuideModal({ showGuide, handleCloseGuide, t }) {
  return (
    <Modal visible={showGuide} animationType="fade" transparent={true} onRequestClose={handleCloseGuide}>
      <View style={styles.modalOverlay}>
        <View style={styles.guideCard}>
          <View style={styles.guideHeader}>
            <View style={styles.guideTitleRow}>
              <Ionicons name="compass-outline" size={22} color="#38bdf8" />
              <Text style={styles.guideTitleText}>{t('guideTitle')}</Text>
            </View>
            <TouchableOpacity onPress={handleCloseGuide} activeOpacity={0.75}>
              <Ionicons name="close" size={22} color="#94a3b8" />
            </TouchableOpacity>
          </View>

          <View style={styles.guideStepsContainer}>
            <View style={styles.guideStepRow}>
              <View style={styles.guideStepIconBox}>
                <Ionicons name="person-add-outline" size={18} color="#38bdf8" />
              </View>
              <View style={styles.guideStepContent}>
                <Text style={styles.guideStepTitle}>{t('step1Title')}</Text>
                <Text style={styles.guideStepDesc}>{t('step1Desc')}</Text>
              </View>
            </View>

            <View style={styles.guideStepRow}>
              <View style={styles.guideStepIconBox}>
                <Ionicons name="share-social-outline" size={18} color="#38bdf8" />
              </View>
              <View style={styles.guideStepContent}>
                <Text style={styles.guideStepTitle}>{t('step2Title')}</Text>
                <Text style={styles.guideStepDesc}>{t('step2Desc')}</Text>
              </View>
            </View>

            <View style={styles.guideStepRow}>
              <View style={styles.guideStepIconBox}>
                <Ionicons name="mic-outline" size={18} color="#38bdf8" />
              </View>
              <View style={styles.guideStepContent}>
                <Text style={styles.guideStepTitle}>{t('step3Title')}</Text>
                <Text style={styles.guideStepDesc}>{t('step3Desc')}</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.guideButton} onPress={handleCloseGuide} activeOpacity={0.85}>
            <Text style={styles.guideButtonText}>{t('gotIt')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

export function EulaModal({
  showEulaModal,
  isEulaFromSettings,
  setShowEulaModal,
  t,
  lang,
  changeLanguage,
  handleAgreeEula,
}) {
  return (
    <Modal
      visible={showEulaModal}
      animationType="fade"
      transparent={true}
      onRequestClose={() => {
        if (isEulaFromSettings) setShowEulaModal(false);
      }}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.eulaCard}>
          <View style={styles.eulaHeader}>
            <View style={styles.eulaTitleRow}>
              <View style={styles.eulaIconBox}>
                <Ionicons name="shield-checkmark" size={22} color="#38bdf8" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.eulaTitleText}>{t('eulaTitle')}</Text>
                <Text style={styles.eulaSubtitleText}>{t('eulaSubtitle')}</Text>
              </View>
            </View>

            <View style={styles.eulaLangSwitch}>
              <TouchableOpacity
                style={[styles.eulaLangBtn, lang === 'en' && styles.eulaLangBtnActive]}
                onPress={() => changeLanguage('en')}
                activeOpacity={0.8}
              >
                <Text style={[styles.eulaLangText, lang === 'en' && styles.eulaLangTextActive]}>EN</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.eulaLangBtn, lang === 'tr' && styles.eulaLangBtnActive]}
                onPress={() => changeLanguage('tr')}
                activeOpacity={0.8}
              >
                <Text style={[styles.eulaLangText, lang === 'tr' && styles.eulaLangTextActive]}>TR</Text>
              </TouchableOpacity>
            </View>

            {isEulaFromSettings && (
              <TouchableOpacity
                onPress={() => setShowEulaModal(false)}
                activeOpacity={0.75}
                style={{ padding: 4, marginLeft: 6 }}
              >
                <Ionicons name="close" size={22} color="#94a3b8" />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.eulaWarningBanner}>
            <Ionicons name="warning" size={18} color="#f59e0b" />
            <Text style={styles.eulaWarningTitle}>{t('eulaZeroToleranceBadge')}</Text>
          </View>

          <ScrollView style={styles.eulaScrollView} showsVerticalScrollIndicator={true} bounces={false}>
            <Text style={styles.eulaBodyText}>{t('eulaContent')}</Text>

            <View style={styles.eulaPointsContainer}>
              <View style={styles.eulaPointRow}>
                <Ionicons name="person-circle" size={16} color="#38bdf8" />
                <Text style={styles.eulaPointText}>{t('eulaPoint1')}</Text>
              </View>
              <View style={styles.eulaPointRow}>
                <Ionicons name="checkmark-circle" size={16} color="#22c55e" />
                <Text style={styles.eulaPointText}>{t('eulaPoint2')}</Text>
              </View>
              <View style={styles.eulaPointRow}>
                <Ionicons name="ban" size={16} color="#ef4444" />
                <Text style={styles.eulaPointText}>{t('eulaPoint3')}</Text>
              </View>
              <View style={styles.eulaPointRow}>
                <Ionicons name="time" size={16} color="#f59e0b" />
                <Text style={styles.eulaPointText}>{t('eulaPoint4')}</Text>
              </View>
              <View style={styles.eulaPointRow}>
                <Ionicons name="hand-left" size={16} color="#a855f7" />
                <Text style={styles.eulaPointText}>{t('eulaPoint5')}</Text>
              </View>
            </View>

            <View style={styles.eulaSupportBox}>
              <Ionicons name="mail-outline" size={16} color="#38bdf8" />
              <Text style={styles.eulaSupportText}>{t('eulaSupportInfo')}</Text>
            </View>
          </ScrollView>

          <TouchableOpacity
            style={styles.eulaAgreeButton}
            onPress={isEulaFromSettings ? () => setShowEulaModal(false) : handleAgreeEula}
            activeOpacity={0.85}
          >
            <Ionicons
              name={isEulaFromSettings ? 'checkmark' : 'shield-checkmark'}
              size={20}
              color="#0f172a"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.eulaAgreeButtonText}>
              {isEulaFromSettings ? t('eulaCloseBtn') : t('eulaAgreeBtn')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

