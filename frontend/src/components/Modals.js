import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/styles';
import { COLORS } from '../styles/theme';
export { UserActionModal, BlockedUsersModal } from './UserModerationModals';

const TUTORIAL_STEPS = [
  {
    icon: 'person-outline',
    color: COLORS.accentCyan,
    bg: COLORS.accentCyanSoft,
    badgeKey: 'tutorialStep1Badge',
    titleKey: 'tutorialStep1Title',
    descKey: 'tutorialStep1Desc',
  },
  {
    icon: 'add-circle-outline',
    color: COLORS.txGreenBright,
    bg: COLORS.txGreenSoft,
    badgeKey: 'tutorialStep2Badge',
    titleKey: 'tutorialStep2Title',
    descKey: 'tutorialStep2Desc',
  },
  {
    icon: 'mic',
    color: COLORS.dangerRed,
    bg: COLORS.dangerRedSoft,
    badgeKey: 'tutorialStep3Badge',
    titleKey: 'tutorialStep3Title',
    descKey: 'tutorialStep3Desc',
  },
  {
    icon: 'flag-outline',
    color: COLORS.rxAmberBright,
    bg: COLORS.rxAmberSoft,
    badgeKey: 'tutorialStep4Badge',
    titleKey: 'tutorialStep4Title',
    descKey: 'tutorialStep4Desc',
  },
];

export function GuideModal({ showGuide, handleCloseGuide, t }) {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (showGuide) setStepIndex(0);
  }, [showGuide]);

  const current = TUTORIAL_STEPS[stepIndex] || TUTORIAL_STEPS[0];
  const isLastStep = stepIndex === TUTORIAL_STEPS.length - 1;

  return (
    <Modal visible={showGuide} animationType="fade" transparent={true} onRequestClose={handleCloseGuide}>
      <View style={styles.modalOverlay}>
        <View style={styles.guideCard}>
          <View style={styles.guideHeader}>
            <View style={styles.guideTitleRow}>
              <Ionicons name="compass-outline" size={20} color={COLORS.accentCyan} />
              <Text style={styles.guideTitleText}>{t('guideTitle')}</Text>
            </View>
            <TouchableOpacity onPress={handleCloseGuide} activeOpacity={0.75}>
              <Text style={styles.tutorialSkipText}>{t('tutorialSkip')}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.tutorialDotsRow}>
            {TUTORIAL_STEPS.map((_, idx) => (
              <View
                key={idx}
                style={[styles.tutorialDot, idx <= stepIndex && styles.tutorialDotActive]}
              />
            ))}
          </View>

          <View style={styles.tutorialSpotlightBox}>
            <View
              style={[
                styles.tutorialIconCircle,
                { backgroundColor: current.bg, borderColor: current.color },
              ]}
            >
              <Ionicons name={current.icon} size={28} color={current.color} />
            </View>
            <View style={styles.tutorialBadgePill}>
              <Text style={[styles.tutorialBadgeText, { color: current.color }]}>
                {t(current.badgeKey)}
              </Text>
            </View>
          </View>

          <Text style={styles.guideStepTitle}>{t(current.titleKey)}</Text>
          <Text style={styles.guideStepDesc}>{t(current.descKey)}</Text>

          <View style={styles.tutorialNavRow}>
            {stepIndex > 0 && (
              <TouchableOpacity
                style={styles.tutorialBackBtn}
                onPress={() => setStepIndex((prev) => Math.max(0, prev - 1))}
                activeOpacity={0.8}
              >
                <Text style={styles.tutorialBackBtnText}>{t('tutorialPrev')}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.guideButton}
              onPress={() => {
                if (isLastStep) {
                  handleCloseGuide();
                } else {
                  setStepIndex((prev) => prev + 1);
                }
              }}
              activeOpacity={0.85}
            >
              <Text style={styles.guideButtonText}>
                {isLastStep ? t('gotIt') : t('tutorialNext')}
              </Text>
            </TouchableOpacity>
          </View>
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

