import React from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/styles';

export function UserActionModal({
  selectedUserForAction,
  setSelectedUserForAction,
  setUserActionStep,
  userActionStep,
  t,
  handleBlockUser,
  handleSelectReportReason,
}) {
  if (!selectedUserForAction) return null;

  const closeActionModal = () => {
    setSelectedUserForAction(null);
    setUserActionStep('menu');
  };

  return (
    <Modal
      visible={Boolean(selectedUserForAction)}
      animationType="fade"
      transparent={true}
      onRequestClose={closeActionModal}
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
            <TouchableOpacity onPress={closeActionModal} activeOpacity={0.75}>
              <Ionicons name="close" size={22} color="#94a3b8" />
            </TouchableOpacity>
          </View>

          {userActionStep === 'menu' ? (
            <View style={styles.userActionButtonsContainer}>
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
                onPress={closeActionModal}
                activeOpacity={0.8}
              >
                <Text style={styles.userActionCancelBtnText}>{t('cancel')}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.reportReasonsContainer}>
              <Text style={styles.reportSubtitleInfo}>{t('reportSubtitleInfo')}</Text>

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

export function BlockedUsersModal({
  showBlockedUsersModal,
  setShowBlockedUsersModal,
  t,
  blockedUsers = [],
  handleUnblockUser,
}) {
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
            <TouchableOpacity onPress={() => setShowBlockedUsersModal(false)} activeOpacity={0.75}>
              <Ionicons name="close" size={22} color="#94a3b8" />
            </TouchableOpacity>
          </View>

          <ScrollView style={{ maxHeight: 300 }} showsVerticalScrollIndicator={false} bounces={false}>
            {blockedUsers.length === 0 ? (
              <View style={styles.emptyDriversContainer}>
                <Ionicons name="checkmark-circle-outline" size={40} color="#22c55e" />
                <Text style={styles.emptyDriversText}>{t('noBlockedUsers')}</Text>
              </View>
            ) : (
              blockedUsers.map((blockedName) => (
                <View key={blockedName} style={styles.blockedUserRow}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
                    <Ionicons name="person-remove" size={16} color="#ef4444" />
                    <Text style={styles.blockedUserNameText} numberOfLines={1}>
                      {blockedName}
                    </Text>
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
            style={styles.blockedModalCloseBtn}
            onPress={() => setShowBlockedUsersModal(false)}
            activeOpacity={0.85}
          >
            <Text style={styles.blockedModalCloseBtnText}>
              {(typeof t === 'function' && (t('closeModal') || t('eulaCloseBtn'))) || 'Kapat'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
