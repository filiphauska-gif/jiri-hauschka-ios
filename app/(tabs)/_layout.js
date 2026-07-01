import { Tabs } from 'expo-router';
import { Platform, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../data/theme';

function TabIcon({ name, color, size }) {
  const iconMap = {
    'works': 'images-outline',
    'about': 'person-outline',
    'exhibitions': 'calendar-outline',
  };
  return <Ionicons name={iconMap[name] || 'ellipse'} size={size} color={color} />;
}

export default function TabLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tabIconSelected,
        tabBarInactiveTintColor: colors.tabIconDefault,
        tabBarShowLabel: true,
        tabBarLabelStyle: styles.tabLabel,
        ...(Platform.OS === 'ios'
          ? {
              tabBarStyle: styles.tabBar,
              tabBarBackground: () => (
                <BlurView tint="systemChromeMaterial" intensity={100} style={StyleSheet.absoluteFill} />
              ),
            }
          : {
              tabBarStyle: {
                backgroundColor: colors.card,
                borderTopColor: colors.separator,
              },
            }),
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '600', fontSize: 17 },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Works',
          tabBarIcon: ({ color, size }) => <TabIcon name="works" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: 'About',
          tabBarIcon: ({ color, size }) => <TabIcon name="about" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="exhibitions"
        options={{
          title: 'Exhibitions',
          tabBarIcon: ({ color, size }) => <TabIcon name="exhibitions" color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    borderTopWidth: 0,
    elevation: 0,
    backgroundColor: 'transparent',
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: -2,
  },
});
