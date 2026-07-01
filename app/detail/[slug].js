import { useLocalSearchParams, router } from 'expo-router';
import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Dimensions,
  Share,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { artworkBySlug } from '../../data/artworks';
import { theme } from '../../data/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ArtworkDetailScreen() {
  const { slug } = useLocalSearchParams();
  const artwork = artworkBySlug(slug);

  if (!artwork) {
    return (
      <View style={styles.centered}>
        <Ionicons name="image-outline" size={64} color={theme.colors.textTertiary} />
        <Text style={styles.notFoundTitle}>Artwork not found</Text>
        <Text style={styles.notFoundSubtitle}>The artwork you're looking for doesn't exist.</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleARPress = () => {
    const arUrl = `https://preview.jirihauschka.com/ar/${slug}`;
    Linking.openURL(arUrl).catch((err) => {
      console.warn('Could not open AR URL:', err);
    });
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${artwork.title} by Jiri Hauschka (${artwork.year})`,
        url: artwork.image,
      });
    } catch (err) {
      console.warn('Share failed:', err);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Image section */}
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: artwork.image }}
          style={styles.image}
          resizeMode="contain"
        />
        <TouchableOpacity style={styles.shareBtn} onPress={handleShare} activeOpacity={0.7}>
          <Ionicons name="share-outline" size={22} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      {/* Detail section — iOS grouped card style */}
      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.title}>{artwork.title}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.row}>
          <Text style={styles.label}>Year</Text>
          <Text style={styles.value}>{artwork.year}</Text>
        </View>
        {artwork.medium ? (
          <>
            <View style={styles.divider} />
            <View style={styles.row}>
              <Text style={styles.label}>Medium</Text>
              <Text style={styles.value}>{artwork.medium}</Text>
            </View>
          </>
        ) : null}
        {artwork.size ? (
          <>
            <View style={styles.divider} />
            <View style={styles.row}>
              <Text style={styles.label}>Size</Text>
              <Text style={styles.value}>{artwork.size}</Text>
            </View>
          </>
        ) : null}
      </View>

      {/* AR button */}
      <TouchableOpacity style={styles.arButton} onPress={handleARPress} activeOpacity={0.8}>
        <Ionicons name="cube-outline" size={22} color="#FFF" style={{ marginRight: 8 }} />
        <Text style={styles.arButtonText}>View on your wall</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  content: {
    paddingBottom: 40,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.bg,
    paddingHorizontal: 32,
  },
  notFoundTitle: {
    fontSize: theme.fontSize.title,
    fontWeight: theme.weight.semibold,
    color: theme.colors.text,
    marginTop: 16,
  },
  notFoundSubtitle: {
    fontSize: theme.fontSize.subhead,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  backButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    borderWidth: 0.5,
    borderColor: theme.colors.separator,
  },
  backButtonText: {
    fontSize: theme.fontSize.body,
    fontWeight: theme.weight.medium,
    color: theme.colors.accent,
  },
  imageWrapper: {
    backgroundColor: theme.colors.card,
    paddingVertical: 20,
  },
  image: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 1.0,
  },
  shareBtn: {
    position: 'absolute',
    top: 8,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      default: {
        elevation: 2,
      },
    }),
  },
  section: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      default: {
        elevation: 1,
      },
    }),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  title: {
    fontSize: theme.fontSize.title,
    fontWeight: theme.weight.semibold,
    color: theme.colors.text,
    flex: 1,
  },
  label: {
    fontSize: theme.fontSize.subhead,
    color: theme.colors.textSecondary,
  },
  value: {
    fontSize: theme.fontSize.subhead,
    fontWeight: theme.weight.medium,
    color: theme.colors.text,
    textAlign: 'right',
    flex: 1,
    marginLeft: 16,
  },
  divider: {
    height: 0.5,
    backgroundColor: theme.colors.separator,
    marginLeft: 16,
  },
  arButton: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: theme.colors.black,
    paddingVertical: 16,
    borderRadius: theme.radius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arButtonText: {
    color: '#FFFFFF',
    fontSize: theme.fontSize.body,
    fontWeight: theme.weight.semibold,
  },
});
