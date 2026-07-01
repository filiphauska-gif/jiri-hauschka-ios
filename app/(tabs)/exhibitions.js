import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Platform,
} from 'react-native';
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
  const { colors } = useTheme();
  const years = Object.keys(grouped).sort((a, b) => b - a);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.bg }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {years.map((year, yi) => (
        <View key={year} style={{ marginBottom: yi < years.length - 1 ? 24 : 0 }}>
          {/* iOS section header */}
          <Text style={[styles.sectionHeader, { color: colors.textSecondary }]}>
            {year}
          </Text>

          {/* iOS grouped card */}
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            {grouped[year].map((ex, i) => (
              <View key={ex.title}>
                {i > 0 && <View style={[styles.divider, { backgroundColor: colors.separator }]} />}
                <View style={styles.row}>
                  <View style={styles.rowLeft}>
                    <Text style={[styles.exTitle, { color: colors.text }]}>{ex.title}</Text>
                    <Text style={[styles.exVenue, { color: colors.textSecondary }]}>
                      {ex.venue}
                    </Text>
                  </View>
                  <Text style={[styles.exLocation, { color: colors.textTertiary }]}>
                    {ex.location}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      ))}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    borderRadius: 13,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
      },
      default: { elevation: 1 },
    }),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  rowLeft: {
    flex: 1,
    marginRight: 12,
  },
  exTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  exVenue: {
    fontSize: 14,
    marginTop: 2,
  },
  exLocation: {
    fontSize: 14,
  },
  divider: {
    height: 0.5,
    marginLeft: 16,
  },
});
