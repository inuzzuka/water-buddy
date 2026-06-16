import ChartArrow from '@/assets/icons/chart-arrow.svg';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/typography';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  data: { date: string; total_ml: number }[];
};

export default function WeeklyFlow({ data }: Props) {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const thisMonday = new Date(today);
  thisMonday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  const thisMondayStr = thisMonday.toISOString().split('T')[0];

  const thisWeekTotal = data.filter((d) => d.date >= thisMondayStr).reduce((sum, d) => sum + d.total_ml, 0);
  const lastWeekTotal = data.filter((d) => d.date < thisMondayStr).reduce((sum, d) => sum + d.total_ml, 0);
  const percentChange = lastWeekTotal > 0 ? Math.round(((thisWeekTotal - lastWeekTotal) / lastWeekTotal) * 100) : 0;

  const isPositive = percentChange >= 0;
  const sign = isPositive ? '+' : '';

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.analytics}>Analytics</Text>
        <Text style={styles.subtitle}>Weekly Flow</Text>
      </View>

      <View style={styles.badge}>
        <ChartArrow
          width={15}
          height={9}
          color={colors.redDark}
          style={{ transform: [{ scaleY: isPositive ? 1 : -1 }] }}
        />
        <Text style={styles.badgeText}>
          {sign}
          {percentChange}% vs last week
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingVertical: 10,
    gap: 50,
  },
  analytics: {
    fontFamily: fonts.jakarta,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: colors.redDark,
  },
  subtitle: {
    fontFamily: fonts.jakarta,
    fontSize: 16,
    lineHeight: 24,
    color: colors.black,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
    backgroundColor: colors.red,
    borderRadius: 9999,
    height: 40,
  },
  badgeText: {
    fontFamily: fonts.jakarta,
    fontSize: 16,
    lineHeight: 24,
    color: colors.redDark,
  },
});
