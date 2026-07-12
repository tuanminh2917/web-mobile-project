import { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Screening, SeatMapConfig, SeatInfo, User } from '@/types';
import { api, formatDateTime, formatPrice } from '@/services/api';
import { Colors, Spacing } from '@/constants/theme';
import SeatMap from '@/components/seat-map';

export default function BookScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [screening, setScreening] = useState<Screening | null>(null);
  const [config, setConfig] = useState<SeatMapConfig | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [selectedSeats, setSelectedSeats] = useState<SeatInfo[]>([]);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      const scrId = Number(id);
      if (!scrId) return;

      const [scr, mapConfig, authData] = await Promise.all([
        api.getScreeningById(scrId),
        api.getSeatMap(scrId),
        AsyncStorage.getItem('@cinema_user')
      ]);

      if (isMounted) {
        setScreening(scr);
        setConfig(mapConfig);
        if (authData) setUser(JSON.parse(authData));
        setLoading(false);
      }
    };
    load();
    return () => { isMounted = false; };
  }, [id]);

  const total = useMemo(() => {
    return selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
  }, [selectedSeats]);

  const handleCheckout = () => {
    if (!user) {
      alert('Vui lòng đăng nhập để tiếp tục.');
      router.push('/account');
      return;
    }
    if (!screening) return;
    router.push({
      pathname: `/checkout/${screening.ScreeningID}` as any,
      params: {
        seats: JSON.stringify(selectedSeats),
        total: total.toString()
      }
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.centered]}>
        <ActivityIndicator size="large" color={Colors.dark.buttonPrimary} />
      </SafeAreaView>
    );
  }

  if (!screening || !config) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.centered]}>
        <Text style={{ color: '#fff' }}>Không tìm thấy suất chiếu.</Text>
        <Pressable onPress={() => router.back()} style={{ marginTop: 20 }}><Text style={{ color: Colors.dark.buttonPrimary }}>Quay lại</Text></Pressable>
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
        <Text style={styles.headerTitle}>Chọn ghế</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={{ flex: 1 }} nestedScrollEnabled>
        <View style={styles.infoBox}>
          <Text style={styles.movieTitle}>{screening.MovieTitle}</Text>
          <Text style={styles.infoText}>{screening.RoomName} · {screening.SeatType || '2D'}</Text>
          <Text style={styles.infoText}>{formatDateTime(screening.StartTime)}</Text>
        </View>

        <SeatMap
          config={config}
          selectedSeats={selectedSeats}
          onSelect={seat => setSelectedSeats(prev => [...prev, seat])}
          onDeselect={seat => setSelectedSeats(prev => prev.filter(s => s.row !== seat.row || s.number !== seat.number))}
        />
        
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.summaryInfo}>
          {selectedSeats.length > 0 ? (
            <>
              <Text style={styles.summaryLabel}>Đã chọn {selectedSeats.length} ghế:</Text>
              <Text style={styles.seatsList} numberOfLines={1}>
                {selectedSeats.map(s => `${s.row}${s.type === 'couple' ? (s.number + 1) / 2 : s.number}`).join(', ')}
              </Text>
            </>
          ) : (
            <Text style={styles.summaryLabel}>Vui lòng chọn ghế</Text>
          )}
        </View>
        <Pressable
          style={({ pressed }) => [
            styles.checkoutBtn,
            selectedSeats.length === 0 && styles.checkoutBtnDisabled,
            pressed && selectedSeats.length > 0 && { opacity: 0.8 }
          ]}
          disabled={selectedSeats.length === 0}
          onPress={handleCheckout}
        >
          <Text style={styles.checkoutBtnText}>
            {selectedSeats.length > 0 ? formatPrice(total) : 'Tiếp tục'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.dark.background },
  centered: { justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.three, paddingVertical: Spacing.two,
    backgroundColor: Colors.dark.backgroundElement, borderBottomWidth: 1, borderBottomColor: Colors.dark.backgroundSelected,
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { flex: 1, color: '#fff', fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
  infoBox: { padding: Spacing.four, alignItems: 'center', gap: 4, borderBottomWidth: 1, borderBottomColor: '#1f2937', marginBottom: Spacing.four },
  movieTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
  infoText: { color: Colors.dark.textSecondary, fontSize: 14 },
  
  bottomBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: Spacing.four, backgroundColor: Colors.dark.backgroundElement,
    borderTopWidth: 1, borderTopColor: Colors.dark.backgroundSelected,
  },
  summaryInfo: { flex: 1, marginRight: Spacing.three },
  summaryLabel: { color: Colors.dark.textSecondary, fontSize: 12, marginBottom: 2 },
  seatsList: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  checkoutBtn: { backgroundColor: Colors.dark.buttonPrimary, paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8 },
  checkoutBtnDisabled: { backgroundColor: '#374151' },
  checkoutBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
