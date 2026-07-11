import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { Screening } from '@/types';
import { api, formatTime, formatPrice, formatDateShort, getFullImageUrl } from '@/services/api';
import { Colors, MaxContentWidth, Spacing } from '@/constants/theme';

// =============================================
// SCHEDULE SCREEN — Lịch chiếu phim
// =============================================
export default function ScheduleScreen() {
  const router = useRouter();
  const [screenings, setScreenings] = useState<Screening[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState<string>('');

  // load screenings khi mount
  useEffect(() => {
    let isMounted = true;
    api.getScreenings().then(data => {
      if (isMounted) {
        setScreenings(data);
        setLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, []);

  // Filter theo trạng thái (useCallback — slide 05)
  const filtered = screenings.filter(s => {
    if (!activeStatus) return true;
    return s.MovieStatus === activeStatus;
  });

  // Render từng suất chiếu
  const renderItem = useCallback(({ item }: { item: Screening }) => (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.85 }]}
      onPress={() => router.push(`/book/${item.ScreeningID}`)}
    >
      {/* Poster */}
      <View style={styles.posterContainer}>
        <Image
          source={{ uri: getFullImageUrl(item.PosterURL) }}
          style={styles.poster}
          contentFit="cover"
          transition={300}
        />
      </View>

      {/* Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.movieTitle} numberOfLines={2}>{item.MovieTitle}</Text>
        <Text style={styles.metaText}>{item.RoomName} · {item.SeatType || '2D'}</Text>
        <Text style={styles.metaText}>{item.Genre} · {item.Duration} phút</Text>

        <View style={styles.timePriceRow}>
          <View style={styles.timeBadge}>
            <Text style={styles.timeText}>{formatTime(item.StartTime)} - {formatDateShort(item.StartTime)}</Text>
          </View>
          <Text style={styles.priceText}>{formatPrice(item.BasePrice)}</Text>
        </View>
      </View>

      {/* Nút chọn ghế */}
      <Pressable
        style={({ pressed }) => [styles.bookBtn, pressed && { opacity: 0.8 }]}
        onPress={() => router.push(`/book/${item.ScreeningID}`)}
      >
        <Text style={styles.bookBtnText}>Chọn ghế</Text>
      </Pressable>
    </Pressable>
  ), [router]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={filtered}
        keyExtractor={item => `${item.ScreeningID}`}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        ItemSeparatorComponent={() => <View style={{ height: Spacing.three }} />}
        ListHeaderComponent={() => (
          <>
            <Text style={styles.pageTitle}>Lịch chiếu phim</Text>

            {/* Status tabs */}
            <View style={styles.statusTabs}>
              {[
                { label: 'Tất cả', value: '' },
                { label: 'Đang chiếu', value: 'On Going' },
                { label: 'Sắp chiếu', value: 'Up Coming' },
              ].map(tab => (
                <Pressable
                  key={tab.value}
                  style={[styles.statusTab, activeStatus === tab.value && styles.statusTabActive]}
                  onPress={() => setActiveStatus(tab.value)}
                >
                  <Text style={[
                    styles.statusTabText,
                    activeStatus === tab.value && styles.statusTabTextActive,
                  ]}>
                    {tab.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            {loading && (
              <View style={{ alignItems: 'center', paddingVertical: Spacing.five }}>
                <ActivityIndicator size="large" color={Colors.dark.buttonPrimary} />
              </View>
            )}
          </>
        )}
        ListEmptyComponent={() => !loading ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>Không có suất chiếu nào</Text>
          </View>
        ) : null}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  contentContainer: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.four,
    maxWidth: MaxContentWidth,
    width: '100%',
    alignSelf: 'center',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginTop: Spacing.three,
    marginBottom: Spacing.three,
  },
  statusTabs: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginBottom: Spacing.three,
  },
  statusTab: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: Colors.dark.backgroundElement,
    borderWidth: 1,
    borderColor: Colors.dark.backgroundSelected,
  },
  statusTabActive: {
    backgroundColor: Colors.dark.buttonPrimary,
    borderColor: Colors.dark.buttonPrimary,
  },
  statusTabText: {
    color: Colors.dark.textSecondary,
    fontWeight: '600',
    fontSize: 13,
  },
  statusTabTextActive: {
    color: '#fff',
  },
  // Screening card
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.dark.backgroundElement,
    borderRadius: 12,
    padding: Spacing.two,
    borderWidth: 1,
    borderColor: Colors.dark.backgroundSelected,
    alignItems: 'center',
    gap: Spacing.two,
  },
  posterContainer: {
    width: 70,
    height: 100,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: Colors.dark.backgroundSelected,
  },
  poster: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    flex: 1,
    gap: 4,
  },
  movieTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.dark.text,
  },
  metaText: {
    fontSize: 12,
    color: Colors.dark.textSecondary,
  },
  timePriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginTop: 4,
  },
  timeBadge: {
    backgroundColor: Colors.dark.backgroundSelected,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  timeText: {
    color: Colors.dark.text,
    fontWeight: 'bold',
    fontSize: 14,
  },
  priceText: {
    color: Colors.dark.buttonPrimary,
    fontWeight: '700',
    fontSize: 14,
  },
  bookBtn: {
    backgroundColor: Colors.dark.buttonPrimary,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  bookBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  emptyBox: {
    alignItems: 'center',
    paddingVertical: Spacing.six,
  },
  emptyText: {
    color: Colors.dark.textSecondary,
    fontSize: 15,
  },
});