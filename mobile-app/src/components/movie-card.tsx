import { Dimensions, Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors, MaxContentWidth, Spacing } from '@/constants/theme';

// 1. Tính toán kích thước card để vừa khít 2 cột
const { width: SCREEN_WIDTH } = Dimensions.get('window');
// Tổng khoảng trống hai bên và ở giữa: padding left/right (Spacing.four * 2) + khoảng cách giữa 2 card (Spacing.three)
const TOTAL_PADDING = Spacing.four * 2 + Spacing.three; 
const CARD_WIDTH = (Math.min(SCREEN_WIDTH, MaxContentWidth) - TOTAL_PADDING) / 2;
const CARD_HEIGHT = CARD_WIDTH * 1.4; // Tỷ lệ poster phim chuẩn

export interface MovieProps {
  title: string;
  imageUrl: string;
  format?: string;
  screeningList?: string[];
  genre?: string;
  duration?: string;
  origin?: string;
  releaseDate?: string;
  ageRating?: string;
}

export function MovieHorizontalCard({
  title,
  genre,
  duration,
  origin,
  releaseDate,
  ageRating,
  format,
  imageUrl,
  screeningList,
}: MovieProps) {
  return (
    <View style={stylesHorizontal.movieCard}>
      <View style={stylesHorizontal.imageContainer}>
        <Image
          source={{ uri: imageUrl }}
          style={stylesHorizontal.movieImage}
          accessibilityLabel={`Poster phim ${title}`}
        />
      </View>

      <View style={stylesHorizontal.infoContainer}>
        {format ? (
          <View style={stylesHorizontal.formatTag}>
            <Text style={stylesHorizontal.formatText}>{format}</Text>
          </View>
        ) : null}

        {genre || duration ? (
          <Text style={stylesHorizontal.metaText} numberOfLines={1}>
            {genre ?? ''}
            {genre && duration ? '  |  ' : ''}
            {duration ?? ''}
          </Text>
        ) : null}

        <Text style={stylesHorizontal.movieTitle} numberOfLines={2}>
          {title}
        </Text>

        {origin ? (
          <Text style={stylesHorizontal.detailText}>
            Xuất xứ: <Text style={stylesHorizontal.whiteText}>{origin}</Text>
          </Text>
        ) : null}
        {releaseDate ? (
          <Text style={stylesHorizontal.detailText}>
            Khởi chiếu: <Text style={stylesHorizontal.whiteText}>{releaseDate}</Text>
          </Text>
        ) : null}
        {ageRating ? (
          <Text style={stylesHorizontal.ageRatingText} numberOfLines={2}>
            {ageRating}
          </Text>
        ) : null}

        <Text style={stylesHorizontal.sectionSubtitle}>Lịch chiếu</Text>

        {screeningList?.length ? (
          <View style={stylesHorizontal.screeningList}>
            {screeningList.map((time, index) => (
              <Pressable key={`${title}-${time}-${index}`} style={stylesHorizontal.screeningButton}>
                <Text style={stylesHorizontal.screeningButtonText}>{time}</Text>
              </Pressable>
            ))}
          </View>
        ) : null}
      </View>
    </View>
  );
}

export function MovieVerticalCard({title, imageUrl}: MovieProps) {
    return (
    <Pressable style={stylesVertical.movieCard}>
      <View style={stylesVertical.imageContainer}>
        <Image
          source={{ uri: imageUrl }}
          style={stylesVertical.movieImage}
          accessibilityLabel={`Poster phim ${title}`}
        />
      </View>
      <Text style={stylesVertical.movieTitle} numberOfLines={2}>
        {title}
      </Text>
    </Pressable>
  );
}

const stylesHorizontal = StyleSheet.create({
  movieCard: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: Colors.dark.backgroundElement,
    borderRadius: 12,
    padding: Spacing.three,
    borderWidth: 1,
    borderColor: Colors.dark.backgroundSelected,
  },
  imageContainer: {
    width: '32%',
    aspectRatio: 2 / 3,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: Colors.dark.backgroundSelected,
  },
  movieImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  infoContainer: {
    flex: 1,
    paddingLeft: Spacing.three,
    position: 'relative',
  },
  formatTag: {
    position: 'absolute',
    right: 0,
    top: 0,
    borderWidth: 1,
    borderColor: Colors.dark.backgroundSelected,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  formatText: {
    color: Colors.dark.textSecondary,
    fontSize: 12,
    fontWeight: 'bold',
  },
  metaText: {
    color: Colors.dark.textSecondary,
    fontSize: 13,
    marginBottom: 4,
    width: '80%',
  },
  movieTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginBottom: 6,
    width: '90%',
  },
  detailText: {
    color: Colors.dark.textSecondary,
    fontSize: 13,
    marginBottom: 2,
  },
  whiteText: {
    color: Colors.dark.text,
  },
  ageRatingText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
    lineHeight: 16,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginTop: 12,
    marginBottom: 8,
  },
  screeningList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  screeningButton: {
    borderWidth: 1,
    borderColor: Colors.dark.backgroundSelected,
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: Colors.dark.backgroundElement,
  },
  screeningButtonText: {
    color: Colors.dark.text,
    fontWeight: '600',
    fontSize: 13,
  },
});

const stylesVertical = StyleSheet.create({
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
