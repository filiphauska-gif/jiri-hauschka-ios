import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  Animated as RNAnimated,
  Platform,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useTheme } from '../../data/theme';
import { artworks } from '../../data/artworks';

const INITIAL_COUNT = 12;
const LOAD_MORE_COUNT = 12;
const HERO_HEIGHT = 360;
const CARD_GAP = 12;
const H_GAP = 16;

const blurhash = 'L6PZfSi_.AyE_3t7t7R**0o#DgR4';

let colorsRef = {};

function SkeletonBlock({ width, height, style }) {
  const opacity = useRef(new RNAnimated.Value(0.3)).current;
  useEffect(() => {
    const anim = RNAnimated.loop(
      RNAnimated.sequence([
        RNAnimated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        RNAnimated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [opacity]);
  return (
    <RNAnimated.View style={[{ width: width || '100%', height: height || 20, borderRadius: 6, backgroundColor: colorsRef.skeleton, opacity }, style]} />
  );
}

function ArtworkCard({ item, onPress, imageWidth, index }) {
  const [loaded, setLoaded] = useState(false);
  const { colors } = useTheme();

  return (
    <Animated.View
      entering={FadeInDown.delay((index % 10) * 50).duration(400).springify()}
      style={{ width: imageWidth, marginBottom: CARD_GAP }}
    >
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => onPress(item.slug)}
        onLongPress={() => Platform.OS === 'ios' && Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
      >
        <View style={styles.card}>
          <View style={styles.imageWrap}>
            {!loaded && <SkeletonBlock width={imageWidth} height={imageWidth} />}
            <Image
              source={{ uri: item.image }}
              style={[styles.image, { height: imageWidth }]}
              placeholder={{ blurhash }}
              contentFit="cover"
              transition={400}
              onLoad={() => setLoaded(true)}
            />
          </View>
          <View style={styles.meta}>
            <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
            <View style={styles.metaRow}>
              <Text style={styles.year}>{item.year}</Text>
              {item.ar && <View style={[styles.arBadge, { backgroundColor: colors.accentLight }]}><Text style={[styles.arBadgeText, { color: colors.accent }]}>AR</Text></View>}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function GalleryScreen() {
  const router = useRouter();
  const { width: windowWidth } = useWindowDimensions();
  const { colors } = useTheme();
  colorsRef = colors;
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const scrollY = useRef(new RNAnimated.Value(0)).current;

  const displayed = useMemo(() => artworks.slice(0, visibleCount), [visibleCount]);
  const hasMore = visibleCount < artworks.length;
  const imageWidth = useMemo(() => (windowWidth - H_GAP * 2 - CARD_GAP) / 2, [windowWidth]);

  const handleLoadMore = useCallback(() => {
    if (hasMore) setVisibleCount(p => Math.min(p + LOAD_MORE_COUNT, artworks.length));
  }, [hasMore]);

  const handlePress = useCallback((slug) => {
    if (Platform.OS === 'ios') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/detail/${slug}`);
  }, [router]);

  const heroScale = scrollY.interpolate({
    inputRange: [-HERO_HEIGHT, 0, HERO_HEIGHT],
    outputRange: [1.3, 1, 0.8],
    extrapolate: 'clamp',
  });
  const heroOpacity = scrollY.interpolate({
    inputRange: [0, HERO_HEIGHT * 0.6],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const renderHeader = useCallback(() => (
    <RNAnimated.View style={[styles.hero, { height: HERO_HEIGHT, opacity: heroOpacity, transform: [{ scale: heroScale }] }]}>
      <Image source={{ uri: artworks[0]?.image }} style={StyleSheet.absoluteFill} contentFit="cover" />
      <View style={[styles.heroOverlay, { backgroundColor: colors.heroOverlay }]} />
      <View style={styles.heroContent}>
        <Text style={[styles.heroTitle, { fontFamily: 'System' }]}>Jiri{'\n'}Hauschka</Text>
        <Text style={styles.heroSub}>Paintings between abstraction,{'\n'}figuration & magical realism.</Text>
        <View style={styles.heroMeta}>
          <View style={[styles.heroBadge, { backgroundColor: colors.heroBadge }]}>
            <Text style={styles.heroBadgeText}>{artworks.length} works</Text>
          </View>
        </View>
      </View>
    </RNAnimated.View>
  ), [heroScale, heroOpacity, colors]);

  const renderItem = useCallback(
    ({ item, index }) => <ArtworkCard item={item} onPress={handlePress} imageWidth={imageWidth} index={index} />,
    [imageWidth, handlePress]
  );

  const renderFooter = useCallback(() => {
    if (!hasMore) return <View style={{ height: 24 }} />;
    return <View style={styles.footer}><SkeletonBlock width={100} height={14} /></View>;
  }, [hasMore]);

  const handleScroll = RNAnimated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );

  const onMomentumEnd = useCallback(({ nativeEvent: { layoutMeasurement, contentOffset, contentSize } }) => {
    if (layoutMeasurement.height + contentOffset.y >= contentSize.height - 300) handleLoadMore();
  }, [handleLoadMore]);

  return (
    <FlatList
      data={displayed}
      renderItem={renderItem}
      keyExtractor={item => item.slug}
      numColumns={2}
      contentContainerStyle={[styles.list, { backgroundColor: colors.bg }]}
      columnWrapperStyle={{ gap: CARD_GAP, paddingHorizontal: H_GAP }}
      showsVerticalScrollIndicator={false}
      onScroll={handleScroll}
      scrollEventThrottle={16}
      onMomentumScrollEnd={onMomentumEnd}
      ListHeaderComponent={renderHeader}
      ListFooterComponent={renderFooter}
      removeClippedSubviews
      maxToRenderPerBatch={10}
      windowSize={7}
    />
  );
}

const styles = StyleSheet.create({
  list: { paddingBottom: 8 },
  hero: {
    justifyContent: 'flex-end',
    paddingBottom: 24,
    paddingHorizontal: 24,
    marginBottom: 8,
    overflow: 'hidden',
  },
  heroOverlay: { ...StyleSheet.absoluteFillObject },
  heroContent: { zIndex: 1 },
  heroTitle: { fontSize: 38, fontWeight: '700', color: '#FFFFFF', lineHeight: 44 },
  heroSub: { fontSize: 15, fontWeight: '400', color: 'rgba(255,255,255,0.8)', marginTop: 8, lineHeight: 22 },
  heroMeta: { flexDirection: 'row', marginTop: 16 },
  heroBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  heroBadgeText: { color: '#FFFFFF', fontSize: 12, fontWeight: '600' },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8 },
      default: { elevation: 2 },
    }),
  },
  imageWrap: { overflow: 'hidden' },
  image: { backgroundColor: 'transparent' },
  meta: { paddingHorizontal: 12, paddingVertical: 12 },
  title: { fontSize: 15, fontWeight: '600', color: '#2D2A24', lineHeight: 20 },
  metaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
  year: { fontSize: 12, fontWeight: '400', color: '#6B6560' },
  arBadge: { paddingHorizontal: 6, paddingVertical: 1, borderRadius: 4 },
  arBadgeText: { fontSize: 9, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  footer: { paddingVertical: 24, alignItems: 'center' },
});
