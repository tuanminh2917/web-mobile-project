import { BackIcon } from '@/components/icon';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const MOCK_INPUTS = {
  movie: {
    title: 'LEVITICUS: BÓNG QUỶ - T18',
    duration: '85 phút',
    ageRating: 'T18',
  },
  roomName: 'Phòng số 1 (Phòng siêu lớn)',
  startTime: '18:25 | 03/07/2026',

  rows: 10,
  seatsPerRow: 15,   // Tiêu chuẩn các hàng bình thường là 15 ghế
  maxSelectable: 8,

  occupiedSeats: [
    { row: 'A', number: 4 },
    { row: 'B', number: 12 },
    { row: 'E', number: 7 },
    { row: 'F', number: 8 },
  ],

  prices: {
    regular: 50000,
    vip: 65000,
    couple: 130000,
  }
};

const ROW_LABELS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const SCROLLBAR_TRACK_WIDTH = 150;

export default function SeatSelectionScreen() {
  const [selectedSeats, setSelectedSeats] = useState<Map<string, any>>(new Map());

  const [scrollX, setScrollX] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  // Thuật toán phân loại loại ghế
  const getSeatType = (rowIdx: number) => {
    const maxRows = MOCK_INPUTS.rows;
    const lastRow = maxRows - 1;
    const midStart = Math.floor(maxRows * 0.4);
    const midEnd = Math.floor(maxRows * 0.7);

    if (rowIdx === lastRow) return 'couple'; // Hàng cuối là ghế đôi
    if (rowIdx >= midStart && rowIdx < midEnd) return 'vip';
    return 'regular';
  };

  const isOccupied = (rowLabel: string, seatNum: number) => {
    return MOCK_INPUTS.occupiedSeats.some(
      (s) => s.row === rowLabel && s.number === seatNum
    );
  };

  const handleSeatPress = (rowLabel: string, seatNum: number, type: string, price: number) => {
    const key = `${rowLabel}${seatNum}`;
    const newSelected = new Map(selectedSeats);

    if (newSelected.has(key)) {
      newSelected.delete(key);
    } else {
      if (newSelected.size >= MOCK_INPUTS.maxSelectable) {
        alert(`Bạn chỉ có thể chọn tối đa ${MOCK_INPUTS.maxSelectable} ghế.`);
        return;
      }
      newSelected.set(key, { row: rowLabel, number: seatNum, type, price });
    }
    setSelectedSeats(newSelected);
  };

  const calculateTotal = () => {
    return Array.from(selectedSeats.values()).reduce((sum, seat) => sum + seat.price, 0);
  };

  // Tính toán thanh cuộn tự chế
  const maxScrollableWidth = contentWidth - containerWidth;
  const thumbWidth = contentWidth > 0
    ? Math.max(30, (containerWidth / contentWidth) * SCROLLBAR_TRACK_WIDTH)
    : 40;
  const thumbLeft = maxScrollableWidth > 0
    ? (scrollX / maxScrollableWidth) * (SCROLLBAR_TRACK_WIDTH - thumbWidth)
    : 0;

  // Tiến trình tạo ma trận phòng chiếu
  const renderRows = [];
  for (let r = 0; r < MOCK_INPUTS.rows; r++) {
    const rowLabel = ROW_LABELS[r];
    const type = getSeatType(r);
    const isCoupleRow = type === 'couple';

    // ĐIỀU CHỈNH: Nếu là hàng ghế đôi thì chỉ chạy vòng lặp tới 7, ngược lại chạy hết 15
    const totalSeatsInThisRow = isCoupleRow ? 7 : MOCK_INPUTS.seatsPerRow;
    const seatsInRow = [];
    // const isSmallRow = r >= MOCK_INPUTS.rows - 2;
    const isSmallRow = false;

    for (let s = 1; s <= totalSeatsInThisRow; s++) {
      const occupied = isOccupied(rowLabel, s);
      const key = `${rowLabel}${s}`;
      const isSelected = selectedSeats.has(key);
      const price = MOCK_INPUTS.prices[type as keyof typeof MOCK_INPUTS.prices];

      seatsInRow.push(
        <Pressable
          key={key}
          disabled={occupied}
          onPress={() => handleSeatPress(rowLabel, s, type, price)}
          style={({ pressed }) => [
            styles.seatBase,
            isSmallRow && styles.seatBaseSmall,
            type === 'regular' && styles.seatRegular,
            type === 'vip' && styles.seatVip,
            type === 'couple' && styles.seatCouple,
            isSelected && styles.seatSelected,
            occupied && styles.seatOccupied,
            pressed && !occupied && { opacity: 0.7 }
          ]}
        >
          <Text style={[
            styles.seatText,
            isSmallRow && styles.seatTextSmall,
            isSelected && { color: '#4caf50' },
            occupied && { color: '#7a221a' }
          ]}>
            {s}
          </Text>
        </Pressable>
      );
    }

    renderRows.push(
      <View key={rowLabel} style={styles.seatRow}>
        {/* Nhãn bên trái cố định đứng thẳng hàng */}
        <Text style={styles.rowLabel}>{rowLabel}</Text>

        {/* Hộp chứa lõi ghế: Giúp tự động gom và căn giữa bất kể hàng có 15 hay 7 ghế */}
        <View style={styles.seatsContainerInRow}>
          {seatsInRow}
        </View>

        {/* Nhãn bên phải cố định đứng thẳng hàng */}
        <Text style={styles.rowLabelRight}>{rowLabel}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Pressable style={styles.backButton}>
        <BackIcon />
      </Pressable>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* TIẾN TRÌNH ĐẶT VÉ */}
        <View style={styles.bookingSteps}>
          <Text style={[styles.step, styles.stepDone]}>1. Chọn phim</Text>
          <Text style={styles.stepArrow}>›</Text>
          <Text style={[styles.step, styles.stepActive]}>2. Chọn ghế</Text>
          <Text style={styles.stepArrow}>›</Text>
          <Text style={styles.step}>3. Thanh toán</Text>
        </View>

        {/* THÔNG TIN PHIM */}
        <Text style={styles.mainTitle}>Chọn ghế ngồi</Text>
        <Text style={styles.subtitle}>
          {MOCK_INPUTS.movie.title}  •  {MOCK_INPUTS.roomName}  •  {MOCK_INPUTS.startTime}
        </Text>

        {/* MÀN HÌNH MÔ PHỎNG */}
        <View style={styles.screenIndicator}>
          <View style={styles.screenLine} />
          <Text style={styles.screenText}>MÀN HÌNH CHÍNH</Text>
        </View>

        {/* KHU VỰC SƠ ĐỒ GHẾ CĂN GIỮA KHUNG HÌNH */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={(event) => setScrollX(event.nativeEvent.contentOffset.x)}
          onContentSizeChange={(w) => setContentWidth(w)}
          onLayout={(event) => setContainerWidth(event.nativeEvent.layout.width)}
          contentContainerStyle={styles.horizontalGridContainer} // Căn giữa toàn bộ rạp khi màn hình rộng
        >
          <View style={styles.seatMapGrid}>
            {renderRows}
          </View>
        </ScrollView>

        {/* THANH CUỘN NGANG ĐỊNH HƯỚNG UX */}
        {contentWidth > containerWidth && (
          <View style={styles.customScrollbarWrapper}>
            <Text style={styles.scrollHintText}>Vuốt ngang xem thêm</Text>
            <View style={styles.scrollbarTrack}>
              <View style={[styles.scrollbarThumb, { width: thumbWidth, left: thumbLeft }]} />
            </View>
          </View>
        )}

        {/* CHÚ THÍCH PHÂN LOẠI GHẾ */}
        <View style={styles.legendContainer}>
          <View style={styles.legendItem}><View style={[styles.legendBox, styles.seatRegular]} /><Text style={styles.legendText}>Ghế thường</Text></View>
          <View style={styles.legendItem}><View style={[styles.legendBox, styles.seatVip]} /><Text style={styles.legendText}>VIP</Text></View>
          <View style={styles.legendItem}><View style={[styles.legendBox, styles.seatCouple]} /><Text style={styles.legendText}>Ghế đôi</Text></View>
          <View style={styles.legendItem}><View style={[styles.legendBox, styles.seatSelected]} /><Text style={styles.legendText}>Đang chọn</Text></View>
          <View style={styles.legendItem}><View style={[styles.legendBox, styles.seatOccupied]} /><Text style={styles.legendText}>Đã bán</Text></View>
        </View>

        {/* KHỐI TỔNG HỢP DANH SÁCH GHẾ ĐÃ CHỌN */}
        <View style={styles.seatSummaryCard}>
          <Text style={styles.summaryHeading}>Ghế đã chọn ({selectedSeats.size})</Text>
          {selectedSeats.size === 0 ? (
            <Text style={styles.noSelectionText}>Chưa chọn ghế nào</Text>
          ) : (
            <View style={styles.selectedBadgeList}>
              {Array.from(selectedSeats.values()).map((s) => (
                <View key={`${s.row}${s.number}`} style={styles.selectedSeatBadge}>
                  <Text style={styles.badgeText}>{`${s.row}${s.number}`}</Text>
                </View>
              ))}
            </View>
          )}

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tổng cộng</Text>
            <Text style={styles.totalAmount}>{calculateTotal().toLocaleString('vi-VN')}đ</Text>
          </View>
        </View>

      </ScrollView>

      {/* FOOTER NÚT THANH TOÁN */}
      <View style={styles.footerContainer}>
        <Pressable
          disabled={selectedSeats.size === 0}
          style={[styles.payButton, selectedSeats.size === 0 && styles.payButtonDisabled]}
          onPress={() => alert(`Đơn hàng: ${calculateTotal().toLocaleString('vi-VN')}đ`)}
        >
          <Text style={styles.payButtonText}>
            {selectedSeats.size > 0
              ? `Tiến hành thanh toán — ${calculateTotal().toLocaleString('vi-VN')}đ`
              : 'Tiến hành thanh toán'
            }
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

// ==========================================
// CẬP NHẬT HỆ THỐNG STYLES CĂN GIỮA TUYỆT ĐỐI
// ==========================================
const SEAT_BASE_WIDTH = 30;
const SEAT_COUPLE_WIDTH = SEAT_BASE_WIDTH * 2;

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
  container: {
    flex: 1,
    backgroundColor: '#05070a',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 110,
  },
  bookingSteps: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 20,
  },
  step: {
    fontSize: 11,
    color: '#64748b',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  stepActive: {
    color: '#f97316',
    borderColor: '#f97316',
    fontWeight: '600',
  },
  stepDone: {
    color: '#4caf50',
    borderColor: '#4caf50',
  },
  stepArrow: {
    color: '#64748b',
    fontSize: 14,
  },
  mainTitle: {
    color: '#e2e8f0',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    color: '#64748b',
    fontSize: 12,
    marginBottom: 24,
  },
  screenIndicator: {
    alignItems: 'center',
    marginBottom: 24,
  },
  screenLine: {
    height: 4,
    width: '80%',
    borderRadius: 2,
    backgroundColor: '#2563eb',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.7,
    shadowRadius: 6,
    elevation: 5,
  },
  screenText: {
    marginTop: 6,
    color: '#64748b',
    fontSize: 10,
    letterSpacing: 4,
  },

  // 1. Cải tiến container cuộn ngang: Đảm bảo căn giữa rạp phim khi màn hình siêu rộng (như Tablet)
  horizontalGridContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  seatMapGrid: {
    flexDirection: 'column',
    gap: 8,
    marginBottom: 10,
  },

  // 2. Cấu trúc hàng ghế mới co giãn linh hoạt theo chiều ngang
  seatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  // 3. Hộp chứa phụ bọc quanh danh sách các ghế trong hàng để thực hiện nhiệm vụ căn giữa
  seatsContainerInRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6, // Đồng bộ khoảng cách giữa các ghế
    flex: 1, // Chiếm trọn không gian trống ở giữa để đẩy 2 nhãn chữ cái ra biên sát lề đường thẳng tắp
  },

  rowLabel: {
    width: 24,
    textAlign: 'left',
    color: '#64748b',
    fontSize: 13,
    fontWeight: 'bold',
  },
  rowLabelRight: {
    width: 24,
    textAlign: 'right',
    color: '#64748b',
    fontSize: 13,
    fontWeight: 'bold',
  },
  seatBase: {
    width: SEAT_BASE_WIDTH,
    height: 30,
    borderRadius: 5,
    borderWidth: 1.5,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  seatBaseSmall: {
    width: 26,
    height: 26,
    borderRadius: 4,
  },
  seatText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
  },
  seatTextSmall: {
    fontSize: 9,
  },
  seatRegular: { borderColor: '#444444' },
  seatVip: {
    borderColor: '#f97316',
    backgroundColor: 'rgba(249, 115, 22, 0.05)',
  },
  seatCouple: {
    borderColor: '#e91e63',
    backgroundColor: 'rgba(233, 30, 99, 0.05)',
    width: SEAT_COUPLE_WIDTH, // Ghế đôi rộng hơn ghế đơn (2 lần width của seatBase)
  },
  seatSelected: {
    borderColor: '#4caf50',
    backgroundColor: 'rgba(76, 175, 80, 0.25)',
  },
  seatOccupied: {
    borderColor: '#2563eb',
    backgroundColor: 'rgba(37, 99, 235, 0.15)',
    opacity: 0.35,
  },
  customScrollbarWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
    gap: 6,
  },
  scrollHintText: {
    color: '#475569',
    fontSize: 11,
    fontStyle: 'italic',
  },
  scrollbarTrack: {
    width: SCROLLBAR_TRACK_WIDTH,
    height: 4,
    backgroundColor: '#1e293b',
    borderRadius: 2,
    position: 'relative',
  },
  scrollbarThumb: {
    height: 4,
    backgroundColor: '#64748b',
    borderRadius: 2,
    position: 'absolute',
    top: 0,
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 24,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendBox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
  },
  legendText: {
    color: '#64748b',
    fontSize: 12,
  },
  seatSummaryCard: {
    backgroundColor: '#0f172a',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  summaryHeading: {
    color: '#e2e8f0',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  noSelectionText: {
    color: '#64748b',
    fontSize: 13,
    marginBottom: 12,
  },
  selectedBadgeList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 14,
  },
  selectedSeatBadge: {
    backgroundColor: 'rgba(76, 175, 80, 0.12)',
    borderColor: '#4caf50',
    borderWidth: 1,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  badgeText: {
    color: '#4caf50',
    fontSize: 12,
    fontWeight: 'bold',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
  },
  totalLabel: {
    color: '#e2e8f0',
    fontSize: 14,
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f97316',
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#05070a',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
  },
  payButton: {
    backgroundColor: '#f97316',
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payButtonDisabled: {
    backgroundColor: '#1e293b',
    opacity: 0.5,
  },
  payButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});