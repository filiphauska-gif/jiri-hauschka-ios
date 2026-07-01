import { useColorScheme } from 'react-native';

const lightColors = {
  bg: '#F2F2F7',
  card: '#FFFFFF',
  text: '#000000',
  textSecondary: '#3C3C43',
  textTertiary: '#8E8E93',
  separator: '#C6C6C8',
  groupedBg: '#F2F2F7',
  accent: '#007AFF',
  black: '#000000',
};

const darkColors = {
  bg: '#000000',
  card: '#1C1C1E',
  text: '#FFFFFF',
  textSecondary: '#98989D',
  textTertiary: '#636366',
  separator: '#38383A',
  groupedBg: '#000000',
  accent: '#0A84FF',
  black: '#FFFFFF',
};

export function useTheme() {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? darkColors : lightColors;

  return {
    colors,
    spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
    fontSize: {
      caption: 12,
      subhead: 15,
      body: 17,
      title: 22,
      largeTitle: 28,
      hero: 34,
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
    },
  };
}

export const theme = {
  colors: lightColors,
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
  fontSize: { caption: 12, subhead: 15, body: 17, title: 22, largeTitle: 28, hero: 34 },
  weight: { regular: '400', medium: '500', semibold: '600', bold: '700' },
  radius: { sm: 6, md: 10, lg: 13 },
};
