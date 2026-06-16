import { colors } from '@/constants/colors';
import { fonts } from '@/constants/typography';
import { StyleSheet, Text, View } from 'react-native';
import SegmentedControl from '../ui/SegmentedControl';

type DayData = {
  date: string;
  total_ml: number;
};

type Props = {
  data: DayData[] | undefined;
  goalMl: number;
  period: string;
  onPeriodChange: (p: string) => void;
};
const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MAX_BAR_HEIGHT = 120;

function getDayIndex(date: string): number {
  const d = new Date(date).getDay();
  return d === 0 ? 6 : d - 1;
}

function getWeekDays(): string[] {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d.toISOString().split('T')[0];
  });
}

function getLastWeekDays(): string[] {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const thisMonday = new Date(today);
  thisMonday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(thisMonday);
    d.setDate(thisMonday.getDate() - 7 + i);
    return d.toISOString().split('T')[0];
  });
}

export default function WaterBarChart({ data = [], goalMl, period, onPeriodChange }: Props) {
  const today = new Date().toISOString().split('T')[0];
  const weekDays = getWeekDays();
  const lastWeekDays = getLastWeekDays();
  const dataMap = Object.fromEntries(data.map((d) => [d.date, d.total_ml]));

  const avgMl = data.length > 0 ? Math.round(data.reduce((sum, d) => sum + d.total_ml, 0) / data.length) : 0;

  if (period === 'Month') {
    // Get first Monday of the current month
    const todayDate = new Date(today);
    const firstDay = new Date(todayDate.getFullYear(), todayDate.getMonth(), 1);
    const firstMonday = new Date(firstDay);
    const firstDayOfWeek = firstDay.getDay();
    firstMonday.setDate(
      firstDay.getDate() + (firstDayOfWeek === 0 ? 1 : firstDayOfWeek === 1 ? 0 : 8 - firstDayOfWeek),
    );

    // Build weeks from first Monday of month
    const weekGroups = Array.from({ length: 5 }, (_, i) => {
      const weekStart = new Date(firstMonday);
      weekStart.setDate(firstMonday.getDate() + i * 7);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      return {
        label: `Wk ${i + 1}`,
        start: weekStart.toISOString().split('T')[0],
        end: weekEnd.toISOString().split('T')[0],
        isFuture: weekStart.toISOString().split('T')[0] > today,
        isCurrent: weekStart <= todayDate && todayDate <= weekEnd,
      };
    });
    // .filter(({ start }) => {
    //   // Only show weeks that overlap with current month
    //   const weekStartMonth = new Date(start).getMonth();
    //   return weekStartMonth === todayDate.getMonth();
    // });

    const weekTotals = weekGroups.map(({ start, end }) =>
      data.filter((d) => d.date >= start && d.date <= end).reduce((sum, d) => sum + d.total_ml, 0),
    );

    const maxMl = Math.max(...weekTotals, 1);
    const currentWeekIndex = weekGroups.findIndex((w) => w.isCurrent);

    return (
      <View style={styles.card}>
        <View style={styles.header}>
          <View>
            <Text style={styles.avgLabel}>Average Intake</Text>
            <Text style={styles.avgValue}>{avgMl.toLocaleString()} ml/day</Text>
          </View>
          <SegmentedControl options={['Week', 'Month']} selected={period} onChange={onPeriodChange} />
        </View>
        <View style={styles.barsRow}>
          {weekGroups.map((week, i) => {
            const ml = weekTotals[i];
            const barHeight = Math.max((ml / maxMl) * MAX_BAR_HEIGHT, ml > 0 ? 8 : 0);
            const isCurrentWeek = i === currentWeekIndex;
            return (
              <View key={week.start} style={styles.barColumn}>
                <View style={styles.barTrack}>
                  {ml === 0 && <View style={styles.barEmpty} />}
                  {ml > 0 && (
                    <View
                      style={[
                        styles.bar,
                        styles.barThisWeek,
                        {
                          height: barHeight,
                          backgroundColor: isCurrentWeek ? colors.primary : colors.primaryLight,
                          opacity: week.isFuture ? 0.3 : 1,
                        },
                      ]}
                    />
                  )}
                  {ml === 0 && <View style={styles.barEmpty} />}
                </View>
                <Text style={[styles.dayLabel, isCurrentWeek && styles.dayLabelActive]}>{week.label}</Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  }

  const allValues = [...weekDays, ...lastWeekDays].map((d) => dataMap[d] ?? 0);
  const maxMl = Math.max(...allValues, 1);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.avgLabel}>Average Intake</Text>
          <Text style={styles.avgValue}>{avgMl.toLocaleString()} ml/day</Text>
        </View>
        <SegmentedControl options={['Week', 'Month']} selected={period} onChange={onPeriodChange} />
      </View>
      <View style={styles.barsRow}>
        {weekDays.map((thisWeekDate, i) => {
          const lastWeekDate = lastWeekDays[i];
          const thisWeekMl = dataMap[thisWeekDate] ?? 0;
          const lastWeekMl = dataMap[lastWeekDate] ?? 0;
          const isToday = thisWeekDate === today;
          const thisWeekHeight = Math.max((thisWeekMl / maxMl) * MAX_BAR_HEIGHT, thisWeekMl > 0 ? 8 : 0);
          const lastWeekHeight = Math.max((lastWeekMl / maxMl) * MAX_BAR_HEIGHT, lastWeekMl > 0 ? 8 : 0);
          const thisWeekColor = isToday ? colors.primary : colors.primaryLight;

          return (
            <View key={thisWeekDate} style={styles.barColumn}>
              <View style={styles.barTrack}>
                {thisWeekMl === 0 && lastWeekMl === 0 && <View style={styles.barEmpty} />}
                {lastWeekMl > 0 && <View style={[styles.bar, styles.barLastWeek, { height: lastWeekHeight }]} />}
                {thisWeekMl > 0 && (
                  <View
                    style={[styles.bar, styles.barThisWeek, { height: thisWeekHeight, backgroundColor: thisWeekColor }]}
                  />
                )}
              </View>
              <Text style={[styles.dayLabel, isToday && styles.dayLabelActive]}>
                {DAY_LABELS[getDayIndex(thisWeekDate)]}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 32,
    padding: 20,
    marginHorizontal: 24,
    marginVertical: 15,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  avgLabel: {
    fontFamily: fonts.jakarta,
    fontSize: 13,
    color: colors.tabInactive,
  },
  avgValue: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.primary,
    marginTop: 2,
  },
  barsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: MAX_BAR_HEIGHT + 32,
  },
  barColumn: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  barTrack: {
    height: MAX_BAR_HEIGHT,
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'relative',
    width: 36,
  },
  bar: {
    position: 'absolute',
    bottom: 0,
    borderRadius: 9999,
  },
  barLastWeek: {
    width: 35,
    backgroundColor: colors.primaryLight,
    opacity: 0.25,
  },
  barThisWeek: {
    width: 35,
  },
  barEmpty: {
    position: 'absolute',
    bottom: 0,
    width: 35,
    height: 10,
    borderRadius: 9999,
    backgroundColor: colors.primary,
    opacity: 0.06,
  },
  dayLabel: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.tabInactive,
  },
  dayLabelActive: {
    fontFamily: fonts.bold,
    color: colors.primary,
  },
});
