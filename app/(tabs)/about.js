import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Linking,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../data/theme';

export default function AboutScreen() {
  const { colors, spacing } = useTheme();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.bg }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Bio card */}
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.heading, { color: colors.text }]}>Biography</Text>
        <Text style={[styles.body, { color: colors.text }]}>
          Born in Šumperk, Jiri Hauschka lives and works in Prague. His paintings are held
          in the National Gallery Prague and private collections internationally. Working
          primarily in acrylic on canvas, his practice moves between abstraction, figuration
          and symbolic landscapes — rooted in memory, nature and inner experience.
        </Text>
      </View>

      {/* Facts — iOS grouped style */}
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <View style={styles.factRow}>
          <Text style={[styles.factLabel, { color: colors.textSecondary }]}>Born</Text>
          <Text style={[styles.factValue, { color: colors.text }]}>1965, Šumperk</Text>
        </View>
        <View style={[styles.divider, { backgroundColor: colors.separator }]} />
        <View style={styles.factRow}>
          <Text style={[styles.factLabel, { color: colors.textSecondary }]}>Based in</Text>
          <Text style={[styles.factValue, { color: colors.text }]}>Prague</Text>
        </View>
        <View style={[styles.divider, { backgroundColor: colors.separator }]} />
        <View style={styles.factRow}>
          <Text style={[styles.factLabel, { color: colors.textSecondary }]}>Medium</Text>
          <Text style={[styles.factValue, { color: colors.text }]}>Acrylic on canvas</Text>
        </View>
        <View style={[styles.divider, { backgroundColor: colors.separator }]} />
        <View style={styles.factRow}>
          <Text style={[styles.factLabel, { color: colors.textSecondary }]}>Focus</Text>
          <Text style={[styles.factValue, { color: colors.text }]}>Nature, memory, symbolic landscapes</Text>
        </View>
      </View>

      {/* Contact card */}
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.heading, { color: colors.text }]}>Contact</Text>
        <Text style={[styles.body, { color: colors.textSecondary }]}>
          For sales, exhibitions and enquiries.
        </Text>
        <View style={styles.emailRow}>
          <Ionicons name="mail-outline" size={18} color={colors.accent} style={{ marginRight: 8 }} />
          <Text
            style={[styles.email, { color: colors.accent }]}
            onPress={() => Linking.openURL('mailto:jirihauschka@seznam.cz')}
          >
            jirihauschka@seznam.cz
          </Text>
        </View>
      </View>

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
  card: {
    borderRadius: 13,
    padding: 16,
    marginBottom: 16,
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
  heading: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
  },
  factRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  factLabel: {
    fontSize: 15,
  },
  factValue: {
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'right',
    flex: 1,
    marginLeft: 16,
  },
  divider: {
    height: 0.5,
    marginLeft: 0,
  },
  emailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  email: {
    fontSize: 16,
    fontWeight: '500',
  },
});
