import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Booking, User } from '@/types';
import { api, formatDateTime, formatPrice, getFullImageUrl } from '@/services/api';
import { Colors, MaxContentWidth, Spacing } from '@/constants/theme';

const AUTH_KEY = '@cinema_user';

// =============================================
// ACCOUNT SCREEN — Login / Profile + Vé
// =============================================
export default function AccountScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');

  // Đọc user từ AsyncStorage khi mount (slide 10: Data Storage)
  useEffect(() => {
    const loadUser = async () => {
      try {
        const stored = await AsyncStorage.getItem(AUTH_KEY);
        if (stored) {
          const parsed: User = JSON.parse(stored);
          setUser(parsed);
          loadBookings(parsed.token);
        }
      } catch (e) {
        console.error('Load user error:', e);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const loadBookings = async (token: string) => {
    try {
      const data = await api.getMyBookings(token);
      // Đảm bảo data luôn là array, tránh crash khi API trả lỗi
      setBookings(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Load bookings error:', e);
      setBookings([]);
    }
  };

  // Đăng nhập
  const handleLogin = useCallback(async () => {
    if (!username.trim() || !password.trim()) {
      setError('Vui lòng nhập đầy đủ thông tin.');
      return;
    }
    setLoginLoading(true);
    setError('');
    const result = await api.login(username.trim(), password);
    setLoginLoading(false);
    if (result.success && result.user) {
      await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(result.user));
      setUser(result.user);
      loadBookings(result.user.token);
      setUsername('');
      setPassword('');
    } else {
      setError('Tên đăng nhập hoặc mật khẩu không đúng.');
    }
  }, [username, password]);

  // Đăng ký
  const handleRegister = useCallback(async () => {
    if (!username.trim() || !password.trim() || !email.trim() || !fullName.trim()) {
      setError('Vui lòng nhập đầy đủ thông tin.');
      return;
    }
    setLoginLoading(true);
    setError('');
    const result = await api.register(username.trim(), password, fullName.trim(), email.trim());
    setLoginLoading(false);
    if (result.success && result.user) {
      await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(result.user));
      setUser(result.user);
      loadBookings(result.user.token);
      setUsername('');
      setPassword('');
      setEmail('');
      setFullName('');
      setIsRegistering(false);
    } else {
      setError('Đăng ký thất bại. Tên đăng nhập có thể đã tồn tại.');
    }
  }, [username, password, email, fullName]);

  // Đăng xuất
  const handleLogout = useCallback(async () => {
    await AsyncStorage.removeItem(AUTH_KEY);
    setUser(null);
    setBookings([]);
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.centered]}>
        <ActivityIndicator size="large" color={Colors.dark.buttonPrimary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ===== CHƯA ĐĂNG NHẬP / ĐĂNG KÝ ===== */}
        {!user && (
          <View style={styles.authForm}>
            <Text style={styles.authTitle}>{isRegistering ? 'Tạo tài khoản' : 'Chào mừng trở lại'}</Text>
            <Text style={styles.authSubtitle}>
              {isRegistering ? 'Điền thông tin để đăng ký thành viên mới' : 'Đăng nhập để quản lý vé và nhận ưu đãi'}
            </Text>

            {!!error && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>⚠ {error}</Text>
              </View>
            )}

            {isRegistering && (
              <>
                <Text style={styles.inputLabel}>Họ và tên</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Nhập họ và tên"
                  placeholderTextColor="#64748b"
                  value={fullName}
                  onChangeText={setFullName}
                />
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Nhập email"
                  placeholderTextColor="#64748b"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </>
            )}

            <Text style={styles.inputLabel}>Tên đăng nhập</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập tên đăng nhập"
              placeholderTextColor="#64748b"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Text style={styles.inputLabel}>Mật khẩu</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập mật khẩu"
              placeholderTextColor="#64748b"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <Pressable
              style={({ pressed }) => [styles.btnPrimary, pressed && { opacity: 0.8 }]}
              onPress={isRegistering ? handleRegister : handleLogin}
              disabled={loginLoading}
            >
              {loginLoading
                ? <ActivityIndicator size="small" color="#fff" />
                : <Text style={styles.btnPrimaryText}>{isRegistering ? 'Đăng ký' : 'Đăng nhập'}</Text>
              }
            </Pressable>

            <Pressable 
              style={({ pressed }) => [styles.btnSecondary, pressed && { opacity: 0.8 }]}
              onPress={() => {
                setIsRegistering(!isRegistering);
                setError('');
              }}
            >
              <Text style={styles.btnSecondaryText}>
                {isRegistering ? 'Đã có tài khoản? Đăng nhập' : 'Tạo tài khoản mới'}
              </Text>
            </Pressable>
          </View>
        )}

        {/* ===== ĐÃ ĐĂNG NHẬP ===== */}
        {!!user && (
          <View style={styles.profileContainer}>
            {/* Profile header */}
            <View style={styles.profileHeader}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {(user.FullName ?? user.Username)[0].toUpperCase()}
                </Text>
              </View>
              <Text style={styles.welcomeText}>{user.FullName || user.Username}</Text>
              <Text style={styles.userEmail}>{user.Email}</Text>

              <Pressable
                style={({ pressed }) => [styles.logoutBtn, pressed && { opacity: 0.8 }]}
                onPress={handleLogout}
              >
                <Text style={styles.logoutBtnText}>Đăng xuất</Text>
              </Pressable>
            </View>

            {/* Vé của tôi */}
            <Text style={styles.sectionTitle}>Vé của tôi</Text>

            {bookings.length === 0 ? (
              <View style={styles.emptyTickets}>
                <Text style={styles.emptyText}>🎫 Chưa có vé nào</Text>
              </View>
            ) : (
              bookings.map(b => <TicketCard key={b.BookingID} booking={b} />)
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// =============================================
// TICKET CARD COMPONENT
// =============================================
function TicketCard({ booking }: { booking: Booking }) {
  const statusLabel =
    booking.Status === 'Paid' ? 'Đã thanh toán' :
    booking.Status === 'Pending' ? 'Chờ thanh toán' : 'Đã hủy';
  const statusColor =
    booking.Status === 'Paid' ? '#34d399' :
    booking.Status === 'Pending' ? '#fbbf24' : '#ef4444';

  return (
    <View style={styles.ticketCard}>
      {/* Header: poster + title + status */}
      <View style={styles.ticketHeader}>
        <View style={styles.ticketPosterWrap}>
          <Image
            source={{ uri: getFullImageUrl(booking.PosterURL) }}
            style={styles.ticketPoster}
            contentFit="cover"
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.ticketMovieTitle} numberOfLines={2}>{booking.MovieTitle}</Text>
          <View style={[styles.statusTag, { backgroundColor: statusColor + '22' }]}>
            <Text style={[styles.statusText, { color: statusColor }]}>{statusLabel}</Text>
          </View>
        </View>
      </View>

      {/* Divider dạng dashed */}
      <View style={styles.ticketDivider} />

      {/* Details */}
      <View style={styles.ticketDetails}>
        <TicketRow label="Mã vé" value={`#BK${booking.BookingID}`} />
        <TicketRow label="Phòng" value={booking.RoomName} />
        <TicketRow label="Suất chiếu" value={formatDateTime(booking.StartTime)} />
        <TicketRow label="Ghế" value={booking.Seats} />
        <TicketRow label="Tổng tiền" value={formatPrice(booking.TotalPrice)} highlight />
      </View>
    </View>
  );
}

function TicketRow({
  label, value, highlight,
}: { label: string; value: string; highlight?: boolean }) {
  return (
    <View style={styles.ticketRow}>
      <Text style={styles.ticketLabel}>{label}</Text>
      <Text style={[styles.ticketValue, highlight && { color: Colors.dark.buttonPrimary, fontWeight: 'bold' }]}>
        {value}
      </Text>
    </View>
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
  },
  container: { flex: 1 },
  contentContainer: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.four,
    maxWidth: MaxContentWidth,
    width: '100%',
    alignSelf: 'center',
  },

  /* --- FORM ĐĂNG NHẬP --- */
  authForm: {
    marginTop: Spacing.four,
  },
  authTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginBottom: 6,
  },
  authSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: Spacing.four,
  },
  errorBox: {
    backgroundColor: '#7f1d1d',
    borderRadius: 8,
    padding: Spacing.two,
    marginBottom: Spacing.two,
  },
  errorText: {
    color: '#fca5a5',
    fontSize: 13,
  },
  inputLabel: {
    color: Colors.dark.textSecondary,
    fontSize: 13,
    marginBottom: 4,
    fontWeight: '600',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#1e293b',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#ffffff',
    marginBottom: Spacing.three,
    borderWidth: 1,
    borderColor: '#334155',
  },
  btnPrimary: {
    height: 50,
    backgroundColor: Colors.dark.buttonPrimary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.two,
  },
  btnPrimaryText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  btnSecondary: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.two,
    borderWidth: 1,
    borderColor: '#334155',
  },
  btnSecondaryText: {
    color: '#94a3b8',
    fontWeight: '600',
    fontSize: 15,
  },

  /* --- PROFILE --- */
  profileContainer: { gap: Spacing.three },
  profileHeader: {
    alignItems: 'center',
    backgroundColor: Colors.dark.backgroundElement,
    borderRadius: 16,
    padding: Spacing.four,
    borderWidth: 1,
    borderColor: Colors.dark.backgroundSelected,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.dark.buttonPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.two,
  },
  avatarText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: Spacing.two,
  },
  logoutBtn: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  logoutBtnText: {
    color: '#ef4444',
    fontSize: 13,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.dark.text,
  },
  emptyTickets: {
    alignItems: 'center',
    paddingVertical: Spacing.five,
    backgroundColor: Colors.dark.backgroundElement,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.dark.backgroundSelected,
  },
  emptyText: {
    color: Colors.dark.textSecondary,
    fontSize: 15,
  },

  /* --- TICKET CARD --- */
  ticketCard: {
    backgroundColor: Colors.dark.backgroundElement,
    borderRadius: 12,
    padding: Spacing.three,
    borderWidth: 1,
    borderColor: Colors.dark.backgroundSelected,
  },
  ticketHeader: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginBottom: Spacing.two,
  },
  ticketPosterWrap: {
    width: 56,
    height: 80,
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: Colors.dark.backgroundSelected,
  },
  ticketPoster: {
    width: '100%',
    height: '100%',
  },
  ticketMovieTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginBottom: 6,
  },
  statusTag: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  ticketDivider: {
    height: 1,
    backgroundColor: Colors.dark.backgroundSelected,
    marginVertical: Spacing.two,
    borderStyle: 'dashed',
  },
  ticketDetails: {
    gap: 6,
  },
  ticketRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ticketLabel: {
    color: Colors.dark.textSecondary,
    fontSize: 13,
  },
  ticketValue: {
    color: Colors.dark.text,
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'right',
    flex: 1,
    marginLeft: Spacing.two,
  },
});