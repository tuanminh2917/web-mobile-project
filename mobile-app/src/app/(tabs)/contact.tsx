import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'; // Đã thêm Text
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors, MaxContentWidth, Spacing } from '@/constants/theme';

export default function ContactScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Liên hệ với chúng tôi</Text>

        <View style={styles.formGroup}>
          <Text style={styles.heading}>Họ và tên</Text>
          <TextInput style={styles.input} placeholder="Nhập họ và tên" placeholderTextColor="#aaa" />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.heading}>Email</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Nhập email" 
            keyboardType="email-address" 
            autoCapitalize="none"
            placeholderTextColor="#aaa"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.heading}>Tiêu đề</Text>
          <TextInput style={styles.input} placeholder="Nhập tiêu đề" placeholderTextColor="#aaa" />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.heading}>Nội dung</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Nhập nội dung tại đây..."
            placeholderTextColor="#9aa0a6"
            multiline
            numberOfLines={4}
            textAlignVertical="top" // Đảm bảo chữ bắt đầu từ góc trên bên trái trên Android
          />
        </View>

        <Pressable style={({ pressed }) => [styles.sendButton, pressed && styles.sendButtonPressed]} onPress={() => { /* Xử lý gửi form */ }}>
          <Text style={styles.sendButtonText}>Gửi</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    alignItems: 'stretch',
  },
  container: {
    flex: 1,
    width: '100%',
  },
  contentContainer: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.four,
    maxWidth: MaxContentWidth,
    width: '100%',
    alignSelf: 'center',
    gap: Spacing.three, // Tạo khoảng cách đều giữa các formGroup
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginBottom: Spacing.two,
  },
  formGroup: {
    width: '100%',
    gap: Spacing.one || 6, // Khoảng cách nhỏ giữa label và ô input
  },
  heading: {
    fontWeight: '600',
    fontSize: 15,
    color: Colors.dark.textSecondary,
  },
  input: {
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderColor: Colors.dark.backgroundSelected,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 15,
    backgroundColor: Colors.dark.backgroundElement,
    color: Colors.dark.text,
  },
  textArea: {
    height: 120,
    paddingTop: 12, // Đệm phía trên cho text area cân đối
  },
  sendButton: {
    marginTop: Spacing.three,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: Colors.dark.buttonPrimary,
    alignItems: 'center',
  },
  sendButtonPressed: {
    backgroundColor: Colors.dark.buttonHoverBg,
  },
  sendButtonText: {
    color: Colors.dark.buttonTextOnPrimary,
    fontWeight: '600',
  },
});