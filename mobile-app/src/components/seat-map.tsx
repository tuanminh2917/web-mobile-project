import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SeatMapConfig, SeatInfo, OccupiedSeat, SeatType } from '@/types';
import { Colors } from '@/constants/theme';

interface SeatMapProps {
  config: SeatMapConfig;
  selectedSeats: SeatInfo[];
  onSelect: (seat: SeatInfo) => void;
  onDeselect: (seat: SeatInfo) => void;
}

const ROW_LABELS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export default function SeatMap({ config, selectedSeats, onSelect, onDeselect }: SeatMapProps) {
  
  // Kiểm tra ghế đã bán
  const isOccupied = (rowLabel: string, seatNum: number) => {
    return config.occupiedSeats.some(s => s.row === rowLabel && s.number === seatNum);
  };

  // Xác định loại ghế (logic như bên js)
  const getSeatType = (rowIdx: number, seatNum: number, rowLabel: string): SeatType => {
    const cacheKey = `${rowLabel}-${seatNum}`;
    if (config.seatTypes && config.seatTypes[cacheKey]) {
      return config.seatTypes[cacheKey];
    }
    const lastRow = config.rows - 1;
    const midStart = Math.floor(config.rows * 0.4);
    const midEnd = Math.floor(config.rows * 0.7);

    if (rowIdx === lastRow) return 'couple';
    if (rowIdx >= midStart && rowIdx < midEnd) return 'vip';
    return 'regular';
  };

  const getPrice = (type: SeatType) => {
    switch(type) {
      case 'vip': return config.vipPrice;
      case 'couple': return config.couplePrice;
      default: return config.regularPrice;
    }
  };

  const getSeatColor = (type: SeatType, isSelected: boolean, occupied: boolean) => {
    if (occupied) return '#374151'; // Xám tối
    if (isSelected) return Colors.dark.buttonPrimary;
    switch(type) {
      case 'vip': return '#f59e0b'; // Vàng
      case 'couple': return '#ec4899'; // Hồng
      default: return '#3b82f6'; // Xanh dương
    }
  };

  const handlePress = (seat: SeatInfo, occupied: boolean, isSelected: boolean) => {
    if (occupied) return;
    if (isSelected) {
      onDeselect(seat);
    } else {
      if (selectedSeats.length >= (config.maxSelectable || 8)) {
        alert(`Bạn chỉ có thể chọn tối đa ${config.maxSelectable || 8} ghế.`);
        return;
      }
      onSelect(seat);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.screenIndicator}>
        <View style={styles.screenLine} />
        <Text style={styles.screenText}>MÀN HÌNH</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollArea}>
        <View style={styles.mapGrid}>
          {Array.from({ length: config.rows }).map((_, rIdx) => {
            const rowLabel = ROW_LABELS[rIdx];
            return (
              <View key={rowLabel} style={styles.row}>
                <Text style={styles.rowLabel}>{rowLabel}</Text>
                {Array.from({ length: config.seatsPerRow }).map((_, sIdx) => {
                  const num = sIdx + 1;
                  const type = getSeatType(rIdx, num, rowLabel);
                  const occupied = isOccupied(rowLabel, num);
                  const isSelected = selectedSeats.some(s => s.row === rowLabel && s.number === num);
                  const seatInfo: SeatInfo = { row: rowLabel, number: num, type, price: getPrice(type) };
                  const isCouple = type === 'couple';

                  return (
                    <Pressable
                      key={`${rowLabel}-${num}`}
                      style={[
                        styles.seat,
                        { backgroundColor: getSeatColor(type, isSelected, occupied) },
                        isCouple && styles.seatCouple
                      ]}
                      onPress={() => handlePress(seatInfo, occupied, isSelected)}
                    >
                      <Text style={[styles.seatText, occupied && {color: '#9ca3af'}]}>
                        {num}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.legend}>
        <LegendItem color="#3b82f6" label="Thường" />
        <LegendItem color="#f59e0b" label="VIP" />
        <LegendItem color="#ec4899" label="Ghế đôi" />
        <LegendItem color={Colors.dark.buttonPrimary} label="Đang chọn" />
        <LegendItem color="#374151" label="Đã bán" />
      </View>
    </View>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendBox, { backgroundColor: color }]} />
      <Text style={styles.legendLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center' },
  screenIndicator: { width: '80%', alignItems: 'center', marginBottom: 20 },
  screenLine: { width: '100%', height: 4, backgroundColor: Colors.dark.buttonPrimary, borderRadius: 2, shadowColor: Colors.dark.buttonPrimary, shadowOpacity: 0.8, shadowRadius: 10, elevation: 5 },
  screenText: { color: '#9ca3af', fontSize: 10, fontWeight: 'bold', marginTop: 8, letterSpacing: 2 },
  scrollArea: { paddingHorizontal: 16, paddingBottom: 20 },
  mapGrid: { gap: 10 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  rowLabel: { width: 20, color: '#9ca3af', fontWeight: 'bold', fontSize: 12, textAlign: 'center' },
  seat: { width: 30, height: 30, borderRadius: 6, justifyContent: 'center', alignItems: 'center' },
  seatCouple: { width: 68 }, // Rộng gấp đôi
  seatText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  legend: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12, marginTop: 10 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendBox: { width: 14, height: 14, borderRadius: 3 },
  legendLabel: { color: '#9ca3af', fontSize: 12 },
});
