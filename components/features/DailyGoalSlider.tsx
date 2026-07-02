import InfoIcon from '@/assets/icons/info.svg';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/typography';
import { useRef, useState } from 'react';
import { PanResponder, StyleSheet, Text, View } from 'react-native';

type Props = {
  goalMl: number;
  onGoalChange: (ml: number) => void;
};

const MIN = 1000;
const MAX = 7000;
const STEP = 100;
const THUMB_SIZE = 24;
const TRACK_HEIGHT = 16;

function snap(value: number): number {
  return Math.round(value / STEP) * STEP;
}

export default function DailyGoalSlider({ goalMl, onGoalChange }: Props) {
  const [trackWidth, setTrackWidth] = useState(0);
  const [goal, setGoal] = useState(goalMl);
  const [ratio, setRatio] = useState((goalMl - MIN) / (MAX - MIN));
  const trackWidthRef = useRef(0);
  const ratioRef = useRef((goalMl - MIN) / (MAX - MIN));
  const startRatioRef = useRef(ratioRef.current);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        startRatioRef.current = ratioRef.current;
      },
      onPanResponderMove: (_, gestureState) => {
        if (!trackWidthRef.current) return;
        const newRatio = Math.min(Math.max(startRatioRef.current + gestureState.dx / trackWidthRef.current, 0), 1);
        ratioRef.current = newRatio;
        setRatio(newRatio);
        setGoal(snap(MIN + newRatio * (MAX - MIN)));
      },
      onPanResponderRelease: () => {
        onGoalChange(snap(MIN + ratioRef.current * (MAX - MIN)));
      },
    }),
  ).current;

  const thumbPosition = ratio * trackWidth;
  const fillWidth = ratio * trackWidth;
  const goalL = (goal / 1000).toFixed(1);

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View>
          <Text style={styles.sectionLabel}>Daily Hydration Goal</Text>
          <Text style={styles.hint}>Keep your buddy happy!</Text>
        </View>
        <View style={styles.valueRow}>
          <Text style={styles.value}>{goalL}</Text>
          <Text style={styles.unit}>L</Text>
        </View>
      </View>

      <View
        style={styles.sliderArea}
        onLayout={(e) => {
          const w = e.nativeEvent.layout.width;
          trackWidthRef.current = w;
          setTrackWidth(w);
        }}
        {...panResponder.panHandlers}>
        <View style={styles.track}>
          <View style={[styles.fill, { width: fillWidth }]} />
        </View>
        <View style={[styles.thumb, { left: thumbPosition - THUMB_SIZE / 2 }]} />
      </View>

      <View style={styles.rangeRow}>
        <Text style={styles.rangeLabel}>1.0L</Text>
        <Text style={styles.rangeLabel}>7.0L</Text>
      </View>

      <View style={styles.hintBox}>
        <View style={styles.infoCircle}>
          <InfoIcon width={14} height={14} color={colors.white} />
        </View>
        <Text style={styles.hintText}>Most health experts recommend about 2.5L per day.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 32,
    padding: 25,
    marginHorizontal: 25,
    marginVertical: 15,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 30,
    elevation: 4,
    gap: 16,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionLabel: {
    fontFamily: fonts.jakarta,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: colors.redDark,
  },
  hint: {
    fontFamily: fonts.jakarta,
    fontSize: 13,
    color: colors.tabInactive,
    marginTop: 2,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
  },
  value: {
    fontFamily: fonts.bold,
    fontSize: 28,
    lineHeight: 52,
    color: colors.primary,
  },
  unit: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.primary,
    marginBottom: 10,
  },
  sliderArea: {
    height: THUMB_SIZE + 8,
    justifyContent: 'center',
  },
  track: {
    height: TRACK_HEIGHT,
    backgroundColor: '#E4E9EB',
    borderRadius: 9999,
    overflow: 'hidden',
  },
  fill: {
    height: TRACK_HEIGHT,
    backgroundColor: colors.primary,
    opacity: 0.4,
    borderRadius: 9999,
  },
  thumb: {
    position: 'absolute',
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: 12,
    backgroundColor: colors.white,
    borderWidth: 4,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  rangeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -8,
  },
  rangeLabel: {
    fontFamily: fonts.jakarta,
    fontSize: 13,
    color: colors.tabInactive,
  },
  hintBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 16,
  },
  infoCircle: {
    width: 28,
    height: 28,
    borderRadius: 9999,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  hintText: {
    flex: 1,
    fontFamily: fonts.regular,
    fontStyle: 'italic',
    fontSize: 14,
    lineHeight: 22,
    color: colors.tabInactive,
  },
  toggleTrack: {
    width: 44,
    height: 24,
    borderRadius: 9999,
    backgroundColor: '#DEE3E5',
    justifyContent: 'center',
    padding: 2,
  },
  toggleTrackOn: {
    backgroundColor: colors.primary,
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 9999,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.white,
  },
  toggleThumbOn: {
    alignSelf: 'flex-end',
  },
});
