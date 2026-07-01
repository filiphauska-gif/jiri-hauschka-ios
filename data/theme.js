import { Platform, useColorScheme } from 'react-native';

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

export const Colors = {
  light: {
    bg: '#F8F5F0',          // warm cream
    card: '#FFFFFF',
    text: '#2D2A24',
    textSecondary: '#6B6560',
    textTertiary: '#A69F99',
    separator: '#E8E4DE',
    accent: '#2C5F7C',       // teal/navy
    accentLight: '#E8F0F4',  // light teal tint
    gold: '#C9A96E',         // warm gold
    tabBar: 'rgba(248,245,240,0.92)',
    tabBarBorder: 'rgba(0,0,0,0.08)',
    tabIconDefault: '#A69F99',
    tabIconSelected: '#2C5F7C',
    overlay: 'rgba(45,42,36,0.35)',
    skeleton: '#E8E4DE',
    skeletonHighlight: '#F5F2ED',
    black: '#2D2A24',
    white: '#FFFFFF',
    arButton: '#2C5F7C',
    heroOverlay: 'rgba(45,42,36,0.4)',
  },
  dark: {
    bg: '#1A1816',
    card: '#2A2724',
    text: '#F0EDE8',
    textSecondary: '#A69F99',
    textTertiary: '#7A7470',
    separator: '#3D3935',
    accent: '#6BA3C4',       // lighter teal for dark
    accentLight: '#2A373F',
    gold: '#D4C5A9',
    tabBar: 'rgba(26,24,22,0.92)',
    tabBarBorder: 'rgba(255,255,255,0.1)',
    tabIconDefault: '#7A7470',
    tabIconSelected: '#6BA3C4',
    overlay: 'rgba(0,0,0,0.5)',
    skeleton: '#3D3935',
    skeletonHighlight: '#4A4642',
    black: '#F0EDE8',
    white: '#1A1816',
    arButton: '#6BA3C4',
    heroOverlay: 'rgba(0,0,0,0.5)',
  },
};

export function useTheme() {
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
    weight: { regular: '400', medium: '500', semibold: '600', bold: '700' },
    radius: { sm: 6, md: 10, lg: 14, xl: 20 },
  };
}
