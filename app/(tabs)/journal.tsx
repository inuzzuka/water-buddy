import MotivationCard from '@/components/features/MotivationCard';
import TodayLogs from '@/components/features/TodayLogs';
import WaterBarChart from '@/components/features/WaterBarChart';
import WeeklyFlow from '@/components/features/WeeklyFlow';
import ScreenContent from '@/components/layout/ScreenContent';
import { useWaterBuddyContext } from '@/context/WaterBuddyContext';
import { useEffect, useState } from 'react';

export default function Journal() {
  const { user, db, goal, logs } = useWaterBuddyContext();
  const [period, setPeriod] = useState('Week');
  const [chartData, setChartData] = useState<{ date: string; total_ml: number }[]>([]);
  useEffect(() => {
    if (!user?.id) return;
    const days = period === 'Week' ? 14 : 28;
    const from = new Date();
    from.setDate(from.getDate() - days + 1);
    const fromDate = from.toISOString().split('T')[0];
    const toDate = new Date().toISOString().split('T')[0];
    db.waterLogs.getDailyTotals(user.id, fromDate, toDate).then(setChartData);
  }, [user?.id, period]);

  return (
    <ScreenContent>
      <WeeklyFlow data={chartData} />
      <WaterBarChart data={chartData} goalMl={goal?.goal_ml ?? 2500} period={period} onPeriodChange={setPeriod} />
      <TodayLogs logs={logs} />
      <MotivationCard consumed_ml={goal?.consumed_ml ?? 0} goal_ml={goal?.goal_ml ?? 2500} />
    </ScreenContent>
  );
}
