import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { MovieProps } from '@/components/movie-card';
import { MovieHorizontalCard as MovieCard } from '@/components/movie-card';

import { Colors, MaxContentWidth, Spacing } from '@/constants/theme';

const movies: MovieProps[] = [
  {
    title: 'LEVITICUS: BÓNG QUỶ-T18',
    format: '2D',
    imageUrl: '/path/to/movie-poster-1.jpg',
    screeningList: ['18:25', '20:00', '22:15', '23:30'],
  },
  {
    title: 'TÊN PHIM 2: ĐẠI CHIẾN-T13',
    format: '3D',
    imageUrl: '/path/to/movie-poster-2.jpg',
    screeningList: ['11:00', '14:00', '17:00'],
  },
];

export default function ScheduleScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={movies}
        keyExtractor={(item, index) => `${item.title}-${index}`}
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <>
            <Text style={styles.title}>Lịch chiếu phim</Text>
            <View style={styles.dayList}>
              <ScreenDayBtn date="Today" active={true} />
              <ScreenDayBtn date="Tomorrow" active={false} />
            </View>
          </>
        )}
        renderItem={({ item }) => (
          <MovieCard
            title={item.title}
            format={item.format}
            imageUrl={item.imageUrl}
            screeningList={item.screeningList}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.movieSeparator} />}
      />
    </SafeAreaView>
  );
}

function ScreenDayBtn({ date, active }: { date: string; active?: boolean }) {
  return (
    <Pressable style={({ pressed }) => [
      styles.dayButton, 
      active && styles.dayButtonActive,
      pressed && styles.dayButtonPressed
    ]}>
      <Text style={[styles.dayButtonText, active && styles.dayButtonTextActive]}>{date}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignItems: 'stretch',
    backgroundColor: Colors.dark.background,
  },
  container: {
    flex: 1,
    width: '100%',
  },
  contentContainer: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.four,
    maxWidth: MaxContentWidth,
    width: '100%',
    alignSelf: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginTop: 16,
    marginBottom: Spacing.two,
  },
  dayList: {
    flexDirection: 'row',
    gap: Spacing.three,
    marginBottom: Spacing.four,
  },
  dayButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: Colors.dark.backgroundElement,
    borderWidth: 1,
    borderColor: Colors.dark.backgroundSelected,
  },
  dayButtonActive: {
    backgroundColor: Colors.dark.buttonPrimary,
    borderColor: Colors.dark.buttonPrimary,
  },
  dayButtonPressed: {
    opacity: 0.85,
  },
  dayButtonText: {
    color: Colors.dark.textSecondary,
    fontWeight: '600',
  },
  dayButtonTextActive: {
    color: Colors.dark.buttonTextOnPrimary,
  },
  movieSeparator: {
    height: Spacing.four,
  },
  movieContainer: {
    gap: Spacing.four,
  },
  // Khối bọc ngang chuẩn ảnh mẫu
  movieTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginBottom: 6,
    width: '90%', // Tránh đè lên tag 2D
  },
  sectionSubtitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginTop: 12,
    marginBottom: 8,
  },
});