import React from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { styles } from '../styles/styles';
import { Ionicons } from '@expo/vector-icons';

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
            <TouchableOpacity onPress={handleCloseGuide} activeOpacity={0.75} style={{ padding: 4 }}>
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

export function EulaModal({ showEulaModal, isEulaFromSettings, setShowEulaModal, t, lang, changeLanguage, handleAgreeEula }) {
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
                <Text style={styles.eulaSubtitleText}>Convoy Radio Safety & Compliance</Text>
              </View>
            </View>

            {/* Quick Lang Switcher inside EULA */}
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

          {/* Zero Tolerance Warning Banner */}
          <View style={styles.eulaWarningBanner}>
            <Ionicons name="warning" size={18} color="#f59e0b" />
            <Text style={styles.eulaWarningTitle}>{t('eulaZeroToleranceBadge')}</Text>
          </View>

          <ScrollView style={styles.eulaScrollView} showsVerticalScrollIndicator={true} bounces={false}>
            <Text style={styles.eulaBodyText}>{t('eulaContent')}</Text>

            <View style={styles.eulaPointsContainer}>
              <View style={styles.eulaPointRow}>
                <Ionicons name="person-circle" size={16} color="#38bdf8" />
                <Text style={styles.eulaPointText}>
                  {lang === 'tr'
                    ? '1. 18+ Yaş Şartı: Convoy Radio yalnızca 18 yaş ve üzeri yetişkin kullanıcılar içindir.'
                    : '1. 18+ Age Requirement: Convoy Radio is strictly intended for users 18 years of age or older.'}
                </Text>
              </View>
              <View style={styles.eulaPointRow}>
                <Ionicons name="checkmark-circle" size={16} color="#22c55e" />
                <Text style={styles.eulaPointText}>
                  {lang === 'tr'
                    ? '2. Saygılı ve güvenli telsiz iletişimi esastır.'
                    : '2. Respectful and safe voice communication is strictly enforced.'}
                </Text>
              </View>
              <View style={styles.eulaPointRow}>
                <Ionicons name="ban" size={16} color="#ef4444" />
                <Text style={styles.eulaPointText}>
                  {lang === 'tr'
                    ? '3. Taciz, nefret söylemi ve kaba dil yasaktır; ihlal edenler anında kalıcı olarak sistemden uzaklaştırılır.'
                    : '3. Harassment, abusive language, hate speech, and threats are strictly forbidden; violators are permanently banned.'}
                </Text>
              </View>
              <View style={styles.eulaPointRow}>
                <Ionicons name="time" size={16} color="#f59e0b" />
                <Text style={styles.eulaPointText}>
                  {lang === 'tr'
                    ? '4. 24 Saat İçinde İnceleme: Şikayet edilen kullanıcı ve sakıncalı içerikler moderasyon ekibimizce 24 saat içinde incelenir ve ihlaller derhal kaldırılır.'
                    : '4. Reports are reviewed within 24 hours: Our moderation team investigates all complaints and permanently bans bad actors.'}
                </Text>
              </View>
              <View style={styles.eulaPointRow}>
                <Ionicons name="hand-left" size={16} color="#a855f7" />
                <Text style={styles.eulaPointText}>
                  {lang === 'tr'
                    ? '5. Kullanıcı engelleme (canlı ses susturma) ve şikayet etme mekanizmaları tüm katılımcılara sunulmuştur.'
                    : '5. In-app user blocking (instant audio mute) and reporting controls are readily available to all users.'}
                </Text>
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
              name={isEulaFromSettings ? "checkmark" : "shield-checkmark"}
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

export function UserActionModal({ selectedUserForAction, setSelectedUserForAction, setUserActionStep, userActionStep, t, handleBlockUser, lang, handleSelectReportReason }) {
  if (!selectedUserForAction) return null;

  return (
    <Modal
      visible={!!selectedUserForAction}
      animationType="fade"
      transparent={true}
      onRequestClose={() => {
        setSelectedUserForAction(null);
        setUserActionStep('menu');
      }}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.userActionCard}>
          <View style={styles.userActionHeader}>
            <View style={styles.userActionAvatar}>
              <Text style={styles.userActionAvatarText}>
                {selectedUserForAction.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.userActionTitle}>{selectedUserForAction.name}</Text>
              <Text style={styles.userActionSubtitle}>
                {userActionStep === 'menu' ? t('userActionsTitle') : t('reportTitle')}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                setSelectedUserForAction(null);
                setUserActionStep('menu');
              }}
              activeOpacity={0.75}
              style={{ padding: 4 }}
            >
              <Ionicons name="close" size={22} color="#94a3b8" />
            </TouchableOpacity>
          </View>

          {userActionStep === 'menu' ? (
            <View style={styles.userActionButtonsContainer}>
              {/* Block Option */}
              <TouchableOpacity
                style={styles.userActionBlockBtn}
                onPress={() => {
                  Alert.alert(
                    t('blockConfirmTitle'),
                    t('blockConfirmMsg', selectedUserForAction.name),
                    [
                      { text: t('cancel'), style: 'cancel' },
                      {
                        text: t('blockUser'),
                        style: 'destructive',
                        onPress: () => handleBlockUser(selectedUserForAction),
                      },
                    ]
                  );
                }}
                activeOpacity={0.85}
              >
                <View style={styles.actionBtnIconBoxBlock}>
                  <Ionicons name="volume-mute" size={20} color="#ef4444" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.actionBtnTitleBlock}>{t('blockUser')}</Text>
                  <Text style={styles.actionBtnSub}>{t('blockUserSub')}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#ef4444" />
              </TouchableOpacity>

              {/* Report Option */}
              <TouchableOpacity
                style={styles.userActionReportBtn}
                onPress={() => setUserActionStep('report_reasons')}
                activeOpacity={0.85}
              >
                <View style={styles.actionBtnIconBoxReport}>
                  <Ionicons name="flag" size={20} color="#f59e0b" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.actionBtnTitleReport}>{t('reportUser')}</Text>
                  <Text style={styles.actionBtnSub}>{t('reportUserSub')}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#f59e0b" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.userActionCancelBtn}
                onPress={() => {
                  setSelectedUserForAction(null);
                  setUserActionStep('menu');
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.userActionCancelBtnText}>{t('cancel')}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.reportReasonsContainer}>
              <Text style={styles.reportSubtitleInfo}>
                {lang === 'tr'
                  ? 'Lütfen şikayet nedenini seçin. Bildirimler moderasyon ekibimizce 24 saat içinde incelenir ve kural ihlali yapan kullanıcılar kalıcı olarak uzaklaştırılır:'
                  : 'Reports are reviewed within 24 hours. Please select a reason. Moderation team investigates and permanently bans violating accounts:'}
              </Text>

              <TouchableOpacity
                style={styles.reportReasonRow}
                onPress={() => handleSelectReportReason('harassment')}
                activeOpacity={0.8}
              >
                <Ionicons name="alert-circle-outline" size={18} color="#ef4444" />
                <Text style={styles.reportReasonText}>{t('reportReason1')}</Text>
                <Ionicons name="chevron-forward" size={14} color="#64748b" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.reportReasonRow}
                onPress={() => handleSelectReportReason('inappropriate')}
                activeOpacity={0.8}
              >
                <Ionicons name="warning-outline" size={18} color="#f59e0b" />
                <Text style={styles.reportReasonText}>{t('reportReason2')}</Text>
                <Ionicons name="chevron-forward" size={14} color="#64748b" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.reportReasonRow}
                onPress={() => handleSelectReportReason('spam')}
                activeOpacity={0.8}
              >
                <Ionicons name="chatbubbles-outline" size={18} color="#38bdf8" />
                <Text style={styles.reportReasonText}>{t('reportReason3')}</Text>
                <Ionicons name="chevron-forward" size={14} color="#64748b" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.reportReasonRow}
                onPress={() => handleSelectReportReason('other')}
                activeOpacity={0.8}
              >
                <Ionicons name="help-circle-outline" size={18} color="#94a3b8" />
                <Text style={styles.reportReasonText}>{t('reportReason4')}</Text>
                <Ionicons name="chevron-forward" size={14} color="#64748b" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.reportBackBtn}
                onPress={() => setUserActionStep('menu')}
                activeOpacity={0.8}
              >
                <Ionicons name="arrow-back" size={16} color="#94a3b8" />
                <Text style={styles.reportBackBtnText}>{t('back')}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

export function BlockedUsersModal({ showBlockedUsersModal, setShowBlockedUsersModal, t, blockedUsers, handleUnblockUser }) {
  return (
    <Modal
      visible={showBlockedUsersModal}
      animationType="fade"
      transparent={true}
      onRequestClose={() => setShowBlockedUsersModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.guideCard}>
          <View style={styles.guideHeader}>
            <View style={styles.guideTitleRow}>
              <Ionicons name="ban" size={22} color="#ef4444" />
              <Text style={styles.guideTitleText}>{t('blockedUsersTitle')}</Text>
            </View>
            <TouchableOpacity
              onPress={() => setShowBlockedUsersModal(false)}
              activeOpacity={0.75}
              style={{ padding: 4 }}
            >
              <Ionicons name="close" size={22} color="#94a3b8" />
            </TouchableOpacity>
          </View>

          <ScrollView style={{ maxHeight: 300 }} showsVerticalScrollIndicator={false} bounces={false}>
            {blockedUsers.length === 0 ? (
              <View style={{ paddingVertical: 24, alignItems: 'center' }}>
                <Ionicons name="checkmark-circle-outline" size={40} color="#22c55e" />
                <Text style={{ color: '#94a3b8', fontSize: 13, marginTop: 8 }}>
                  {t('noBlockedUsers')}
                </Text>
              </View>
            ) : (
              blockedUsers.map((blockedName) => (
                <View key={blockedName} style={styles.blockedUserRow}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
                    <Ionicons name="person-remove" size={16} color="#ef4444" />
                    <Text style={styles.blockedUserNameText} numberOfLines={1}>{blockedName}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.unblockBtn}
                    onPress={() => {
                      Alert.alert(
                        t('unblock'),
                        t('unblockConfirmMsg', blockedName),
                        [
                          { text: t('cancel'), style: 'cancel' },
                          { text: t('unblock'), onPress: () => handleUnblockUser(blockedName) },
                        ]
                      );
                    }}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.unblockBtnText}>{t('unblock')}</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </ScrollView>

          <TouchableOpacity
            style={[styles.guideButton, { marginTop: 16 }]}
            onPress={() => setShowBlockedUsersModal(false)}
            activeOpacity={0.85}
          >
            <Text style={styles.guideButtonText}>{t('eulaCloseBtn')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
