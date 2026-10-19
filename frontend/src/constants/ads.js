import { TurboModuleRegistry } from 'react-native';

export const ADS_CONFIG = {
  IS_TEST_MODE: true,

  TEST_UNITS: {
    BANNER: 'ca-app-pub-3940256099942544/2934735716',
    INTERSTITIAL: 'ca-app-pub-3940256099942544/4411468910',
    REWARDED: 'ca-app-pub-3940256099942544/1712485313',
  },

  PROD_UNITS_IOS: {
    BANNER: 'ca-app-pub-3940256099942544/2934735716',
    INTERSTITIAL: 'ca-app-pub-3940256099942544/4411468910',
    REWARDED: 'ca-app-pub-3940256099942544/1712485313',
  },

  AD_FREE_DURATION_MS: 24 * 60 * 60 * 1000,
  INTERSTITIAL_COOLDOWN_MS: 15 * 60 * 1000,

  STORAGE_KEYS: {
    AD_FREE_UNTIL: '@convoy_ad_free_until',
    LAST_INTERSTITIAL: '@convoy_last_interstitial',
  },
};

export function getAdUnitId(type) {
  if (ADS_CONFIG.IS_TEST_MODE || __DEV__) {
    return ADS_CONFIG.TEST_UNITS[type] || ADS_CONFIG.TEST_UNITS.BANNER;
  }
  return ADS_CONFIG.PROD_UNITS_IOS[type] || ADS_CONFIG.TEST_UNITS[type];
}

let cachedAdsModule = undefined;

export function getNativeAdsModule() {
  if (cachedAdsModule !== undefined) {
    return cachedAdsModule;
  }
  try {
    const turboModule = TurboModuleRegistry?.get?.('RNGoogleMobileAdsModule');
    if (!turboModule) {
      cachedAdsModule = null;
      return null;
    }
    // Native modul mevcutsa (EAS Build / Production), gercek SDK'yi yukle
    cachedAdsModule = require('react-native-google-mobile-ads');
    return cachedAdsModule;
  } catch (e) {
    console.warn('[ADS] Native AdMob modulu Expo Go icinde devre disi, test simülasyonu aktif.');
    cachedAdsModule = null;
    return null;
  }
}
