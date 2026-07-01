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
import { useTheme, Fonts } from '../../data/theme';
import { artworks } from '../../data/artworks';

const INITIAL_COUNT = 12;
const LOAD_MORE_COUNT = 12;
const NUM_COLUMNS = 2;
const GAP = 2;
const HERO_HEIGHT = 340;

const blurhash = 'L6PZfSi_.AyE_3t7t7R**0o#DgR4';

function SkeletonBlock({ width, height, style, colors }) {
  const opacity = useRef(new RNAnimated.Value(0.3)).current;

  useEffect(() => {
    const animation = RNAnimated.loop(
      RNAnimated.sequence([
        RNAnimated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        RNAnimated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <RNAnimated.View
      style={[
        {
          width: width || '100%',
          height: height || 20,
          borderRadius: 6,
          backgroundColor: colors.skeleton,
          opacity,
        },
        style,
      ]}
    />
  );
}

function ArtworkCard({ item, onPress, imageWidth, index }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <Animated.View
      entering={FadeInDown.delay((index % 10) * 50).duration(400).springify()}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => onPress(item.slug)}
        onLongPress={() => {
          if (Platform.OS === 'ios') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }}
        style={{ width: imageWidth, marginBottom: 1 }}
      >
        <View style={styles.card}>
          <View style={styles.imageWrap}>
            {!loaded && (
              <SkeletonBlock width={imageWidth} height={imageWidth} colors={colorsRef} />
            )}
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
            <Text style={styles.title} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.year}>{item.year}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

let colorsRef = {};

export default function GalleryScreen() {
  const router = useRouter();
  const { width: windowWidth } = useWindowDimensions();
  const { colors } = useTheme();
  colorsRef = colors;
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const scrollY = useRef(new RNAnimated.Value(0)).current;

  const displayedArtworks = useMemo(
    () => artworks.slice(0, visibleCount),
    [visibleCount]
  );
  const hasMore = visibleCount < artworks.length;

  const imageWidth = useMemo(
    () => (windowWidth - GAP * (NUM_COLUMNS - 1)) / NUM_COLUMNS,
    [windowWidth]
  );

  const handleLoadMore = useCallback(() => {
    if (hasMore) {
      setVisibleCount((prev) => Math.min(prev + LOAD_MORE_COUNT, artworks.length));
    }
  }, [hasMore]);

  const handlePress = useCallback(
    (slug) => {
      if (Platform.OS === 'ios') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      router.push(`/detail/${slug}`);
    },
    [router]
  );

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

  const renderItem = useCallback(
    ({ item, index }) => <ArtworkCard item={item} onPress={handlePress} imageWidth={imageWidth} index={index} />,
    [imageWidth, handlePress]
  );

  const renderFooter = useCallback(() => {
    if (!hasMore) return <View style={styles.footerEnd} />;
    return (
      <View style={styles.footer}>
        <SkeletonBlock width={120} height={16} colors={colors} />
      </View>
    );
  }, [hasMore, colors]);

  const renderHeader = useCallback(
    () => (
      <RNAnimated.View
        style={[
          styles.hero,
          {
            height: HERO_HEIGHT,
            opacity: heroOpacity,
            transform: [{ scale: heroScale }],
          },
        ]}
      >
        <Image
          source={{ uri: artworks[0]?.image }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
        />
        <View style={[styles.heroOverlay, { backgroundColor: colors.overlay }]} />
        <View style={styles.heroContent}>
          <Text style={[styles.heroTitle, { fontFamily: Fonts.serif }]}>Jiri{'\n'}Hauschka</Text>
          <Text style={styles.heroSub}>Paintings between abstraction,{'\n'}figuration & magical realism.</Text>
        </View>
      </RNAnimated.View>
    ),
    [heroScale, heroOpacity, colors]
  );

  const handleScroll = RNAnimated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: true }
  );

  const scrollEndHandler = useCallback(
    ({ nativeEvent }) => {
      const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
      if (layoutMeasurement.height + contentOffset.y >= contentSize.height - 300) {
        handleLoadMore();
      }
    },
    [handleLoadMore]
  );

  return (
    <FlatList
      data={displayedArtworks}
      renderItem={renderItem}
      keyExtractor={(item) => item.slug}
      numColumns={NUM_COLUMNS}
      columnWrapperStyle={{ gap: GAP }}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
      onScroll={handleScroll}
      scrollEventThrottle={16}
      onMomentumScrollEnd={scrollEndHandler}
      ListHeaderComponent={renderHeader}
      ListFooterComponent={renderFooter}
      removeClippedSubviews
      maxToRenderPerBatch={10}
      windowSize={7}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    paddingBottom: 8,
  },
  hero: {
    justifyContent: 'flex-end',
    paddingBottom: 24,
    paddingHorizontal: 20,
    marginBottom: 4,
    overflow: 'hidden',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  heroContent: {
    zIndex: 1,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 42,
  },
  heroSub: {
    fontSize: 15,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.8)',
    marginTop: 8,
    lineHeight: 22,
  },
  card: {
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  imageWrap: {
    overflow: 'hidden',
  },
  image: {
    backgroundColor: 'transparent',
  },
  meta: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
    lineHeight: 20,
  },
  year: {
    fontSize: 12,
    fontWeight: '400',
    color: '#8E8E93',
    marginTop: 2,
  },
  footer: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  footerEnd: {
    height: 20,
  },
});
