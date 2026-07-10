import { BackIcon } from '@/components/icon';
import { Colors } from '@/constants/theme';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PaymentScreen() {
    return (
        <SafeAreaView style={styles.safeArea}>
            <Pressable style={styles.backButton}>
                <BackIcon />
            </Pressable>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* KHỐI 1: THÔNG TIN VÉ & CHI TIẾT PHÍM CHIẾU */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Thông tin vé đã chọn</Text>

                    {/* Thông tin Phim & Độ tuổi */}
                    <View style={styles.movieHeaderRow}>
                        <View style={styles.ageBadge}>
                            <Text style={styles.ageBadgeText}>T18</Text>
                        </View>
                        <Text style={styles.movieTitle} numberOfLines={2}>
                            LEVITICUS: BÓNG QUỶ
                        </Text>
                    </View>

                    {/* Chi tiết phòng và giờ chiếu */}
                    <View style={styles.infoGrid}>
                        <View style={styles.row}>
                            <Text style={styles.rowLabel}>Phòng chiếu</Text>
                            <Text style={styles.rowValue}>Phòng số 1 (Siêu lớn)</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.rowLabel}>Giờ chiếu</Text>
                            <Text style={styles.rowValueHighlight}>18:25 | 03/07/2026</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    {/* Chi tiết danh sách ghế */}
                    <View style={styles.row}>
                        <Text style={styles.rowLabel}>Ghế thường</Text>
                        <Text style={styles.rowValue}>A1, A2 (2)</Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.rowLabel}>Ghế VIP</Text>
                        <Text style={styles.rowValue}>E1, E2 (2)</Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.rowLabel}>Ghế Đôi</Text>
                        <Text style={styles.rowValue}>I3 (1)</Text>
                    </View>

                    <View style={styles.divider} />

                    {/* Tổng tiền tổng kết hóa đơn */}
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Tổng tiền vé</Text>
                        <Text style={styles.totalValue}>500.000đ</Text>
                    </View>
                </View>

                {/* KHỐI 2: THÔNG TIN CHUYỂN KHOẢN & QR CODE */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Quét mã QR để thanh toán</Text>

                    {/* QR Code Container */}
                    <View style={styles.qrContainer}>
                        <Image
                            source={{ uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/QR_code_example.svg/800px-QR_code_example.svg.png" }}
                            style={styles.qr}
                        />
                    </View>

                    {/* Thông tin tài khoản ngân hàng */}
                    <View style={styles.bankInfoContainer}>
                        <Text style={styles.bankName}>Ngân hàng Techcombank</Text>
                        <Text style={styles.bankAccount}>
                            Số tài khoản: <Text style={styles.accountNumber}>19037628423018</Text>
                        </Text>
                    </View>

                    <View style={styles.divider} />

                    {/* BỔ SUNG: Số tiền và Nội dung chuyển khoản bắt buộc */}
                    <View style={styles.transferDetailBox}>
                        <View style={styles.transferRow}>
                            <Text style={styles.transferLabel}>Số tiền cần chuyển</Text>
                            <Text style={styles.transferValueAmount}>500.000đ</Text>
                        </View>

                        <View style={styles.transferRow}>
                            <Text style={styles.transferLabel}>Nội dung chuyển khoản</Text>
                            <Text style={styles.transferValueContent}>CINEMA 762842</Text>
                        </View>
                        <Text style={styles.transferWarning}>
                            *Vui lòng nhập chính xác nội dung để vé được duyệt tự động
                        </Text>
                    </View>
                </View>

                {/* NÚT BẤM XÁC NHẬN THANH TOÁN */}
                <Pressable
                    style={({ pressed }) => [
                        styles.button,
                        pressed && styles.buttonPressed
                    ]}
                >
                    <Text style={styles.buttonText}>Xác nhận đã chuyển khoản</Text>
                </Pressable>

            </ScrollView>
        </SafeAreaView>
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
        backgroundColor: Colors.dark.background,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 32,
    },
    section: {
        backgroundColor: Colors.dark.backgroundElement,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Colors.dark.border,
        padding: 16,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#e2e8f0',
        marginBottom: 16,
    },
    // --- KHỐI THÔNG TIN PHIM MỚI ---
    movieHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 14,
    },
    ageBadge: {
        backgroundColor: '#ef4444', // Màu đỏ cảnh báo giới hạn tuổi
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 4,
    },
    ageBadgeText: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    movieTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#f8fafc',
        flex: 1,
    },
    infoGrid: {
        gap: 8,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    rowLabel: {
        fontSize: 14,
        color: '#94a3b8',
    },
    rowValue: {
        fontSize: 14,
        color: '#f8fafc',
        fontWeight: '500',
    },
    rowValueHighlight: {
        fontSize: 14,
        color: '#f97316', // Làm nổi bật giờ chiếu
        fontWeight: '600',
    },
    divider: {
        height: 1,
        backgroundColor: Colors.dark.border,
        marginVertical: 14,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    totalLabel: {
        fontSize: 15,
        fontWeight: '600',
        color: '#e2e8f0',
    },
    totalValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#22c55e', // Màu xanh lá cây biểu thị số tiền thanh toán hóa đơn thành công
    },
    qrContainer: {
        backgroundColor: '#ffffff',
        padding: 12,
        borderRadius: 12,
        alignSelf: 'center',
        marginTop: 4,
        marginBottom: 16,
    },
    qr: {
        width: 180,
        height: 180,
    },
    bankInfoContainer: {
        alignItems: 'center',
        gap: 4,
        marginBottom: 4,
    },
    bankName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#f8fafc',
    },
    bankAccount: {
        fontSize: 14,
        color: '#94a3b8',
    },
    accountNumber: {
        color: '#e2e8f0',
        fontWeight: 'bold',
    },
    // --- KHỐI CHI TIẾT GIAO DỊCH BỔ SUNG ---
    transferDetailBox: {
        backgroundColor: 'rgba(30, 41, 59, 0.5)', // Khung nền xám tối tách biệt thông tin cốt lõi
        borderRadius: 10,
        padding: 12,
        gap: 10,
    },
    transferRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    transferLabel: {
        fontSize: 13,
        color: '#94a3b8',
    },
    transferValueAmount: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#f97316', // Màu cam đồng bộ tổng tiền
    },
    transferValueContent: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#38bdf8', // Màu xanh dương Cyan dễ nhìn, giả lập text có thể copy
        fontFamily: 'Arial', // Định dạng font chữ mã code chuyên nghiệp
    },
    transferWarning: {
        fontSize: 11,
        color: '#94a3b8',
        fontStyle: 'italic',
        textAlign: 'center',
        marginTop: 4,
    },
    button: {
        backgroundColor: Colors.dark.buttonPrimary,
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
        marginTop: 8,
        shadowColor: Colors.dark.buttonPrimary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 3,
    },
    buttonPressed: {
        opacity: 0.85,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});