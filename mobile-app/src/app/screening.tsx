import { BackIcon } from '@/components/icon';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MovieHorizontalCard as MovieCard } from '@/components/movie-card';
import { Colors, MaxContentWidth, Spacing } from '@/constants/theme';

// Dữ liệu mẫu của duy nhất 1 bộ phim với lịch chiếu chia theo Ngày
const MOVIE_DATA = {
  title: 'LEVITICUS: BÓNG QUỶ - T18',
  imageUrl: 'https://via.placeholder.com/150x225',
  format: '2D',
  // Lịch chiếu thay đổi động theo ngày được chọn
  schedule: {
    today: [
      { room: 'Phòng chiếu 1', times: ['12:30', '15:00', '18:25', '20:00'] },
      { room: 'Phòng chiếu 3 (IMAX)', times: ['21:15', '23:30'] }
    ],
    tomorrow: [
      { room: 'Phòng chiếu 1', times: ['09:00', '13:15', '16:00'] },
      { room: 'Phòng chiếu 2', times: ['19:00', '21:30'] }
    ]
  }
};

export default function MovieScreeningScreen() {
  const [activeDay, setActiveDay] = useState<'today' | 'tomorrow'>('today');

  // Lấy ra danh sách suất chiếu của ngày đang được chọn
  const currentScreenings = MOVIE_DATA.schedule[activeDay];

  return (
    <SafeAreaView style={styles.safeArea}>
      <Pressable style={styles.backButton}>
        <BackIcon />
      </Pressable>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Lịch chiếu phim</Text>

        {/* 1. Thông tin bộ phim duy nhất */}
        <View style={styles.movieHeaderCard}>
          <MovieCard
            title={MOVIE_DATA.title}
            imageUrl={MOVIE_DATA.imageUrl}
            format={MOVIE_DATA.format}
            screeningList={[]} // Không cần truyền list giờ vào card nữa
          />
        </View>

        {/* 2. Thanh chọn Ngày chiếu */}
        <View style={styles.dayList}>
          <ScreenDayBtn
            date="Today"
            active={activeDay === 'today'}
            onPress={() => setActiveDay('today')}
          />
          <ScreenDayBtn
            date="Tomorrow"
            active={activeDay === 'tomorrow'}
            onPress={() => setActiveDay('tomorrow')}
          />
        </View>

        <Text style={styles.sectionTitle}>Chọn suất chiếu</Text>

        {/* 3. Hiển thị danh sách các suất chiếu theo Phòng / Định dạng */}
        <View style={styles.screeningsContainer}>
          {currentScreenings.map((item, index) => (
            <View key={index} style={styles.roomCard}>
              <Text style={styles.roomName}>{item.room}</Text>

              <View style={styles.timeGrid}>
                {item.times.map((time, timeIdx) => (
                  <Pressable
                    key={timeIdx}
                    style={({ pressed }) => [
                      styles.timeButton,
                      pressed && styles.timeButtonPressed
                    ]}
                    onPress={() => {
                      // Hàm xử lý chọn suất chiếu
                    }}
                  >
                    <Text style={styles.timeButtonText}>{time}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

function ScreenDayBtn({ date, active, onPress }: { date: string; active?: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.dayButton,
        active && styles.dayButtonActive,
        pressed && styles.dayButtonPressed
      ]}
    >
      <Text style={[styles.dayButtonText, active && styles.dayButtonTextActive]}>{date}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 999,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  safeArea: {
    flex: 1,
    width: '100%',
    maxWidth: MaxContentWidth,
    backgroundColor: Colors.dark.background,
    alignSelf: 'center',
  },
  container: {
    flex: 1,
    width: '100%',
  },
  contentContainer: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.five || 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginTop: 16,
    marginBottom: Spacing.three,
  },
  movieHeaderCard: {
    marginBottom: Spacing.four,
  },
  dayList: {
    flexDirection: 'row',
    gap: Spacing.three,
    marginBottom: Spacing.four,
  },
  dayButton: {
    flex: 1, // Chia đều 2 nút bấm ngày bằng nhau cho cân đối
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: Colors.dark.backgroundElement,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  dayButtonActive: {
    backgroundColor: Colors.dark.buttonPrimary,
    borderColor: Colors.dark.buttonPrimary,
  },
  dayButtonPressed: {
    opacity: 0.85,
  },
  dayButtonText: {
    color: Colors.dark.textSecondary || '#94a3b8',
    fontWeight: '700',
    fontSize: 14,
  },
  dayButtonTextActive: {
    color: Colors.dark.buttonTextOnPrimary || '#ffffff',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginBottom: Spacing.three,
  },
  screeningsContainer: {
    gap: Spacing.three,
  },
  roomCard: {
    backgroundColor: Colors.dark.backgroundElement || '#1e293b',
    borderRadius: 14,
    padding: Spacing.three,
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  roomName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#94a3b8',
    marginBottom: 12,
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  timeButton: {
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#3b82f6', // Viền xanh lam tạo cảm giác công nghệ, hiện đại
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    minWidth: 75,
    alignItems: 'center',
  },
  timeButtonPressed: {
    backgroundColor: '#3b82f6',
    opacity: 0.4,
  },
  timeButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});