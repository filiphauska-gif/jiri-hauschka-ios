import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../data/theme';

export default function RootLayout() {
  const { colors } = useTheme();
  
  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ contentStyle: { backgroundColor: colors.bg } }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="detail/[slug]" options={{ 
          title: 'Artwork',
          headerBackTitle: 'Back',
          presentation: 'card',
          headerTintColor: colors.accent,
          headerStyle: { backgroundColor: colors.card },
        }} />
      </Stack>
    </>
  );
}
