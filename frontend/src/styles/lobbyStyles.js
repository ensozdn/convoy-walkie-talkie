import { Platform } from 'react-native';
import { IS_SMALL_DEVICE, SCREEN_HEIGHT } from '../constants/config';
import { COLORS, RADIUS } from './theme';

const IS_TIGHT_SCREEN = SCREEN_HEIGHT <= 896;
const LOGO_SIZE = IS_TIGHT_SCREEN ? 70 : 84;

export const lobbyStyles = {
  container: { flex: 1, backgroundColor: COLORS.bgPrimary },
  roomRootContainer: { flex: 1, backgroundColor: COLORS.bgDeep },
  roomContentSafeArea: { flex: 1, backgroundColor: COLORS.bgPrimary },
  lobbyScrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: IS_SMALL_DEVICE ? 16 : 20,
    paddingTop: Platform.OS === 'android' ? 12 : 6,
    paddingBottom: Platform.OS === 'ios' ? 20 : 12,
    maxWidth: 520,
    width: '100%',
    alignSelf: 'center',
  },
  lobbyContentWrapper: {
    width: '100%',
  },
  lobbyOuter: {
    flex: 1, paddingHorizontal: IS_SMALL_DEVICE ? 16 : 20,
    paddingTop: Platform.OS === 'android' ? 12 : 6, paddingBottom: 16, justifyContent: 'space-between',
    maxWidth: 520, width: '100%', alignSelf: 'center',
  },
  lobbySubCardCenter: {
    width: '100%',
    marginTop: IS_TIGHT_SCREEN ? 10 : 20,
    marginBottom: 16,
  },
  lobbyTopBar: {
    width: '100%', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginBottom: IS_TIGHT_SCREEN ? 2 : 6,
  },
  lobbyTopBarRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  infoGuideButton: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.bgSurface,
    borderWidth: 1, borderColor: COLORS.borderDefault, alignItems: 'center', justifyContent: 'center',
  },
  miniLangRow: {
    flexDirection: 'row', backgroundColor: COLORS.bgInput, borderRadius: RADIUS.pill,
    padding: 2, borderWidth: 1, borderColor: COLORS.borderDefault,
  },
  miniLangBtn: { paddingHorizontal: 9, paddingVertical: 4, borderRadius: RADIUS.pill, alignItems: 'center', justifyContent: 'center' },
  miniLangBtnActive: { backgroundColor: COLORS.accentCyan },
  miniLangText: { color: COLORS.textDim, fontSize: 11, fontWeight: '800' },
  miniLangTextActive: { color: COLORS.bgPrimary },
  langSelectorRow: {
    flexDirection: 'row', backgroundColor: COLORS.bgInput, borderRadius: RADIUS.sm,
    padding: 3, borderWidth: 1, borderColor: COLORS.borderDefault,
  },
  langBtn: { flex: 1, paddingVertical: 8, borderRadius: RADIUS.xs, alignItems: 'center' },
  langBtnActive: { backgroundColor: COLORS.accentCyan },
  langBtnText: { color: COLORS.textMuted, fontSize: 12, fontWeight: '800' },
  langBtnTextActive: { color: COLORS.bgPrimary },
  lobbyHeroSection: {
    alignItems: 'center',
    marginTop: IS_TIGHT_SCREEN ? 0 : 6,
    marginBottom: IS_TIGHT_SCREEN ? 8 : 14,
  },
  lobbyLogoWrapper: {
    width: LOGO_SIZE + 10, height: LOGO_SIZE + 10,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: IS_TIGHT_SCREEN ? 6 : 10,
  },
  lobbyNeonBorder: {
    position: 'absolute',
    width: LOGO_SIZE + 6,
    height: LOGO_SIZE + 6,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: COLORS.accentCyan,
    shadowColor: COLORS.accentCyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.95,
    shadowRadius: 10,
    elevation: 8,
  },
  lobbyLogoImage: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.45)',
  },
  title: {
    color: COLORS.white, fontSize: IS_TIGHT_SCREEN ? 22 : 26, fontWeight: '900', letterSpacing: 0.4, textAlign: 'center',
  },
  subtitle: {
    color: COLORS.textMuted, fontSize: IS_TIGHT_SCREEN ? 12 : 13, fontWeight: '500',
    textAlign: 'center', marginTop: 3, paddingHorizontal: 12, lineHeight: 18,
  },
  card: {
    width: '100%', backgroundColor: COLORS.bgElevated, borderRadius: RADIUS.xl,
    padding: IS_TIGHT_SCREEN ? 14 : 18, borderWidth: 1, borderColor: COLORS.borderDefault,
  },
  inputContainer: { width: '100%', marginBottom: IS_TIGHT_SCREEN ? 10 : 14 },
  inputLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  inputLabel: { color: COLORS.textMuted, fontSize: 11, fontWeight: '800', letterSpacing: 1, textTransform: 'uppercase' },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.bgInput,
    borderRadius: RADIUS.md, borderWidth: 1.5, borderColor: COLORS.borderDefault,
    paddingHorizontal: 12, height: IS_TIGHT_SCREEN ? 44 : 50, gap: 10,
  },
  inputWrapperFocused: { borderColor: COLORS.accentCyan },
  input: { flex: 1, color: COLORS.white, fontSize: 15, fontWeight: '700', paddingVertical: 0 },
  codeInput: { fontSize: 20, fontWeight: '900', letterSpacing: 4, textAlign: 'center', color: COLORS.accentCyan },
  lobbyActionsStack: { width: '100%', gap: IS_TIGHT_SCREEN ? 8 : 10, marginTop: 2 },
  actionCardPrimary: {
    width: '100%', backgroundColor: COLORS.accentCyan, borderRadius: RADIUS.lg,
    paddingVertical: IS_TIGHT_SCREEN ? 12 : 14, paddingHorizontal: 14,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  actionCardSecondary: {
    width: '100%', backgroundColor: COLORS.bgInput, borderRadius: RADIUS.lg,
    paddingVertical: IS_TIGHT_SCREEN ? 12 : 14, paddingHorizontal: 14,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderWidth: 1.5, borderColor: COLORS.borderDefault,
  },
  actionCardLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  actionIconCirclePrimary: {
    width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(15, 23, 42, 0.16)', alignItems: 'center', justifyContent: 'center',
  },
  actionIconCircleSecondary: {
    width: 36, height: 36, borderRadius: 10, backgroundColor: COLORS.accentCyanSoft, alignItems: 'center', justifyContent: 'center',
  },
  actionTitlePrimary: { color: COLORS.bgPrimary, fontSize: 15, fontWeight: '900' },
  actionSubPrimary: { color: '#0c4a6e', fontSize: 11, fontWeight: '600', marginTop: 1 },
  actionTitleSecondary: { color: COLORS.white, fontSize: 15, fontWeight: '800' },
  actionSubSecondary: { color: COLORS.textMuted, fontSize: 11, fontWeight: '500', marginTop: 1 },
  quickJoinCard: {
    width: '100%',
    backgroundColor: COLORS.bgInput,
    borderRadius: RADIUS.md,
    borderWidth: 1.2,
    borderColor: 'rgba(56, 189, 248, 0.35)',
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  quickJoinLeft: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  quickJoinIconCircle: {
    width: 28, height: 28, borderRadius: 8,
    backgroundColor: COLORS.accentCyanSoft, alignItems: 'center', justifyContent: 'center',
  },
  quickJoinSub: { color: COLORS.textMuted, fontSize: 9, fontWeight: '800', letterSpacing: 0.8 },
  quickJoinCode: { color: COLORS.accentCyan, fontSize: 14, fontWeight: '900', letterSpacing: 2 },
  quickJoinPill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: COLORS.accentCyan, paddingHorizontal: 8, paddingVertical: 4, borderRadius: RADIUS.pill,
  },
  quickJoinPillText: { color: COLORS.bgPrimary, fontSize: 10, fontWeight: '900', letterSpacing: 0.5 },
};
