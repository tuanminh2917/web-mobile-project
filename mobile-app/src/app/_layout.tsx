import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        {/* Tab group */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        {/* Detail screens — push lên trên tab */}
        <Stack.Screen name="movie/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="book/[id]"  options={{ headerShown: false }} />
        <Stack.Screen name="checkout/[id]" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}
