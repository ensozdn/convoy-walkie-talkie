import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getAdUnitId, getNativeAdsModule, ADS_CONFIG } from '../constants/ads';
import { styles } from '../styles/styles';
import { COLORS } from '../styles/theme';

export function ConvoyBanner({ isAdFree, isTrackingGranted, style }) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  if (isAdFree || hasError) return null;

  const nativeAds = getNativeAdsModule();

  if (!nativeAds) {
    return (
      <View style={[styles.bannerContainer, style]}>
        <View style={styles.mockBannerBox}>
          <View style={styles.mockAdTag}>
            <Text style={styles.mockAdTagText}>AD</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.mockBannerTitle}>Google AdMob Test Banner (320x50)</Text>
            <Text style={styles.mockBannerSub}>Canlı derlemede gerçek AdMob reklamı gösterilir</Text>
          </View>
          <Ionicons name="open-outline" size={14} color={COLORS.textMuted} />
        </View>
      </View>
    );
  }

  const { BannerAd, BannerAdSize } = nativeAds;

  return (
    <View style={[styles.bannerContainer, style]}>
      {isLoaded && (
        <View style={styles.sponsorBadge}>
          <Text style={styles.sponsorBadgeText}>SPONSOR</Text>
        </View>
      )}
      <BannerAd
        unitId={getAdUnitId('BANNER')}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: !isTrackingGranted }}
        onAdLoaded={() => setIsLoaded(true)}
        onAdFailedToLoad={(err) => {
          console.warn('[ADS] Banner yuklenemedi:', err?.message ?? err);
          setHasError(true);
        }}
      />
    </View>
  );
}

export function RewardedAdButton({
  isAdFree,
  remainingHours,
  onPress,
  onResetTest,
  isLoading,
  t,
  style,
  hideWhenActive = false,
}) {
  if (isAdFree) {
    if (hideWhenActive) return null;
    return (
      <TouchableOpacity
        style={[styles.adFreeActiveCard, style]}
        onLongPress={ADS_CONFIG.IS_TEST_MODE || __DEV__ ? onResetTest : undefined}
        activeOpacity={0.9}
      >
        <View style={styles.adFreeIconCircle}>
          <Ionicons name="shield-checkmark" size={18} color={COLORS.txGreenBright} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.adFreeActiveTitle}>
            {typeof t === 'function' ? t('adFreeActiveBadge') : 'REKLAMSIZ MOD'}
          </Text>
          <Text style={styles.adFreeActiveSub}>
            {typeof t === 'function' ? t('adFreeRemaining', remainingHours) : `${remainingHours} saat kaldı`}
          </Text>
        </View>
        <View style={styles.activePill}>
          <Text style={styles.activePillText}>24H</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.rewardedCard, style]}
      onPress={onPress}
      activeOpacity={0.85}
      disabled={isLoading}
    >
      <View style={styles.rewardedIconCircle}>
        {isLoading ? (
          <ActivityIndicator size="small" color={COLORS.accentCyan} />
        ) : (
          <Ionicons name="play-circle" size={22} color={COLORS.accentCyan} />
        )}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.rewardedTitle}>
          {typeof t === 'function' ? t('rewardedBtnTitle') : '24 Saat Reklamsız Sürüş'}
        </Text>
        <Text style={styles.rewardedSub}>
          {typeof t === 'function' ? t('rewardedBtnSub') : 'Kısa video izle, 24 saat sıfır reklam kullan'}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color={COLORS.textDim} />
    </TouchableOpacity>
  );
}
