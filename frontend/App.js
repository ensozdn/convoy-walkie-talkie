import React, { useState, useRef, useEffect } from 'react';
import { Text, View, SafeAreaView, StatusBar, Alert, Keyboard, Share, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useKeepAwake } from 'expo-keep-awake';
import * as Clipboard from 'expo-clipboard';
import { generateRoomCode } from './src/utils/roomCode';
import { styles } from './src/styles/styles';
import { COLORS } from './src/styles/theme';
import { useLocation } from './src/hooks/useLocation';
import { usePTT } from './src/hooks/usePTT';
import { useRoomSocket } from './src/hooks/useRoomSocket';
import { useConvoyPreferences } from './src/hooks/useConvoyPreferences';
import { useUIAnimations } from './src/hooks/useUIAnimations';
import { GuideModal, EulaModal, UserActionModal, BlockedUsersModal } from './src/components/Modals';
import { Toast } from './src/components/Toast';
import { BottomTabBar } from './src/components/BottomTabBar';
import { MapTab } from './src/screens/MapTab';
import { DriversTab } from './src/screens/DriversTab';
import { SettingsTab } from './src/screens/SettingsTab';
import { LobbyScreen } from './src/screens/LobbyScreen';
import { RadioTab } from './src/screens/RadioTab';

export default function App() {
  const [activeTab, setActiveTab] = useState('radio');
  const [isInRoom, setIsInRoom] = useState(false);
  const [roomCode, setRoomCode] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [lobbyMode, setLobbyMode] = useState('home');
  const [copied, setCopied] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [mapType, setMapType] = useState('standard');
  const [isFollowing, setIsFollowing] = useState(true);
  const [activeSpeaker, setActiveSpeaker] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);

  const mapRef = useRef(null);
  const roomCodeRef = useRef('');
  const usernameRef = useRef('');
  const socketRef = useRef(null);
  const copyTimerRef = useRef(null);
  const blockedUsersRefProxy = useRef([]);
  const rogerBeepRefProxy = useRef(true);

  useKeepAwake(isInRoom ? 'room-active' : undefined);

  useEffect(() => () => {
    if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
  }, []);

  const { userLocation, sendLocationUpdate } = useLocation({ isInRoom, socketRef, roomCodeRef, usernameRef });

  const {
    isSpeakingLocally, setIsSpeakingLocally, isChannelMuted, toggleChannelMute,
    playBeepOff, playIncoming, dropIncomingFrom, handleTalkStart, handleTalkEnd,
  } = usePTT({
    isInRoom, socketRef, roomCodeRef, usernameRef,
    blockedUsersRef: blockedUsersRefProxy, rogerBeepRef: rogerBeepRefProxy,
    activeSpeaker, setActiveSpeaker,
  });

  const prefs = useConvoyPreferences({
    socketRef, roomCodeRef, usernameRef, activeSpeaker, setActiveSpeaker, dropIncomingFrom,
  });

  blockedUsersRefProxy.current = prefs.blockedUsers;
  rogerBeepRefProxy.current = prefs.rogerBeep;

  const {
    connectionState, participants, leaderName, waypoint, activePing,
    sendQuickPing, setConvoyWaypoint, connect, leaveRoom, syncRoomIdentity,
  } = useRoomSocket({
    socketRef, roomCodeRef, usernameRef, blockedUsersRef: prefs.blockedUsersRef,
    userLocation, setActiveSpeaker, playIncoming,
  });

  const {
    fadeAnim, slideAnim, pulseAnim, logoGlowAnim, logoScaleAnim, tabFadeAnim, tabSlideAnim, animateTabTransition,
  } = useUIAnimations({ lobbyMode, activeSpeaker });

  const { t, username, setUsername } = prefs;

  const handleToggleMute = () => {
    const nextMuted = toggleChannelMute();
    prefs.triggerToast(nextMuted ? t('toastMuted') : t('toastUnmuted'));
  };

  const handleCreateRoom = () => {
    const trimmedName = username.trim();
    if (!trimmedName) return Alert.alert(t('missingInfo'), t('enterNameAlert'));
    setUsername(trimmedName);
    prefs.saveUsername(trimmedName);
    setGeneratedCode(generateRoomCode());
    setCopied(false);
    return setLobbyMode('create');
  };

  const handleCopyCode = async () => {
    await Clipboard.setStringAsync(generatedCode);
    setCopied(true);
    prefs.triggerToast(t('toastCopied'));
    if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    copyTimerRef.current = setTimeout(() => setCopied(false), 2500);
  };

  const handleCopyRoomCode = async () => {
    if (!roomCode) return;
    await Clipboard.setStringAsync(roomCode);
    prefs.triggerToast(t('toastCopied'));
  };

  const handleShareCode = async () => {
    try {
      await Share.share({ message: t('shareMessage', generatedCode) });
    } catch (e) {
      console.error('[SHARE] Paylasim hatasi:', e.message);
    }
  };

  const enterRoom = async (name, code) => {
    try {
      setRoomCode(code);
      roomCodeRef.current = code;
      usernameRef.current = name;
      connect(name, code, userLocation);
      setIsInRoom(true);
      sendLocationUpdate(userLocation);
      await prefs.addRecentCode(code);
    } catch (error) {
      console.error('[ROOM] Odaya katilma hatasi:', error.message);
      Alert.alert(t('connError'), t('connErrorSub'));
    }
  };

  const handleEnterCreatedRoom = async () => {
    const name = username.trim() || usernameRef.current;
    if (!name) return Alert.alert(t('missingInfo'), t('enterNameAlert'));
    return enterRoom(name, generatedCode);
  };

  const handleJoinRoom = () => {
    const trimmedName = username.trim();
    const trimmedCode = joinCode.trim().toUpperCase();
    if (!trimmedName) return Alert.alert(t('missingInfo'), t('enterNameAlert'));
    if (!trimmedCode) return Alert.alert(t('missingInfo'), t('enterCodeAlert'));
    prefs.saveUsername(trimmedName);
    return enterRoom(trimmedName, trimmedCode);
  };

  const handleLeaveRoom = () => {
    leaveRoom();
    setIsInRoom(false);
    setActiveSpeaker(null);
    setIsSpeakingLocally(false);
    setActiveTab('radio');
  };

  const confirmLeaveRoom = () => {
    Alert.alert(t('leaveTitle'), t('leaveMessage'), [
      { text: t('cancel'), style: 'cancel' },
      { text: t('leave'), style: 'destructive', onPress: handleLeaveRoom },
    ]);
  };

  const visibleParticipants = participants.filter((p) => !prefs.blockedUsers.includes(p.name));

  const handleRecenter = () => {
    setIsFollowing(true);
    mapRef.current?.animateToRegion(userLocation, 800);
  };

  const handleFitAll = () => {
    setIsFollowing(false);
    if (mapRef.current && visibleParticipants.length > 0) {
      const coords = visibleParticipants.map((p) => p.coords || userLocation);
      if (waypoint) coords.push({ latitude: waypoint.latitude, longitude: waypoint.longitude });
      mapRef.current.fitToCoordinates(coords, {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    }
  };

  const handleTabPress = (tabName) => {
    if (tabName === activeTab) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActiveTab(tabName);
    animateTabTransition();
  };

  const handleSaveName = () => {
    const trimmed = editingName.trim();
    const previousName = usernameRef.current;
    if (trimmed.length > 0 && trimmed !== previousName) {
      if (socketRef.current && roomCodeRef.current && previousName) {
        socketRef.current.emit('leave_room', { roomName: roomCodeRef.current, participantName: previousName });
      }
      setUsername(trimmed);
      usernameRef.current = trimmed;
      prefs.saveUsername(trimmed);
      syncRoomIdentity();
    }
    setIsEditingName(false);
    Keyboard.dismiss();
  };

  const modalOverlays = (
    <>
      <GuideModal showGuide={prefs.showGuide} handleCloseGuide={prefs.handleCloseGuide} t={t} />
      <EulaModal {...prefs} t={t} />
      <UserActionModal {...prefs} t={t} />
      <BlockedUsersModal {...prefs} t={t} />
      <Toast toastMessage={prefs.toastMessage} toastAnim={prefs.toastAnim} />
    </>
  );

  if (!isInRoom) {
    return (
      <LobbyScreen
        {...prefs}
        lobbyMode={lobbyMode} setLobbyMode={setLobbyMode}
        fadeAnim={fadeAnim} slideAnim={slideAnim}
        logoGlowAnim={logoGlowAnim} logoScaleAnim={logoScaleAnim}
        handleCreateRoom={handleCreateRoom} handleCopyCode={handleCopyCode}
        copied={copied} generatedCode={generatedCode} handleShareCode={handleShareCode}
        handleEnterCreatedRoom={handleEnterCreatedRoom} isInputFocused={isInputFocused}
        setIsInputFocused={setIsInputFocused} joinCode={joinCode} setJoinCode={setJoinCode}
        handleJoinRoom={handleJoinRoom} overlays={modalOverlays}
      />
    );
  }

  const sharedTabProps = {
    t, roomCode, connectionState, isSpeakingLocally, handleTalkStart, handleTalkEnd,
    userLocation, visibleParticipants, activeSpeaker, mapRef, mapType, setMapType,
    isFollowing, setIsFollowing, handleFitAll, handleRecenter,
    leaderName, username, waypoint, setConvoyWaypoint, triggerToast: prefs.triggerToast,
    setSelectedUserForAction: prefs.setSelectedUserForAction, setUserActionStep: prefs.setUserActionStep,
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ backgroundColor: COLORS.bgPrimary }} />
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bgPrimary} />
      {connectionState === 'reconnecting' && (
        <View style={styles.reconnectingBanner}>
          <Text style={styles.reconnectingBannerText}>{t('reconnectingBanner')}</Text>
        </View>
      )}
      <Animated.View style={{ flex: 1, width: '100%', opacity: tabFadeAnim, transform: [{ translateY: tabSlideAnim }] }}>
        {activeTab === 'map' ? (
          <MapTab {...sharedTabProps} />
        ) : activeTab === 'drivers' ? (
          <DriversTab {...sharedTabProps} handleTabPress={handleTabPress} />
        ) : activeTab === 'settings' ? (
          <SettingsTab
            {...prefs} isEditingName={isEditingName} setEditingName={setEditingName}
            setIsEditingName={setIsEditingName} editingName={editingName}
            handleSaveName={handleSaveName} playBeepOff={playBeepOff}
          />
        ) : (
          <RadioTab
            {...sharedTabProps} isChannelMuted={isChannelMuted} handleToggleMute={handleToggleMute}
            handleCopyRoomCode={handleCopyRoomCode} confirmLeaveRoom={confirmLeaveRoom}
            pulseAnim={pulseAnim} activePing={activePing} sendQuickPing={sendQuickPing}
          />
        )}
      </Animated.View>
      <BottomTabBar activeTab={activeTab} handleTabPress={handleTabPress} t={t} />
      {modalOverlays}
    </View>
  );
}
