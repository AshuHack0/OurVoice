/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 */

import { Platform } from 'react-native';

// OurVoice: primary civic blue (buttons, tabs, accents); dark = softer blue
const tintColorLight = '#1970E5';
const tintColorDark = '#7ba3c7';

/** Brand logo/tagline — charcoal and civic blue (client spec) */
export const BrandColors = {
  charcoal: '#313235',
  civicBlue: '#1970E5',
} as const;

/** Button colors from typography spec */
export const ButtonColors = {
  primaryBlue: '#1970E5',
  primaryYellow: '#FEDA29',
  secondaryGreen: '#00C458',
} as const;

/** Footer / secondary nav — light gray bg, charcoal text */
export const FooterColors = {
  backgroundLight: '#DDE5EB',
  backgroundDark: '#252a33',
  text: BrandColors.charcoal,
} as const;

/** Phase 1 accent colors — hover states & question/poll card background */
const accentLightBlue = '#E6F0FF';
const cardGrayLight = '#F7F8FA';

export const Colors = {
  light: {
    text: '#1a1d21',
    textSecondary: '#5c6370',
    background: '#f5f6f8',
    surface: '#ffffff',
    tint: tintColorLight,
    icon: '#5c6370',
    tabIconDefault: '#8b92a0',
    tabIconSelected: tintColorLight,
    border: '#e4e6e9',
    accent: tintColorLight,
    cardBg: '#ffffff',
    cardGray: cardGrayLight,
    accentHover: accentLightBlue,
    /** Success / submitted state */
    success: '#16a34a',
    shadow: 'rgba(30, 58, 95, 0.08)',
  },
  dark: {
    text: '#f1f3f5',
    textSecondary: '#9ca3af',
    background: '#0c0e11',
    surface: '#161b22',
    tint: tintColorDark,
    icon: '#9ca3af',
    tabIconDefault: '#6b7280',
    tabIconSelected: tintColorDark,
    border: '#30363d',
    accent: tintColorDark,
    cardBg: '#161b22',
    cardGray: '#1c2128',
    accentHover: 'rgba(25, 112, 229, 0.2)',
    success: '#4ade80',
    shadow: 'rgba(0, 0, 0, 0.35)',
  },
};

/** Tab bar approximate height for scroll padding */
export const TAB_BAR_HEIGHT = 56;

/** Min touch target (px) — mobile-friendly buttons */
export const MIN_TOUCH_TARGET = 52;

/** Optional "Other" field max length (characters) */
export const OTHER_FIELD_MAX_LENGTH = 100;

/** Compact, professional spacing (px) — use for padding/margins */
export const Spacing = {
  screenH: 20,
  screenBottom: 24,
  headerTop: 8,
  headerBottom: 10,
  /** Extra gap for visual flow: logo → headline → paragraph → participation */
  flowSectionGap: 20,
  card: 16,
  /** Space between cards (card ↔ card) */
  cardBetween: 12,
  cardGap: 12,
  sectionGap: 14,
  itemGap: 8,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 14,
  xl: 18,
} as const;

/**
 * Typography usage (Montserrat / Inter) — per client spec
 * Text color Charcoal (#313235) unless noted (e.g. buttons = white on colored bg)
 */
export const Typography = {
  /** Logo: 24–32px Bold, Charcoal */
  logo: { fontSize: 28, fontWeight: '700' as const, letterSpacing: -0.5 },
  logoHeader: { fontSize: 24, fontWeight: '700' as const, letterSpacing: -0.5 },
  logoSplash: { fontSize: 32, fontWeight: '700' as const, letterSpacing: -0.6 },
  /** Tagline: 14–18px Medium, Charcoal */
  tagline: { fontSize: 16, fontWeight: '500' as const, letterSpacing: 0.3 },
  taglineHeader: { fontSize: 14, fontWeight: '500' as const, letterSpacing: 0.3 },
  taglineSplash: { fontSize: 18, fontWeight: '500' as const, letterSpacing: 0.4 },
  /** Headline: 28–36px Bold, Charcoal */
  headline: { fontSize: 32, fontWeight: '700' as const, letterSpacing: -0.3, lineHeight: 38 },
  /** Paragraph: 16px Regular, Charcoal */
  paragraph: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  /** Primary Button: 16px Bold, text White, bg Blue or Yellow */
  primaryButton: { fontSize: 16, fontWeight: '700' as const },
  /** Secondary Button: 16px Medium, text White, bg Green */
  secondaryButton: { fontSize: 16, fontWeight: '500' as const },
  /** Poll Options: 16px Regular, Charcoal, card White */
  pollOption: { fontSize: 16, fontWeight: '400' as const, lineHeight: 22 },
  /** Footer Links: 14px Medium, Charcoal */
  footerLink: { fontSize: 14, fontWeight: '500' as const },
  /** Legacy / UI helpers */
  overline: { fontSize: 11, fontWeight: '600' as const, letterSpacing: 0.6 },
  caption: { fontSize: 12, lineHeight: 18, fontWeight: '400' as const },
  body: { fontSize: 16, lineHeight: 24, fontWeight: '400' as const },
  bodyBold: { fontSize: 16, lineHeight: 24, fontWeight: '600' as const },
  title: { fontSize: 32, fontWeight: '700' as const, letterSpacing: -0.3, lineHeight: 38 },
  subtitle: { fontSize: 14, lineHeight: 20, fontWeight: '500' as const },
  button: { fontSize: 16, fontWeight: '700' as const },
} as const;

/** Card and surface elevation — consistent across app */
export const Shadows = {
  card: Platform.select({
    ios: {
      shadowColor: '#1a1d21',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
    },
    android: { elevation: 2 },
    default: {},
  }),
  header: Platform.select({
    ios: {
      shadowColor: '#1a1d21',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.04,
      shadowRadius: 4,
    },
    android: { elevation: 1 },
    default: {},
  }),
  tabBar: Platform.select({
    ios: {
      shadowColor: '#1a1d21',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 10,
    },
    android: { elevation: 6 },
    default: {},
  }),
} as const;

/** Montserrat / Inter — set to Inter_* after loading @expo-google-fonts/inter */
export const Fonts = Platform.select({
  ios: {
    sans: 'System',
    /** Use when Inter loaded: Inter_400Regular, Inter_500Medium, Inter_700Bold */
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
  default: {
    sans: 'System',
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
  web: {
    sans: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    regular: 'Inter',
    medium: 'Inter',
    bold: 'Inter',
  },
});
