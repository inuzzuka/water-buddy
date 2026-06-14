import { colors } from '@/constants/colors';
import { fonts } from '@/constants/typography';
import { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import { Polygon, Svg } from 'react-native-svg';

type Props = {
  size?: number;
  bubble?: string;
};

export default function BuddyMascot({ size = 160, bubble }: Props) {
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: -10, duration: 1800, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0, duration: 1800, useNativeDriver: true }),
      ]),
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      {bubble && (
        <View style={styles.bubbleWrapper}>
          <View style={styles.bubble}>
            <Text style={styles.bubbleText}>{bubble}</Text>
          </View>
          <Svg width={20} height={10} style={{ marginTop: -2 }}>
            <Polygon points="0,0 20,0 10,10" fill={colors.white} />
          </Svg>
        </View>
      )}

      <Animated.View style={{ transform: [{ translateY: floatAnim }] }}>
        <Image
          source={require('@/assets/images/water-buddy.png')}
          style={{ width: size, height: size }}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubbleWrapper: {
    alignItems: 'center',
    marginBottom: 8,
  },
  bubble: {
    width: 275,
    maxWidth: 297.5,
    paddingHorizontal: 40,
    paddingVertical: 24,
    backgroundColor: colors.white,
    borderRadius: 48,
    borderWidth: 1,
    borderColor: 'rgba(71, 169, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 6,
  },
  bubbleText: {
    fontFamily: fonts.bold,
    fontSize: 16,
    lineHeight: 24,
    color: colors.primary,
    textAlign: 'center',
    width: 193,
  },
});
