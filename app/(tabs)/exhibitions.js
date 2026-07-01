import { ScrollView, View, Text, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../data/theme';

const exhibitions = [
  { year: '2025', title: 'Nobody Knows', venue: 'Pragovka Gallery', location: 'Prague' },
  { year: '2023', title: 'Art Prague', venue: 'Kafkáč', location: 'Prague' },
  { year: '2023', title: 'Hidden Paths', venue: 'Gallery U Zlatého prstenu', location: 'Prague' },
  { year: '2022', title: 'Strange Days', venue: 'Gallery 1', location: 'Prague' },
  { year: '2022', title: 'Jiří Hauschka', venue: 'Centrum současného umění', location: 'Prague' },
];

const grouped = exhibitions.reduce((acc, item) => {
  if (!acc[item.year]) acc[item.year] = [];
  acc[item.year].push(item);
  return acc;
}, {});

export default function ExhibitionsScreen() {
  const { colors, radius } = useTheme();
  const years = Object.keys(grouped).sort((a, b) => b - a);

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.bg }]} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {years.map((year, yi) => (
        <View key={year} style={{ marginBottom: yi < years.length - 1 ? 24 : 0 }}>
          <View style={styles.sectionRow}>
            <Ionicons name="calendar-outline" size={14} color={colors.accent} style={{ marginRight: 6 }} />
            <Text style={[styles.sectionHeader, { color: colors.accent }]}>{year}</Text>
          </View>
          <View style={[styles.card, { backgroundColor: colors.card, borderRadius: radius.lg }]}>
            {grouped[year].map((ex, i) => (
              <View key={ex.title}>
                {i > 0 && <View style={[styles.divider, { backgroundColor: colors.separator }]} />}
                <View style={styles.row}>
                  <View style={[styles.dot, { backgroundColor: colors.accent }]} />
                  <View style={styles.rowContent}>
                    <Text style={[styles.exTitle, { color: colors.text }]}>{ex.title}</Text>
                    <Text style={[styles.exVenue, { color: colors.textSecondary }]}>{ex.venue}</Text>
                  </View>
                  <Text style={[styles.loc, { color: colors.textTertiary }]}>{ex.location}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      ))}
      <View style={{ height: 120 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingTop: 16, paddingHorizontal: 16 },
  sectionRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, marginLeft: 4 },
  sectionHeader: { fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  card: {
    overflow: 'hidden',
    ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8 }, default: { elevation: 1 } }),
  },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 16 },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 14, opacity: 0.5 },
  rowContent: { flex: 1, marginRight: 12 },
  exTitle: { fontSize: 16, fontWeight: '600', lineHeight: 20 },
  exVenue: { fontSize: 14, marginTop: 2 },
  loc: { fontSize: 14 },
  divider: { height: 0.5 },
});
