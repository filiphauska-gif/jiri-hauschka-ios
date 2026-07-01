import { Platform, useColorScheme } from 'react-native';

// System font — stejný jako web
const systemFont = Platform.select({
  ios: 'System',
  default: 'System',
});

export const Colors = {
  light: {
    bg: '#F5F2EF',          // jemné teplé šedo-krémové pozadí
    card: '#FFFFFF',
    text: '#1D1D1F',         // měkká čerň
    textSecondary: 'rgba(29,29,31,0.64)',
    textTertiary: 'rgba(29,29,31,0.42)',
    separator: 'rgba(0,0,0,0.08)',
    accent: '#0071E3',       // modrá z webu
    accentLight: '#E8F3FF',
    gold: '#C9A96E',
    tabBar: 'rgba(245,242,239,0.92)',
    tabBarBorder: 'rgba(0,0,0,0.06)',
    tabIconDefault: 'rgba(29,29,31,0.32)',
    tabIconSelected: '#0071E3',
    overlay: 'rgba(29,29,31,0.3)',
    skeleton: '#E8E5E2',
    skeletonHighlight: '#F5F2EF',
    black: '#1D1D1F',
    white: '#FFFFFF',
    arButton: '#0071E3',
    heroOverlay: 'rgba(29,29,31,0.45)',
    heroBadge: '#0071E3',
    sectionBg: '#FFFFFF',
    cardShadow: 'rgba(0,0,0,0.04)',
  },
  dark: {
    bg: '#1A1918',
    card: '#2C2A28',
    text: '#F5F2EF',
    textSecondary: 'rgba(245,242,239,0.64)',
    textTertiary: 'rgba(245,242,239,0.42)',
    separator: 'rgba(255,255,255,0.1)',
    accent: '#64AFFF',
    accentLight: '#1E2A38',
    gold: '#D4C5A9',
    tabBar: 'rgba(26,25,24,0.92)',
    tabBarBorder: 'rgba(255,255,255,0.08)',
    tabIconDefault: 'rgba(245,242,239,0.32)',
    tabIconSelected: '#64AFFF',
    overlay: 'rgba(0,0,0,0.5)',
    skeleton: '#3D3B38',
    skeletonHighlight: '#4C4A47',
    black: '#F5F2EF',
    white: '#1A1918',
    arButton: '#64AFFF',
    heroOverlay: 'rgba(0,0,0,0.55)',
    heroBadge: '#64AFFF',
    sectionBg: '#2C2A28',
    cardShadow: 'rgba(0,0,0,0.2)',
  },
};

export function useTheme() {
  const scheme = useColorScheme();
  const colors = Colors[scheme ?? 'light'];
  return {
    colors,
    fonts: { sans: systemFont, serif: systemFont, mono: 'Menlo' },
    spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
    fontSize: { caption: 12, subhead: 15, body: 17, title: 22, largeTitle: 28, hero: 34 },
    weight: { regular: '400', medium: '500', semibold: '600', bold: '700' },
    radius: { sm: 10, md: 14, lg: 20, xl: 22 },
  };
}
