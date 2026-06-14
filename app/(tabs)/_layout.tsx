import AppFooter from '@/components/layout/AppFooter';
import AppHeader from '@/components/layout/AppHeader';
import { colors } from '@/constants/colors';
import { Tabs } from 'expo-router';
import { Image, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      {/* Fixed background */}
      <Image source={require('@/assets/images/background.png')} style={styles.background} resizeMode="cover" />

      {/* Header extends into status bar */}
      <View style={[styles.headerWrapper, { paddingTop: insets.top, backgroundColor: colors.background }]}>
        <AppHeader title="Water Buddy" />
      </View>

      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: 'none' },
          sceneStyle: { backgroundColor: 'transparent' },
        }}>
        <Tabs.Screen name="index" />
        <Tabs.Screen name="journal" />
        <Tabs.Screen name="settings" />
      </Tabs>

      {/* Footer */}
      <View style={[styles.footerWrapper, { paddingBottom: Math.max(0, insets.bottom - 20) }]}>
        <AppFooter />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  headerWrapper: {
    width: '100%',
  },
  footerWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
});
