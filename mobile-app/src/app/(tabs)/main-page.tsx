import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { Movie } from '@/types';
import { api, getFullImageUrl } from '@/services/api';
import { Colors, MaxContentWidth, Spacing } from '@/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TOTAL_PADDING = Spacing.four * 2 + Spacing.three;
const CARD_WIDTH = (Math.min(SCREEN_WIDTH, MaxContentWidth) - TOTAL_PADDING) / 2;
const CARD_HEIGHT = CARD_WIDTH * 1.4;

// =============================================
// MOVIE CARD — Vertical (grid 2 cột)
// =============================================
function MovieVerticalCard({ movie }: { movie: Movie }) {
  const router = useRouter();
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.8 }]}
      onPress={() => router.push(`/movie/${movie.MovieID}`)}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: getFullImageUrl(movie.PosterURL) }}
          style={styles.movieImage}
          contentFit="cover"
          placeholder={{ thumbhash: undefined }}
          transition={300}
        />
        {/* Badge kiểm duyệt */}
        <View style={styles.censorBadge}>
          <Text style={styles.censorText}>{movie.Censorship || 'P'}</Text>
        </View>
      </View>
      <Text style={styles.movieTitle} numberOfLines={2}>{movie.Title}</Text>
      <Text style={styles.movieMeta} numberOfLines={1}>{movie.Genre} · {movie.Duration} phút</Text>
    </Pressable>
  );
}

// =============================================
// MAIN SCREEN
// =============================================
export default function MainPageScreen() {
  const [nowShowing, setNowShowing] = useState<Movie[]>([]);
  const [comingSoon, setComingSoon] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  // useEffect — chạy khi mount (slide 05: Running Only on the First Render)
  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      const [now, coming] = await Promise.all([
        api.getNowShowing(),
        api.getComingSoon(),
      ]);
      if (isMounted) {
        setNowShowing(now);
        setComingSoon(coming);
        setLoading(false);
      }
    };
    load();
    // cleanup (Effect Cleanup từ slide 05)
    return () => { isMounted = false; };
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.centered]}>
        <ActivityIndicator size="large" color={Colors.dark.buttonPrimary} />
        <Text style={styles.loadingText}>Đang tải phim...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={[]}
        keyExtractor={() => 'dummy'}
        renderItem={null}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        ListHeaderComponent={() => (
          <>
            {/* Header */}
            <View style={styles.pageHeader}>
              <Text style={styles.brandName}>🎬 <Text style={{ color: Colors.dark.buttonPrimary }}>C</Text>inema</Text>
            </View>

            {/* PHIM ĐANG CHIẾU */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Phim đang chiếu</Text>
              <View style={styles.movieGrid}>
                {nowShowing.map(movie => (
                  <MovieVerticalCard key={movie.MovieID} movie={movie} />
                ))}
              </View>
            </View>

            {/* PHIM SẮP CHIẾU */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Phim sắp chiếu</Text>
              <View style={styles.movieGrid}>
                {comingSoon.map(movie => (
                  <MovieVerticalCard key={movie.MovieID} movie={movie} />
                ))}
              </View>
            </View>
          </>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.two,
  },
  loadingText: {
    color: Colors.dark.textSecondary,
    fontSize: 14,
  },
  contentContainer: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.four,
    maxWidth: MaxContentWidth,
    width: '100%',
    alignSelf: 'center',
  },
  pageHeader: {
    paddingVertical: Spacing.three,
  },
  brandName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.dark.text,
  },
  section: {
    marginTop: Spacing.three,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginBottom: Spacing.three,
  },
  movieGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.three,
  },
  // MovieVerticalCard
  card: {
    width: CARD_WIDTH,
  },
  imageContainer: {
    width: '100%',
    height: CARD_HEIGHT,
    borderRadius: 12,
    backgroundColor: Colors.dark.backgroundElement,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  movieImage: {
    width: '100%',
    height: '100%',
  },
  censorBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: Colors.dark.buttonPrimary,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  censorText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  movieTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.dark.text,
    marginTop: Spacing.two,
    lineHeight: 18,
  },
  movieMeta: {
    fontSize: 12,
    color: Colors.dark.textSecondary,
    marginTop: 2,
  },
});