import { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image'; // Dùng expo-image làm qr code placeholder 

import { Screening, SeatInfo, User } from '@/types';
import { api, formatDateTime, formatPrice } from '@/services/api';
import { Colors, Spacing } from '@/constants/theme';

export default function CheckoutScreen() {
  const { id, seats, total } = useLocalSearchParams<{ id: string; seats: string; total: string }>();
  const router = useRouter();

  const [screening, setScreening] = useState<Screening | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Countdown (10 phút = 600s)
  const [timeLeft, setTimeLeft] = useState(600);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const selectedSeats: SeatInfo[] = seats ? JSON.parse(seats) : [];
  const totalAmount = Number(total) || 0;

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      const scrId = Number(id);
      if (!scrId) return;

      const [scr, authData] = await Promise.all([
        api.getScreeningById(scrId),
        AsyncStorage.getItem('@cinema_user')
      ]);

      if (isMounted) {
        setScreening(scr);
        if (authData) setUser(JSON.parse(authData));
        setLoading(false);
      }
    };
    load();

    // Khởi động bộ đếm
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      isMounted = false;
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [id]);

  const handleConfirmPay = async () => {
    if (!user) return;
    setIsProcessing(true);
    // Tự tạo token từ UserID nếu user.token không có (dữ liệu cũ trong AsyncStorage)
    const token = user.token || `dummy-token-${user.UserID}`;
    const result = await api.confirmBooking(Number(id), selectedSeats, token);
    setIsProcessing(false);
    
    if (result.success) {
      Alert.alert("Thành công", `Đặt vé thành công! Mã giao dịch: #BK${result.bookingID}`, [
        { text: "Xem vé", onPress: () => router.replace('/account') }
      ]);
    } else {
      Alert.alert("Lỗi", "Giao dịch thất bại, vui lòng thử lại.");
    }
  };

  const formatTimeLeft = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.centered]}><ActivityIndicator size="large" color={Colors.dark.buttonPrimary} /></SafeAreaView>
    );
  }

  if (timeLeft === 0) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.centered]}>
        <Ionicons name="time-outline" size={64} color="#ef4444" />
        <Text style={{ color: '#fff', fontSize: 18, marginTop: 10 }}>Đơn hàng đã hết hạn!</Text>
        <Pressable onPress={() => router.replace('/')} style={styles.returnBtn}>
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Về trang chủ</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </Pressable>
        <Text style={styles.headerTitle}>Xác nhận thanh toán</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Countdown bar */}
      <View style={styles.countdownBar}>
        <Text style={styles.countdownText}>
          ⏱ Vé được giữ trong: <Text style={styles.timeHighlight}>{formatTimeLeft(timeLeft)}</Text>
        </Text>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* THÔNG TIN ĐẶT VÉ */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 Thông tin đặt vé</Text>
          <View style={styles.infoRow}><Text style={styles.label}>Phim</Text><Text style={styles.value}>{screening?.MovieTitle}</Text></View>
          <View style={styles.infoRow}><Text style={styles.label}>Phòng chiếu</Text><Text style={styles.value}>{screening?.RoomName}</Text></View>
          <View style={styles.infoRow}><Text style={styles.label}>Suất chiếu</Text><Text style={styles.value}>{formatDateTime(screening?.StartTime || '')}</Text></View>
          <View style={styles.infoRow}><Text style={styles.label}>Ghế</Text><Text style={styles.value}>{selectedSeats.map(s=>s.row+s.number).join(', ')}</Text></View>
          <View style={styles.divider} />
          {selectedSeats.map(s => (
            <View key={`${s.row}${s.number}`} style={styles.infoRow}>
              <Text style={styles.label}>Ghế {s.row}{s.number} ({s.type === 'regular'?'Thường':s.type==='vip'?'VIP':'Đôi'})</Text>
              <Text style={styles.priceValue}>{formatPrice(s.price)}</Text>
            </View>
          ))}
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.totalLabel}>Tổng cộng</Text>
            <Text style={styles.totalValue}>{formatPrice(totalAmount)}</Text>
          </View>
        </View>

        {/* THANH TOÁN QR */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💳 Thanh toán QR</Text>
          <Text style={styles.qrInstruction}>Quét mã QR bằng ứng dụng ngân hàng để thanh toán</Text>
          
          <View style={styles.qrContainer}>
            {/* Tạo QR giả bằng API public giống bên Web */}
            <Image 
              source={{ uri: `https://api.qrserver.com/v1/create-qr-code/?data=CINEMA-BK-${id}-${totalAmount}&size=200x200` }}
              style={styles.qrImage}
              contentFit="contain"
            />
          </View>

          <View style={styles.payInfoBox}>
            <View style={styles.payRow}><Text style={styles.payLabel}>Ngân hàng</Text><Text style={styles.payValue}>Vietcombank</Text></View>
            <View style={styles.payRow}><Text style={styles.payLabel}>Số tài khoản</Text><Text style={styles.payValueHighlight}>1234567890</Text></View>
            <View style={styles.payRow}><Text style={styles.payLabel}>Chủ tài khoản</Text><Text style={styles.payValue}>Rạp chiếu phim</Text></View>
            <View style={styles.payRow}><Text style={styles.payLabel}>Số tiền</Text><Text style={styles.payTotal}>{formatPrice(totalAmount)}</Text></View>
            <View style={styles.payRow}><Text style={styles.payLabel}>Nội dung CK</Text><Text style={styles.payValueHighlight}>BOOKING{Math.floor(Math.random() * 9000)+1000}</Text></View>
          </View>

          <Text style={styles.noteText}>* Sau khi chuyển khoản thành công, nhấn nút bên dưới để xác nhận.</Text>
          
          <Pressable 
            style={({pressed}) => [styles.confirmBtn, pressed && { opacity: 0.8 }]}
            disabled={isProcessing}
            onPress={handleConfirmPay}
          >
            {isProcessing ? <ActivityIndicator color="#fff" /> : <Text style={styles.confirmBtnText}>Xác nhận đã thanh toán</Text>}
          </Pressable>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.dark.background },
  centered: { justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.three, paddingVertical: Spacing.two, backgroundColor: Colors.dark.backgroundElement, borderBottomWidth: 1, borderBottomColor: Colors.dark.backgroundSelected },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { flex: 1, color: '#fff', fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
  
  countdownBar: { backgroundColor: '#fef9c3', padding: 10, alignItems: 'center' },
  countdownText: { color: '#854d0e', fontSize: 14, fontWeight: '600' },
  timeHighlight: { color: '#b45309', fontWeight: 'bold', fontSize: 16 },

  container: { flex: 1 },
  contentContainer: { padding: Spacing.four, gap: Spacing.four },

  section: { backgroundColor: Colors.dark.backgroundElement, borderRadius: 12, padding: Spacing.four, borderWidth: 1, borderColor: Colors.dark.backgroundSelected },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#fff', marginBottom: Spacing.three },
  
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  label: { color: Colors.dark.textSecondary, fontSize: 14 },
  value: { color: '#fff', fontSize: 14, fontWeight: '500', textAlign: 'right', flex: 1, marginLeft: 20 },
  priceValue: { color: Colors.dark.text, fontSize: 14 },
  divider: { height: 1, backgroundColor: Colors.dark.backgroundSelected, marginVertical: 12 },
  totalLabel: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  totalValue: { color: Colors.dark.buttonPrimary, fontSize: 18, fontWeight: 'bold' },

  qrInstruction: { color: Colors.dark.textSecondary, fontSize: 13, textAlign: 'center', marginBottom: Spacing.three },
  qrContainer: { alignSelf: 'center', backgroundColor: '#fff', padding: 10, borderRadius: 8, marginBottom: Spacing.three },
  qrImage: { width: 180, height: 180 },
  
  payInfoBox: { backgroundColor: '#111827', padding: Spacing.three, borderRadius: 8, gap: 10 },
  payRow: { flexDirection: 'row', justifyContent: 'space-between' },
  payLabel: { color: '#9ca3af', fontSize: 13 },
  payValue: { color: '#f3f4f6', fontSize: 13, fontWeight: '500' },
  payValueHighlight: { color: '#34d399', fontSize: 14, fontWeight: 'bold' },
  payTotal: { color: '#f87171', fontSize: 15, fontWeight: 'bold' },
  
  noteText: { color: '#ef4444', fontSize: 12, fontStyle: 'italic', marginTop: Spacing.three, marginBottom: Spacing.three, textAlign: 'center' },
  
  confirmBtn: { backgroundColor: Colors.dark.buttonPrimary, paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
  confirmBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

  returnBtn: { marginTop: 20, backgroundColor: '#374151', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 }
});
