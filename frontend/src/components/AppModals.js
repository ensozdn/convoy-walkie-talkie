import React from 'react';
import { Image } from 'react-native';
import { GuideModal, EulaModal, UserActionModal, BlockedUsersModal } from './Modals';
import { AvatarCustomizationModal } from './AvatarCustomizationModal';
import { DriveSummaryModal } from './DriveSummaryModal';
import { Toast } from './Toast';

const LOGO_BADGE = require('../../assets/logo-badge.png');

export function AppModals({ prefs, t, username, driveSession }) {
  return (
    <>
      <Image source={LOGO_BADGE} style={{ width: 1, height: 1, position: 'absolute', opacity: 0 }} fadeDuration={0} />
      <GuideModal showGuide={prefs.showGuide} handleCloseGuide={prefs.handleCloseGuide} t={t} />
      <EulaModal {...prefs} t={t} />
      <UserActionModal {...prefs} t={t} />
      <BlockedUsersModal {...prefs} t={t} />
      <AvatarCustomizationModal
        visible={prefs.showAvatarModal}
        onClose={() => prefs.setShowAvatarModal(false)}
        onSave={prefs.handleUpdateAvatarProfile}
        currentColor={prefs.avatarColor}
        currentVehicle={prefs.vehicleType}
        username={username}
        t={t}
      />
      <DriveSummaryModal summaryData={driveSession?.summaryData} onClose={driveSession?.closeSummary} t={t} />
      <Toast toastMessage={prefs.toastMessage} toastAnim={prefs.toastAnim} />
    </>
  );
}
