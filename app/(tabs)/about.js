import { ScrollView, View, Text, StyleSheet, Linking, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../data/theme';

const facts = [
  { label: 'Born', value: '1965, Šumperk' },
  { label: 'Based in', value: 'Prague, Czech Republic' },
  { label: 'Medium', value: 'Acrylic on canvas' },
  { label: 'Focus', value: 'Nature, memory, symbolic landscapes' },
];

function LinkRow({ icon, text, color, onPress }) {
  return (
    <TouchableOpacity style={styles.linkRow} onPress={onPress}>
      <Ionicons name={icon} size={18} color={color} style={{ marginRight: 10 }} />
      <Text style={[styles.linkText, { color }]}>{text}</Text>
      <Ionicons name="chevron-forward" size={16} color="rgba(128,128,128,0.3)" />
    </TouchableOpacity>
  );
}

export default function AboutScreen() {
  const { colors, radius } = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.bg }]} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Bio */}
      <View style={[styles.card, { backgroundColor: colors.card, borderRadius: radius.lg }]}>
        <Text style={styles.emoji}>🎨</Text>
        <Text style={[styles.heading, { color: colors.text }]}>Biography</Text>
        <Text style={[styles.body, { color: colors.textSecondary }]}>
          Born in Šumperk, Jiri Hauschka lives and works in Prague. His paintings are held in the National Gallery Prague and private collections internationally.
        </Text>
        <Text style={[styles.body, { color: colors.textSecondary, marginTop: 12 }]}>
          Working primarily in acrylic on canvas, his practice moves between abstraction, figuration and symbolic landscapes — rooted in memory, nature and inner experience.
        </Text>
      </View>

      {/* Facts */}
      <View style={[styles.card, { backgroundColor: colors.card, borderRadius: radius.lg }]}>
        {facts.map((f, i) => (
          <View key={f.label}>
            {i > 0 && <View style={[styles.divider, { backgroundColor: colors.separator }]} />}
            <View style={styles.factRow}>
              <Text style={[styles.factLabel, { color: colors.textTertiary }]}>{f.label}</Text>
              <Text style={[styles.factValue, { color: colors.text }]}>{f.value}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Contact */}
      <View style={[styles.card, { backgroundColor: colors.card, borderRadius: radius.lg }]}>
        <Text style={[styles.heading, { color: colors.text }]}>Contact</Text>
        <Text style={[styles.body, { color: colors.textTertiary, marginBottom: 16 }]}>For sales, exhibitions and enquiries.</Text>
        <LinkRow icon="mail-outline" text="jirihauschka@seznam.cz" color={colors.accent} onPress={() => Linking.openURL('mailto:jirihauschka@seznam.cz')} />
        <View style={[styles.divider, { backgroundColor: colors.separator }]} />
        <LinkRow icon="globe-outline" text="preview.jirihauschka.com" color={colors.accent} onPress={() => Linking.openURL('https://preview.jirihauschka.com')} />
        <View style={[styles.divider, { backgroundColor: colors.separator }]} />
        <LinkRow icon="logo-instagram" text="@jirihauschka" color={colors.accent} onPress={() => Linking.openURL('https://instagram.com/jirihauschka')} />
      </View>

      {/* Extra space pro tab bar */}
      <View style={{ height: 120 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingTop: 16, paddingHorizontal: 16 },
  card: {
    padding: 20, marginBottom: 16,
    ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8 }, default: { elevation: 1 } }),
  },
  emoji: { fontSize: 32, marginBottom: 8 },
  heading: { fontSize: 20, fontWeight: '700', marginBottom: 10 },
  body: { fontSize: 16, lineHeight: 24 },
  factRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
  factLabel: { fontSize: 14 },
  factValue: { fontSize: 14, fontWeight: '600', textAlign: 'right', flex: 1, marginLeft: 16 },
  divider: { height: 0.5 },
  linkRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  linkText: { fontSize: 16, fontWeight: '500', flex: 1 },
});
