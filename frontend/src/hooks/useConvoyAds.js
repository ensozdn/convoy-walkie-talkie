import { useState, useEffect, useRef, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import mobileAds, {
  InterstitialAd,
  RewardedAd,
  AdEventType,
  RewardedAdEventType,
} from 'react-native-google-mobile-ads';
import { ADS_CONFIG, getAdUnitId } from '../constants/ads';

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

  const loadInterstitial = useCallback(() => {
    try {
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
    }
  }, []);

  const loadRewarded = useCallback(() => {
    try {
      setIsRewardedLoading(true);
      const ad = RewardedAd.createForAdRequest(getAdUnitId('REWARDED'), {
        requestNonPersonalizedAdsOnly: true,
      });

      const unsubLoaded = ad.addAdEventListener(RewardedAdEventType.LOADED, () => {
        setIsRewardedLoaded(true);
        setIsRewardedLoading(false);
      });

      const unsubEarned = ad.addAdEventListener(RewardedAdEventType.EARNED_REWARD, async () => {
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
    }
  }, [t, triggerToast]);

  const showExitInterstitial = useCallback(() => {
    if (isAdFree) return false;
    const now = Date.now();
    if (now - lastInterstitialTimeRef.current < ADS_CONFIG.INTERSTITIAL_COOLDOWN_MS) {
      return false;
    }
    if (isInterstitialLoadedRef.current && interstitialRef.current) {
      try {
        interstitialRef.current.show();
        lastInterstitialTimeRef.current = now;
        AsyncStorage.setItem(ADS_CONFIG.STORAGE_KEYS.LAST_INTERSTITIAL, String(now)).catch(() => {});
        return true;
      } catch (e) {
        console.warn('[ADS] Interstitial gosterim hatasi:', e?.message ?? e);
      }
    }
    return false;
  }, [isAdFree]);

  const showRewardedAd = useCallback(() => {
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
  }, [isRewardedLoaded, loadRewarded]);

  useEffect(() => {
    let unmounted = false;
    let unsubInter = null;
    let unsubReward = null;

    (async () => {
      try {
        await mobileAds().initialize();
        if (unmounted) return;
        const activeAdFree = await checkAdFreeStatus();
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
    isAdFree,
    adFreeRemainingHours,
    isRewardedLoaded,
    isRewardedLoading,
    showExitInterstitial,
    showRewardedAd,
    checkAdFreeStatus,
  };
}
