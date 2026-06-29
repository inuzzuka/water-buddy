import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { Circle, ClipPath, Defs, Path, Svg } from 'react-native-svg';

const SIZE = 220;
const RADIUS = SIZE / 2;

const WAVE_LIGHT = 'rgba(147, 210, 255, 0.5)';
const WAVE_DARK = 'rgba(71, 169, 255, 0.85)';
const CIRCLE_BG = '#EAF4FB';
const BUBBLE_COLOR = 'white';

function WaveCircle({ fillPercent }: { fillPercent: number }) {
  const waveAnim = useRef(new Animated.Value(0)).current;
  const fillAnim = useRef(new Animated.Value(fillPercent)).current;
  const fillRef = useRef(fillPercent);

  useEffect(() => {
    Animated.loop(
      Animated.timing(waveAnim, {
        toValue: 1,
        duration: 6000,
        easing: Easing.inOut(Easing.sin),
        useNativeDriver: false,
      }),
    ).start();
  }, []);

  useEffect(() => {
    Animated.timing(fillAnim, {
      toValue: fillPercent,
      duration: 800,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
    fillRef.current = fillPercent;
  }, [fillPercent]);

  const waveHeight = 10;

  const wavePath = (fillY: number, offset: number) => {
    const segments = 4;
    const segW = SIZE / 2;
    let d = `M ${-SIZE + offset} ${fillY}`;
    for (let i = 0; i < segments * 2; i++) {
      const x1 = -SIZE + offset + i * segW + segW / 4;
      const x2 = -SIZE + offset + i * segW + (segW * 3) / 4;
      const x3 = -SIZE + offset + (i + 1) * segW;
      d += ` C ${x1} ${fillY - waveHeight}, ${x2} ${fillY + waveHeight}, ${x3} ${fillY}`;
    }
    d += ` L ${SIZE} ${SIZE} L ${-SIZE + offset} ${SIZE} Z`;
    return d;
  };

  return (
    <Svg width={SIZE} height={SIZE}>
      <Defs>
        <ClipPath id="circleClip">
          <Circle cx={RADIUS} cy={RADIUS} r={RADIUS} />
        </ClipPath>
      </Defs>
      <Circle cx={RADIUS} cy={RADIUS} r={RADIUS} fill={CIRCLE_BG} />
      <Circle
        cx={RADIUS}
        cy={RADIUS}
        r={RADIUS - 1}
        fill="none"
        stroke="rgba(0,98,161,0.08)"
        strokeWidth={6}
        clipPath="url(#circleClip)"
      />

      {fillPercent > 0 && (
        <AnimatedPath
          waveAnim={waveAnim}
          fillAnim={fillAnim}
          wavePath={wavePath}
          fill={WAVE_LIGHT}
          phaseOffset={0}
          clipPath="url(#circleClip)"
        />
      )}
      {fillPercent > 0 && (
        <AnimatedPath
          waveAnim={waveAnim}
          fillAnim={fillAnim}
          wavePath={wavePath}
          fill={WAVE_DARK}
          phaseOffset={0.5}
          clipPath="url(#circleClip)"
        />
      )}

      <Circle cx={70} cy={190} r={5} fill={BUBBLE_COLOR} opacity={0.6} clipPath="url(#circleClip)" />
      <Circle cx={110} cy={196} r={4.5} fill={BUBBLE_COLOR} opacity={0.5} clipPath="url(#circleClip)" />
      <Circle cx={150} cy={192} r={3} fill={BUBBLE_COLOR} opacity={0.4} clipPath="url(#circleClip)" />
    </Svg>
  );
}

function AnimatedPath({
  waveAnim,
  fillAnim,
  wavePath,
  fill,
  phaseOffset,
  clipPath,
}: {
  waveAnim: Animated.Value;
  fillAnim: Animated.Value;
  wavePath: (fillY: number, offset: number) => string;
  fill: string;
  phaseOffset: number;
  clipPath: string;
}) {
  const pathRef = useRef<any>(null);
  const waveRef = useRef(0);
  const fillRef = useRef(0);

  useEffect(() => {
    const waveId = waveAnim.addListener(({ value }) => {
      waveRef.current = value;
      updatePath();
    });
    const fillId = fillAnim.addListener(({ value }) => {
      fillRef.current = value;
      updatePath();
    });
    return () => {
      waveAnim.removeListener(waveId);
      fillAnim.removeListener(fillId);
    };
  }, []);

  function updatePath() {
    const segW = SIZE / 2;
    const offset = (waveRef.current * segW * 2 + phaseOffset * segW * 2) % (segW * 2);
    const fillY = SIZE - fillRef.current * SIZE;
    if (pathRef.current) {
      pathRef.current.setNativeProps({ d: wavePath(fillY, offset) });
    }
  }

  return <Path ref={pathRef} d={wavePath(SIZE, 0)} fill={fill} clipPath={clipPath} />;
}

export default function WaterIntakeDisplay({ consumedMl, goalMl }: { consumedMl: number; goalMl: number }) {
  const fillPercent = Math.min(consumedMl / goalMl, 1);
  const consumedL = (consumedMl / 1000).toFixed(1);
  const goalL = (goalMl / 1000).toFixed(1);

  return (
    <View style={styles.container}>
      <View style={styles.circleWrapper}>
        <View style={styles.circleOutline} />
        <WaveCircle key={goalMl} fillPercent={fillPercent} />
        <View style={styles.textOverlay}>
          <View style={styles.amountRow}>
            <Text style={styles.amount}>{consumedL}</Text>
            <Text style={styles.unit}>L</Text>
          </View>
          <View style={styles.goalBadge}>
            <Text style={styles.goalText}>Goal: {goalL}L</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 16,
  },
  circleOutline: {
    position: 'absolute',
    width: SIZE + 12,
    height: SIZE + 12,
    borderRadius: (SIZE + 12) / 2,
    backgroundColor: colors.white,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  circleWrapper: {
    width: SIZE,
    height: SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textOverlay: {
    position: 'absolute',
    alignItems: 'center',
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  amount: {
    ...typography.h2,
    fontSize: 52,
    lineHeight: 56,
    color: colors.primaryDark,
  },
  unit: {
    ...typography.h2,
    fontSize: 24,
    color: colors.primaryDark,
    marginBottom: 6,
  },
  goalBadge: {
    backgroundColor: colors.background,
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 9999,
    marginTop: 6,
  },
  goalText: {
    fontSize: 14,
    color: colors.primaryDark,
    fontFamily: 'NunitoSans_400Regular',
  },
});
