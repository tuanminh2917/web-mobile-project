import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MovieVerticalCard } from '@/components/movie-card';
import { Colors, MaxContentWidth, Spacing } from '@/constants/theme';

// 1. Tính toán kích thước card để vừa khít 2 cột
const { width: SCREEN_WIDTH } = Dimensions.get('window');
// Tổng khoảng trống hai bên và ở giữa: padding left/right (Spacing.four * 2) + khoảng cách giữa 2 card (Spacing.three)
const TOTAL_PADDING = Spacing.four * 2 + Spacing.three; 
const CARD_WIDTH = (Math.min(SCREEN_WIDTH, MaxContentWidth) - TOTAL_PADDING) / 2;
const CARD_HEIGHT = CARD_WIDTH * 1.4; // Tỷ lệ poster phim chuẩn

export default function MainPageScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* SECTION: PHIM ĐANG CHIẾU */}
        <View style={styles.movieSection}>
          <Text style={styles.movieSectionText}>Phim đang chiếu</Text>
          <View style={styles.movieGrid}>
            <MovieVerticalCard title="Tên Phim 1" imageUrl="/path/to/movie-poster-1.jpg" />
            <MovieVerticalCard title="Tên Phim 2" imageUrl="/path/to/movie-poster-2.jpg" />
            <MovieVerticalCard title="Tên Phim 3" imageUrl="/path/to/movie-poster-3.jpg" />
            <MovieVerticalCard title="Tên Phim 4" imageUrl="/path/to/movie-poster-4.jpg" />
          </View>
        </View>

        {/* SECTION: PHIM SẮP CHIẾU */}
        <View style={styles.movieSection}>
          <Text style={styles.movieSectionText}>Phim sắp chiếu</Text>
          <View style={styles.movieGrid}>
            <MovieVerticalCard title="Tên Phim 1" imageUrl="/path/to/movie-poster-1.jpg" />
            <MovieVerticalCard title="Tên Phim 2" imageUrl="/path/to/movie-poster-2.jpg" />
            <MovieVerticalCard title="Tên Phim 3" imageUrl="/path/to/movie-poster-3.jpg" />
            <MovieVerticalCard title="Tên Phim 4" imageUrl="/path/to/movie-poster-4.jpg" />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.four,
    maxWidth: MaxContentWidth,
    width: '100%',
    alignSelf: 'center',
  },
  movieSection: {
    width: '100%',
    marginTop: Spacing.four,
  },
  movieSectionText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginBottom: Spacing.three,
  },
  movieGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start', // Căn đều từ trái qua
    gap: Spacing.three,          // Khoảng cách giữa các hàng và các cột
  },
  movieCard: {
    width: CARD_WIDTH,
    marginBottom: Spacing.two,    // Khoảng cách phụ dưới chân mỗi card
  },
  imageContainer: {
    width: '100%',
    height: CARD_HEIGHT,
    borderRadius: 12,
    backgroundColor: Colors.dark.backgroundElement,
    // Hiệu ứng đổ bóng đổ khối hiện đại
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  movieImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 12,
  },
  movieTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.dark.text,
    marginTop: Spacing.two,
    lineHeight: 18,
  },
});