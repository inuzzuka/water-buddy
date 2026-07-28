import MotivationCard from "@/components/journal/MotivationCard";
import TodayLogs from "@/components/journal/TodayLogs";
import WaterBarChart from "@/components/journal/WaterBarChart";
import WeeklyFlow from "@/components/journal/WeeklyFlow";
import ScreenContent from "@/components/layout/ScreenContent";
import { useWaterBuddyContext } from "@/context/WaterBuddyContext";
import { useGoal } from "@/features/goals/hooks/useGoal";
import { useWaterLogs } from "@/features/water/hooks/useWaterLogs";
import { useEffect, useState } from "react";

export default function Journal() {
  const { goal } = useGoal();

  const { logs, deleteLog } = useWaterLogs();

  const { db, user } = useWaterBuddyContext();

  const [period, setPeriod] = useState("Week");
  const [chartData, setChartData] = useState<
    { date: string; total_ml: number }[]
  >([]);

  useEffect(() => {
    if (!user?.id) return;
    const days = period === "Week" ? 14 : 28;
    const from = new Date();
    from.setDate(from.getDate() - days + 1);
    const fromDate = from.toISOString().split("T")[0];
    const toDate = new Date().toISOString().split("T")[0];
    db.waterLogs.getDailyTotals(user.id, fromDate, toDate).then(setChartData);
  }, [user?.id, period]);

  return (
    <ScreenContent>
      <WeeklyFlow data={chartData} />
      <WaterBarChart
        data={chartData}
        goalMl={goal?.goal_ml ?? 2500}
        period={period}
        onPeriodChange={setPeriod}
      />
      <TodayLogs logs={logs} onDelete={deleteLog} />
      <MotivationCard
        consumed_ml={goal?.consumed_ml ?? 0}
        goal_ml={goal?.goal_ml ?? 2500}
      />
    </ScreenContent>
  );
}
