import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { getAdUnitId } from '../constants/ads';
import { COLORS, RADIUS } from '../styles/theme';

export function ConvoyBanner({ isAdFree, style }) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  if (isAdFree || hasError) return null;

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
        requestOptions={{ requestNonPersonalizedAdsOnly: true }}
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
  isLoading,
  t,
  style,
}) {
  if (isAdFree) {
    return (
      <View style={[styles.adFreeActiveCard, style]}>
        <View style={styles.adFreeIconCircle}>
          <Ionicons name="shield-checkmark" size={18} color={COLORS.txGreenBright} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.adFreeActiveTitle}>
            {typeof t === 'function' ? t('adFreeActiveBadge') : 'REKLAMSIZ MOD AKTİF'}
          </Text>
          <Text style={styles.adFreeActiveSub}>
            {typeof t === 'function' ? t('adFreeRemaining', remainingHours) : `${remainingHours} saat kaldı`}
          </Text>
        </View>
        <View style={styles.activePill}>
          <Text style={styles.activePillText}>24H</Text>
        </View>
      </View>
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

const styles = StyleSheet.create({
  bannerContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 6,
    overflow: 'hidden',
  },
  sponsorBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.bgInput,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 3,
    borderWidth: 0.5,
    borderColor: COLORS.borderDefault,
  },
  sponsorBadgeText: {
    color: COLORS.textDim,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  rewardedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: COLORS.bgElevated,
    borderRadius: RADIUS.md,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderWidth: 1.5,
    borderColor: COLORS.borderHighlight,
    marginVertical: 6,
  },
  rewardedIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: COLORS.accentCyanSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rewardedTitle: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  rewardedSub: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  adFreeActiveCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderRadius: RADIUS.md,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(34, 197, 94, 0.4)',
    marginVertical: 6,
  },
  adFreeIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  adFreeActiveTitle: {
    color: COLORS.txGreenBright,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  adFreeActiveSub: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '600',
    marginTop: 1,
  },
  activePill: {
    backgroundColor: COLORS.bgInput,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.4)',
  },
  activePillText: {
    color: COLORS.txGreenBright,
    fontSize: 10,
    fontWeight: '900',
  },
});
