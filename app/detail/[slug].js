import { useLocalSearchParams, router } from 'expo-router';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Dimensions,
  Share,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { artworkBySlug } from '../../data/artworks';
import { useTheme, Fonts } from '../../data/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IMAGE_HEIGHT = SCREEN_WIDTH * 1.0;

const blurhash = 'L6PZfSi_.AyE_3t7t7R**0o#DgR4';

export default function ArtworkDetailScreen() {
  const { slug } = useLocalSearchParams();
  const artwork = artworkBySlug(slug);
  const { colors, radius } = useTheme();

  if (!artwork) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.bg }]}>
        <Ionicons name="image-outline" size={64} color={colors.textTertiary} />
        <Text style={[styles.notFound, { color: colors.text }]}>Artwork not found</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={{ color: colors.accent, fontWeight: '600' }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Native AR: open USDZ directly — iOS Quick Look handles it natively
  const handleARPress = () => {
    if (Platform.OS === 'ios') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const usdzUrl = `https://preview.jirihauschka.com${artwork.usdz}`;
    Linking.openURL(usdzUrl).catch(() => {});
  };

  const handleShare = async () => {
    if (Platform.OS === 'ios') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await Share.share({ message: `${artwork.title} by Jiri Hauschka (${artwork.year})`, url: artwork.image });
    } catch {}
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.bg }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Image */}
      <View style={[styles.imageCard, { backgroundColor: colors.card }]}>
        <Image
          source={{ uri: artwork.image }}
          style={styles.image}
          placeholder={{ blurhash }}
          contentFit="contain"
          transition={400}
          cachePolicy="memory-disk"
        />
        <TouchableOpacity style={[styles.shareBtn, { backgroundColor: colors.card }]} onPress={handleShare}>
          <Ionicons name="share-outline" size={18} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Info */}
      <View style={[styles.section, { backgroundColor: colors.card, borderRadius: radius.lg }]}>
        <Text style={[styles.title, { color: colors.text, fontFamily: Fonts.serif }]}>{artwork.title}</Text>
        {artwork.size ? <Text style={[styles.size, { color: colors.textTertiary }]}>{artwork.size}</Text> : null}
        <View style={[styles.divider, { backgroundColor: colors.separator }]} />
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>Year</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>{artwork.year}</Text>
          </View>
          {artwork.medium ? (
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>Medium</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>{artwork.medium}</Text>
            </View>
          ) : null}
        </View>
      </View>

      {/* AR Button */}
      <TouchableOpacity
        style={[styles.arButton, { backgroundColor: colors.arButton }]}
        onPress={handleARPress}
        activeOpacity={0.85}
      >
        <Ionicons name="cube" size={20} color="#FFF" style={{ marginRight: 10 }} />
        <Text style={styles.arText}>View on your wall</Text>
      </TouchableOpacity>
      <Text style={[styles.arNote, { color: colors.textTertiary }]}>
        AR Quick Look — see this artwork at real scale in your space.
      </Text>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingBottom: 40 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 },
  notFound: { fontSize: 20, fontWeight: '600', marginTop: 12 },
  backBtn: { marginTop: 16, paddingVertical: 10, paddingHorizontal: 20 },
  imageCard: {
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8 },
      default: { elevation: 2 },
    }),
  },
  image: { width: '100%', height: IMAGE_HEIGHT },
  shareBtn: {
    position: 'absolute', top: 10, right: 10,
    width: 34, height: 34, borderRadius: 17,
    justifyContent: 'center', alignItems: 'center',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.15, shadowRadius: 4 },
      default: { elevation: 2 },
    }),
  },
  section: {
    marginHorizontal: 16, marginTop: 16, padding: 20,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6 },
      default: { elevation: 1 },
    }),
  },
  title: { fontSize: 24, fontWeight: '700', lineHeight: 30 },
  size: { fontSize: 14, marginTop: 4, fontWeight: '400' },
  divider: { height: 0.5, marginVertical: 14 },
  infoGrid: { gap: 12 },
  infoItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  infoLabel: { fontSize: 14, fontWeight: '400' },
  infoValue: { fontSize: 15, fontWeight: '600' },
  arButton: {
    flexDirection: 'row', marginHorizontal: 16, marginTop: 20,
    paddingVertical: 16, borderRadius: 14, justifyContent: 'center', alignItems: 'center',
  },
  arText: { color: '#FFFFFF', fontSize: 17, fontWeight: '600' },
  arNote: { textAlign: 'center', fontSize: 12, marginTop: 10, marginHorizontal: 32, lineHeight: 16 },
});
