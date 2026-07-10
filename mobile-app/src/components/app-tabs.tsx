import { Colors } from '@/constants/theme';
import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AppTabs() {
  return (
    <Tabs
      screenOptions={{
        // Quản lý màu sắc chữ/icon theo trạng thái chọn
        tabBarActiveTintColor: COLORS.active,
        tabBarInactiveTintColor: COLORS.inactive,
        
        // Áp dụng các định dạng CSS được định nghĩa độc lập phía dưới
        tabBarLabelStyle: styles.tabLabel,
        tabBarStyle: styles.tabBar,
        
        headerShown: false, 
      }}
    >
      <Tabs.Screen
        name="main-page"
        options={{
          title: 'Main',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} color={color} size={size} />
          )
        }}
      />

      <Tabs.Screen
        name="schedule"
        options={{
          title: 'Schedule',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? 'calendar' : 'calendar-outline'} color={color} size={size} />
          )
        }}
      />

      <Tabs.Screen
        name="contact"
        options={{
          title: 'Contact',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? 'chatbubbles' : 'chatbubbles-outline'} color={color} size={size} />
          )
        }}
      />

      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} color={color} size={size} />
          )
        }}
      />
    </Tabs>
  );
}

// ==========================================
// ĐỊNH NGHĨA BIẾN MÀU SẮC (Bảng màu chung)
// ==========================================
const COLORS = {
  active: Colors.dark.text,
  inactive: Colors.dark.textSecondary,
  background: Colors.dark.backgroundElement,
  border: Colors.dark.backgroundSelected,
};

// ==========================================
// TÁCH PHẦN CSS / STYLESHEET ĐỘC LẬP
// ==========================================
const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    height: 60,
    paddingBottom: 8,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
});