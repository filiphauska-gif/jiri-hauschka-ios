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
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { artworkBySlug } from '../../data/artworks';
import { useTheme, Fonts } from '../../data/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IMAGE_HEIGHT = SCREEN_WIDTH * 1.1;

const blurhash = 'L6PZfSi_.AyE_3t7t7R**0o#DgR4';

export default function ArtworkDetailScreen() {
  const { slug } = useLocalSearchParams();
  const artwork = artworkBySlug(slug);
  const { colors } = useTheme();

  // Pinch-to-zoom
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

  const pinchGesture = Gesture.Pinch()
    .onStart(() => {
      savedScale.value = scale.value;
    })
    .onUpdate((e) => {
      scale.value = Math.min(Math.max(savedScale.value * e.scale, 1), 4);
    })
    .onEnd(() => {
      if (scale.value < 1) {
        scale.value = withTiming(1, { duration: 200 });
        translateX.value = withTiming(0, { duration: 200 });
        translateY.value = withTiming(0, { duration: 200 });
      }
    });

  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      if (scale.value > 1) {
        scale.value = withTiming(1, { duration: 200 });
        translateX.value = withTiming(0, { duration: 200 });
        translateY.value = withTiming(0, { duration: 200 });
      } else {
        scale.value = withTiming(2.5, { duration: 200 });
      }
    });

  const panGesture = Gesture.Pan()
    .onStart(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    })
    .onUpdate((e) => {
      if (scale.value > 1) {
        translateX.value = savedTranslateX.value + e.translationX;
        translateY.value = savedTranslateY.value + e.translationY;
      }
    })
    .minPointers(2);

  const composedGesture = Gesture.Simultaneous(pinchGesture, panGesture);

  const imageAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  // Fallback
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
    Linking.openURL(`https://preview.jirihauschka.com/ar/${slug}`).catch(() => {});
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
      {/* Zoomable image */}
      <GestureDetector gesture={composedGesture}>
        <Animated.View style={[styles.imageWrapper, imageAnimatedStyle]}>
          <Image
            source={{ uri: artwork.image }}
            style={styles.image}
            placeholder={{ blurhash }}
            contentFit="contain"
            transition={500}
            cachePolicy="memory-disk"
          />
        </Animated.View>
      </GestureDetector>
      <TouchableOpacity
        style={[styles.shareBtn, { backgroundColor: colors.card }]}
        onPress={handleShare}
        activeOpacity={0.7}
      >
        <Ionicons name="share-outline" size={20} color={colors.text} />
      </TouchableOpacity>

      {/* Hint */}
      <Text style={[styles.zoomHint, { color: colors.textTertiary }]}>
        Pinch to zoom · Double tap to zoom in/out
      </Text>

      {/* Detail card */}
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.title, { color: colors.text, fontFamily: Fonts.serif }]}>
          {artwork.title}
        </Text>
        {artwork.size ? (
          <Text style={[styles.size, { color: colors.textTertiary }]}>{artwork.size}</Text>
        ) : null}
        <View style={[styles.divider, { backgroundColor: colors.separator }]} />
        <View style={styles.row}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Year</Text>
          <Text style={[styles.value, { color: colors.text }]}>{artwork.year}</Text>
        </View>
        {artwork.medium ? (
          <>
            <View style={[styles.divider, { backgroundColor: colors.separator }]} />
            <View style={styles.row}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Medium</Text>
              <Text style={[styles.value, { color: colors.text }]}>{artwork.medium}</Text>
            </View>
          </>
        ) : null}
      </View>

      {/* AR button */}
      <TouchableOpacity
        style={[styles.arButton, { backgroundColor: colors.black }]}
        onPress={handleARPress}
        activeOpacity={0.85}
      >
        <Ionicons name="cube" size={20} color={colors.white} style={{ marginRight: 10 }} />
        <Text style={[styles.arText, { color: colors.white }]}>View on your wall</Text>
      </TouchableOpacity>
      <Text style={[styles.arNote, { color: colors.textTertiary }]}>
        Opens AR Quick Look to preview this artwork at real scale.
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
  notFound: { fontSize: 20, fontWeight: '600', marginTop: 12 },
  backBtn: { marginTop: 16, paddingVertical: 10, paddingHorizontal: 20 },
  imageWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    height: IMAGE_HEIGHT,
  },
  image: {
    width: SCREEN_WIDTH,
    height: IMAGE_HEIGHT,
  },
  zoomHint: {
    textAlign: 'center',
    fontSize: 11,
    marginTop: -4,
    marginBottom: 4,
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
    marginTop: 16,
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
  title: { fontSize: 24, fontWeight: '700', lineHeight: 30 },
  size: { fontSize: 14, marginTop: 4, fontWeight: '400' },
  divider: { height: 0.5, marginVertical: 14 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6 },
  label: { fontSize: 15, fontWeight: '400' },
  value: { fontSize: 15, fontWeight: '600' },
  arButton: {
    flexDirection: 'row', marginHorizontal: 16, marginTop: 20,
    paddingVertical: 18, borderRadius: 14, justifyContent: 'center', alignItems: 'center',
  },
  arText: { fontSize: 17, fontWeight: '600' },
  arNote: { textAlign: 'center', fontSize: 12, marginTop: 10, marginHorizontal: 32, lineHeight: 16 },
});
