import { Platform } from 'react-native';
import { IS_SMALL_DEVICE } from '../constants/config';
import { COLORS, RADIUS } from './theme';

export const tabsStyles = {
  fullScreenTabContainer: {
    flex: 1, paddingHorizontal: IS_SMALL_DEVICE ? 12 : 16, paddingTop: IS_SMALL_DEVICE ? 6 : 10, paddingBottom: 6,
  },
  tabHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  tabTitleWrapper: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  tabTitleText: { color: COLORS.white, fontSize: 18, fontWeight: '900', letterSpacing: 0.3 },
  fullScreenMapCard: {
    flex: 1, borderRadius: RADIUS.lg, overflow: 'hidden',
    borderWidth: 1.5, borderColor: COLORS.borderDefault, backgroundColor: COLORS.bgInput,
  },
  fullScreenMap: { width: '100%', height: '100%' },
  mapLayerBtnHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: COLORS.bgElevated,
    paddingHorizontal: 11, paddingVertical: 7, borderRadius: RADIUS.sm, borderWidth: 1, borderColor: COLORS.borderDefault,
  },
  mapBottomControlsRow: {
    position: 'absolute', bottom: 12, left: 12, right: 12,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8,
  },
  mapFitBtnOverlay: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(15, 23, 42, 0.92)', paddingHorizontal: 11, paddingVertical: 9,
    borderRadius: RADIUS.sm, borderWidth: 1, borderColor: COLORS.borderDefault,
  },
  mapFollowBtnOverlay: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(15, 23, 42, 0.92)', paddingHorizontal: 11, paddingVertical: 9,
    borderRadius: RADIUS.sm, borderWidth: 1, borderColor: COLORS.borderDefault,
  },
  mapFollowBtnActive: { backgroundColor: COLORS.accentCyanDark, borderColor: COLORS.accentCyan },
  mapLayerBtnActive: { backgroundColor: COLORS.accentCyanDark, borderColor: COLORS.accentCyan },
  btnLabelText: { color: COLORS.accentCyan, fontSize: 11, fontWeight: '800', letterSpacing: 0.4 },
  btnLabelTextActive: { color: COLORS.white },
  markerContainer: { alignItems: 'center' },
  markerNameBadge: {
    paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6, marginBottom: 3,
    borderWidth: 1.5, borderColor: COLORS.white,
  },
  markerNameText: { color: COLORS.white, fontSize: 10, fontWeight: '800' },
  customMarkerPin: {
    width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: COLORS.white,
  },
  customMarkerPinLeader: { borderColor: COLORS.rxAmberBright, borderWidth: 2.5 },
  markerText: { color: COLORS.white, fontSize: 12, fontWeight: '900' },
  mapDriverStripScroll: { flexDirection: 'row', alignItems: 'center', gap: 7, paddingBottom: 9 },
  mapDriverChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: COLORS.bgElevated,
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: RADIUS.pill, borderWidth: 1, borderColor: COLORS.borderDefault,
  },
  mapDriverChipActive: { backgroundColor: COLORS.accentCyanSoft, borderColor: COLORS.accentCyan },
  mapDriverChipLeader: { borderColor: COLORS.rxAmber },
  mapDriverChipText: { color: COLORS.white, fontSize: 11, fontWeight: '800' },
  mapDriverChipDist: { color: COLORS.accentCyan, fontSize: 10, fontWeight: '700' },
  waypointBanner: {
    position: 'absolute', top: 12, left: 12, right: 12, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', gap: 14, backgroundColor: 'rgba(15, 23, 42, 0.94)',
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: RADIUS.sm, borderWidth: 1, borderColor: COLORS.rxAmber,
  },
  waypointBannerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1, paddingRight: 6 },
  waypointBannerTextCol: { flex: 1, justifyContent: 'center' },
  waypointBannerText: { color: COLORS.rxAmberBright, fontSize: 10, fontWeight: '900', letterSpacing: 0.4, flexShrink: 1 },
  waypointDistanceSubText: { color: COLORS.white, fontSize: 11, fontWeight: '800', marginTop: 1 },
  waypointActionsRight: { flexDirection: 'row', alignItems: 'center', gap: 8, flexShrink: 0 },
  waypointNavBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: COLORS.rxAmber,
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6,
  },
  waypointNavBtnText: { color: COLORS.bgPrimary, fontSize: 10, fontWeight: '900' },
  waypointClearBtn: {
    width: 26, height: 26, borderRadius: 6, backgroundColor: COLORS.rxAmberSoft,
    alignItems: 'center', justifyContent: 'center',
  },
  waypointMarkerPin: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.rxAmber,
    borderWidth: 2, borderColor: COLORS.white, alignItems: 'center', justifyContent: 'center',
  },
  mapLeaderWaypointBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    backgroundColor: 'rgba(15, 23, 42, 0.94)', paddingHorizontal: 10, paddingVertical: 9,
    borderRadius: RADIUS.sm, borderWidth: 1, borderColor: COLORS.rxAmber,
  },
  mapLeaderWaypointText: { color: COLORS.rxAmberBright, fontSize: 11, fontWeight: '800', letterSpacing: 0.3 },
  waypointCrosshairOverlay: {
    ...({ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }),
    alignItems: 'center', justifyContent: 'center',
  },
  waypointCrosshairRing: {
    width: 48, height: 48, borderRadius: 24, borderWidth: 2, borderColor: COLORS.rxAmberBright,
    backgroundColor: 'rgba(245, 158, 11, 0.18)', alignItems: 'center', justifyContent: 'center',
  },
  waypointPickerActionBar: {
    position: 'absolute', bottom: 14, left: 14, right: 14, flexDirection: 'row', alignItems: 'center', gap: 8,
  },
  waypointCancelBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5,
    backgroundColor: 'rgba(15, 23, 42, 0.94)', paddingVertical: 11, borderRadius: RADIUS.sm,
    borderWidth: 1, borderColor: COLORS.borderHighlight,
  },
  waypointCancelText: { color: COLORS.textSecondary, fontSize: 12, fontWeight: '800' },
  waypointConfirmBtn: {
    flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    backgroundColor: COLORS.rxAmber, paddingVertical: 11, borderRadius: RADIUS.sm,
    borderWidth: 1, borderColor: COLORS.rxAmberBright,
  },
  waypointConfirmText: { color: COLORS.bgPrimary, fontSize: 12, fontWeight: '900', letterSpacing: 0.4 },
  driverCountBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: COLORS.accentCyanSoft,
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: RADIUS.pill,
  },
  driverCountText: { color: COLORS.accentCyan, fontSize: 12, fontWeight: '800' },
  emptyDriversContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 48, gap: 10 },
  emptyDriversText: { color: COLORS.textMuted, fontSize: 14, fontWeight: '600' },
  driverCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.bgElevated,
    borderRadius: RADIUS.md, padding: 13, marginBottom: 9, borderWidth: 1, borderColor: COLORS.borderDefault, gap: 12,
  },
  driverCardSpeaking: { borderColor: COLORS.txGreenBright, backgroundColor: COLORS.txGreenSoft },
  driverAvatarLarge: {
    width: 44, height: 44, borderRadius: 14, backgroundColor: COLORS.bgInput,
    borderWidth: 1, borderColor: COLORS.borderHighlight, alignItems: 'center', justifyContent: 'center',
  },
  driverAvatarLargeSpeaking: { backgroundColor: COLORS.txGreen, borderColor: COLORS.txGreenBright },
  driverAvatarText: { color: COLORS.white, fontSize: 16, fontWeight: '900' },
  driverInfo: { flex: 1 },
  driverNameRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6 },
  driverNameText: { color: COLORS.white, fontSize: 15, fontWeight: '800' },
  driverNameTextSpeaking: { color: COLORS.txGreenBright },
  youBadge: { backgroundColor: COLORS.accentCyanSoft, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  youBadgeText: { color: COLORS.accentCyan, fontSize: 10, fontWeight: '800' },
  leaderBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: COLORS.rxAmberSoft,
    borderWidth: 1, borderColor: COLORS.rxAmber, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6,
  },
  leaderBadgeText: { color: COLORS.rxAmberBright, fontSize: 9, fontWeight: '900', letterSpacing: 0.5 },
  driverStatusRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  driverStatusDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: COLORS.textDim },
  driverStatusDotSpeaking: { backgroundColor: COLORS.txGreenBright },
  driverStatusText: { color: COLORS.textMuted, fontSize: 12, fontWeight: '600' },
  driverStatusTextSpeaking: { color: COLORS.txGreenBright, fontWeight: '700' },
  driverDistancePill: {
    flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: COLORS.bgInput,
    paddingHorizontal: 8, paddingVertical: 5, borderRadius: RADIUS.xs, borderWidth: 1, borderColor: COLORS.borderDefault,
  },
  driverDistanceText: { color: COLORS.accentCyan, fontSize: 11, fontWeight: '800' },
  driverMoreBtn: {
    width: 32, height: 32, borderRadius: 10, backgroundColor: COLORS.bgInput, alignItems: 'center', justifyContent: 'center',
  },
  bottomTabBarContainer: {
    flexDirection: 'row', backgroundColor: COLORS.bgElevated, borderTopWidth: 1, borderTopColor: COLORS.borderDefault,
    paddingHorizontal: 10, paddingTop: 8, paddingBottom: Platform.OS === 'ios' ? 16 : 8,
  },
  bottomTabBtn: {
    flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 6, borderRadius: RADIUS.sm, gap: 3,
  },
  bottomTabBtnActive: { backgroundColor: COLORS.accentCyanSoft },
  bottomTabText: { color: COLORS.textDim, fontSize: 11, fontWeight: '700' },
  bottomTabTextActive: { color: COLORS.accentCyan, fontWeight: '900' },
};
