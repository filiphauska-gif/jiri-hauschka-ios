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

const blurhash = 'L6PZfSi_.AyE_3t7t7R**0o#DgR4';

export default function ArtworkDetailScreen() {
  const { slug } = useLocalSearchParams();
  const artwork = artworkBySlug(slug);
  const { colors } = useTheme();

  if (!artwork) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Ionicons name="image-outline" size={64} color={colors.textTertiary} />
        <Text style={[styles.notFound, { color: colors.text }]}>Artwork not found</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={{ color: colors.blue, fontWeight: '600' }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleARPress = () => {
    if (Platform.OS === 'ios') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const arUrl = `https://preview.jirihauschka.com/ar/${slug}`;
    Linking.openURL(arUrl).catch(() => {});
  };

  const handleShare = async () => {
    if (Platform.OS === 'ios') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await Share.share({
        message: `${artwork.title} by Jiri Hauschka (${artwork.year})`,
        url: artwork.image,
      });
    } catch {}
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Image with rounded bottom */}
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: artwork.image }}
          style={styles.image}
          placeholder={{ blurhash }}
          contentFit="contain"
          transition={500}
          cachePolicy="memory-disk"
        />
        <TouchableOpacity style={[styles.shareBtn, { backgroundColor: colors.card }]} onPress={handleShare} activeOpacity={0.7}>
          <Ionicons name="share-outline" size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Detail Section - Glass card */}
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.title, { color: colors.text, fontFamily: Fonts.serif }]}>{artwork.title}</Text>
        {artwork.size ? (
          <Text style={[styles.size, { color: colors.textTertiary }]}>{artwork.size}</Text>
        ) : null}
        <View style={[styles.divider, { backgroundColor: colors.separator }]} />
        {artwork.medium ? (
          <View style={styles.row}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Medium</Text>
            <Text style={[styles.value, { color: colors.text }]}>{artwork.medium}</Text>
          </View>
        ) : null}
        <View style={styles.row}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Year</Text>
          <Text style={[styles.value, { color: colors.text }]}>{artwork.year}</Text>
        </View>
      </View>

      {/* AR Button - Premium style */}
      <TouchableOpacity
        style={[styles.arButton, { backgroundColor: colors.black }]}
        onPress={handleARPress}
        activeOpacity={0.85}
      >
        <Ionicons name="cube" size={20} color={colors.white} style={{ marginRight: 10 }} />
        <Text style={[styles.arText, { color: colors.white }]}>View on your wall</Text>
      </TouchableOpacity>

      {/* Info note */}
      <Text style={[styles.arNote, { color: colors.textTertiary }]}>
        Opens AR Quick Look to preview this artwork in your space at real scale.
      </Text>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingBottom: 40 },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  notFound: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 12,
  },
  backBtn: {
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  imageWrapper: {
    backgroundColor: 'transparent',
  },
  image: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 1.1,
  },
  shareBtn: {
    position: 'absolute',
    top: 12,
    right: 16,
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      default: { elevation: 3 },
    }),
  },
  section: {
    marginHorizontal: 16,
    marginTop: -20,
    borderRadius: 16,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      default: { elevation: 2 },
    }),
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 30,
  },
  size: {
    fontSize: 14,
    marginTop: 4,
    fontWeight: '400',
  },
  divider: {
    height: 0.5,
    marginVertical: 14,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  label: {
    fontSize: 15,
    fontWeight: '400',
  },
  value: {
    fontSize: 15,
    fontWeight: '600',
  },
  arButton: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 20,
    paddingVertical: 18,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arText: {
    fontSize: 17,
    fontWeight: '600',
  },
  arNote: {
    textAlign: 'center',
    fontSize: 12,
    marginTop: 10,
    marginHorizontal: 32,
    lineHeight: 16,
  },
});
