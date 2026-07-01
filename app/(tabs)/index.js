import { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { artworks } from '../../data/artworks';
import { theme } from '../../data/theme';

const INITIAL_COUNT = 12;
const LOAD_MORE_COUNT = 12;
const NUM_COLUMNS = 2;
const GAP = 2;

export default function GalleryScreen() {
  const router = useRouter();
  const { width: windowWidth } = useWindowDimensions();
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const [refreshing, setRefreshing] = useState(false);

  const displayedArtworks = useMemo(
    () => artworks.slice(0, visibleCount),
    [visibleCount]
  );
  const hasMore = visibleCount < artworks.length;

  const itemWidth = useMemo(
    () => (windowWidth - GAP * (NUM_COLUMNS - 1)) / NUM_COLUMNS,
    [windowWidth]
  );

  const handleLoadMore = useCallback(() => {
    if (hasMore) {
      setVisibleCount((prev) => Math.min(prev + LOAD_MORE_COUNT, artworks.length));
    }
  }, [hasMore]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setVisibleCount(INITIAL_COUNT);
    setTimeout(() => setRefreshing(false), 200);
  }, []);

  const handlePress = useCallback(
    (slug) => {
      router.push(`/detail/${slug}`);
    },
    [router]
  );

  const renderItem = useCallback(
    ({ item }) => (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => handlePress(item.slug)}
        style={{ width: itemWidth }}
      >
        <View style={styles.cell}>
          <Image
            source={{ uri: item.image }}
            style={[styles.image, { height: itemWidth }]}
            resizeMode="cover"
          />
          <View style={styles.meta}>
            <Text style={styles.title} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.year}>{item.year}</Text>
          </View>
        </View>
      </TouchableOpacity>
    ),
    [itemWidth, handlePress]
  );

  const renderFooter = useCallback(() => {
    if (!hasMore) return <View style={styles.footerEnd} />;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={theme.colors.textTertiary} />
      </View>
    );
  }, [hasMore]);

  const handleScroll = useCallback(
    ({ nativeEvent }) => {
      const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
      if (
        layoutMeasurement.height + contentOffset.y >=
        contentSize.height - 200
      ) {
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
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
      onScroll={handleScroll}
      scrollEventThrottle={16}
      refreshing={refreshing}
      onRefresh={handleRefresh}
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
  cell: {
    backgroundColor: theme.colors.card,
    borderRightWidth: GAP,
    borderBottomWidth: GAP,
    borderColor: theme.colors.bg,
  },
  image: {
    backgroundColor: theme.colors.separator,
  },
  meta: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  title: {
    fontSize: theme.fontSize.subhead,
    fontWeight: theme.weight.semibold,
    color: theme.colors.text,
    lineHeight: 20,
  },
  year: {
    fontSize: theme.fontSize.caption,
    fontWeight: theme.weight.regular,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  footerEnd: {
    height: 20,
  },
});
