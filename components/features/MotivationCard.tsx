import Flame from '@/assets/icons/flame.svg';
import Star from '@/assets/icons/star-filled.svg';
import WaterDrop from '@/assets/icons/water-drop.svg';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/typography';
import { StyleSheet, Text, View } from 'react-native';

const ICON_MAP = {
  drop: WaterDrop,
  flame: Flame,
  star: Star,
};

type Props = {
  consumed_ml: number;
  goal_ml: number;
};

function getMessage(remaining: number): { title: string; body: string; icon: keyof typeof ICON_MAP } {
  if (remaining <= 500) {
    return {
      title: 'Almost there!',
      body: `Just ${remaining}ml to go. You're crushing it!`,
      icon: 'flame',
    };
  }
  if (remaining <= 1000) {
    return {
      title: 'Keep going!',
      body: `You're only ${remaining}ml away from reaching your goal today. Drink up!`,
      icon: 'star',
    };
  }
  return {
    title: 'Stay Bubblier!',
    body: `You're only ${remaining}ml away from reaching your goal today. Drink up!`,
    icon: 'drop',
  };
}

export default function MotivationCard({ consumed_ml, goal_ml }: Props) {
  const remaining = Math.max(0, goal_ml - consumed_ml);
  const progress = Math.min(consumed_ml / goal_ml, 1);

  if (remaining === 0) return null;

  const { title, body, icon } = getMessage(remaining);
  const IconComponent = ICON_MAP[icon];

  return (
    <View style={styles.card}>
      {/* Watermark */}
      <View style={styles.watermark}>
        <WaterDrop width={140} height={140} color={colors.redDark} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Top row: emoji + title */}
        <View style={styles.titleRow}>
          <IconComponent width={22} height={22} color={colors.redDark} />
          <Text style={styles.title}>{title}</Text>
        </View>

        <Text style={styles.body}>{body}</Text>

        {/* Progress bar */}
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>

        {/* Progress label */}
        <Text style={styles.progressLabel}>
          {consumed_ml}ml / {goal_ml}ml
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 50,
    marginVertical: 25,
    borderRadius: 40,
    backgroundColor: colors.redLight,
    overflow: 'hidden',
    shadowColor: colors.redDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 4,
  },
  watermark: {
    position: 'absolute',
    right: -30,
    bottom: -30,
    opacity: 0.12,
    transform: [{ rotate: '20deg' }],
  },
  content: {
    padding: 28,
    gap: 10,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  emoji: {
    fontSize: 20,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: colors.redDark,
  },
  body: {
    fontFamily: fonts.jakarta,
    fontSize: 14,
    lineHeight: 22,
    color: colors.redDark,
    opacity: 0.85,
    paddingRight: 60,
  },
  progressTrack: {
    height: 6,
    backgroundColor: 'rgba(62, 0, 34, 0.15)',
    borderRadius: 9999,
    marginTop: 4,
  },
  progressFill: {
    height: 6,
    backgroundColor: colors.redDark,
    borderRadius: 9999,
    opacity: 0.6,
  },
  progressLabel: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.redDark,
    opacity: 0.6,
  },
});
