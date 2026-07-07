import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors, MaxContentWidth, Spacing } from '@/constants/theme';

export default function AccountScreen() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Nút giả lập trạng thái - Đẩy lên trên cùng tách biệt */}
      <Pressable style={styles.devBtn} onPress={() => setIsLoggedIn(!isLoggedIn)}>
        <Text style={styles.devBtnText}>
          {isLoggedIn ? '🔄 Giả lập: Đăng xuất' : '🔄 Giả lập: Đăng nhập'}
        </Text>
      </Pressable>

      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. TRẠNG THÁI CHƯA ĐĂNG NHẬP */}
        {!isLoggedIn && (
          <View style={styles.authForm}>
            <Text style={styles.authTitle}>Chào mừng trở lại</Text>
            <Text style={styles.authSubtitle}>Đăng nhập để quản lý vé và nhận ưu đãi</Text>

            <TextInput 
              style={styles.input} 
              placeholder="Tên đăng nhập" 
              placeholderTextColor="#64748b"
            />
            <TextInput 
              style={styles.input} 
              placeholder="Mật khẩu" 
              placeholderTextColor="#64748b"
              secureTextEntry 
            />

            <Pressable style={styles.buttonPrimary} onPress={() => setIsLoggedIn(true)}>
              <Text style={styles.buttonTextPrimary}>Đăng nhập</Text>
            </Pressable>

            <Pressable style={styles.buttonSecondary} onPress={() => { /* Logic Đăng ký */ }}>
              <Text style={styles.buttonTextSecondary}>Tạo tài khoản mới</Text>
            </Pressable>
          </View>
        )}

        {/* 2. TRẠNG THÁI ĐÃ ĐĂNG NHẬP */}
        {isLoggedIn && (
          <View style={styles.profileContainer}>
            {/* Khu vực thông tin cá nhân */}
            <View style={styles.profileHeader}>
              <View style={styles.avatar}>
                {/* Chữ cái đầu của User làm Avatar tạm thời */}
                <Text style={styles.avatarText}>U</Text>
              </View>
              <Text style={styles.welcomeText}>Xin chào, Nguyễn Văn A</Text>
              <Text style={styles.userEmail}>user.demo@gmail.com</Text>

              <Pressable style={styles.logoutBtn} onPress={() => setIsLoggedIn(false)}>
                <Text style={styles.logoutBtnText}>Đăng xuất</Text>
              </Pressable>
            </View>

            {/* Khu vực vé đã mua */}
            <View style={styles.ticketSection}>
              <Text style={styles.ticketSectionTitle}>Vé của tôi</Text>
              <TicketInfo ticketNumber="TCK-123456" movieTitle="LEVITICUS: BÓNG QUỶ (2D)" showTime="20:00 • 03/07/2026" />
              <TicketInfo ticketNumber="TCK-987654" movieTitle="AVATAR 3 (3D)" showTime="14:30 • 15/08/2026" />
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function TicketInfo({ ticketNumber, movieTitle, showTime }: { ticketNumber: string; movieTitle: string; showTime: string }) {
  return (
    <View style={styles.ticketCard}>
      <View style={styles.ticketHeader}>
        <Text style={styles.ticketMovieTitle}>{movieTitle}</Text>
        <View style={styles.statusTag}><Text style={styles.statusText}>Sắp diễn ra</Text></View>
      </View>
      <View style={styles.ticketDivider} />
      <View style={styles.ticketDetails}>
        <Text style={styles.ticketMeta}>Mã vé: <Text style={styles.whiteText}>{ticketNumber}</Text></Text>
        <Text style={styles.ticketMeta}>Giờ chiếu: <Text style={styles.whiteText}>{showTime}</Text></Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    width: '100%',
    maxWidth: MaxContentWidth,
    backgroundColor: Colors?.dark?.background || '#0f172a',
    alignSelf: 'center',
  },
  devBtn: {
    backgroundColor: '#334155',
    paddingVertical: 6,
    alignItems: 'center',
    width: '100%',
  },
  devBtnText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
  },
  container: {
    flex: 1,
    width: '100%',
  },
  contentContainer: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.five || 24,
  },
  
  /* --- STYLE FORM ĐĂNG NHẬP --- */
  authForm: {
    width: '100%',
    marginTop: Spacing.four,
  },
  authTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors?.dark?.text || '#ffffff',
    marginBottom: 6,
  },
  authSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: Spacing.four,
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
  buttonPrimary: {
    width: '100%',
    height: 50,
    backgroundColor: Colors?.dark?.buttonPrimary || '#007BFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.two,
  },
  buttonTextPrimary: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonSecondary: {
    width: '100%',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.two,
    borderWidth: 1,
    borderColor: '#334155',
  },
  buttonTextSecondary: {
    color: '#94a3b8',
    fontWeight: '600',
    fontSize: 15,
  },

  /* --- STYLE PROFILE & VÉ --- */
  profileContainer: {
    width: '100%',
  },
  profileHeader: {
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: Spacing.four,
    marginBottom: Spacing.four,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.three,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors?.dark?.text || '#ffffff',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: Spacing.three,
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
  ticketSection: {
    width: '100%',
  },
  ticketSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors?.dark?.text || '#ffffff',
    marginBottom: Spacing.three,
  },
  ticketCard: {
    backgroundColor: '#111827',
    borderRadius: 12,
    padding: Spacing.three,
    marginBottom: Spacing.three,
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ticketMovieTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
    marginRight: 8,
  },
  statusTag: {
    backgroundColor: '#065f46',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    color: '#34d399',
    fontSize: 11,
    fontWeight: 'bold',
  },
  ticketDivider: {
    height: 1,
    backgroundColor: '#1f2937',
    marginVertical: Spacing.two,
    borderStyle: 'dashed', // Tạo hiệu ứng đường đứt đoạn của vé xem phim
  },
  ticketDetails: {
    gap: 4,
  },
  ticketMeta: {
    fontSize: 13,
    color: '#9ca3af',
  },
  whiteText: {
    color: '#f3f4f6',
    fontWeight: '500',
  },
});