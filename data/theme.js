import { Platform, useColorScheme } from 'react-native';

// iOS SF Fonts
export const Fonts = Platform.select({
  ios: {
    sans: 'System',
    serif: 'Georgia',
    rounded: 'System',
    mono: 'Menlo',
  },
  default: {
    sans: 'System',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
});

const tintLight = '#1A1A1A';
const tintDark = '#FFFFFF';
const accentLight = '#8B7355';      // Muted gold/warm
const accentDark = '#D4C5A9';        // Lighter warm for dark mode

export const Colors = {
  light: {
    text: '#000000',
    textSecondary: '#3C3C43',
    textTertiary: '#8E8E93',
    background: '#F2F2F7',
    card: '#FFFFFF',
    cardBorder: '#E5E5EA',
    separator: '#C6C6C8',
    tint: tintLight,
    accent: accentLight,
    tabBar: 'rgba(255, 255, 255, 0.85)',
    tabBarBorder: 'rgba(0, 0, 0, 0.1)',
    tabIconDefault: '#8E8E93',
    tabIconSelected: '#000000',
    overlay: 'rgba(0,0,0,0.3)',
    blue: '#007AFF',
    black: '#000000',
    white: '#FFFFFF',
    skeleton: '#E5E5EA',
    skeletonHighlight: '#F2F2F7',
  },
  dark: {
    text: '#FFFFFF',
    textSecondary: '#98989D',
    textTertiary: '#636366',
    background: '#000000',
    card: '#1C1C1E',
    cardBorder: '#38383A',
    separator: '#38383A',
    tint: tintDark,
    accent: accentDark,
    tabBar: 'rgba(0, 0, 0, 0.85)',
    tabBarBorder: 'rgba(255, 255, 255, 0.15)',
    tabIconDefault: '#636366',
    tabIconSelected: '#FFFFFF',
    overlay: 'rgba(0,0,0,0.5)',
    blue: '#0A84FF',
    black: '#FFFFFF',
    white: '#000000',
    skeleton: '#2C2C2E',
    skeletonHighlight: '#3A3A3C',
  },
};

export function useAppTheme() {
  const scheme = useColorScheme();
  const colors = Colors[scheme ?? 'light'];
  return {
    colors,
    fonts: Fonts,
    spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
    fontSize: {
      caption: 12,
      subhead: 15,
      body: 17,
      title: 22,
      largeTitle: 28,
      hero: 36,
    },
    weight: {
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    radius: {
      sm: 6,
      md: 10,
      lg: 13,
      xl: 20,
    },
  };
}
