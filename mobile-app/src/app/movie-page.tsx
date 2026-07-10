import { BackIcon } from '@/components/icon';
import { useState } from 'react';
import { Dimensions, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '@/constants/theme';

const { width } = Dimensions.get('window');
const POSTER_WIDTH = width * 0.65;

export default function MoviePage() {
    const [selectedRating, setSelectedRating] = useState(0);
    const [commentText, setCommentText] = useState('');

    return (
        <SafeAreaView style={styles.container}>
            <Pressable style={styles.backButton}>
                <BackIcon />
            </Pressable>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                {/* Khu vực ảnh Poster & Nút Đặt Vé */}
                <View style={styles.posterSection}>
                    <View style={styles.imageShadow}>
                        <Image
                            style={styles.poster}
                            source={{ uri: 'https://via.placeholder.com/300x450' }}
                        />
                    </View>
                    <Pressable style={({ pressed }) => [styles.bookingBtn, pressed && styles.btnPressed]}>
                        <Text style={styles.bookingBtnText}>Đặt vé ngay</Text>
                    </Pressable>
                </View>

                {/* Khu vực thông tin chi tiết phim */}
                <View style={styles.movieInfoContainer}>
                    <Text style={styles.movieTitle}>Titanic</Text>

                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Đạo diễn:</Text>
                        <Text style={styles.infoValue}>James Cameron</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Diễn viên:</Text>
                        <Text style={styles.infoValue}>Leonardo DiCaprio, Kate Winslet</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Thể loại:</Text>
                        <Text style={styles.infoValue}>Romance, Drama</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Thời lượng:</Text>
                        <Text style={styles.infoValue}>194 phút</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Quốc gia:</Text>
                        <Text style={styles.infoValue}>Hoa Kỳ</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Khởi chiếu:</Text>
                        <Text style={styles.infoValue}>19/12/1997</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Kiểm duyệt:</Text>
                        <View style={styles.ageTag}>
                            <Text style={styles.ageTagText}>T16</Text>
                        </View>
                    </View>

                    <View style={styles.synopsisContainer}>
                        <Text style={styles.synopsisTitle}>Nội dung phim</Text>
                        <Text style={styles.synopsisContent}>
                            Một câu chuyện tình yêu bi thương giữa hai người từ các tầng lớp xã hội khác nhau trên chuyến hải trình định mệnh của con tàu Titanic vĩ đại.
                        </Text>
                    </View>
                </View>

                {/* KHU VỰC ĐÁNH GIÁ & BÌNH LUẬN (ĐÃ TỐI ƯU HÓA) */}
                <View style={styles.commentsSection}>
                    <Text style={styles.commentsTitle}>Đánh giá & Bình luận</Text>

                    {/* FORM GỬI BÌNH LUẬN CAO CẤP */}
                    <View style={styles.commentForm}>
                        <Text style={styles.commentFormTitle}>Trải nghiệm của bạn thế nào?</Text>

                        {/* Chọn sao */}
                        <View style={styles.ratingStarsContainer}>
                            {[1, 2, 3, 4, 5].map((value) => (
                                <Pressable
                                    key={value}
                                    style={styles.starButton}
                                    onPress={() => setSelectedRating(value)}
                                    accessibilityRole="radio"
                                    accessibilityState={{ selected: selectedRating === value }}
                                >
                                    <Text style={[styles.star, selectedRating >= value ? styles.starActive : styles.starInactive]}>
                                        ★
                                    </Text>
                                </Pressable>
                            ))}
                            {selectedRating > 0 && (
                                <Text style={styles.ratingStatusText}>{selectedRating}/5 Điểm</Text>
                            )}
                        </View>

                        {/* Ô nhập liệu tích hợp nút Gửi */}
                        <View style={styles.inputWrapper}>
                            <TextInput
                                style={styles.commentFormTextInput}
                                placeholder="Chia sẻ cảm nghĩ của bạn về phim..."
                                placeholderTextColor="#64748b"
                                value={commentText}
                                onChangeText={setCommentText}
                            />
                            <Pressable
                                style={({ pressed }) => [
                                    styles.sendButton,
                                    (!commentText.trim() || selectedRating === 0) && styles.sendButtonDisabled,
                                    pressed && styles.btnPressed
                                ]}
                                disabled={!commentText.trim() || selectedRating === 0}
                            >
                                <Text style={styles.sendButtonText}>Gửi</Text>
                            </Pressable>
                        </View>
                    </View>

                    {/* DANH SÁCH BÌNH LUẬN MẪU TINH TẾ */}
                    <View style={styles.commentsList}>
                        <Comment user="Nguyen Van" content="Phim hay quá" s={4} />
                        <Comment user="Tran Thi" content="Không ấn tượng" s={3} />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

function Comment({ user, content, s }: { user: string; content: string; s: number }) {
    return (
        <View style={styles.commentCard}>
            <View style={styles.commentHeader}>
                <View style={styles.commentUserGroup}>
                    <View style={styles.userAvatar}>
                        <Text style={styles.avatarText}>{handleName(user)}</Text>
                    </View>
                    <View>
                        <Text style={styles.commentAuthor}>{user}</Text>
                        {/* Hiển thị số sao của comment này */}
                        <View style={styles.ratingStarsRow}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Text
                                    key={star}
                                    style={[
                                        styles.miniStar,
                                        star <= s ? styles.starActive : styles.starInactive,
                                    ]}
                                >
                                    ★
                                </Text>
                            ))}
                        </View>
                    </View>
                </View>
            </View>
            <Text style={styles.commentContent}>{content}</Text>
        </View>
    );
}

// Hàm xử lý chuỗi: lấy chữ cái đầu tiên của các từ (cách nhau bởi khoảng trắng), chuyển thành chữ hoa và concatenate
function handleName(name: string) {
    return name
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .map((word) => word[0].toUpperCase())
        .join('');
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
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        backgroundColor: Colors.dark.background,
    },
    scrollView: {
        flex: 1,
    },
    contentContainer: {
        paddingBottom: 40,
    },
    posterSection: {
        alignItems: 'center',
        paddingVertical: 24,
    },
    imageShadow: {
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
        backgroundColor: '#1e293b',
        marginBottom: 20,
    },
    poster: {
        width: POSTER_WIDTH,
        aspectRatio: 2 / 3,
        borderRadius: 16,
        resizeMode: 'cover',
    },
    bookingBtn: {
        backgroundColor: '#ef4444',
        width: POSTER_WIDTH,
        height: 46,
        borderRadius: 23,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnPressed: {
        opacity: 0.8,
    },
    bookingBtnText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    movieInfoContainer: {
        backgroundColor: Colors.dark.backgroundElement || '#1e293b',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        marginHorizontal: 16,
    },
    movieTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 20,
    },
    infoRow: {
        flexDirection: 'row',
        marginBottom: 12,
        alignItems: 'flex-start',
    },
    infoLabel: {
        color: '#94a3b8',
        width: 110,
        fontSize: 14,
        fontWeight: '500',
    },
    infoValue: {
        color: '#f8fafc',
        flex: 1,
        fontSize: 14,
        lineHeight: 20,
    },
    ageTag: {
        backgroundColor: '#eab308',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    ageTagText: {
        color: '#000000',
        fontWeight: 'bold',
        fontSize: 12,
    },
    synopsisContainer: {
        marginTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#334155',
        paddingTop: 20,
    },
    synopsisTitle: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    synopsisContent: {
        color: '#cbd5e1',
        fontSize: 14,
        lineHeight: 22,
    },

    /* --- PHẦN COMMENT ĐÃ TỐI ƯU --- */
    commentsSection: {
        marginTop: 24,
        paddingHorizontal: 24,
    },
    commentsTitle: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    commentForm: {
        backgroundColor: '#1e293b',
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#334155',
    },
    commentFormTitle: {
        color: '#f8fafc',
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 10,
    },
    ratingStarsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 14,
    },
    starButton: {
        marginRight: 6,
    },
    star: {
        fontSize: 26, // Tăng kích thước sao để dễ bấm chọn hơn
    },
    starActive: {
        color: '#eab308', // Màu vàng rực rỡ khi chọn
    },
    starInactive: {
        color: '#475569', // Màu xám tối khi chưa chọn
    },
    ratingStatusText: {
        color: '#eab308',
        fontSize: 13,
        fontWeight: '600',
        marginLeft: 10,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#0f172a',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#334155',
        paddingRight: 8,
    },
    commentFormTextInput: {
        flex: 1,
        color: '#f8fafc',
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 14,
    },
    sendButton: {
        backgroundColor: '#3b82f6',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    sendButtonDisabled: {
        backgroundColor: '#1e293b',
        opacity: 0.5,
    },
    sendButtonText: {
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    commentsList: {
        gap: 16,
    },
    commentCard: {
        backgroundColor: '#111827',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#1f2937',
    },
    commentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    commentUserGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    userAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#3b82f6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    commentAuthor: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '600',
    },
    ratingStarsRow: {
        flexDirection: 'row',
        marginTop: 2,
    },
    miniStar: {
        fontSize: 12,
        marginRight: 1,
    },
    commentTime: {
        color: '#64748b',
        fontSize: 12,
    },
    commentContent: {
        color: '#cbd5e1',
        fontSize: 14,
        lineHeight: 22,
    },
});