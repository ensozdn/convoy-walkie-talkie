import { useState, useEffect, useRef, useCallback } from 'react';
import { Alert, Platform, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDeviceLanguage, TRANSLATIONS } from '../constants/translations';

export function useConvoyPreferences({
  socketRef, roomCodeRef, usernameRef, activeSpeaker, setActiveSpeaker, dropIncomingFrom,
}) {
  const [lang, setLang] = useState(getDeviceLanguage());
  const [username, setUsername] = useState('');
  const [recentCodes, setRecentCodes] = useState([]);
  const [showGuide, setShowGuide] = useState(false);
  const [showEulaModal, setShowEulaModal] = useState(false);
  const [isEulaFromSettings, setIsEulaFromSettings] = useState(false);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const blockedUsersRef = useRef([]);
  const [selectedUserForAction, setSelectedUserForAction] = useState(null);
  const [userActionStep, setUserActionStep] = useState('menu');
  const [showBlockedUsersModal, setShowBlockedUsersModal] = useState(false);
  const [rogerBeep, setRogerBeep] = useState(true);
  const rogerBeepRef = useRef(true);
  const [toastMessage, setToastMessage] = useState(null);
  const toastAnim = useRef(new Animated.Value(-80)).current;
  const guideTimerRef = useRef(null);

  const t = useCallback((key, param) => {
    const val = TRANSLATIONS[lang]?.[key];
    return typeof val === 'function' ? val(param) : val || key;
  }, [lang]);

  useEffect(() => {
    blockedUsersRef.current = blockedUsers;
  }, [blockedUsers]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const savedLang = await AsyncStorage.getItem('@convoy_lang');
        if (mounted && (savedLang === 'tr' || savedLang === 'en')) setLang(savedLang);

        const savedUser = await AsyncStorage.getItem('savedUsername');
        if (mounted && savedUser) {
          setUsername(savedUser);
          usernameRef.current = savedUser;
        }

        const savedCodes = await AsyncStorage.getItem('recentCodes');
        if (mounted && savedCodes) setRecentCodes(JSON.parse(savedCodes));

        const eulaAccepted = await AsyncStorage.getItem('@convoy_eula_accepted');
        if (mounted) {
          if (!eulaAccepted) {
            setShowEulaModal(true);
            setIsEulaFromSettings(false);
          } else {
            const hasSeen = await AsyncStorage.getItem('hasSeenGuide');
            if (!hasSeen) setShowGuide(true);
          }
        }

        const savedBlocked = await AsyncStorage.getItem('@convoy_blocked_users');
        if (mounted && savedBlocked) {
          const parsed = JSON.parse(savedBlocked);
          if (Array.isArray(parsed)) {
            setBlockedUsers(parsed);
            blockedUsersRef.current = parsed;
          }
        }

        const savedRoger = await AsyncStorage.getItem('@convoy_roger_beep');
        if (mounted && savedRoger !== null) {
          const parsedRoger = JSON.parse(savedRoger);
          setRogerBeep(parsedRoger);
          rogerBeepRef.current = parsedRoger;
        }
      } catch (e) {
        console.error('[PREFS] AsyncStorage yukleme hatasi:', e.message);
      }
    })();

    return () => {
      mounted = false;
      if (guideTimerRef.current) clearTimeout(guideTimerRef.current);
    };
  }, [usernameRef]);

  const triggerToast = useCallback((msg) => {
    setToastMessage(msg);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Animated.sequence([
      Animated.timing(toastAnim, { toValue: Platform.OS === 'ios' ? 56 : 24, duration: 280, useNativeDriver: true }),
      Animated.delay(2200),
      Animated.timing(toastAnim, { toValue: -80, duration: 280, useNativeDriver: true }),
    ]).start(() => setToastMessage(null));
  }, [toastAnim]);

  const changeLanguage = useCallback(async (newLang) => {
    setLang(newLang);
    try {
      await AsyncStorage.setItem('@convoy_lang', newLang);
    } catch (e) {
      console.warn('[PREFS] Dil tercihi kaydedilemedi:', e.message);
    }
  }, []);

  const saveUsername = useCallback(async (name) => {
    try {
      await AsyncStorage.setItem('savedUsername', name);
    } catch (e) {
      console.warn('[PREFS] Kullanici adi kaydedilemedi:', e.message);
    }
  }, []);

  const addRecentCode = useCallback(async (code) => {
    const updated = [code, ...recentCodes.filter((c) => c !== code)].slice(0, 3);
    setRecentCodes(updated);
    try {
      await AsyncStorage.setItem('recentCodes', JSON.stringify(updated));
    } catch (e) {
      console.warn('[PREFS] Son kodlar kaydedilemedi:', e.message);
    }
  }, [recentCodes]);

  const handleCloseGuide = useCallback(async () => {
    setShowGuide(false);
    try {
      await AsyncStorage.setItem('hasSeenGuide', 'true');
    } catch (e) {
      console.warn('[PREFS] Rehber durumu kaydedilemedi:', e.message);
    }
  }, []);

  const handleAgreeEula = useCallback(async () => {
    try {
      await AsyncStorage.setItem('@convoy_eula_accepted', 'true');
    } catch (e) {
      console.warn('[PREFS] EULA onayi kaydedilemedi:', e.message);
    }
    setShowEulaModal(false);
    try {
      const hasSeen = await AsyncStorage.getItem('hasSeenGuide');
      if (!hasSeen) guideTimerRef.current = setTimeout(() => setShowGuide(true), 320);
    } catch (e) {
      console.warn('[PREFS] Rehber kontrol hatasi:', e.message);
    }
  }, []);

  const handleBlockUser = useCallback(async (targetUser) => {
    if (!targetUser) return;
    const targetName = targetUser.name;
    const updated = Array.from(new Set([...blockedUsers, targetName]));
    setBlockedUsers(updated);
    blockedUsersRef.current = updated;
    try {
      await AsyncStorage.setItem('@convoy_blocked_users', JSON.stringify(updated));
    } catch (e) {
      console.warn('[PREFS] Engellenen kullanici kaydedilemedi:', e.message);
    }

    dropIncomingFrom(targetName);
    if (activeSpeaker && activeSpeaker.name === targetName) setActiveSpeaker(null);

    socketRef.current?.emit('user_blocked_report', {
      blockedUser: targetName,
      reportedBy: usernameRef.current,
      room: roomCodeRef.current,
      timestamp: new Date().toISOString(),
    });

    setSelectedUserForAction(null);
    setUserActionStep('menu');
    Alert.alert(t('userBlockedTitle'), t('userBlockedMsg'));
  }, [activeSpeaker, blockedUsers, dropIncomingFrom, roomCodeRef, setActiveSpeaker, socketRef, t, usernameRef]);

  const handleUnblockUser = useCallback(async (name) => {
    const updated = blockedUsers.filter((u) => u !== name);
    setBlockedUsers(updated);
    blockedUsersRef.current = updated;
    try {
      await AsyncStorage.setItem('@convoy_blocked_users', JSON.stringify(updated));
    } catch (e) {
      console.warn('[PREFS] Engel kaldirma kaydedilemedi:', e.message);
    }
    triggerToast(t('toastUnblocked', name));
  }, [blockedUsers, t, triggerToast]);

  const handleSelectReportReason = useCallback((reasonKey) => {
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
    Alert.alert(t('reportSubmittedTitle'), t('reportSubmittedMsg'));
  }, [roomCodeRef, selectedUserForAction, socketRef, t, usernameRef]);

  return {
    lang, t, changeLanguage, username, setUsername, saveUsername, recentCodes, addRecentCode,
    showGuide, setShowGuide, handleCloseGuide, showEulaModal, setShowEulaModal,
    isEulaFromSettings, setIsEulaFromSettings, handleAgreeEula, blockedUsers, blockedUsersRef,
    selectedUserForAction, setSelectedUserForAction, userActionStep, setUserActionStep,
    showBlockedUsersModal, setShowBlockedUsersModal, handleBlockUser, handleUnblockUser,
    handleSelectReportReason, rogerBeep, setRogerBeep, rogerBeepRef, toastMessage, toastAnim, triggerToast,
  };
}
