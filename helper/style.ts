import { StyleSheet } from 'react-native';



export const colors = {
  background: '#f5f7fa',
  foreground: '#182230',

  card: '#ffffff',
  cardForeground: '#182230',

  popover: '#ffffff',
  popoverForeground: '#182230',

  primary: '#183b63',
  primaryHover: '#244e7d',
  primaryForeground: '#ffffff',

  secondary: '#edf2f7',
  secondaryForeground: '#26384d',

  muted: '#f0f3f7',
  mutedForeground: '#667487',

  accent: '#e9f0f8',
  accentForeground: '#214a73',

  destructive: '#bd3d48',
  success: '#18734d',
  warning: '#986012',
  info: '#2d64a5',

  border: '#dfe5ec',
  input: '#d5dee8',
  ring: '#7392b2',

  cameraBackground: '#090a0c',
  white: '#ffffff',
  black: '#000000',
};

export const darkColors = {
  background: '#101114',
  foreground: '#f3f4f6',

  card: '#191b20',
  cardForeground: '#f3f4f6',

  popover: '#1d2026',
  popoverForeground: '#f3f4f6',

  primary: '#79a9d8',
  primaryHover: '#9bc2e8',
  primaryForeground: '#101a26',

  secondary: '#292c33',
  secondaryForeground: '#f3f4f6',

  muted: '#22252b',
  mutedForeground: '#a0a5af',

  accent: '#292d35',
  accentForeground: '#f3f4f6',

  destructive: '#f16b6b',
  success: '#48c786',
  warning: '#e9b45c',
  info: '#83a0ff',

  border: '#30343c',
  input: '#383d47',
  ring: '#777f8e',

  cameraBackground: '#090a0c',
  white: '#ffffff',
  black: '#000000',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const radius = {
  xs: 6,
  sm: 8,
  md: 11,
  lg: 14,
  xl: 16,
  xxl: 20,
  round: 999,
};

export const typography = {
  brand: 24,
  heading: 28,
  subheading: 20,
  title: 17,
  body: 14,
  small: 12,
  caption: 11,
};

export const fontFamilies = {
  regular: 'PlusJakartaSans-Regular',
  light: 'PlusJakartaSans-Light',
  medium: 'PlusJakartaSans-Medium',
  semiBold: 'PlusJakartaSans-SemiBold',
  bold: 'PlusJakartaSans-Bold',
  extraBold: 'PlusJakartaSans-ExtraBold',
} as const;

export const shadows = {
  small: {
    shadowColor: '#101828',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.035,
    shadowRadius: 3,
    elevation: 1,
  },
  medium: {
    shadowColor: '#101828',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.06,
    shadowRadius: 9,
    elevation: 3,
  },
  large: {
    shadowColor: '#101828',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.09,
    shadowRadius: 19,
    elevation: 6,
  },
};

export const styles = StyleSheet.create({
  // Screen and layout
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screenFrame: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  screenContainer: {
    flex: 1,
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
  },
  screenContent: {
    flexGrow: 1,
    padding: spacing.xl,
  },
  container: {
    width: '100%',
    alignSelf: 'center',
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  column: {
    flexDirection: 'column',
  },
  section: {
    marginBottom: spacing.xxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    width: '100%',
    backgroundColor: colors.border,
  },

  // Typography
  brand: {
    fontFamily: fontFamilies.extraBold,
    color: colors.foreground,
    fontSize: typography.brand,
    fontWeight: '800',
    letterSpacing: -0.8,
  },
  heading: {
    fontFamily: fontFamilies.bold,
    color: colors.foreground,
    fontSize: typography.heading,
    fontWeight: '700',
    letterSpacing: -0.6,
  },
  subheading: {
    fontFamily: fontFamilies.semiBold,
    color: colors.foreground,
    fontSize: typography.subheading,
    fontWeight: '600',
  },
  title: {
    fontFamily: fontFamilies.semiBold,
    color: colors.foreground,
    fontSize: typography.title,
    fontWeight: '600',
  },
  body: {
    fontFamily: fontFamilies.regular,
    color: colors.foreground,
    fontSize: typography.body,
    lineHeight: 21,
  },
  mutedText: {
    fontFamily: fontFamilies.regular,
    color: colors.mutedForeground,
    fontSize: typography.body,
    lineHeight: 20,
  },
  smallText: {
    fontFamily: fontFamilies.medium,
    color: colors.mutedForeground,
    fontSize: typography.small,
    lineHeight: 17,
  },
  caption: {
    fontFamily: fontFamilies.medium,
    color: colors.mutedForeground,
    fontSize: typography.caption,
  },
  link: {
    fontFamily: fontFamilies.semiBold,
    color: colors.info,
    fontSize: typography.body,
    fontWeight: '600',
  },
  textCenter: {
    textAlign: 'center',
  },

  // Header and navigation
  header: {
    minHeight: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.card,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontFamily: fontFamilies.bold,
    color: colors.foreground,
    fontSize: typography.title,
    fontWeight: '700',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: radius.round,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.muted,
    borderWidth: 1,
    borderColor: colors.border,
  },

  // Cards and surfaces
  card: {
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    backgroundColor: colors.card,
    ...shadows.small,
  },
  cardCompact: {
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.card,
  },
  panel: {
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.xl,
    backgroundColor: colors.card,
    ...shadows.medium,
  },
  surfaceMuted: {
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.muted,
  },

  // Buttons
  button: {
    minHeight: 48,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
  },
  buttonText: {
    fontFamily: fontFamilies.semiBold,
    color: colors.primaryForeground,
    fontSize: typography.body,
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonSecondary: {
    backgroundColor: colors.secondary,
    borderColor: colors.border,
  },
  buttonSecondaryText: {
    color: colors.secondaryForeground,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderColor: colors.border,
  },
  buttonOutlineText: {
    color: colors.foreground,
  },
  buttonDanger: {
    backgroundColor: colors.destructive,
    borderColor: colors.destructive,
  },
  buttonSuccess: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  buttonFull: {
    width: '100%',
  },
  buttonDisabled: {
    opacity: 0.5,
  },

  // Forms and inputs
  form: {
    width: '100%',
    gap: spacing.lg,
  },
  formGroup: {
    gap: spacing.xs,
  },
  label: {
    fontFamily: fontFamilies.semiBold,
    color: colors.foreground,
    fontSize: typography.body,
    fontWeight: '600',
  },
  input: {
    fontFamily: fontFamilies.regular,
    width: '100%',
    minHeight: 50,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.input,
    borderRadius: radius.md,
    backgroundColor: colors.card,
    color: colors.foreground,
    fontSize: typography.body,
  },
  inputMultiline: {
    minHeight: 110,
    textAlignVertical: 'top',
  },
  inputHint: {
    fontFamily: fontFamilies.medium,
    color: colors.mutedForeground,
    fontSize: typography.small,
  },
  inputError: {
    borderColor: colors.destructive,
  },

  // Status, alerts and badges
  alert: {
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.muted,
  },
  alertText: {
    fontFamily: fontFamilies.medium,
    color: colors.foreground,
    fontSize: typography.body,
    lineHeight: 20,
  },
  alertSuccess: {
    backgroundColor: '#edf6f1',
    borderColor: '#c8e2d2',
  },
  alertError: {
    backgroundColor: '#fbefef',
    borderColor: '#edcccc',
  },
  alertWarning: {
    backgroundColor: '#faf5e9',
    borderColor: '#e9d9b8',
  },
  badge: {
    minHeight: 25,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.round,
    backgroundColor: colors.muted,
  },
  badgeText: {
    fontFamily: fontFamilies.bold,
    color: colors.mutedForeground,
    fontSize: typography.caption,
    fontWeight: '700',
  },
  badgeSuccess: {
    backgroundColor: '#eaf5ee',
  },
  badgeSuccessText: {
    color: colors.success,
  },
  badgeDanger: {
    backgroundColor: '#fbeeee',
  },
  badgeDangerText: {
    color: colors.destructive,
  },

  // Lists and empty states
  listItem: {
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  emptyState: {
    minHeight: 180,
    padding: spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.border,
    borderRadius: radius.lg,
    backgroundColor: colors.card,
  },

  // Camera and image areas
  image: {
    width: '100%',
    borderRadius: radius.md,
    backgroundColor: colors.muted,
  },
  camera: {
    width: '100%',
    minHeight: 220,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    backgroundColor: colors.cameraBackground,
  },

  // Common sizing helpers
  fullWidth: {
    width: '100%',
  },
  flex: {
    flex: 1,
  },
  flexWrap: {
    flexWrap: 'wrap',
  },
  hidden: {
    display: 'none',
  },
});
