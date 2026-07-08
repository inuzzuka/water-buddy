import { colors } from '@/constants/colors';
import { WaterBuddyProvider } from '@/context/WaterBuddyContext';
import { NunitoSans_400Regular, NunitoSans_700Bold, useFonts } from '@expo-google-fonts/nunito-sans';
import { PlusJakartaSans_400Regular } from '@expo-google-fonts/plus-jakarta-sans';

import * as NavigationBar from 'expo-navigation-bar';
import * as Notifications from 'expo-notifications';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

SplashScreen.preventAutoHideAsync();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function RootLayout() {
  const [loaded, error] = useFonts({
    NunitoSans_700Bold,
    NunitoSans_400Regular,
    PlusJakartaSans_400Regular,
  });

  useEffect(() => {
    async function setupNotifications() {
      await Notifications.setNotificationChannelAsync('water-reminders-v2', {
        name: 'Water Reminders',
        importance: Notifications.AndroidImportance.HIGH,
        sound: 'waterbuddy_sound.wav',
        vibrationPattern: [0, 250, 250, 250],
      });
    }

    setupNotifications();

    NavigationBar.setButtonStyleAsync('dark');

    if (loaded || error) SplashScreen.hideAsync();
  }, [loaded, error]);

  if (!loaded && !error) return null;

  return (
    <SafeAreaProvider>
      <WaterBuddyProvider>
        <StatusBar style="dark" backgroundColor={colors.background} />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: 'transparent' } }}>
          <Stack.Screen name="splash" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </WaterBuddyProvider>
    </SafeAreaProvider>
  );
}
