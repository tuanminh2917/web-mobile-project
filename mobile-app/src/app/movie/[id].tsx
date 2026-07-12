import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { Movie, ScreeningByRoom, Comment, User } from '@/types';
import { api, formatDateShort, formatTime, formatPrice, getVNDateString, getFullImageUrl } from '@/services/api';
import { Colors, MaxContentWidth, Spacing } from '@/constants/theme';

export default function MovieDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [movie, setMovie] = useState<Movie | null>(null);
  const [screenings, setScreenings] = useState<ScreeningByRoom>({});
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  // Lọc suất chiếu
  const [dates, setDates] = useState<string[]>([]);
  const [activeDate, setActiveDate] = useState<string>('');

  // Comment form states
  const [user, setUser] = useState<User | null>(null);
  const [ratingInput, setRatingInput] = useState(5);
  const [commentInput, setCommentInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const movieId = Number(id);
    if (!movieId) return;

    AsyncStorage.getItem('@cinema_user').then(u => {
      if (u && isMounted) setUser(JSON.parse(u));
    });

    Promise.all([
      api.getMovieById(movieId),
      api.getScreeningsByMovie(movieId),
      api.getComments(movieId),
    ]).then(([m, s, c]) => {
      if (isMounted) {
        setMovie(m);
        setScreenings(s);
        // Đảm bảo comments luôn là array hợp lệ
        setComments(Array.isArray(c) ? c : []);

        // Trích xuất danh sách ngày có suất chiếu
        // Dùng getVNDateString để format cố định theo múi giờ Châu Á/Hồ Chí Minh
        const allDates = new Set<string>();
        Object.values(s).flat().forEach(scr => {
          allDates.add(getVNDateString(scr.StartTime));
        });
        const dateArr = Array.from(allDates).sort();
        setDates(dateArr);
        if (dateArr.length > 0) setActiveDate(dateArr[0]);

        setLoading(false);
      }
    });

    return () => { isMounted = false; };
  }, [id]);

  const handleSubmitComment = async () => {
    const userStr = await AsyncStorage.getItem('@cinema_user');
    const currentUser = userStr ? JSON.parse(userStr) : null;

    if (!currentUser) {
      Alert.alert('Lỗi', 'Vui lòng đăng nhập để bình luận!');
      return;
    }
    if (!commentInput.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập nội dung bình luận!');
      return;
    }

    setIsSubmitting(true);
    const res = await api.submitComment(Number(id), ratingInput, commentInput, currentUser);
    setIsSubmitting(false);

    if (res.success && res.comment) {
      setComments(prev => [res.comment!, ...prev]);
      setCommentInput('');
      setRatingInput(5);
    } else {
      Alert.alert('Lỗi', 'Gửi bình luận thất bại. Vui lòng đăng nhập lại.');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.centered]}>
        <ActivityIndicator size="large" color={Colors.dark.buttonPrimary} />
      </SafeAreaView>
    );
  }

  if (!movie) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.centered]}>
        <Text style={{ color: '#fff' }}>Không tìm thấy phim.</Text>
        <Pressable onPress={() => router.back()} style={{ marginTop: 20 }}>
          <Text style={{ color: Colors.dark.buttonPrimary }}>Quay lại</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  // Calculate Average Rating — dùng Number() để tránh crash nếu Rating là string
  const validComments = comments.filter(c => c && c.Rating != null);
  const avgRating = validComments.length > 0
    ? (validComments.reduce((sum, c) => sum + Number(c.Rating), 0) / validComments.length).toFixed(1)
    : 'Chưa có';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header bar */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>{movie.Title}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* --- MOVIE INFO --- */}
        <View style={styles.infoSection}>
          <Image
            source={{ uri: getFullImageUrl(movie.PosterURL) }}
            style={styles.poster}
            contentFit="cover"
          />
          <View style={styles.details}>
            <Text style={styles.title}>{movie.Title}</Text>
            
            <View style={styles.tagsContainer}>
              <View style={[styles.tag, { backgroundColor: '#ef444422' }]}>
                <Text style={[styles.tagText, { color: '#ef4444' }]}>{movie.Censorship || 'P'}</Text>
              </View>
              <View style={styles.tag}><Text style={styles.tagText}>{movie.Genre}</Text></View>
              <View style={styles.tag}><Text style={styles.tagText}>{movie.Duration}p</Text></View>
              <View style={[styles.tag, { backgroundColor: '#f59e0b22' }]}>
                <Text style={[styles.tagText, { color: '#f59e0b' }]}>★ {avgRating}</Text>
              </View>
            </View>

            <Text style={styles.metaText}><Text style={styles.label}>Đạo diễn:</Text> {movie.Director}</Text>
            <Text style={styles.metaText}><Text style={styles.label}>Diễn viên:</Text> {movie.Actor}</Text>
            <Text style={styles.metaText}><Text style={styles.label}>Ngôn ngữ:</Text> {movie.Languages}</Text>
          </View>
        </View>

        <Text style={styles.description}>{movie.Description}</Text>

        {/* --- SHOWTIMES --- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lịch chiếu</Text>
          
          {movie.Status === 'Up Coming' ? (
            <View style={{ backgroundColor: Colors.dark.backgroundElement, padding: 20, borderRadius: 12, borderWidth: 1, borderColor: Colors.dark.backgroundSelected, alignItems: 'center' }}>
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>Phim sắp ra mắt</Text>
              <Text style={{ color: Colors.dark.textSecondary, fontSize: 14 }}>Dự kiến khởi chiếu từ ngày {new Date(movie.ReleaseDate).toLocaleDateString('vi-VN')}</Text>
            </View>
          ) : dates.length > 0 ? (
            <>
              {/* Date Tabs */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateTabs}>
                {dates.map(date => (
                  <Pressable
                    key={date}
                    style={[styles.dateTab, activeDate === date && styles.dateTabActive]}
                    onPress={() => setActiveDate(date)}
                  >
                    <Text style={[styles.dateDay, activeDate === date && styles.dateTextActive]}>
                      {formatDateShort(date)}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>

              {/* Screenings by Room */}
              {Object.entries(screenings).map(([room, list]) => {
                // Filter suất chiếu theo ngày — dùng getVNDateString
                const dayList = list.filter(s => getVNDateString(s.StartTime) === activeDate);
                if (dayList.length === 0) return null;

                return (
                  <View key={room} style={styles.roomBlock}>
                    <Text style={styles.roomName}>{room}</Text>
                    <View style={styles.timeGrid}>
                      {dayList.map(s => (
                        <Pressable
                          key={s.ScreeningID}
                          style={styles.timeBtn}
                          onPress={() => router.push(`/book/${s.ScreeningID}`)}
                        >
                          <Text style={styles.timeText}>{formatTime(s.StartTime)}</Text>
                          <Text style={styles.priceText}>{s.BasePrice / 1000}k</Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>
                );
              })}
            </>
          ) : (
            <Text style={styles.emptyText}>Chưa có lịch chiếu cho phim này.</Text>
          )}
        </View>

        {/* --- COMMENTS --- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Đánh giá ({comments.length})</Text>

          {/* Comment Form */}
          <View style={styles.commentForm}>
            <Text style={styles.formLabel}>Viết đánh giá của bạn:</Text>
            <View style={styles.starSelector}>
              {[1, 2, 3, 4, 5].map(star => (
                <Pressable key={star} onPress={() => setRatingInput(star)} style={{ padding: 4 }}>
                  <Text style={{ color: star <= ratingInput ? '#f59e0b' : '#4b5563', fontSize: 24 }}>★</Text>
                </Pressable>
              ))}
            </View>
            <TextInput
              style={styles.commentInput}
              placeholder="Nhập bình luận..."
              placeholderTextColor="#6b7280"
              value={commentInput}
              onChangeText={setCommentInput}
              multiline
            />
            <Pressable 
              style={[styles.submitBtn, isSubmitting && { opacity: 0.7 }]} 
              onPress={handleSubmitComment}
              disabled={isSubmitting}
            >
              <Text style={styles.submitBtnText}>{isSubmitting ? 'Đang gửi...' : 'Gửi Đánh Giá'}</Text>
            </Pressable>
          </View>

          {comments.map((c, i) => (
            <View key={c.CommentID || i} style={styles.commentCard}>
              <View style={styles.commentHeader}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{(c.FullName || c.Username)[0].toUpperCase()}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.commentName}>{c.FullName || c.Username}</Text>
                  <View style={{ flexDirection: 'row' }}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <Text key={star} style={{ color: star <= c.Rating ? '#f59e0b' : '#4b5563', fontSize: 12 }}>★</Text>
                    ))}
                  </View>
                </View>
                <Text style={styles.commentDate}>{formatDateShort(c.CreatedAt)}</Text>
              </View>
              <Text style={styles.commentText}>{c.Content}</Text>
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.dark.background },
  centered: { justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    backgroundColor: Colors.dark.backgroundElement,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.backgroundSelected,
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { flex: 1, color: '#fff', fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
  container: { flex: 1 },
  contentContainer: { padding: Spacing.four, paddingBottom: 100 },
  
  infoSection: { flexDirection: 'row', gap: Spacing.three, marginBottom: Spacing.three },
  poster: { width: 100, height: 150, borderRadius: 8 },
  details: { flex: 1, gap: 4 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginVertical: 4 },
  tag: { backgroundColor: Colors.dark.backgroundSelected, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  tagText: { color: Colors.dark.textSecondary, fontSize: 11, fontWeight: 'bold' },
  metaText: { color: Colors.dark.textSecondary, fontSize: 13, lineHeight: 18 },
  label: { color: '#9ca3af', fontWeight: 'bold' },
  description: { color: Colors.dark.textSecondary, fontSize: 14, lineHeight: 22, marginBottom: Spacing.four },

  section: { marginTop: Spacing.four },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginBottom: Spacing.three },
  
  dateTabs: { flexDirection: 'row', marginBottom: Spacing.three },
  dateTab: { 
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, 
    borderWidth: 1, borderColor: Colors.dark.backgroundSelected, marginRight: Spacing.two 
  },
  dateTabActive: { backgroundColor: Colors.dark.buttonPrimary, borderColor: Colors.dark.buttonPrimary },
  dateDay: { color: Colors.dark.textSecondary, fontWeight: 'bold' },
  dateTextActive: { color: '#fff' },

  roomBlock: { marginBottom: Spacing.three, backgroundColor: Colors.dark.backgroundElement, padding: Spacing.three, borderRadius: 12 },
  roomName: { color: '#fff', fontWeight: 'bold', marginBottom: Spacing.two },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  timeBtn: { 
    borderWidth: 1, borderColor: Colors.dark.backgroundSelected, 
    borderRadius: 8, paddingVertical: 6, paddingHorizontal: 12, alignItems: 'center' 
  },
  timeText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  priceText: { color: Colors.dark.textSecondary, fontSize: 11, marginTop: 2 },
  emptyText: { color: '#6b7280', fontStyle: 'italic' },

  commentCard: { backgroundColor: Colors.dark.backgroundElement, padding: Spacing.three, borderRadius: 12, marginBottom: Spacing.two },
  commentHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, marginBottom: 8 },
  avatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.dark.buttonPrimary, justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#fff', fontWeight: 'bold' },
  commentName: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  commentDate: { color: '#6b7280', fontSize: 12 },
  commentText: { color: Colors.dark.textSecondary, fontSize: 14, lineHeight: 20 },
  
  commentForm: { backgroundColor: Colors.dark.backgroundElement, padding: Spacing.three, borderRadius: 12, marginBottom: Spacing.four },
  formLabel: { color: '#fff', fontWeight: 'bold', marginBottom: 8 },
  starSelector: { flexDirection: 'row', marginBottom: 8 },
  commentInput: { backgroundColor: Colors.dark.background, color: '#fff', borderRadius: 8, padding: 12, height: 80, textAlignVertical: 'top', marginBottom: 12, borderWidth: 1, borderColor: Colors.dark.backgroundSelected },
  submitBtn: { backgroundColor: Colors.dark.buttonPrimary, paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  submitBtnText: { color: '#fff', fontWeight: 'bold' },
});
