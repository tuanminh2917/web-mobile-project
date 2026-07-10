// src/app/_layout.tsx
import { Stack } from 'expo-router';

// SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Màn hình chính chứa các Tabs */}
      <Stack.Screen name="(tabs)" />

      {/* Màn hình chi tiết phim (file của bạn) */}
      <Stack.Screen
        name="movie-page"
        options={{
          headerShown: true,
          title: "Chi tiết phim" // Có thể hiện Header hoặc không tùy bạn
        }}
      />
      <Stack.Screen
        name="screening"
        options={{
          headerShown: true,
          title: "Chọn suất chiếu"
        }}
      />
      <Stack.Screen
        name="seat-selection"
        options={{
          headerShown: true,
          title: "Chọn ghế"
        }}
      />
      <Stack.Screen
        name="payment"
        options={{
          headerShown: true,
          title: "Thanh toán"
        }}
      />
    </Stack>
  );
}

// Tạm thời cấu hình thế này trong src/app/_layout.tsx để preview:
// QUAN TRỌNG: Xóa hoặc comment đoạn này khi muốn triển khai thực tế.
// export default function RootLayout() {
//   return (
//     <Stack initialRouteName="payment" screenOptions={{ headerShown: false }}>
//       <Stack.Screen name="(tabs)" />
//       <Stack.Screen name="movie-page" />
//       <Stack.Screen name="screening" />
//       <Stack.Screen name="seat-selection" />
//       <Stack.Screen name="payment" />
//     </Stack>
//   );
// }