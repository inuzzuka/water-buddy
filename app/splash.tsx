import { colors } from '@/constants/colors';
import { fonts } from '@/constants/typography';
import { useWaterBuddyContext } from '@/context/WaterBuddyContext';
import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, Image, ImageBackground, StyleSheet, Text, View } from 'react-native';

export default function SplashScreen() {
  const { ready } = useWaterBuddyContext();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const dotsAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate in
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Dots animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(dotsAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(dotsAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
      ]),
    ).start();
  }, []);

  useEffect(() => {
    if (!ready) return;
    // Wait a bit then navigate
    const timeout = setTimeout(() => {
      router.replace('/(tabs)');
    }, 2000);
    return () => clearTimeout(timeout);
  }, [ready]);

  return (
    <ImageBackground source={require('@/assets/images/background-1.png')} style={styles.container} resizeMode="cover">
      <Animated.View style={[styles.mascotWrapper, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <View style={styles.mascotCircle}>
          <Image source={require('@/assets/images/water-buddy.png')} style={styles.mascot} resizeMode="contain" />
        </View>
      </Animated.View>

      <Animated.View style={[styles.textBlock, { opacity: fadeAnim }]}>
        <Text style={styles.title}>Good morning, Buddy!</Text>
        <Text style={styles.subtitle}>Time for a refreshing sip.</Text>
      </Animated.View>

      <Animated.View style={[styles.dotsRow, { opacity: fadeAnim }]}>
        <View style={styles.dots}>
          {[0, 1, 2].map((i) => (
            <Animated.View
              key={i}
              style={[
                styles.dot,
                {
                  opacity: dotsAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [i === 0 ? 1 : 0.3, i === 1 ? 1 : 0.3],
                  }),
                },
              ]}
            />
          ))}
        </View>
        <Text style={styles.wakingUp}>WAKING UP BUDDY...</Text>
      </Animated.View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 32,
  },
  mascotWrapper: {
    alignItems: 'center',
  },
  mascotCircle: {
    width: 256,
    height: 256,
    borderRadius: 9999,
    backgroundColor: colors.white,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.15,
    shadowRadius: 50,
    elevation: 12,
    // outer ring
    borderWidth: 8,
    borderColor: 'rgba(71, 169, 255, 0.2)',
  },
  mascot: {
    width: 240,
    height: 240,
  },
  textBlock: {
    alignItems: 'center',
    gap: 6,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 24,
    color: colors.primaryDark,
  },
  subtitle: {
    fontFamily: fonts.jakarta,
    fontSize: 16,
    color: colors.tabInactive,
  },
  dotsRow: {
    alignItems: 'center',
    gap: 8,
  },
  dots: {
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 9999,
    backgroundColor: colors.primary,
  },
  wakingUp: {
    fontFamily: fonts.jakarta,
    fontSize: 12,
    letterSpacing: 1.5,
    color: colors.tabInactive,
    textTransform: 'uppercase',
    marginTop: 4,
  },
});
