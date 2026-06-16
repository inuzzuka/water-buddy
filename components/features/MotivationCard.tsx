import WaterDrop from '@/assets/icons/water-drop.svg';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/typography';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  consumed_ml: number;
  goal_ml: number;
};

function getMessage(remaining: number): { title: string; body: string } {
  if (remaining <= 500) {
    return {
      title: 'Almost there!',
      body: `Just ${remaining}ml to go. You're crushing it!`,
    };
  }
  if (remaining <= 1000) {
    return {
      title: 'Keep going!',
      body: `You're only ${remaining}ml away from reaching your goal today. Drink up!`,
    };
  }
  return {
    title: 'Stay Bubblier!',
    body: `You're only ${remaining}ml away from reaching your goal today. Drink up!`,
  };
}

export default function MotivationCard({ consumed_ml, goal_ml }: Props) {
  const remaining = Math.max(0, goal_ml - consumed_ml);

  if (remaining === 0) return null;

  const { title, body } = getMessage(remaining);

  return (
    <View style={styles.card}>
      <View style={styles.textBlock}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.body}>{body}</Text>
      </View>
      <View style={styles.watermark}>
        <WaterDrop width={100} height={100} color={colors.redDark} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 50,
    marginVertical: 25,
    borderRadius: 32,
    backgroundColor: colors.redLight,
    padding: 45,
    paddingBottom: 65,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
  },
  textBlock: {
    flex: 1,
    gap: 6,
    paddingRight: 30,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.redDark,
  },
  body: {
    fontFamily: fonts.jakarta,
    fontSize: 14,
    lineHeight: 20,
    color: colors.redDark,
  },
  watermark: {
    position: 'absolute',
    right: -20,
    bottom: -20,
    opacity: 0.2,
    transform: [{ rotate: '20deg' }],
  },
});
