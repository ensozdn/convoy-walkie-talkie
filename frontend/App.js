import React, { useState, useEffect, useRef } from 'react';
import { Text, View, SafeAreaView, StatusBar, Alert, Keyboard, Platform, Share, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useKeepAwake } from 'expo-keep-awake';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from 'expo-clipboard';
import { getDeviceLanguage, TRANSLATIONS } from './src/constants/translations';
import { generateRoomCode } from './src/utils/roomCode';
import { styles } from './src/styles/styles';
import { useLocation } from './src/hooks/useLocation';
import { usePTT } from './src/hooks/usePTT';
import { useRoomSocket } from './src/hooks/useRoomSocket';
import { GuideModal, EulaModal, UserActionModal, BlockedUsersModal } from './src/components/Modals';
import { Toast } from './src/components/Toast';
import { BottomTabBar } from './src/components/BottomTabBar';
import { MapTab } from './src/screens/MapTab';
import { DriversTab } from './src/screens/DriversTab';
import { SettingsTab } from './src/screens/SettingsTab';
import { LobbyScreen } from './src/screens/LobbyScreen';
import { RadioTab } from './src/screens/RadioTab';

export default function App() {
  const [lang, setLang] = useState(getDeviceLanguage()); // 'tr' | 'en'
  const [activeTab, setActiveTab] = useState('radio'); // 'radio' | 'map' | 'drivers' | 'settings'
  const [isInRoom, setIsInRoom] = useState(false);
  const [username, setUsername] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [recentCodes, setRecentCodes] = useState([]);
  const [showGuide, setShowGuide] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const toastAnim = useRef(new Animated.Value(-80)).current;
  const [generatedCode, setGeneratedCode] = useState('');
  const [lobbyMode, setLobbyMode] = useState('home'); // 'home' | 'create' | 'join'
  const [copied, setCopied] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [mapType, setMapType] = useState('standard'); // 'standard' | 'hybrid'
  const [loading, setLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState(true);
  
  const [activeSpeaker, setActiveSpeaker] = useState(null);
  const [rogerBeep, setRogerBeep] = useState(true);
  const rogerBeepRef = useRef(true);
  const [editingName, setEditingName] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);

  // Apple UGC Compliance States
  const [showEulaModal, setShowEulaModal] = useState(false);
  const [isEulaFromSettings, setIsEulaFromSettings] = useState(false);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const blockedUsersRef = useRef([]);
  const [selectedUserForAction, setSelectedUserForAction] = useState(null);
  const [userActionStep, setUserActionStep] = useState('menu'); // 'menu' | 'report_reasons'
  const [showBlockedUsersModal, setShowBlockedUsersModal] = useState(false);
  
  const mapRef = useRef(null);
  const roomCodeRef = useRef(''); // Stale closure bug fix: roomCode için ref
  const usernameRef = useRef(''); // Stale closure bug fix: username için ref
  const socketRef = useRef(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const logoGlowAnim = useRef(new Animated.Value(0.3)).current;
  const btn1Anim = useRef(new Animated.Value(18)).current;
  const btn2Anim = useRef(new Animated.Value(18)).current;
  const btnFadeAnim = useRef(new Animated.Value(0)).current;
  const tabFadeAnim = useRef(new Animated.Value(1)).current;
  const tabSlideAnim = useRef(new Animated.Value(0)).current;

  const t = (key, param) => {
    const val = TRANSLATIONS[lang][key];
    if (typeof val === 'function') return val(param);
    return val || key;
  };

  useKeepAwake(isInRoom ? 'room-active' : undefined);

  const { userLocation, sendLocationUpdate } = useLocation({ isInRoom, socketRef, roomCodeRef, usernameRef });

  const {
    isSpeakingLocally,
    setIsSpeakingLocally,
    playBeepOff,
    playIncoming,
    dropIncomingFrom,
    handleTalkStart,
    handleTalkEnd,
  } = usePTT({
    isInRoom,
    socketRef,
    roomCodeRef,
    usernameRef,
    blockedUsersRef,
    rogerBeepRef,
    activeSpeaker,
    setActiveSpeaker,
  });

  const { connectionState, participants, connect, leaveRoom } = useRoomSocket({
    socketRef,
    roomCodeRef,
    usernameRef,
    blockedUsersRef,
    setActiveSpeaker,
    playIncoming,
  });

  useEffect(() => {
    blockedUsersRef.current = blockedUsers;
  }, [blockedUsers]);

  useEffect(() => {
    initApp();
    Animated.loop(
      Animated.sequence([
        Animated.timing(logoGlowAnim, { toValue: 0.9, duration: 1300, useNativeDriver: true }),
        Animated.timing(logoGlowAnim, { toValue: 0.25, duration: 1300, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    fadeAnim.setValue(0);
    slideAnim.setValue(24);
    btn1Anim.setValue(18);
    btn2Anim.setValue(18);
    btnFadeAnim.setValue(0);

    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 320, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 320, useNativeDriver: true }),
      ]),
      Animated.stagger(100, [
        Animated.parallel([
          Animated.timing(btn1Anim, { toValue: 0, duration: 280, useNativeDriver: true }),
          Animated.timing(btnFadeAnim, { toValue: 1, duration: 280, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(btn2Anim, { toValue: 0, duration: 280, useNativeDriver: true }),
        ]),
      ]),
    ]).start();
  }, [lobbyMode]);

  useEffect(() => {
    if (activeSpeaker) {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.15, duration: 600, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1.0, duration: 600, useNativeDriver: true }),
        ])
      );
      animation.start();
      return () => animation.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [activeSpeaker]);

  const changeLanguage = async (newLang) => {
    setLang(newLang);
    try {
      await AsyncStorage.setItem('@convoy_lang', newLang);
    } catch (e) {}
  };

  const initApp = async () => {
    try {
      const savedLang = await AsyncStorage.getItem('@convoy_lang');
      if (savedLang === 'tr' || savedLang === 'en') {
        setLang(savedLang);
      }
      const savedUser = await AsyncStorage.getItem('savedUsername');
      if (savedUser) setUsername(savedUser);
      const saved = await AsyncStorage.getItem('recentCodes');
      if (saved) setRecentCodes(JSON.parse(saved));

      // Apple UGC: EULA Onay Kontrolü (@convoy_eula_accepted)
      const eulaAccepted = await AsyncStorage.getItem('@convoy_eula_accepted');
      if (!eulaAccepted) {
        setShowEulaModal(true);
        setIsEulaFromSettings(false);
      } else {
        const hasSeen = await AsyncStorage.getItem('hasSeenGuide');
        if (!hasSeen) setShowGuide(true);
      }

      // Apple UGC: Engellenen Kullanıcılar (@convoy_blocked_users)
      const savedBlocked = await AsyncStorage.getItem('@convoy_blocked_users');
      if (savedBlocked) {
        const parsed = JSON.parse(savedBlocked);
        if (Array.isArray(parsed)) {
          setBlockedUsers(parsed);
          blockedUsersRef.current = parsed;
        }
      }

      // Roger Beep Tercihi (@convoy_roger_beep)
      const savedRoger = await AsyncStorage.getItem('@convoy_roger_beep');
      if (savedRoger !== null) {
        const parsedRoger = JSON.parse(savedRoger);
        setRogerBeep(parsedRoger);
        rogerBeepRef.current = parsedRoger;
      }
    } catch (e) {
      console.log('AsyncStorage yükleme hatası:', e);
    }
  };

  const saveUsername = async (name) => {
    try { await AsyncStorage.setItem('savedUsername', name); } catch (e) {}
  };

  const handleCreateRoom = () => {
    const trimmedName = username.trim();
    if (!trimmedName) {
      Alert.alert(t('missingInfo'), t('enterNameAlert'));
      return;
    }
    setUsername(trimmedName); // State'i de güncelle
    saveUsername(trimmedName);
    const code = generateRoomCode();
    setGeneratedCode(code);
    setCopied(false);
    setLobbyMode('create');
  };

  const triggerToast = (msg) => {
    setToastMessage(msg);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Animated.sequence([
      Animated.timing(toastAnim, { toValue: Platform.OS === 'ios' ? 56 : 24, duration: 300, useNativeDriver: true }),
      Animated.delay(2400),
      Animated.timing(toastAnim, { toValue: -80, duration: 300, useNativeDriver: true }),
    ]).start(() => setToastMessage(null));
  };

  const handleCloseGuide = async () => {
    setShowGuide(false);
    try { await AsyncStorage.setItem('hasSeenGuide', 'true'); } catch (e) {}
  };

  const handleAgreeEula = async () => {
    try {
      await AsyncStorage.setItem('@convoy_eula_accepted', 'true');
    } catch (e) {}
    setShowEulaModal(false);
    try {
      const hasSeen = await AsyncStorage.getItem('hasSeenGuide');
      if (!hasSeen) {
        setTimeout(() => setShowGuide(true), 350);
      }
    } catch (e) {}
  };

  const handleBlockUser = async (targetUser) => {
    if (!targetUser) return;
    const targetName = targetUser.name;
    const updated = Array.from(new Set([...blockedUsers, targetName]));
    setBlockedUsers(updated);
    blockedUsersRef.current = updated;
    try {
      await AsyncStorage.setItem('@convoy_blocked_users', JSON.stringify(updated));
    } catch (e) {}

    // Canlı çalan ses varsa anında durdur
    dropIncomingFrom(targetName);
    if (activeSpeaker && activeSpeaker.name === targetName) {
      setActiveSpeaker(null);
    }

    if (socketRef.current) {
      socketRef.current.emit('user_blocked_report', {
        blockedUser: targetName,
        reportedBy: usernameRef.current,
        room: roomCodeRef.current,
        timestamp: new Date().toISOString(),
      });
    }

    setSelectedUserForAction(null);
    setUserActionStep('menu');

    Alert.alert(
      t('userBlockedTitle'),
      t('userBlockedMsg')
    );
  };

  const handleUnblockUser = async (name) => {
    const updated = blockedUsers.filter((u) => u !== name);
    setBlockedUsers(updated);
    blockedUsersRef.current = updated;
    try {
      await AsyncStorage.setItem('@convoy_blocked_users', JSON.stringify(updated));
    } catch (e) {}
    triggerToast(lang === 'tr' ? `${name} engeli kaldırıldı` : `${name} unblocked`);
  };

  const handleSelectReportReason = (reasonKey) => {
    if (selectedUserForAction && socketRef.current) {
      socketRef.current.emit('user_reported', {
        reportedUser: selectedUserForAction.name,
        reason: reasonKey,
        reportedBy: usernameRef.current,
        room: roomCodeRef.current,
        timestamp: new Date().toISOString(),
      });
    }
    setSelectedUserForAction(null);
    setUserActionStep('menu');
    Alert.alert(
      t('reportSubmittedTitle'),
      t('reportSubmittedMsg')
    );
  };

  const handleCopyCode = async () => {
    await Clipboard.setStringAsync(generatedCode);
    setCopied(true);
    triggerToast(t('toastCopied'));
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareCode = async () => {
    try {
      await Share.share({
        message: t('shareMessage', generatedCode),
      });
    } catch (e) {
      console.error('Paylaşım hatası:', e);
    }
  };

  const handleEnterCreatedRoom = async () => {
    const name = username.trim() || usernameRef.current;
    if (!name) {
      Alert.alert(t('missingInfo'), t('enterNameAlert'));
      return;
    }
    await enterRoom(name, generatedCode);
  };

  const handleJoinRoom = () => {
    if (!username.trim()) {
      Alert.alert(t('missingInfo'), t('enterNameAlert'));
      return;
    }
    if (!joinCode.trim()) {
      Alert.alert(t('missingInfo'), t('enterCodeAlert'));
      return;
    }
    saveUsername(username.trim());
    enterRoom(username.trim(), joinCode.trim().toUpperCase());
  };

  const enterRoom = async (name, code) => {
    try {
      setLoading(true);
      setRoomCode(code);
      roomCodeRef.current = code;
      usernameRef.current = name;

      connect(name, code, userLocation);

      setIsInRoom(true);
      sendLocationUpdate(userLocation);

      const updated = [code, ...recentCodes.filter((c) => c !== code)].slice(0, 3);
      setRecentCodes(updated);
      try { await AsyncStorage.setItem('recentCodes', JSON.stringify(updated)); } catch (e) {}
    } catch (error) {
      console.error('Odaya katılma hatası:', error);
      Alert.alert(t('connError'), t('connErrorSub'));
    } finally {
      setLoading(false);
    }
  };

  const confirmLeaveRoom = () => {
    Alert.alert(
      t('leaveTitle'),
      t('leaveMessage'),
      [
        { text: t('cancel'), style: 'cancel' },
        { text: t('leave'), style: 'destructive', onPress: handleLeaveRoom },
      ]
    );
  };

  const handleLeaveRoom = () => {
    leaveRoom();
    setIsInRoom(false);
    setActiveSpeaker(null);
    setIsSpeakingLocally(false);
  };

  const handleRecenter = () => {
    setIsFollowing(true);
    if (mapRef.current) {
      mapRef.current.animateToRegion(userLocation, 800);
    }
  };

  const handleFitAll = () => {
    setIsFollowing(false);
    const visible = participants.filter(p => !blockedUsersRef.current.includes(p.name));
    if (mapRef.current && visible.length > 0) {
      const coords = visible.map(p => p.coords || userLocation);
      mapRef.current.fitToCoordinates(coords, {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    }
  };

  const handleTabPress = (tabName) => {
    if (tabName === activeTab) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    tabFadeAnim.setValue(0.35);
    tabSlideAnim.setValue(8);
    setActiveTab(tabName);
    Animated.parallel([
      Animated.timing(tabFadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(tabSlideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const visibleParticipants = participants.filter(p => !blockedUsers.includes(p.name));

  const handleSaveName = () => {
    const trimmed = editingName.trim();
    if (trimmed.length > 0) {
      setUsername(trimmed);
      usernameRef.current = trimmed;
      AsyncStorage.setItem('savedUsername', trimmed);
    }
    setIsEditingName(false);
    Keyboard.dismiss();
  };

  const overlays = (
    <>
      <GuideModal showGuide={showGuide} handleCloseGuide={handleCloseGuide} t={t} />
      <EulaModal
        showEulaModal={showEulaModal}
        isEulaFromSettings={isEulaFromSettings}
        setShowEulaModal={setShowEulaModal}
        t={t}
        lang={lang}
        changeLanguage={changeLanguage}
        handleAgreeEula={handleAgreeEula}
      />
      <UserActionModal
        selectedUserForAction={selectedUserForAction}
        setSelectedUserForAction={setSelectedUserForAction}
        setUserActionStep={setUserActionStep}
        userActionStep={userActionStep}
        t={t}
        handleBlockUser={handleBlockUser}
        lang={lang}
        handleSelectReportReason={handleSelectReportReason}
      />
      <BlockedUsersModal
        showBlockedUsersModal={showBlockedUsersModal}
        setShowBlockedUsersModal={setShowBlockedUsersModal}
        t={t}
        blockedUsers={blockedUsers}
        handleUnblockUser={handleUnblockUser}
      />
      <Toast toastMessage={toastMessage} toastAnim={toastAnim} />
      <BottomTabBar activeTab={activeTab} handleTabPress={handleTabPress} t={t} />
    </>
  );

  if (!isInRoom) {
    return <LobbyScreen
      lobbyMode={lobbyMode}
      fadeAnim={fadeAnim}
      slideAnim={slideAnim}
      logoGlowAnim={logoGlowAnim}
      setShowGuide={setShowGuide}
      t={t}
      username={username}
      setUsername={setUsername}
      lang={lang}
      changeLanguage={changeLanguage}
      btnFadeAnim={btnFadeAnim}
      btn1Anim={btn1Anim}
      handleCreateRoom={handleCreateRoom}
      btn2Anim={btn2Anim}
      setLobbyMode={setLobbyMode}
      handleCopyCode={handleCopyCode}
      copied={copied}
      generatedCode={generatedCode}
      handleShareCode={handleShareCode}
      handleEnterCreatedRoom={handleEnterCreatedRoom}
      isInputFocused={isInputFocused}
      setIsInputFocused={setIsInputFocused}
      joinCode={joinCode}
      setJoinCode={setJoinCode}
      handleJoinRoom={handleJoinRoom}
      recentCodes={recentCodes}
      overlays={overlays}
    />;
  }

  const isReconnecting = connectionState === 'reconnecting';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

      {isReconnecting && (
        <View style={styles.reconnectingBanner}>
          <Text style={styles.reconnectingBannerText}>{t('reconnectingBanner')}</Text>
        </View>
      )}

      <Animated.View style={{ flex: 1, width: '100%', opacity: tabFadeAnim, transform: [{ translateY: tabSlideAnim }] }}>
        {activeTab === 'map' ? (
          <MapTab
            t={t}
            mapType={mapType}
            setMapType={setMapType}
            mapRef={mapRef}
            userLocation={userLocation}
            setIsFollowing={setIsFollowing}
            visibleParticipants={visibleParticipants}
            activeSpeaker={activeSpeaker}
            lang={lang}
            setSelectedUserForAction={setSelectedUserForAction}
            setUserActionStep={setUserActionStep}
            handleFitAll={handleFitAll}
            isFollowing={isFollowing}
            handleRecenter={handleRecenter}
          />
        ) : activeTab === 'drivers' ? (
          <DriversTab
            t={t}
            visibleParticipants={visibleParticipants}
            lang={lang}
            activeSpeaker={activeSpeaker}
            handleTabPress={handleTabPress}
            mapRef={mapRef}
            setSelectedUserForAction={setSelectedUserForAction}
            setUserActionStep={setUserActionStep}
          />
        ) : activeTab === 'settings' ? (
          <SettingsTab
            lang={lang}
            changeLanguage={changeLanguage}
            isEditingName={isEditingName}
            username={username}
            setEditingName={setEditingName}
            setIsEditingName={setIsEditingName}
            editingName={editingName}
            handleSaveName={handleSaveName}
            rogerBeep={rogerBeep}
            setRogerBeep={setRogerBeep}
            rogerBeepRef={rogerBeepRef}
            playBeepOff={playBeepOff}
            t={t}
            setIsEulaFromSettings={setIsEulaFromSettings}
            setShowEulaModal={setShowEulaModal}
            triggerToast={triggerToast}
            setShowBlockedUsersModal={setShowBlockedUsersModal}
            blockedUsers={blockedUsers}
            setShowGuide={setShowGuide}
          />
        ) : (
          <RadioTab
            connectionState={connectionState}
            activeSpeaker={activeSpeaker}
            t={t}
            isSpeakingLocally={isSpeakingLocally}
            roomCode={roomCode}
            visibleParticipants={visibleParticipants}
            confirmLeaveRoom={confirmLeaveRoom}
            username={username}
            lang={lang}
            changeLanguage={changeLanguage}
            setSelectedUserForAction={setSelectedUserForAction}
            setUserActionStep={setUserActionStep}
            mapRef={mapRef}
            mapType={mapType}
            userLocation={userLocation}
            setIsFollowing={setIsFollowing}
            handleFitAll={handleFitAll}
            isFollowing={isFollowing}
            handleRecenter={handleRecenter}
            setMapType={setMapType}
            pulseAnim={pulseAnim}
            handleTalkStart={handleTalkStart}
            handleTalkEnd={handleTalkEnd}
          />
        )}
      </Animated.View>
      {overlays}
    </SafeAreaView>
  );
}

