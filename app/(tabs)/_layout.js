import { Tabs } from 'expo-router';
import { Platform, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../data/theme';

function TabIcon({ name, color }) {
  const icons = { works: 'images-outline', about: 'person-outline', exhibitions: 'calendar-outline' };
  return <Ionicons name={icons[name] || 'ellipse'} size={24} color={color} />;
}

export default function TabLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tabIconSelected,
        tabBarInactiveTintColor: colors.tabIconDefault,
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600', marginTop: -2 },
        ...(Platform.OS === 'ios'
          ? {
              tabBarStyle: { position: 'absolute', borderTopWidth: 0, elevation: 0, backgroundColor: 'transparent' },
              tabBarBackground: () => <BlurView tint="systemChromeMaterial" intensity={100} style={StyleSheet.absoluteFill} />,
            }
          : { tabBarStyle: { backgroundColor: colors.card, borderTopColor: colors.separator } }),
        headerStyle: { backgroundColor: colors.bg },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '600', fontSize: 17 },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Works', tabBarIcon: ({ color }) => <TabIcon name="works" color={color} /> }} />
      <Tabs.Screen name="about" options={{ title: 'About', tabBarIcon: ({ color }) => <TabIcon name="about" color={color} /> }} />
      <Tabs.Screen name="exhibitions" options={{ title: 'Exhibitions', tabBarIcon: ({ color }) => <TabIcon name="exhibitions" color={color} /> }} />
    </Tabs>
  );
}
