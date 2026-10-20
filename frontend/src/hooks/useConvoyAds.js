import { useState, useEffect, useRef, useCallback } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ADS_CONFIG, getAdUnitId, getNativeAdsModule } from '../constants/ads';

export function useConvoyAds(triggerToast, t) {
  const [isAdFree, setIsAdFree] = useState(false);
  const [adFreeRemainingHours, setAdFreeRemainingHours] = useState(0);
  const [isRewardedLoaded, setIsRewardedLoaded] = useState(false);
  const [isRewardedLoading, setIsRewardedLoading] = useState(false);

  const interstitialRef = useRef(null);
  const rewardedRef = useRef(null);
  const isInterstitialLoadedRef = useRef(false);
  const lastInterstitialTimeRef = useRef(0);

  const checkAdFreeStatus = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(ADS_CONFIG.STORAGE_KEYS.AD_FREE_UNTIL);
      if (stored) {
        const until = parseInt(stored, 10);
        const now = Date.now();
        if (until > now) {
          setIsAdFree(true);
          setAdFreeRemainingHours(Math.max(1, Math.ceil((until - now) / (3600 * 1000))));
          return true;
        }
        await AsyncStorage.removeItem(ADS_CONFIG.STORAGE_KEYS.AD_FREE_UNTIL);
      }
      const lastInter = await AsyncStorage.getItem(ADS_CONFIG.STORAGE_KEYS.LAST_INTERSTITIAL);
      if (lastInter) {
        lastInterstitialTimeRef.current = parseInt(lastInter, 10);
      }
    } catch (e) {
      console.warn('[ADS] Durum okunamadi:', e?.message ?? e);
    }
    setIsAdFree(false);
    setAdFreeRemainingHours(0);
    return false;
  }, []);

  const grantAdFreeReward = useCallback(async () => {
    const until = Date.now() + ADS_CONFIG.AD_FREE_DURATION_MS;
    try {
      await AsyncStorage.setItem(ADS_CONFIG.STORAGE_KEYS.AD_FREE_UNTIL, String(until));
    } catch (e) {
      console.warn('[ADS] Odul kaydedilemedi:', e?.message ?? e);
    }
    setIsAdFree(true);
    setAdFreeRemainingHours(24);
    const toastMsg = typeof t === 'function' ? t('toastAdFreeGranted') : '24 saat boyunca reklamsız kokpit aktif edildi';
    triggerToast?.(toastMsg);
  }, [t, triggerToast]);

  const resetAdFreeForTest = useCallback(async () => {
    if (!ADS_CONFIG.IS_TEST_MODE && !__DEV__) return;
    try {
      await AsyncStorage.removeItem(ADS_CONFIG.STORAGE_KEYS.AD_FREE_UNTIL);
      await AsyncStorage.removeItem(ADS_CONFIG.STORAGE_KEYS.LAST_INTERSTITIAL);
      lastInterstitialTimeRef.current = 0;
    } catch (e) {
      console.warn('[ADS] Sifirlama hatasi:', e?.message ?? e);
    }
    setIsAdFree(false);
    setAdFreeRemainingHours(0);
    triggerToast?.('Test: Reklamsız mod sıfırlandı');
  }, [triggerToast]);

  const loadInterstitial = useCallback(() => {
    const nativeAds = getNativeAdsModule();
    if (!nativeAds) return undefined;

    try {
      const { InterstitialAd, AdEventType } = nativeAds;
      const ad = InterstitialAd.createForAdRequest(getAdUnitId('INTERSTITIAL'), {
        requestNonPersonalizedAdsOnly: true,
      });

      const unsubLoaded = ad.addAdEventListener(AdEventType.LOADED, () => {
        isInterstitialLoadedRef.current = true;
      });
      const unsubClosed = ad.addAdEventListener(AdEventType.CLOSED, () => {
        isInterstitialLoadedRef.current = false;
        setTimeout(loadInterstitial, 3000);
      });
      const unsubError = ad.addAdEventListener(AdEventType.ERROR, (err) => {
        isInterstitialLoadedRef.current = false;
        console.warn('[ADS] Interstitial hatasi:', err?.message ?? err);
      });

      interstitialRef.current = ad;
      ad.load();

      return () => {
        unsubLoaded();
        unsubClosed();
        unsubError();
      };
    } catch (e) {
      console.warn('[ADS] Interstitial yuklenemedi:', e?.message ?? e);
      return undefined;
    }
  }, []);

  const loadRewarded = useCallback(() => {
    const nativeAds = getNativeAdsModule();
    if (!nativeAds) {
      setIsRewardedLoaded(true);
      setIsRewardedLoading(false);
      return undefined;
    }

    try {
      setIsRewardedLoading(true);
      const { RewardedAd, RewardedAdEventType, AdEventType } = nativeAds;
      const ad = RewardedAd.createForAdRequest(getAdUnitId('REWARDED'), {
        requestNonPersonalizedAdsOnly: true,
      });

      const unsubLoaded = ad.addAdEventListener(RewardedAdEventType.LOADED, () => {
        setIsRewardedLoaded(true);
        setIsRewardedLoading(false);
      });
      const unsubEarned = ad.addAdEventListener(RewardedAdEventType.EARNED_REWARD, () => {
        grantAdFreeReward();
      });
      const unsubClosed = ad.addAdEventListener(AdEventType.CLOSED, () => {
        setIsRewardedLoaded(false);
        setTimeout(loadRewarded, 3000);
      });
      const unsubError = ad.addAdEventListener(AdEventType.ERROR, (err) => {
        setIsRewardedLoaded(false);
        setIsRewardedLoading(false);
        console.warn('[ADS] Rewarded hatasi:', err?.message ?? err);
      });

      rewardedRef.current = ad;
      ad.load();

      return () => {
        unsubLoaded();
        unsubEarned();
        unsubClosed();
        unsubError();
      };
    } catch (e) {
      setIsRewardedLoading(false);
      console.warn('[ADS] Rewarded yuklenemedi:', e?.message ?? e);
      return undefined;
    }
  }, [grantAdFreeReward]);

  const showExitInterstitial = useCallback(() => {
    if (isAdFree) return false;
    const now = Date.now();
    if (now - lastInterstitialTimeRef.current < ADS_CONFIG.INTERSTITIAL_COOLDOWN_MS) {
      return false;
    }

    const nativeAds = getNativeAdsModule();
    if (!nativeAds) {
      lastInterstitialTimeRef.current = now;
      AsyncStorage.setItem(ADS_CONFIG.STORAGE_KEYS.LAST_INTERSTITIAL, String(now)).catch((e) => console.warn('[ADS] Kayit hatasi:', e?.message ?? e));
      Alert.alert(
        'AdMob Test Geçiş Reklamı',
        'Odadan ayrılma geçiş reklamı (Interstitial) tetiklendi. 15 dakika boyunca tekrar gösterilmeyecek.'
      );
      return true;
    }

    if (isInterstitialLoadedRef.current && interstitialRef.current) {
      try {
        interstitialRef.current.show();
        lastInterstitialTimeRef.current = now;
        AsyncStorage.setItem(ADS_CONFIG.STORAGE_KEYS.LAST_INTERSTITIAL, String(now)).catch((e) => console.warn('[ADS] Kayit hatasi:', e?.message ?? e));
        return true;
      } catch (e) {
        console.warn('[ADS] Interstitial gosterim hatasi:', e?.message ?? e);
      }
    }
    return false;
  }, [isAdFree]);

  const showRewardedAd = useCallback(() => {
    const nativeAds = getNativeAdsModule();
    if (!nativeAds) {
      Alert.alert(
        'AdMob Ödüllü Video (Test Modu)',
        'Test video reklamını izleyip 24 saat boyunca tüm reklamları gizlemek ister misiniz?',
        [
          { text: typeof t === 'function' ? t('cancel') : 'Vazgeç', style: 'cancel' },
          { text: 'İzle ve Aktif Et', onPress: grantAdFreeReward },
        ]
      );
      return true;
    }

    if (isRewardedLoaded && rewardedRef.current) {
      try {
        rewardedRef.current.show();
        return true;
      } catch (e) {
        console.warn('[ADS] Rewarded gosterim hatasi:', e?.message ?? e);
      }
    }
    loadRewarded();
    return false;
  }, [grantAdFreeReward, isRewardedLoaded, loadRewarded, t]);

  useEffect(() => {
    let unmounted = false;
    let unsubInter = null;
    let unsubReward = null;

    (async () => {
      try {
        const activeAdFree = await checkAdFreeStatus();
        if (unmounted) return;

        const nativeAds = getNativeAdsModule();
        if (nativeAds?.default) {
          await nativeAds.default().initialize();
        }
        if (unmounted) return;

        if (!activeAdFree) {
          unsubInter = loadInterstitial();
        }
        unsubReward = loadRewarded();
      } catch (e) {
        console.warn('[ADS] MobileAds init hatasi:', e?.message ?? e);
      }
    })();

    return () => {
      unmounted = true;
      if (unsubInter) unsubInter();
      if (unsubReward) unsubReward();
    };
  }, [checkAdFreeStatus, loadInterstitial, loadRewarded]);

  return {
    isAdFree, adFreeRemainingHours, isRewardedLoaded, isRewardedLoading,
    showExitInterstitial, showRewardedAd, resetAdFreeForTest, checkAdFreeStatus,
  };
}
