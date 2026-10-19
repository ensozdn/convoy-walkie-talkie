import { IS_SMALL_DEVICE } from '../constants/config';
import { COLORS, RADIUS } from './theme';

const PTT_OUTER_SIZE = IS_SMALL_DEVICE ? 132 : 154;
const PTT_BUTTON_SIZE = IS_SMALL_DEVICE ? 114 : 134;

export const pttAndStripStyles = {
  convoyStripSection: {
    backgroundColor: COLORS.bgElevated,
    borderRadius: RADIUS.md,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
  },
  sectionMicroHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6,
  },
  sectionMicroTitle: {
    color: COLORS.textDim, fontSize: 10, fontWeight: '800', letterSpacing: 1,
  },
  sectionMicroActionBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 3, paddingVertical: 2, paddingHorizontal: 4,
  },
  sectionMicroActionText: {
    color: COLORS.accentCyan, fontSize: 10, fontWeight: '800',
  },
  convoyAvatarScroll: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingVertical: 2,
  },
  avatarItemCol: {
    alignItems: 'center', width: 48,
  },
  avatarCircleWrapper: {
    width: 38, height: 38, borderRadius: 19, borderWidth: 2,
    alignItems: 'center', justifyContent: 'center', position: 'relative',
  },
  avatarCircleSpeaking: {
    borderColor: COLORS.txGreenBright, backgroundColor: COLORS.txGreenSoft,
  },
  avatarCircleText: {
    fontSize: 14, fontWeight: '900',
  },
  avatarLeaderCrownBadge: {
    position: 'absolute', top: -3, right: -3, backgroundColor: COLORS.rxAmber,
    borderRadius: 6, width: 13, height: 13, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: COLORS.bgElevated,
  },
  avatarSpeakingMicBadge: {
    position: 'absolute', bottom: -2, right: -2, backgroundColor: COLORS.txGreenBright,
    borderRadius: 6, width: 13, height: 13, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: COLORS.bgElevated,
  },
  avatarNameText: {
    color: COLORS.textDim, fontSize: 9.5, fontWeight: '700', marginTop: 3, textAlign: 'center', width: '100%',
  },
  avatarNameTextLocal: {
    color: COLORS.accentCyan, fontWeight: '900',
  },
  avatarNameTextSpeaking: {
    color: COLORS.txGreenBright, fontWeight: '900',
  },
  convoyStripScroll: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  participantChip: {
    flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: COLORS.bgInput,
    paddingVertical: 7, paddingHorizontal: 10, borderRadius: RADIUS.sm, borderWidth: 1, borderColor: COLORS.borderDefault,
  },
  participantChipSpeaking: { borderColor: COLORS.txGreenBright, backgroundColor: COLORS.txGreenSoft },
  avatarBadge: {
    width: 28, height: 28, borderRadius: 9, backgroundColor: COLORS.bgElevated,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.borderHighlight,
  },
  avatarBadgeSpeaking: { backgroundColor: COLORS.txGreen, borderColor: COLORS.txGreenBright },
  avatarBadgeText: { color: COLORS.white, fontSize: 12, fontWeight: '900' },
  chipMetaCol: { justifyContent: 'center' },
  chipNameRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  chipText: { color: COLORS.white, fontSize: 12, fontWeight: '800', maxWidth: 96 },
  chipDistanceText: { color: COLORS.textMuted, fontSize: 10, fontWeight: '700', marginTop: 1 },
  leaderMiniBadge: {
    backgroundColor: COLORS.rxAmberSoft, borderWidth: 1, borderColor: COLORS.rxAmber,
    borderRadius: 4, paddingHorizontal: 4, paddingVertical: 1,
  },
  leaderMiniBadgeText: { color: COLORS.rxAmberBright, fontSize: 8, fontWeight: '900', letterSpacing: 0.5 },
  quickPingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quickPingBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    backgroundColor: COLORS.bgElevated,
    paddingVertical: IS_SMALL_DEVICE ? 9 : 11,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
  },
  quickPingBtnText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '800',
  },
  pttContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: IS_SMALL_DEVICE ? 4 : 8,
  },
  pttOuterChassis: {
    width: PTT_OUTER_SIZE,
    height: PTT_OUTER_SIZE,
    borderRadius: PTT_OUTER_SIZE / 2,
    backgroundColor: COLORS.bgInput,
    borderWidth: 2,
    borderColor: COLORS.borderDefault,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseRing: {
    position: 'absolute',
    width: PTT_OUTER_SIZE + 14,
    height: PTT_OUTER_SIZE + 14,
    borderRadius: (PTT_OUTER_SIZE + 14) / 2,
    borderWidth: 2.5,
  },
  pttButton: {
    width: PTT_BUTTON_SIZE,
    height: PTT_BUTTON_SIZE,
    borderRadius: PTT_BUTTON_SIZE / 2,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  pttButtonDisabled: {
    opacity: 0.72,
  },
  pttText: {
    color: COLORS.white,
    fontSize: IS_SMALL_DEVICE ? 13 : 15,
    fontWeight: '900',
    letterSpacing: 1,
    textAlign: 'center',
    marginTop: 6,
  },
  pttSubHint: {
    color: COLORS.textDim,
    fontSize: 11,
    fontWeight: '600',
    marginTop: 8,
  },
  quickPttDock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.bgElevated,
    marginHorizontal: 14,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
  },
  quickPttStatusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    flex: 1,
    marginRight: 10,
  },
  quickPttIndicatorDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
  },
  quickPttStatusTitle: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '800',
  },
  quickPttStatusSub: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '600',
  },
  quickPttActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: RADIUS.sm,
    borderWidth: 1.5,
  },
  quickPttActionText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
};
