import { TestIds } from 'react-native-google-mobile-ads';

export const ADS_CONFIG = {
  // Canli reklamlar acildiginda buraya gercek Ad Unit ID'leri eklenecektir
  IS_TEST_MODE: true,

  // Google Resmi Test Ad Unit ID'leri (Test modunda bunlari kullanir)
  TEST_UNITS: {
    BANNER: TestIds.BANNER,
    INTERSTITIAL: TestIds.INTERSTITIAL,
    REWARDED: TestIds.REWARDED,
  },

  // AdMob Paneli Uzerinden Alinacak Gercek iOS Reklam Birimi ID'leri
  PROD_UNITS_IOS: {
    BANNER: 'ca-app-pub-3940256099942544/2934735716', // Kullanici canli ID verene kadar test fallback
    INTERSTITIAL: 'ca-app-pub-3940256099942544/4411468910',
    REWARDED: 'ca-app-pub-3940256099942544/1712485313',
  },

  // Zamanlama ve Sureler
  AD_FREE_DURATION_MS: 24 * 60 * 60 * 1000, // 24 saat
  INTERSTITIAL_COOLDOWN_MS: 15 * 60 * 1000, // 15 dakika odadan cikis gecis reklami araligi

  STORAGE_KEYS: {
    AD_FREE_UNTIL: '@convoy_ad_free_until',
    LAST_INTERSTITIAL: '@convoy_last_interstitial',
  },
};

export function getAdUnitId(type) {
  if (ADS_CONFIG.IS_TEST_MODE || __DEV__) {
    return ADS_CONFIG.TEST_UNITS[type] || TestIds.BANNER;
  }
  return ADS_CONFIG.PROD_UNITS_IOS[type] || ADS_CONFIG.TEST_UNITS[type];
}
