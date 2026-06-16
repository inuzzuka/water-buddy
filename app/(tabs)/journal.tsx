import TodayLogs from '@/components/features/TodayLogs';
import WaterBarChart from '@/components/features/WaterBarChart';
import ScreenContent from '@/components/layout/ScreenContent';
import { useWaterBuddyContext } from '@/context/WaterBuddyContext';
import { useEffect, useState } from 'react';

export default function Journal() {
  const { userId, db, goal, logs } = useWaterBuddyContext();
  const [period, setPeriod] = useState('Week');
  const [chartData, setChartData] = useState<{ date: string; total_ml: number }[]>([]);
  useEffect(() => {
    if (!userId) return;
    const days = period === 'Week' ? 7 : 28;
    const from = new Date();
    from.setDate(from.getDate() - days + 1);
    const fromDate = from.toISOString().split('T')[0];
    const toDate = new Date().toISOString().split('T')[0];
    db.waterLogs.getDailyTotals(userId, fromDate, toDate).then(setChartData);
  }, [userId, period]);

  return (
    <ScreenContent>
      <WaterBarChart data={chartData} goalMl={goal?.goal_ml ?? 2500} period={period} onPeriodChange={setPeriod} />
      <TodayLogs logs={logs} />
    </ScreenContent>
  );
}
